---
title: 开源的智能工具！OpenManus
tags:
  - AI
  - OpenManus
  - Agent
  - 开源
  - 浏览器自动化
  - Playwright
  - LLM
  - 工具
  - GIStudy
  - 微信公众号推文
---
下面开始介绍OpenManus的安装以及测试。
网站在：
```
https://github.com/mannaandpoem/OpenManus
```
下面告诉你如何快速入门：
- 创建开发环境
- 复制代码仓库
- 安装依赖
- 配置上自己的api key
	- 你可以用我的推荐码，这是一个api站点：https://api.zetatechs.com/register?aff=hiqf
- 开始运行

## 创建开发环境

```
conda create -n open_manus python=3.12
conda activate open_manus
```

## 复制代码仓库
```
git clone https://github.com/mannaandpoem/OpenManus.git
# 打开对应文件夹
cd OpenManus
```

## 安装依赖

```
pip install -r requirements.txt
```

如果不用浏览器功能的话，就可以直接开始运行了，但是OpenManuse的一个特色就是浏览器功能，所以可以先测试一下，如果用到就继续安装。


## 配置自己LLM 的api
- 复制模版文件
- 配置自己的api

```
cp config/config.example.toml config/config.toml
```

```
# Global LLM configuration
[llm]
model = "gpt-4o-mini"
base_url = "https://api.zetatechs.com/v1"
api_key = "sk-..."  # 这里换成你自己的key
max_tokens = 4096
temperature = 0.0

# Optional configuration for specific LLM models
[llm.vision]
model = "gpt-4o-mini"
base_url = "https://api.zetatechs.com/v1"
api_key = "sk-..."  # 这里换成你自己的key

```

## 开始运行

```
# 在终端运行：
python main.py

```
你可以和它用中文对话，最后需要要求输出用markdown格式。（不然对话结果只会在终端中）

如果你确定需要使用浏览器，你需要额外执行浏览器的安装，下面这个可以帮助你安装OpenManus指定的浏览器
```
playwright install
```


![[Pasted image 20250309094437.png]]

![[Pasted image 20250309095136.png]]

成功调用浏览器：

![[Pasted image 20250309095158.png]]
最后的结果：
![[Pasted image 20250309095612.png]]