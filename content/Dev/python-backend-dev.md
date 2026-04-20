# Python 后端开发指南

本文档介绍 Python 后端开发的常见模式，包括 API 开发、CLI 开发以及常用工具推荐。

## Python 环境准备

### 使用 uv 管理（推荐）

```bash
# 创建项目
uv init --python 3.13 backend-project
cd backend-project

# 添加依赖
uv add fastapi uvicorn sqlalchemy pydantic

# 添加开发依赖
uv add --dev pytest pytest-asyncio httpx black ruff mypy
```

### 目录结构推荐

```
backend-project/
├── .git/
├── pyproject.toml
├── uv.lock
├── src/
│   └── backend/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── models/
│       ├── schemas/
│       ├── api/
│       │   └── routes/
│       ├── services/
│       ├── repositories/
│       ├── cli/
│       └── utils/
├── tests/
│   ├── unit/
│   └── integration/
└── alembic/              # 数据库迁移
```

## API 开发

### 框架选择

| 框架 | 特点 | 适用场景 |
|------|------|----------|
| FastAPI | 异步、高性能、自动文档 | 现代微服务 |
| Flask | 轻量、灵活 | 小型项目、REST API |
| Django | 全功能、ORM、内置后台 | 全栈应用、内容管理 |
| Starlette | ASGI 工具包 | 底层 ASGI 开发 |

### FastAPI 快速上手

#### 安装

```bash
uv add fastapi uvicorn
```

#### 基础示例

```python
# src/backend/main.py
from fastapi import FastAPI

app = FastAPI(title="我的 API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id, "name": f"物品 {item_id}"}
```

#### 启动服务

```bash
uv run uvicorn src.backend.main:app --reload --port 8000
```

访问 `http://localhost:8000/docs` 查看自动生成的 Swagger 文档。

### 请求与响应

#### 查询参数与路径参数

```python
from fastapi import FastAPI, Query, Path
from typing import Optional

app = FastAPI()

# 路径参数
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}

# 查询参数
@app.get("/users")
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None
):
    return {"skip": skip, "limit": limit, "search": search}

# 路径参数带验证
@app.get("/posts/{post_id}")
async def get_post(post_id: int = Path(..., ge=1)):
    return {"post_id": post_id}
```

#### 请求体

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    age: Optional[int] = Field(None, ge=0, le=150)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    # 创建用户逻辑
    return UserResponse(
        id=1,
        username=user.username,
        email=user.email,
        created_at=datetime.now()
    )
```

#### 请求体更新（部分更新）

```python
from pydantic import BaseModel
from typing import Optional

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

@app.patch("/users/{user_id}")
async def update_user(user_id: int, user: UserUpdate):
    # 更新逻辑
    return {"user_id": user_id, **user.model_dump(exclude_unset=True)}
```

### 数据库集成

#### SQLAlchemy 模型

```python
# src/backend/models/user.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

#### 数据库连接

```python
# src/backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### 在路由中使用

```python
# src/backend/api/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from src.backend.database import get_db
from src.backend.models.user import User
from src.backend.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user

@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 检查是否已存在
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="邮箱已被注册")
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

### 认证与授权

#### JWT 认证

```python
# 安装依赖
uv add python-jose[cryptography] passlib[bcrypt] python-multipart

# src/backend/auth.py
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    # 获取用户逻辑
    return {"user_id": user_id}

# 使用方式
@app.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {"user_id": current_user["user_id"]}
```

### 中间件

```python
from fastapi import FastAPI, Request
from time import time

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time()
    response = await call_next(request)
    process_time = time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f"{request.method} {request.url} - {process_time:.3f}s")
    return response
```

### 错误处理

```python
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "服务器内部错误"}
    )
```

## CLI 开发

### 框架选择

| 框架 | 特点 |
|------|------|
| Click | 简单、功能强、装饰器风格 |
| Typer | 基于 Click、类型提示友好 |
| argparse | 标准库、无需额外依赖 |
| Cement | 完整 CLI 框架 |

### Click 快速上手

#### 安装

```bash
uv add click
```

#### 基础示例

```python
# src/backend/cli/main.py
import click
from pathlib import Path

@click.group()
def cli():
    """我的 CLI 工具"""
    pass

@cli.command()
@click.argument("name")
@click.option("--count", "-c", default=1, help="重复次数")
def greet(name: str, count: int):
    """向用户打招呼"""
    for _ in range(count):
        click.echo(f"你好，{name}！")

@cli.command()
@click.argument("files", nargs=-1, type=click.Path())
@click.option("--verbose", "-v", is_flag=True, help="详细输出")
def process(files: tuple, verbose: bool):
    """处理文件"""
    for file in files:
        if verbose:
            click.echo(f"处理: {file}")
        # 处理逻辑

if __name__ == "__main__":
    cli()
```

#### 运行

```bash
uv run python -m src.backend.cli.main greet --count 3 张三
```

### Typer 示例

```python
# src/backend/cli/main.py
import typer
from typing import Optional

app = typer.Typer(help="我的 CLI 工具")

@app.command()
def greet(name: str, count: int = 1):
    """向用户打招呼"""
    for _ in range(count):
        typer.echo(f"你好，{name}！")

@app.command()
def serve(
    host: str = "127.0.0.1",
    port: int = 8000,
    reload: bool = False
):
    """启动服务器"""
    typer.echo(f"启动服务器: {host}:{port}")
    # 启动逻辑

if __name__ == "__main__":
    app()
```

### 子命令组

```python
# src/backend/cli/main.py
import click
import sys

@click.group()
def cli():
    """项目 CLI 工具"""
    pass

@cli.group()
def user():
    """用户管理"""
    pass

@user.command("create")
@click.argument("username")
@click.option("--email", prompt=True)
@click.password_option()
def user_create(username: str, email: str, password: str):
    """创建用户"""
    click.echo(f"创建用户: {username} ({email})")
    # 创建逻辑

@user.command("list")
@click.option("--active-only", is_flag=True)
def user_list(active_only: bool):
    """列出用户"""
    users = []  # 获取用户列表
    for user in users:
        status = "活跃" if user.active else "禁用"
        click.echo(f"{user.username} - {user.email} [{status}]")

@cli.group()
def db():
    """数据库操作"""
    pass

@db.command("init")
def db_init():
    """初始化数据库"""
    click.echo("初始化数据库...")

@db.command("migrate")
@click.option("--revision", default="head")
def db_migrate(revision: str):
    """执行迁移"""
    click.echo(f"执行迁移: {revision}")

if __name__ == "__main__":
    cli()
```

### 交互式输入

```python
import click

@click.command()
def init():
    """初始化项目"""
    name = click.prompt("项目名称", default="my-project")
    db_type = click.prompt("数据库类型", type=click.Choice(["sqlite", "postgres", "mysql"]))
    confirm = click.confirm("确认创建？")

    if confirm:
        click.echo(f"创建项目: {name}, 使用 {db_type}")
    else:
        click.echo("取消")
        sys.exit(0)
```

### 彩色输出与进度条

```python
import click

# 彩色输出
click.echo(click.style("成功!", fg="green"))
click.echo(click.style("警告!", fg="yellow"))
click.echo(click.style("错误!", fg="red", bold=True))

# 进度条
with click.progressbar(range(100), label="处理中") as bar:
    for i in bar:
        pass  # 处理逻辑

# Spinner
with click_spinner.spinner():
    # 耗时操作
    pass
```

### CLI 配置入口

```python
# src/backend/cli/__init__.py
from .main import cli

__all__ = ["cli"]

# pyproject.toml 添加
# [project.scripts]
# mycli = "backend.cli:main"
```

## 测试

### API 测试（使用 TestClient）

```python
# tests/api/test_users.py
import pytest
from fastapi.testclient import TestClient
from src.backend.main import app

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/users",
        json={"username": "test", "email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "test"
    assert "id" in data

def test_get_user_not_found():
    response = client.get("/users/99999")
    assert response.status_code == 404

def test_list_users():
    response = client.get("/users?skip=0&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### 异步测试

```python
# tests/test_async.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from src.backend.main import app

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_async_endpoint(client):
    response = await client.get("/items/1")
    assert response.status_code == 200
```

### CLI 测试

```python
# tests/cli/test_main.py
from click.testing import CliRunner
from src.backend.cli.main import cli

def test_greet():
    runner = CliRunner()
    result = runner.invoke(cli, ["greet", "World"])
    assert result.exit_code == 0
    assert "你好，World" in result.output

def test_greet_with_count():
    runner = CliRunner()
    result = runner.invoke(cli, ["greet", "Alice", "--count", "3"])
    assert result.exit_code == 0
    assert result.output.count("你好，Alice") == 3
```

## 常用开发工具

### 代码质量

```bash
# Ruff - 快速 Linter
uv add --dev ruff
uv run ruff check .
uv run ruff format .

# Black - 代码格式化
uv add --dev black
uv run black .

# MyPy - 类型检查
uv add --dev mypy
uv run mypy src/

# Pre-commit
uv add --dev pre-commit
```

### pre-commit 配置

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

## 常用命令速查

```bash
# 启动开发服务器
uv run uvicorn src.backend.main:app --reload --port 8000

# 运行测试
uv run pytest                    # 所有测试
uv run pytest tests/unit/        # 单元测试
uv run pytest --cov=src        # 覆盖率

# 代码检查
uv run ruff check .
uv run ruff format .
uv run mypy src/

# CLI 测试
uv run python -m src.backend.cli.main --help
```

## 参考资源

- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [SQLAlchemy 文档](https://docs.sqlalchemy.org/)
- [Click 文档](https://click.palletsprojects.com/)
- [Typer 文档](https://typer.tiangolo.com/)
- [Pydantic 文档](https://docs.pydantic.dev/)
