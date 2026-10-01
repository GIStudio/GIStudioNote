---
title: DSH 专题
description: DeepSeek Harness（DSH）插件开发、发布与使用实践的专题导航。
tags:
  - DSH
  - 插件开发
  - AI Agent
  - 索引
---

# DSH 专题

[DeepSeek Harness（DSH）](https://github.com/deepseek-ai/deepseek-harness)是一个开源的 AI Agent 运行环境：Node.js 运行时，插件系统建立在 Cordis 框架之上，插件以 npm 包的形式分发和安装。

本专题收集围绕 DSH 的实践笔记——插件怎么写、怎么发、踩过哪些坑。内容来自真实开发和发布过程，机制性论断尽量回到官方文档或源码核验，经验性内容会标注证据边界。

## 插件开发

- [[dsh-plugin-python|DSH 插件能不能用 Python 写]]——npm 外壳 + Python 子进程的桥接模式，用三个真实插件的源码验证。
- [[dsh-plugin-publishing-pitfalls|第一次发布 DSH 插件，我踩了这五个坑]]——seminar-copilot-dsh-plugin 从 v0.3.0 到 v0.3.1 的发布实录与检查清单。

## 内容边界

- 版本、字段、命令等行为事实以对应版本的官方源码和文档为准。
- 踩坑记录属于一手经验，结论只覆盖记录时的版本与环境。
