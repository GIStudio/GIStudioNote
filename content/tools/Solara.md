---
title: Solara：纯 Python 的 React 风格数据应用框架
description: Solara 的定位、四层架构、组件与状态模型、快速上手，以及与 Streamlit/Dash 的选择判据。
tags:
  - 工具
  - Python
  - 数据可视化
  - Web开发
  - Jupyter
  - 开源
---

[Solara](https://solara.dev) 是一个用纯 Python 写交互式数据应用（data app）的开源框架，MIT 协议，由 Widgetti 团队开发和维护（仓库 2022 年建立；2026 年 10 月版本 1.64.0，要求 Python ≥ 3.8）。它的核心承诺是"一次编写，处处运行"：同一份组件代码，在 Jupyter notebook 里是交互式输出，交给 `solara run` 就是独立的多用户 Web 应用——不写 JavaScript，不碰 Node 构建工具。

Solara 适合把 Jupyter 中的交互式分析组织成供他人使用的网页应用。

## 它解决什么问题

把 notebook 原型变成交互应用，传统上有三条路，各有各的痛。

学一条 JavaScript 前端栈。React/Vue 加状态管理，对以 Python 为母语的人成本太高，而且数据计算部分还得隔着 API 与前端通信，两边各维护一份代码。

用 Streamlit 或 Dash。纯 Python、上手快，但执行模型是"每次交互重跑整个脚本"，状态与性能要靠缓存机制打补丁；它们与 Jupyter 的组件生态（ipywidgets 一族）也不互通，notebook 里的交互控件迁移过去要重写。

直接用 ipywidgets 加 voila。能复用 Jupyter 生态，但 ipywidgets 是命令式 API：每个控件手动挂回调、手动同步状态，界面一复杂，代码就缠成回调网。官方文档对 voila 还指出一个运维痛点——代码改动通常要重启服务器才能生效，而 Solara 服务器支持热重载，改完代码浏览器一刷就是新的，多用户部署时每个会话独立运行。

Solara 的答案是给 ipywidgets 换一个 React 式的编程模型，下面看它怎么做到。

## 四层架构

官方把自己的技术栈拆成四层，自底向上：

1. **ipywidgets**：Jupyter 的交互组件协议，控件状态在内核与前端之间同步。这是"同一份代码在 notebook 和浏览器里都能跑"的地基。
2. **ipyvuetify**：把 Vue 的 Material UI 组件库 Vuetify 封装成 widget，提供按钮、卡片、布局这些有设计感的基础件。
3. **Reacton**：用 Python 实现的 React。组件、props、Hooks、虚拟 DOM diff 都在，只是语言换成了 Python。这一层决定了执行模型：状态变化时只重新执行受影响的组件函数，而不是重跑整个脚本——与 Streamlit 的根本区别就在这里。
4. **Solara 本体**：在 Reacton 之上提供约 40 个开箱即用组件（数据表格、文件浏览、Markdown 渲染等）、路由和独立服务器。服务器为每个用户会话维护独立内核。

Solara 可以接入 ipyleaflet 地图、bqplot 图表等 ipywidgets 生态组件，也提供 matplotlib、plotly 等可视化集成。对已有 Jupyter 组件的工作流，这提供了一条复用现有代码的路径。

## 五分钟上手

安装：`pip install solara` 是最小安装，`pip install "solara[all]"` 带上常用依赖。

一个计数器（官方状态管理文档的入门例）：

```python
import solara

@solara.component
def Counter():
    count, set_count = solara.use_state(0)

    def on_click():
        set_count(count + 1)

    solara.Button(label=f"Clicked {count} times", on_click=on_click)
```

启动：

```bash
solara run app.py
```

浏览器打开 `http://localhost:8765` 就是应用。同一份代码放进 Jupyter，在单元格里直接调用 `Counter()`，输出就是那个按钮，一行不用改。

`@solara.component` 把普通函数变成组件，`use_state` 与 React 的 `useState` 一一对应。写过 React 的人几乎零成本迁移；没写过的要补的也只有"组件函数会被反复重新执行"这一个心智模型。

## 两个要紧的心智模型

**组件是声明式的。** 你描述"状态 S 应该渲染成什么样"，框架负责 diff 和更新。组件用 props 收数据、用 children 组合内容，界面靠组合而非配置项堆出来。渲染还是惰性的：官方给过一个数字，一万行的 DataTable 实际只渲染视口内可见的三十来行，滚动时再补——对大数据展示是实打实的性能红利。

**状态有两条路。** `solara.reactive(...)` 创建跨组件共享的响应式变量，`.value` 一变，引用它的组件自动重渲染，适合全局状态；`solara.use_state(...)` 是组件内局部状态。文档专门列了两个常见坑：一是"stale closure"——在事件回调里引用组件函数里的局部变量，拿到的是渲染时刻的旧值；二是频繁重渲染。解法都是往响应式变量上靠：事件触发时才读 `.value`，读到的永远是最新值。全局状态推荐 store 模式，把响应式变量收进一个类：

```python
class GlobalStore:
    state = solara.reactive({'counter': 0})
```

任何组件读 `GlobalStore.state.value['counter']`，任何一处改动，所有引用同步更新。

## 与 Streamlit/Dash 怎么选

选择取决于现有组件、部署方式和交互需求。

选 Solara 的理由集中在三点：要复用 Jupyter/ipywidgets 资产（ipyleaflet、bqplot 可以原样进页面）；要多用户部署但不想维护 Node 工具链；交互频繁的应用里"只重渲染受影响组件"比"重跑整个脚本"省心。

选 Streamlit 的理由：团队没有 Jupyter 习惯、要的是报表式展示、需要更大的社区和第三方组件生态——Streamlit 的社区规模比 Solara 大一个数量级以上，这是生态差距，不是质量判断。Dash 的定位偏企业仪表盘，与 Solara 重叠的部分类似权衡。官方甚至准备了 [Streamlit 迁移教程](https://solara.dev/documentation/getting_started/tutorials/streamlit)，逐组件对照着翻。

也有明确的退出条件：要高度定制的前端交互、非 Material 的视觉体系，或者产品本身就是一个复杂 SPA——这时正经前端栈仍是正解。Solara 的组件基于 Vuetify，想突破默认样式得写 CSS 或直接嵌 Vue/ESM 组件，走到那一步，其实已经在写前端了。

## 资源

- [官网与文档入口](https://solara.dev/documentation)
- [快速上手（Quickstart）](https://solara.dev/docs/quickstart)：安装到运行一分钟走完
- [组件基础](https://solara.dev/documentation/getting_started/fundamentals/components) · [状态管理](https://solara.dev/documentation/getting_started/fundamentals/state-management)：两篇必读
- [架构理解系列](https://solara.dev/documentation/advanced/understanding/)：ipywidgets、ipyvuetify、Reacton 逐层拆开讲
- [在线示例库](https://solara.dev/documentation/examples)：计算器、待办、聊天机器人等可以直接玩
- [GitHub 仓库](https://github.com/widgetti/solara)（MIT）
