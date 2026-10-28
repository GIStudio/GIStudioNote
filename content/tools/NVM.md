---
title: NVM 教程
description: NVM 教程的使用说明、资源链接与实践记录。
tags:
  - DevOps
  - NVM
  - Node.js
  - 版本管理
  - macOS
  - 教程
---

`nvm`（Node Version Manager）用于在用户环境中安装和切换多个 Node.js 版本。下文以本仓库固定使用的 22.16.0 为命令示例；为其他项目选择版本时，应另外核对支持周期和安全更新。[nvm 官方说明](https://github.com/nvm-sh/nvm)

---

### 1. 检查当前安装的 Node.js 版本
运行以下命令查看当前正在使用的 Node.js 版本：
```bash
node -v
```
或者使用 `nvm` 提供的命令：
```bash
nvm current
```
这将显示当前激活的 Node.js 版本。

---

### 2. 列出所有已安装的 Node.js 版本
要查看通过 `nvm` 安装的所有 Node.js 版本，可以运行：
```bash
nvm list
```
历史输出示例，仅用于解释箭头和别名；其中的版本号不是当前安装建议：
```
->     v14.18.1
       v20.9.0
         system
default -> 20 (-> v20.9.0)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v20.9.0) (default)
stable -> 20.9 (-> v20.9.0) (default)
```
- **箭头 (`->`)** 表示当前正在使用的版本。
- `default` 表示默认版本。

---

### 3. 切换到特定版本
如果需要切换到其他已安装的版本，可以使用以下命令：
```bash
nvm use 22.16.0
```
例如，切换到 Node.js 20.9.0：
```bash
nvm use 20.9.0
```

如果该版本尚未安装，`nvm` 会提示您先安装它。

---

### 4. 设置默认版本
如果您希望在每次打开终端时自动使用某个版本，可以将其设置为默认版本：
```bash
nvm alias default 22.16.0
```
例如，将 Node.js 20 设置为默认版本：
```bash
nvm alias default 20
```

验证默认版本：
```bash
nvm list
```
您会看到类似以下的输出：
```
default -> 20 (-> v20.9.0)
```

---

### 5. 安装新版本（如果需要）
如果目标版本尚未安装，可以通过以下命令安装：
```bash
nvm install 22.16.0
```
例如，安装 Node.js 22：
```bash
nvm install 22
```

安装完成后，您可以直接切换到该版本：
```bash
nvm use 22
```

---

### 6. 验证切换是否成功
切换后，验证当前的 Node.js 和 npm 版本：
```bash
node -v
npm -v
```

---

### 常见问题及解决方法

#### 问题 1: `nvm` 命令不可用
如果运行 `nvm` 命令时提示未找到命令，可能是因为 `nvm` 尚未正确安装或配置。请确保以下内容已添加到您的 shell 配置文件（如 `.bashrc` 或 `.zshrc`）中：
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载 bash 自动补全
```
然后重新加载配置文件：
```bash
source ~/.bashrc  # 或者 ~/.zshrc
```

#### 问题 2: 切换版本后仍使用旧版本
如果切换版本后仍然显示旧版本，先核对当前 shell 实际使用的命令和 nvm 状态：
```bash
command -v nvm
command -v node
which -a node
nvm current
nvm version default
```
`nvm` 通常是 shell 函数，适合用 `command -v nvm` 检查。若 `node` 路径与预期不符，检查当前 shell 是否加载 nvm、PATH 顺序及项目是否使用 `.nvmrc`。系统 Node.js 可能被其他工具依赖；先确认来源和用途，再决定是否调整，避免直接卸载。

---

设置默认版本影响后续加载了 nvm 的新 shell；要在当前 shell 中立即使用它，可以运行 `nvm use default`。切换后用 `node -v` 和 `npm -v` 检查实际生效的版本。

### 相关：默认版本解析不出结果会怎样

如果 `default` 指向尚未安装的版本，`nvm version default` 可能返回 `N/A`。如果自定义的 `precmd` 自动切换逻辑在解析失败后每次都重试，可能拖慢终端；是否发生取决于具体配置。排查方法见 [[../Dev/terminal-startup-slowdown|终端启动慢与标题闪动的排查]]。

### 安全与项目配置

使用可信的 Node.js 下载源，并在运行 `nvm use` 前检查陌生项目的 `.nvmrc`。nvm 官方 [GHSA-8grh-q73j-ffrc](https://github.com/nvm-sh/nvm/security/advisories/GHSA-8grh-q73j-ffrc) 指出，至 0.40.7 的版本可能因恶意 `.nvmrc` 路径穿越而读取本地文件，0.40.8 修复了该问题。另一项 [GHSA-3c52-35h2-gfmm](https://github.com/nvm-sh/nvm/security/advisories/GHSA-3c52-35h2-gfmm) 涉及恶意镜像，修复版本为 0.40.5。请按自己的安装方式核对当前版本及[官方安全公告](https://github.com/nvm-sh/nvm/security/advisories)，选择包含相关修复的受支持版本；这些公告不能保证不存在其他问题。

安装与更新说明见 [nvm 官方仓库](https://github.com/nvm-sh/nvm#installing-and-updating)。以上安全公告核验于 2026 年 10 月 28 日。

