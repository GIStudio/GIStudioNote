---
title: Solara：纯 Python 的 React 风格数据应用框架
description: Solara 的定位、组件与状态模型、快速上手，以及与 Streamlit/Dash 的选择判据。
tags:
  - 工具
  - Python
  - 数据可视化
  - Web开发
  - Jupyter
  - 开源
---

[Solara](https://solara.dev/) 是一个以 Python 编写交互式数据应用的开源框架。它的组件建立在 Reacton 和 ipywidgets 之上，可以在 Jupyter 环境中展示，也可以通过 Solara server 提供网页应用。[官方介绍](https://solara.dev/documentation/getting_started/introduction)

如果已有 notebook 分析，希望将控件和结果组织成可复用的页面，Solara 提供了一条从 Python 组件到网页应用的路径。

## 组件与状态

组件用 `@solara.component` 声明，`use_state` 为组件提供当前值和更新函数。下面的按钮每点击一次，计数加一：

```python
import solara


@solara.component
def Page():
    count, set_count = solara.use_state(0)

    def increment():
        set_count(lambda previous: previous + 1)

    return solara.Button(label=f"点击次数：{count}", on_click=increment)
```

将代码保存为 `app.py`，在已安装 Solara 的 Python 环境运行：

```bash
solara run app.py
```

Solara server 会查找名为 `Page` 的组件；地址以终端实际输出为准。在 notebook 中可用 `display(Page())` 显示组件。安装方式和运行示例参见 [Solara 教程](https://solara.dev/documentation/getting_started/tutorials/web-app)。

官方教程中的计数示例为不同浏览器用户保留各自的状态。状态的共享范围取决于创建和存储方式；部署敏感数据应用时，还需要单独设计身份认证、访问控制和数据隔离，不应仅凭组件状态推断进程隔离。[状态钩子文档](https://solara.dev/documentation/api/hooks/use_state)

## 与其他 Python 应用框架的选择

| 框架 | 编写和交互方式 | 适合关注的问题 |
| --- | --- | --- |
| Solara | React 风格组件、状态钩子，基于 ipywidgets 与 Reacton | 如何复用组件和 notebook 交互 |
| Streamlit | 脚本式页面；交互通常触发脚本重新运行，也可通过 `st.fragment` 限定重运行范围 | 如何快速组织数据应用 |
| Dash | 声明式布局与回调函数，按输入和输出连接交互 | 如何围绕回调构建可视化应用 |

这些框架都提供 Python 应用开发方式。选择时应根据团队经验、已有组件、部署环境和实际性能测试决定。Dash 也可在 Jupyter 中运行，因此 notebook 支持不是 Solara 独有的能力。

## 参考资料

- [Solara：入门与架构介绍](https://solara.dev/documentation/getting_started/introduction)
- [Solara：Web 应用教程](https://solara.dev/documentation/getting_started/tutorials/web-app)
- [Streamlit：执行流程与 fragment](https://docs.streamlit.io/develop/api-reference/execution-flow/st.fragment)
- [Dash：基础回调](https://dash.plotly.com/basic-callbacks)；[Dash 在 Jupyter 中运行](https://dash.plotly.com/dash-in-jupyter)
