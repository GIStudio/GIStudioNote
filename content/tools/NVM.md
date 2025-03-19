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

通过以上步骤，您可以轻松检查、安装和切换 Node.js 版本。

在 macOS 中使用 `nvm`（Node Version Manager）时，默认的 Node.js 和 npm 版本可能会因为配置不当而每次打开终端时重置。为了让 `nvm` 默认使用特定版本的 Node.js（例如 v22），并确保 npm 的版本也固定，您可以按照以下步骤进行配置。

---

### 已知信息
1. 您希望让 `nvm` 默认使用 Node.js v22。
2. 您正在使用 macOS，并且终端是基于 `zsh` 的。
3. 每次打开终端时，`nvm` 的默认版本似乎没有正确加载。

---

### 解决步骤

#### 1. 确认已安装 Node.js v22
首先，确保您已经通过 `nvm` 安装了 Node.js v22：
```bash
nvm install 22
```
如果已经安装，可以通过以下命令确认：
```bash
nvm list
```
输出中会显示所有已安装的 Node.js 版本，当前使用的版本会带有 `->` 标记。

---

#### 2. 设置默认 Node.js 版本
使用以下命令将 Node.js v22 设置为默认版本：
```bash
nvm alias default 22
```
这会在 `~/.nvm/alias/default` 文件中记录默认版本，确保每次打开终端时自动加载 Node.js v22。

验证默认版本是否设置成功：
```bash
nvm current
```
输出应该是 `v22.x.x`（具体版本号可能略有不同）。

---

#### 3. 确保 `nvm` 在 `.zshrc` 中正确加载
为了让 `nvm` 在每次打开终端时自动加载，请检查您的 `~/.zshrc` 文件中是否包含以下内容：

编辑 `~/.zshrc` 文件：
```bash
nano ~/.zshrc
```

添加或确保以下代码存在：
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载 bash_completion（可选）
```

保存文件后，重新加载配置：
```bash
source ~/.zshrc
```

---

#### 4. 验证 npm 版本
Node.js 自带 npm，因此设置默认 Node.js 版本后，npm 的版本也会随之确定。验证 npm 版本：
```bash
npm -v
```
如果需要更新 npm 到最新版本，可以运行：
```bash
npm install -g npm@latest
```

---

#### 5. 测试默认版本是否生效
关闭终端并重新打开，运行以下命令验证默认版本是否生效：
```bash
node -v
npm -v
```
输出应该分别是 Node.js v22 和对应的 npm 版本。

---

### 常见问题与解决方法

#### 问题 1：`nvm` 未正确加载
如果 `nvm` 在终端中无法使用，可能是 `~/.zshrc` 文件未正确配置。请确保上述步骤中的 `nvm` 加载代码已正确添加。

#### 问题 2：默认版本未生效
如果设置了 `nvm alias default 22` 后仍然未生效，可能是 `default` 别名未正确保存。可以手动检查 `~/.nvm/alias/default` 文件内容，确保其值为 `22`。

#### 问题 3：多个 Shell 配置文件冲突
如果您同时使用了 `.bashrc`、`.zshrc` 或其他 Shell 配置文件，请确保它们之间没有冲突。通常只需配置 `.zshrc` 即可。

---

### 总结
通过以上步骤，您可以确保 `nvm` 默认使用 Node.js v22，并在每次打开终端时自动加载正确的版本。如果仍有问题，请提供以下信息以便进一步排查：
1. `nvm list` 的输出。
2. `~/.zshrc` 文件中与 `nvm` 相关的配置内容。
3. 是否有其他工具（如 `brew` 或 `fnm`）可能干扰了 `nvm` 的行为。

