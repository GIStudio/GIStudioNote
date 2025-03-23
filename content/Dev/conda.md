---
title: conda 使用速查
tags:
  - Python
---
以下是一个关于 `conda` 的快速使用速查指南，涵盖了安装、创建环境、激活环境以及设置终端默认激活等内容。内容以清晰的步骤和说明为主，便于快速上手。

---

### **1. Conda 安装**
#### **方法一：通过 Anaconda 安装（推荐）**
1. 下载 Anaconda 安装包：
   - 访问 [Anaconda 官网](https://www.anaconda.com/)。
   - 根据操作系统选择合适的版本（Windows、macOS 或 Linux）。
2. 安装 Anaconda：
   - Windows: 双击下载的 `.exe` 文件，按照提示完成安装。
   - macOS/Linux: 使用命令行运行安装脚本，例如：
     ```bash
     bash Anaconda3-YYYY.MM-Linux-x86_64.sh
     ```
     安装过程中可以选择是否将 `conda` 添加到系统路径中（建议选择 "yes"）。
3. 验证安装：
   打开终端或命令提示符，运行以下命令检查是否安装成功：
   ```bash
   conda --version
   ```
   如果显示版本号（如 `conda 23.x.x`），则安装成功。

#### **方法二：通过 Miniconda 安装（轻量版）**
1. 下载 Miniconda 安装包：
   - 访问 [Miniconda 官网](https://docs.conda.io/en/latest/miniconda.html)。
   - 根据操作系统选择合适的版本。
2. 安装 Miniconda：
   - Windows: 双击 `.exe` 文件并按提示完成安装。
   - macOS/Linux: 使用命令行运行安装脚本，例如：
     ```bash
     bash Miniconda3-latest-Linux-x86_64.sh
     ```
3. 验证安装：
   同样运行 `conda --version` 检查是否安装成功。

---

### **2. 创建和管理 Conda 环境**
#### **创建新环境**
```bash
conda create --name <env_name> python=<version>
```
- `<env_name>`: 环境名称，例如 `my_env`。
- `<version>`: Python 版本号，例如 `3.9`。

示例：
```bash
conda create --name my_env python=3.9
```

#### **查看所有环境**
```bash
conda env list
```
或
```bash
conda info --envs
```

#### **激活环境**
```bash
conda activate <env_name>
```
示例：
```bash
conda activate my_env
```

#### **退出当前环境**
```bash
conda deactivate
```

#### **删除环境**
```bash
conda remove --name <env_name> --all
```
示例：
```bash
conda remove --name my_env --all
```

---

### **3. 安装和管理包**
#### **安装包**
```bash
conda install <package_name>
```
示例：
```bash
conda install numpy
```

#### **更新包**
```bash
conda update <package_name>
```
示例：
```bash
conda update numpy
```

#### **卸载包**
```bash
conda remove <package_name>
```
示例：
```bash
conda remove numpy
```

#### **查看已安装的包**
```bash
conda list
```

---

### **4. 设置终端默认激活某个环境**
#### **方法一：修改配置文件**
1. 找到 Conda 的配置文件（通常是 `~/.bashrc` 或 `~/.zshrc`，取决于你的 shell）。
2. 在文件末尾添加以下内容：
   ```bash
   conda activate <env_name>
   ```
   示例：
   ```bash
   conda activate my_env
   ```
3. 保存文件并重新加载配置：
   ```bash
   source ~/.bashrc
   ```
   或
   ```bash
   source ~/.zshrc
   ```

#### **方法二：使用 `auto_activate_base`**
Conda 默认会自动激活 `base` 环境。如果希望禁用此行为，可以运行以下命令：
```bash
conda config --set auto_activate_base false
```
如果希望重新启用，可以运行：
```bash
conda config --set auto_activate_base true
```

---

### **5. 其他常用命令**
#### **更新 Conda**
```bash
conda update conda
```

#### **清理缓存**
```bash
conda clean --all
```

#### **导出环境配置**
```bash
conda env export > environment.yml
```

#### **从配置文件创建环境**
```bash
conda env create -f environment.yml
```

---

### **总结**
以上内容涵盖了 Conda 的安装、环境管理、包管理以及终端默认激活等常见操作。你可以根据需要复制粘贴相关命令进行快速操作。如果有其他问题，欢迎进一步提问！