---
title: OpenManus：开源 Agent 框架入门与安全边界
description: 介绍 OpenManus 的官方仓库、基础配置和运行 Agent 时需要注意的安全边界。
tags:
  - AI
  - OpenManus
  - Agent
  - 开源
  - 浏览器自动化
  - LLM
  - 工具
verified_at: 2026-10-28
---

# OpenManus：开源 Agent 框架入门

OpenManus 是一个开源 Agent 项目，可以把语言模型与工具连接起来，围绕用户任务调用浏览器、执行操作并返回结果。[官方仓库](https://github.com/FoundationAgents/OpenManus)采用 MIT 许可证。原先的 mannaandpoem/OpenManus 地址已迁往 FoundationAgents，旧地址现在指向新仓库和归档版本。

运行 Agent 前应先确定它可访问的文件、浏览器账号和网络，以及模型服务提供方可以接收哪些数据。以下步骤依据仓库文档整理，未在本页进行安装或运行测试；版本变化时以官方说明为准。

## 安装与配置

官方文档提供 Python 3.12 和虚拟环境的安装方式。确认本机已安装 uv 后，可以参考：

~~~bash
git clone https://github.com/FoundationAgents/OpenManus.git
cd OpenManus
uv venv --python 3.12
source .venv/bin/activate
uv pip install -r requirements.txt
cp config/config.example.toml config/config.toml
chmod 600 config/config.toml
~~~

根据[官方配置示例](https://github.com/FoundationAgents/OpenManus/blob/main/config/config.example.toml)，在本地配置文件填写自行选择的模型名称、服务地址和密钥。先核实服务商身份、隐私条款及计费规则；不要将密钥放进聊天记录、截图、公开仓库或示例代码。官方仓库的 [config 目录忽略规则](https://github.com/FoundationAgents/OpenManus/blob/main/config/.gitignore)列出了该文件；填写密钥之前，可在自己的副本中用以下命令确认规则生效：

~~~bash
git check-ignore -v config/config.toml
~~~

如果没有输出，先处理忽略规则；即使忽略了文件，也不应把它分享给他人。密钥一旦泄露，应立即在服务商处撤销并更换。

## 首次运行与浏览器

官方入口是：

~~~bash
OPENMANUS_DISABLE_BROWSER_USE=1 python main.py
~~~

这里先关闭官方文档所述默认 Browser Use 服务，便于限定首次测试的浏览器访问；这不代表关闭所有其他工具或隔离了文件和代码执行。选择非敏感的测试任务，确认工具调用范围后再启用浏览器。当前官方文档说明 Browser Use 可连接本地 Chrome 或 Chromium；使用前应检查连接目标，避免让 Agent 接管含私人登录状态的日常浏览器。

项目还提供沙箱配置，但不能仅凭配置名称断言所有工具都受到隔离；在隔离环境或专用低权限账户中测试，限制文件挂载和网络，并核实实际生效范围。浏览器、MCP 服务与外部模型各自可能拥有独立权限。涉及发送消息、上传数据或修改文件等操作时，应先人工检查和确认。

## 参考资料

- [OpenManus 官方仓库与安装说明](https://github.com/FoundationAgents/OpenManus)
- [官方配置示例](https://github.com/FoundationAgents/OpenManus/blob/main/config/config.example.toml)
- [旧仓库迁址说明](https://github.com/mannaandpoem/OpenManus)
