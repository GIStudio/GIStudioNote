---
title: DSH 插件能不能用 Python 写
description: DSH 插件必须以 npm 包的形式分发，但核心逻辑可以放在 Python 子进程里。拆解"JS/TS 接入层 + Python 实现层"的桥接模式，并用三个真实插件的源码验证。
tags:
  - DSH
  - 插件开发
  - Python
  - npm
  - AI Agent
  - Dev
---

# DSH 插件能不能用 Python 写

能，但要分两层看：**插件的外壳必须是 npm 管理的 JavaScript/TypeScript 包，核心逻辑却可以整个放在 Python 进程里**。JS/TS 是接入 DSH 运行时的"门票"，Python 是实现层，两者通过子进程桥接。

## 为什么外壳必须是 npm 包

[DeepSeek Harness（DSH）](https://github.com/deepseek-ai/deepseek-harness)的插件运行时是 Node.js，插件系统建立在 [Cordis](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.zh.md) 之上——一个以 vendor 方式引入的 TypeScript 插件框架。按官方文档，一个 Cordis 插件就是一个带可选 `inject` 声明和 `apply(ctx)` 入口的函数（或 `Service` 子类），通过 `ctx.<key>` 查找服务、用类型化事件通信。这套契约本身是用 TypeScript 表达的，插件自然得是 JS/TS 包。

安装引导要求输入包名、GitHub 仓库地址或本地目录路径，本质上都是在定位一个 npm 包。从[插件管理器的源码](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/src/install-spec.ts)可以看到，安装器实际识别的规格有四种：

| 规格形态 | 例子 |
|---|---|
| npm registry 包名（可带版本） | `dsh-python-env`、`dsh-python-env@0.1.2` |
| git 仓库（简写、git URL、托管平台 URL） | `github:user/repo`、`https://github.com/user/repo` |
| tarball（本地或 HTTP） | `./plugin.tgz`、`https://…/plugin.tar.gz` |
| 本地目录（**必须是绝对路径**） | `/Users/me/my-plugin` |

包装上还有一个小契约：`package.json` 里的 `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }` 字段告诉 DSH 这个包是一个插件 bundle、入口组合在哪。这些字段都只对 npm 包有意义，纯 Python 项目进不了这扇门。

## Python 怎么"藏在里面"

关键在于：插件代码运行在 DSH 宿主的 Node 进程里，而 Node 进程可以启动任意外部进程。所以桥接 Python 有两条通道：

1. **直接用 Node 的 `child_process`**。插件自己 `spawn` 一个 Python 解释器，通过 stdio、文件或本地端口通信。简单粗暴，进程生命周期完全由插件自己管。
2. **走 DSH 提供的 `ctx.subprocess` 服务**。这是平台级的子进程通道，由 `@deepseek-ai/dsh-base` 这类基础 profile 提供，附带输出字节上限、进程树终止等管控，也不受 DSH 沙箱 shell 的限制。

## 三个真实插件的做法

以下结论均来自 npm 上已发布包的实际源码（2026-10-01 核验），不是推测。

**dsh-memoria**（[npm](https://www.npmjs.com/package/dsh-memoria)）：维护**一个长驻 Python 子进程**。它的 `lib/index.js` 直接 `spawn(python, ['-m', 'memoria.plugin_server'], { stdio: ['pipe', 'pipe', 'pipe'] })`，用换行分隔的 JSON（NDJSON）在 stdio 上和这个进程通信，让所有记忆读写共享同一个内存实例。Python 解释器路径做成可配置项，默认取 PATH 上的 `python`/`python3`。

**dsh-agentdebugx**（[npm](https://www.npmjs.com/package/dsh-agentdebugx)）：npm 包里直接附带一个桥接脚本 `bridge/agentdebug_bridge.py`，但**故意不替用户安装 Python**——Python 运行时和底层的 AgentDebugX 包由用户自己装，安装过程保持可审计。插件启动时用本机解释器拉起这个桥接脚本，把会话诊断请求转发给 Python 侧的确定性分析管线。

**dsh-python-env**（[npm](https://www.npmjs.com/package/dsh-python-env)、[GitHub](https://github.com/AngelosZou/dsh-python-env)）：专门演示第二条通道的价值。它通过 `ctx.subprocess` 执行 `python -m venv` 和 `pip`，而不是走沙箱 shell——因为 DSH 的 shell 沙箱会拦下 CPython 的属主专属临时目录（Windows 上 `ensurepip` 会报 `[Errno 13]`）和包索引的网络访问。插件代码跑在宿主进程里，恰好绕开这两个坑。

## 选哪条通道，各自的责任是什么

| 通道 | 适合场景 | 你要自己负责的事 |
|---|---|---|
| `child_process` 直接 spawn | 长驻 Python 服务、自定义 stdio 协议（如 NDJSON） | 进程生命周期、崩溃重启、输出背压、跨平台解释器发现 |
| `ctx.subprocess` 服务 | 短命令调用（venv、pip、CLI 工具） | 遵循平台的输出上限与终止语义 |

无论哪条通道，**Python 依赖的安装责任都在插件作者和用户身上**：npm 装不了 Python 包。三个例子给出了两种应对——memoria 假设用户已装好可 `import memoria` 的解释器，agentdebugx 明确要求用户独立安装 Python 运行时。写插件时最好把解释器路径做成配置项，并在文档里写清 Python 侧的安装步骤。

另一个容易忽略的点：插件卸载或热重载时，Cordis 会撤销 `ctx.effect()` 注册的副作用，但你 spawn 出来的 Python 子进程不会自动消失——在 `apply` 返回的清理逻辑里显式杀掉它，否则会留下孤儿进程。

## 一句话总结

DSH 插件的模式可以概括为：**JS/TS 是接入层，Python 是实现层**。npm 包是接入运行时的门票，负责注册工具、声明服务依赖、管理生命周期；算法、模型推理、数据处理这些重活，交给一个独立的 Python 进程，通过 stdio 或 `ctx.subprocess` 桥接回来。

## 来源与证据边界

- 插件契约与 Cordis 概念：[DSH 官方 Cordis 入门](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.zh.md)（官方文档）。
- 安装规格识别：[plugin-manager/install-spec.ts 源码](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/src/install-spec.ts)（一手源码）。
- 三个社区插件的内部实现：各自 npm 发布包（dsh-memoria 0.1.0、dsh-agentdebugx 0.1.0、dsh-python-env 0.1.2）内的源码与 README，2026-10-01 下载核验。
- 沙箱限制的描述（`[Errno 13]`、网络拦截）来自 dsh-python-env 作者的 README，属于作者自述，未独立复现。
