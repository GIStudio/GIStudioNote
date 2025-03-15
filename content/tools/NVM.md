---
title: NVM 教程
tags:
  - "#DevOps"
  - "#NVM"
---

`nvm`（Node Version Manager）是一个非常强大的工具，用于管理多个 Node.js 版本。以下是检查当前安装的 Node.js 版本并切换版本的具体操作步骤：

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
输出示例：
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
nvm use <version>
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
nvm alias default <version>
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
nvm install <version>
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
如果切换版本后仍然显示旧版本，请检查是否有系统级别的 Node.js 安装覆盖了 `nvm` 的版本。可以通过以下命令确认：
```bash
which node
```
如果输出路径不是 `$NVM_DIR/versions/node/<version>/bin/node`，说明系统级别的 Node.js 可能干扰了 `nvm`。建议卸载系统级别的 Node.js 或调整环境变量优先级。

---

通过以上步骤，您可以轻松检查、安装和切换 Node.js 版本。如果仍有疑问，请随时补充问题！