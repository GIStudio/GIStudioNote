# Git 与 GitHub 配置指南

本文档介绍如何从零开始配置 Git 和 GitHub。

## 安装 Git

### macOS
```bash
# 使用 Homebrew 安装
brew install git

# 或检查是否已安装
git --version
```

### Windows
从 [Git 官网](https://git-scm.com/download/win) 下载安装包，按提示完成安装。

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

## 初始配置

安装完成后，需要进行全局配置：

```bash
# 配置用户名（建议与 GitHub 用户名一致）
git config --global user.name "你的用户名"

# 配置邮箱（建议与 GitHub 注册邮箱一致）
git config --global user.email "your.email@example.com"

# 启用颜色输出
git config --global color.ui auto

# 设置默认分支名为 main
git config --global init.defaultBranch main
```

### 查看配置
```bash
# 查看所有配置
git config --list

# 查看特定配置项
git config --global user.name
```

## 生成 SSH 密钥

SSH 密钥用于无需输入密码即可与 GitHub 通信。

### 1. 检查是否已有密钥
```bash
ls -la ~/.ssh
```
如果已有 `id_rsa` 和 `id_rsa.pub`，可跳过生成步骤。

### 2. 生成新密钥
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```
按提示操作：
- 输入保存路径（直接回车使用默认路径）
- 输入密码（可留空，但建议设置）

### 3. 添加到 SSH Agent
```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加密钥
ssh-add ~/.ssh/id_ed25519
```

## 配置 GitHub

### 1. 复制公钥
```bash
# 查看公钥内容
cat ~/.ssh/id_ed25519.pub
# 或
cat ~/.ssh/id_rsa.pub
```
复制输出的内容。

### 2. 在 GitHub 添加公钥
1. 登录 GitHub，点击右上角头像 → **Settings**
2. 左侧菜单选择 **SSH and GPG keys**
3. 点击 **New SSH key**
4. 填写标题（如 "我的电脑"）
5. 将复制的公钥粘贴到 **Key** 框中
6. 点击 **Add SSH key**

### 3. 验证连接
```bash
ssh -T git@github.com
```
看到 "Hi xxx! You've successfully authenticated" 即配置成功。

## 克隆仓库

获取仓库的 SSH 地址后，可以克隆到本地：

```bash
git clone git@github.com:用户名/仓库名.git
```

## 基础 Git 工作流

### 1. 创建或进入项目目录
```bash
cd 项目目录
git init  # 如果是已有项目，执行此命令初始化
```

### 2. 创建/修改文件

### 3. 查看状态
```bash
git status
```

### 4. 暂存文件
```bash
# 暂存特定文件
git add 文件名

# 暂存所有更改
git add .

# 暂存所有更改（包括删除）
git add -A
```

### 5. 提交更改
```bash
git commit -m "提交说明"
```

### 6. 推送到远程
```bash
# 首次推送
git push -u origin main

# 后续推送
git push
```

### 7. 拉取更新
```bash
git pull
```

## 分支操作

### 创建并切换分支
```bash
git checkout -b 新分支名
# 或
git switch -c 新分支名
```

### 切换分支
```bash
git checkout 分支名
# 或
git switch 分支名
```

### 查看分支
```bash
# 本地分支
git branch

# 所有分支（包括远程）
git branch -a
```

### 合并分支
```bash
git checkout main
git merge 分支名
```

## 常见问题

### Q: 每次 push 都需要输入密码？
确保使用的是 SSH 方式而非 HTTPS。检查远程地址：
```bash
git remote -v
```
如果显示 `https://github.com/...`，改为 SSH：
```bash
git remote set-url origin git@github.com:用户名/仓库名.git
```

### Q: 提交信息写错了怎么办？
```bash
# 修改最后一次提交
git commit --amend
```

### Q: 如何撤销更改？
```bash
# 撤销工作区的更改（未 add）
git checkout -- 文件名

# 取消暂存（已 add 但未 commit）
git reset HEAD 文件名

# 回退到上一次提交
git reset --hard HEAD^
```

## 参考资源

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方文档](https://docs.github.com/)
- [Git 飞行手册](https://github.com/pcottle/learnGitBranching)
