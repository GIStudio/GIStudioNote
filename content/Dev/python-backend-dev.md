---
title: Python 后端开发指南
description: Python 后端开发指南的环境配置、操作步骤与常见问题指南。
tags:
  - Dev
  - Python
  - 后端开发
  - API
  - 教程
verified_at: 2026-10-28
---
# Python 后端开发指南

本文档介绍 Python 后端开发的常见模式，包括 API 开发、CLI 开发以及常用工具推荐。

## Python 环境准备

### 使用 uv 管理（推荐）

```bash
# 创建项目
uv init --python 3.13 backend-project
cd backend-project

# 添加依赖
uv add fastapi uvicorn sqlalchemy 'pydantic[email]' 'pwdlib[argon2]'

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

创建 `src/backend/` 目录和空的 `src/backend/__init__.py`，将以下代码保存为 `src/backend/main.py`。该 hello world 与后面的用户数据库示例是两个独立应用。

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

### 请求、数据库与响应：一个可运行的本地示例

下面是独立于前面 hello world 的教学应用。它使用 SQLite 保存用户、使用 Argon2 哈希密码，并在响应中只返回公开字段。它**没有登录、授权、限流或生产部署配置**，只用于本机学习，不能直接公开到互联网。

先在项目中安装依赖：

```bash
uv add fastapi uvicorn sqlalchemy 'pydantic[email]' 'pwdlib[argon2]'
```

`EmailStr` 依赖 `email-validator`；`pydantic[email]` 安装这一额外依赖。密码使用 FastAPI 文档介绍的 `pwdlib` 哈希方案，实际生产还应检查密码策略、账户保护与密钥管理。[Pydantic EmailStr](https://docs.pydantic.dev/latest/api/networks/#pydantic.networks.EmailStr) · [FastAPI 密码与 JWT 教程](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)

将以下内容保存为 `src/backend/user_demo.py`；如目录不存在，先创建 `src/backend/` 和空的 `src/backend/__init__.py`。

```python
from collections.abc import Generator
import os

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pwdlib import PasswordHash
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(254), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8, repr=False)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: EmailStr


# 仅作本地 SQLite 教学；测试可设 EXAMPLE_DATABASE_URL 到临时数据库。
database_url = os.environ.get("EXAMPLE_DATABASE_URL", "sqlite:///./example.db")
engine = create_engine(database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(engine)  # 演示建表；正式项目应使用迁移工具。
password_hash = PasswordHash.recommended()
app = FastAPI(title="本地用户示例")


def get_db() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session


@app.post("/users", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    record = User(
        username=user.username,
        email=str(user.email),
        hashed_password=password_hash.hash(user.password),
    )
    db.add(record)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="用户名或邮箱冲突") from exc
    db.refresh(record)
    return record


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    record = db.get(User, user_id)
    if record is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return record
```

运行 `uv run uvicorn src.backend.user_demo:app --reload --host 127.0.0.1 --port 8000`，在本机打开 `http://127.0.0.1:8000/docs`。数据库文件 `example.db` 会创建在运行目录；不要提交实际用户数据。`response_model` 限制输出字段，密码原文只用于生成哈希，数据库唯一约束及提交异常处理也覆盖并发重复提交。[SQLAlchemy 会话与事务](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)

### 认证与授权

上面的 API 没有身份验证；如果需要登录，应在调用端与服务端之间使用经过审查的认证方案，并对每个操作实施授权。FastAPI 的 [OAuth2 与 JWT 教程](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/) 展示了密码校验、签名令牌、过期时间及验证流程。签名密钥应从受控的密钥管理或环境配置读取，生产环境使用高熵独立密钥，切勿写死在源码或提交到仓库。

JWT 验证还需使用明确允许的算法，核对签名、有效期及身份主体，并结合应用需要验证发行者、受众和用户状态。生产部署还需 TLS、安全会话策略、错误信息控制、限流、日志脱敏、密钥轮换和数据库迁移；具体要求取决于系统设计。示例未实现这些功能，也不声称完成生产级安全审计。

### 其他路由示意

以下中间件和异常处理片段展示接口用法，应结合实际应用的 `app` 与日志配置集成；它们不是可直接拼接成完整项目的独立文件。


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
    # 记录路径而非完整 URL，避免将查询参数中的敏感值写入日志。
    print(f"{request.method} {request.url.path} - {process_time:.3f}s")
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
        content={"detail": exc.detail},
        headers=exc.headers,
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

这是与上面的 Click 程序独立的替代示例；使用前安装 `uv add typer`，不要把两个示例覆盖到同一个文件后同时运行。

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

下面也是独立的 Click 命令示意；用户列表和数据库操作尚未连接真实服务。

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
def user_create(username: str, email: str):
    """创建用户"""
    click.echo(f"示例：收到 {username} ({email})，尚未创建用户")
    # 创建逻辑

@user.command("list")
@click.option("--active-only", is_flag=True)
def user_list(active_only: bool):
    """列出用户"""
    click.echo("示例：尚未连接用户服务")
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
    click.echo("示例：尚未初始化数据库")

@db.command("migrate")
@click.option("--revision", default="head")
def db_migrate(revision: str):
    """执行迁移"""
    click.echo(f"示例：尚未执行迁移 {revision}")

if __name__ == "__main__":
    cli()
```

### 交互式输入

```python
import click
import sys

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
import click_spinner

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

使用进度条示例前安装 `uv add click-spinner`；它只提供终端动画，不代表后台任务已经执行。

### CLI 配置入口

```python
# src/backend/cli/__init__.py
from .main import cli

__all__ = ["cli"]

# pyproject.toml 添加
# [project.scripts]
# mycli = "backend.cli:cli"
```

这是可安装包的入口声明。应先配置项目构建后端，使 `src/backend` 作为 `backend` 包安装；未配置打包时继续使用上面的 `python -m src.backend.cli.main` 命令。

## 测试

### API 测试（使用 TestClient）

以下测试对应 `user_demo.py`，数据库放在 pytest 的临时目录，不使用工作目录中的 `example.db`。从项目根目录执行 `uv run python -m pytest tests/api/test_users.py`。

```python
# tests/api/test_users.py
from fastapi.testclient import TestClient

def test_user_creation_and_storage(tmp_path, monkeypatch):
    monkeypatch.setenv("EXAMPLE_DATABASE_URL", f"sqlite:///{tmp_path / 'test.db'}")
    from src.backend.user_demo import app, SessionLocal, User, password_hash

    payload = {"username": "test", "email": "test@example.com", "password": "example-password"}
    with TestClient(app) as client:
        response = client.post("/users", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["username"] == "test"
        assert "password" not in data and "hashed_password" not in data
        assert client.get(f"/users/{data['id']}").status_code == 200
        assert client.get("/users/99999").status_code == 404
        assert client.post("/users", json=payload).status_code == 409

    with SessionLocal() as db:
        saved = db.get(User, data["id"])
        assert saved.hashed_password != payload["password"]
        assert password_hash.verify(payload["password"], saved.hashed_password)
```

该示例在隔离环境中以 FastAPI 0.162.0、SQLAlchemy 2.1.6、Pydantic 2.14.1 和 pwdlib 0.3.1 运行过上述测试，检查了创建、读取、重复提交与密码哈希。测试使用本地临时 SQLite；没有连接生产数据库，也没有验证登录、授权或部署安全。

### 异步测试

这个例子针对前面的 `main.py` hello world，而不是用户数据库应用。

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

这个例子针对上面的 Click 基础示例；Typer 和子命令组是单独的应用。

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
