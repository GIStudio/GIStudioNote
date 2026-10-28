---
title: uv 配置指南
description: uv 配置指南的环境配置、操作步骤与常见问题指南。
tags:
  - Dev
  - Python
  - uv
  - 环境管理
  - 教程
verified_at: 2026-10-28
---
# uv 配置指南

本文档介绍如何从零配置 uv（Python 包管理器），并配合 Git Bash 在项目中使用。

## 什么是 uv

uv 是由 Astral 开发、使用 Rust 编写的 Python 工具，支持 Python 版本管理、虚拟环境管理和包安装等功能。实际安装速度取决于依赖、缓存和网络环境。

## 安装 uv

### Windows

#### 方法一：使用 PowerShell 或 CMD
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### 方法二：使用 winget
```powershell
winget install --id=astral-sh.uv -e
```

#### 方法三：使用 Scoop
```powershell
scoop install uv
```

### macOS

#### 方法一：使用 Homebrew（推荐）
```bash
brew install uv
```

#### 方法二：使用 curl
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Linux

#### 方法一：使用 curl（通用）
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### 方法二：使用发行版包管理器

包名、可用版本及安装命令取决于发行版和软件源。请先查阅当前发行版或 [uv 安装文档](https://docs.astral.sh/uv/getting-started/installation/)，并核对包来源。

上面的安装脚本会在本机执行从网络下载的代码。执行前应确认来源和内容；在受管理机器上遵循所在组织的安装策略。

## 配置 Python 3.13

### 安装 Python 3.13
```bash
# 安装指定版本
uv python install 3.13

# 查看已安装的 Python 版本
uv python list
```

### 设置项目 Python 版本
```bash
# 在项目目录中设置
cd your-project
uv python pin 3.13
```

## 在 Git Bash 中使用 uv（Windows 重点）

### 问题说明
在 Windows Git Bash 中，某些 uv 命令可能需要特殊处理。

### 解决方案

#### 方案一：为 `uv run` 指定 Python 版本
Git Bash 中使用 `uv run` 时，建议显式指定 Python：
```bash
uv run --python 3.13 python script.py
```

#### 方案二：设置环境变量
在 `~/.bashrc` 或 `~/.zshrc` 中添加：
```bash
export UV_PYTHON=3.13
```

#### 方案三：创建项目时指定
```bash
uv init --python 3.13 myproject
cd myproject
```

### Windows Git Bash 注意事项
- Git Bash 使用类 Unix 的 shell 语法；包含空格的路径应加引号。
- 传给 Windows 程序的路径可能需要按程序要求转换；遇到路径问题时检查实际程序的参数格式。

## 创建项目

### 新建项目
```bash
uv init --python 3.13 myproject
cd myproject
```

### 已有项目
```bash
cd existing-project
uv init
uv sync
```

### 手动创建虚拟环境
```bash
uv venv --python 3.13
source .venv/bin/activate  # Linux/macOS
# 或在 Git Bash 中：
source .venv/Scripts/activate  # Windows
```

## 管理依赖

### 添加依赖
```bash
# 添加到 pyproject.toml
uv add requests

# 添加开发依赖
uv add --dev pytest black

# 添加特定版本
uv add "requests>=2.28"
```

### 安装依赖
```bash
# 从 pyproject.toml 安装
uv sync

# 同步默认依赖及 dev 组；其他可选组按需指定
uv sync --dev
```

### 移除依赖
```bash
uv remove requests
```

### 升级依赖
在项目目录中，以下命令在 `pyproject.toml` 的版本约束内更新 `uv.lock`，然后根据锁文件同步环境。升级会改变依赖版本，先审查锁文件差异并运行测试。

```bash
uv lock --upgrade
uv sync --locked
```

`uv pip compile` 是另一套 pip 兼容接口，默认将解析结果输出到终端；需要生成 requirements 文件时可使用 `uv pip compile pyproject.toml -o requirements.txt`。它不替代上述 `uv.lock` 更新流程。[官方说明](https://docs.astral.sh/uv/concepts/projects/sync/) · [pip 接口说明](https://docs.astral.sh/uv/pip/compile/)

## 运行脚本和命令

### 运行 Python 脚本
```bash
uv run python script.py
```

### 运行带依赖的脚本
```bash
uv run --with requests python script.py
```

### 使用 uvx（类似 npx）
```bash
# 临时使用工具
uvx ruff check .
uvx black .
uvx mypy src/
```

## 与 Git 配合使用

### 推荐的项目结构
```
myproject/
├── .git/
├── .python-version      # 由 uv 管理
├── pyproject.toml      # 项目配置
├── uv.lock            # 锁文件，提交到仓库
├── src/
│   └── myproject/
│       └── __init__.py
└── tests/
    └── test_main.py
```

### .gitignore 配置
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
.venv/
venv/
ENV/
env/

# IDE
.idea/
.vscode/
*.swp
*.swo

# macOS
.DS_Store

# 测试
.pytest_cache/
.coverage
htmlcov/
```

### 工作流程示例
```bash
# 1. 克隆仓库
git clone git@github.com:username/myproject.git
cd myproject

# 2. 同步依赖
uv sync

# 3. 开发
# 编辑代码...

# 4. 运行测试
uv run pytest

# 5. 检查并提交指定文件；其他需要提交的文件按实际情况加入
git status
git add pyproject.toml uv.lock
git diff --cached
git commit --only -m "描述" -- pyproject.toml uv.lock

# 6. 需要同步环境时
uv sync
```

这里的 `--only` 将提交限定为所列路径，其他路径的既有暂存内容保持原状。它会提交所列文件当前工作区的完整内容；同一文件内若混有其他任务的修改，应先拆分并检查提交范围。[Git commit 文档](https://git-scm.com/docs/git-commit)

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `uv init` | 初始化新项目 |
| `uv add <pkg>` | 添加依赖 |
| `uv remove <pkg>` | 移除依赖 |
| `uv sync` | 同步依赖 |
| `uv run python script.py` | 运行脚本 |
| `uvx <tool>` | 运行工具 |
| `uv python install 3.13` | 安装 Python |
| `uv python list` | 列出可用版本 |
| `uv venv` | 创建虚拟环境 |
| `uv lock --upgrade` | 在项目约束内更新 `uv.lock` |
| `uv pip compile ... -o requirements.txt` | 导出 pip 兼容的锁定依赖列表 |

## 常见问题

### Q: uv 和 pip 的区别？
uv 速度更快（Rust 实现），支持锁定文件，支持 Python 版本管理，可以直接运行脚本。

### Q: 如何指定国内镜像？
```bash
# 设置镜像源
uv pip install --index-url https://pypi.tuna.tsinghua.edu.cn/simple requests

# 或在 pyproject.toml 中配置
[tool.uv]
index-url = "https://pypi.tuna.tsinghua.edu.cn/simple"
```

### Q: 如何在 CI/CD 中使用？
```yaml
# GitHub Actions 示例
- name: Install uv
  uses: astral-sh/setup-uv@v4

- name: Install dependencies
  run: uv sync

- name: Run tests
  run: uv run pytest
```

### Q: uv.lock 是什么？
uv.lock 是自动生成的锁文件，记录了所有依赖的精确版本。应提交到仓库以保证团队成员和部署环境的一致性。

## 参考资源

- [uv 官方文档](https://docs.astral.sh/uv/)
- [uv GitHub 仓库](https://github.com/astral-sh/uv)
