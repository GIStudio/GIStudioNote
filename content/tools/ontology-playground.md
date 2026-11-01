---
title: Ontology Playground：从本体概念到可视化建模
description: 梳理微软 Ontology Playground 的课程、目录、设计器与 RDF 导出，解释本体、知识图谱、约束和自然语言演示的关系。
tags:
  - 本体论
  - 知识图谱
  - 语义网
  - 数据建模
  - 开源工具
source: https://github.com/microsoft/Ontology-Playground
source_commit: 7bf7acb427424ce68f917fa26f484fb06ca42051
verified_at: 2026-11-01
---

[Ontology Playground](https://github.com/microsoft/Ontology-Playground) 是微软开源的本体学习与设计工具。它把实体类型、属性、关系和约束画成可探索的图，并提供课程、示例目录和可视化设计器。对初学者，它提供了从“读懂一个模型”到“说明自己的建模选择”的练习路径。

冬奇实验室的[介绍文章](https://home.wonlab.top/blog/open-source-projects/183-ontology-playground)是一个中文入口。本文进一步依据官方文档和源码整理；版本固定为 `7bf7acb`，核验日期为 2026 年 11 月 1 日。项目仍标注为 Preview，功能和接口应按相应版本理解。

## 从“有哪些数据”进入“数据指什么”

以图书馆为例，我们可能记录建筑、运营机构、借阅活动和开放时间。本体设计要说明这些词分别指什么：建筑是物理对象，机构是组织，借阅是活动，开放时间描述服务安排。它们之间的关系也各有含义，例如机构运营服务、服务在某栋建筑中提供。

这里需要区分两个相连的任务。

- **哲学本体论**追问存在者的种类、关系和存在条件。进入城市研究，它帮助我们讨论物理空间、社会制度与持续过程分别怎样构成城市。
- **知识工程中的本体**把选定领域的术语、类别和关系作形式化表达，使人和软件能按照明确的语义交换信息。OWL 是支持这种表达的标准语言之一。[OWL 2 概述](https://www.w3.org/TR/owl2-overview/)

在这个例子中，本体规定 `Building`、`Organisation`、`Service` 等类别及其关系；知识图谱再用这些词汇描述具体的建筑、机构和服务。类型定义与具体事实共同参与解释，但各自承担不同职责。

## 怎样阅读它的知识资源

官方学习入口是 [Ontology School](https://microsoft.github.io/Ontology-Playground/#/learn)，示例入口是 [Catalogue](https://microsoft.github.io/Ontology-Playground/#/catalogue)。可以按下面的顺序阅读。

| 阅读阶段 | 在工具里做什么 | 要能说明什么 |
| --- | --- | --- |
| 理解概念 | 阅读基础课程，查看小型示例 | 类、具体对象、属性和关系如何区分 |
| 观察建模选择 | 打开一个行业本体，检查节点与边 | 一个类别为何单列，关系的起点与终点是什么 |
| 修改模型 | 在 [Designer](https://microsoft.github.io/Ontology-Playground/#/designer) 中创建或调整自建模型 | 修改以后，哪些问题变得可以表达 |
| 检查交换结果 | 查看并导出 RDF/XML | 哪些语义被表达，哪些信息属于工具自身的展示或绑定元数据 |

课程和行业路径可用作入门材料；将示例带入真实场景时，还需核对当地术语、制度、数据与业务规则。官方目录中的分类为学习服务，具体领域的本体应围绕要回答的问题设计。

## 一个小模型怎样变得有用

先提出一个可以检验的问题，例如“某项服务由谁运营，在什么地方、什么时间提供”。然后建立所需类别和关系：

```text
Organisation ── operates ──> Service
Service ── providedAt ──> Building
Service ── hasSchedule ──> OpeningSchedule
```

这是教学性结构示意，尚未绑定真实数据。每条边都需要说明方向与含义；时间安排也要约定时区、有效日期和例外情况。模型完成后，检查它是否确实能表达原先的问题，再补充遗漏的概念。

这类用来检验模型能力的问题通常称为“能力问题”（competency questions）。它让建模有一个具体判断依据：当前词汇和关系能否支持需要的描述与查询。

## RDF、OWL 与 SHACL 分别承担什么

RDF 用三元组组织陈述，例如“服务 S 在建筑 B 中提供”；OWL 为类、属性和逻辑公理规定形式语义；SHACL 则用形状描述需要检查的数据条件。[OWL 2](https://www.w3.org/TR/owl2-overview/) · [SHACL](https://www.w3.org/TR/shacl/)

以“每条服务记录都要填写一个运营机构”为例，需要明确这是对当前数据的完整性要求。可以用 SHACL 的计数约束检查指定属性是否有值。OWL 采用开放世界语义：资料中尚未列出的事实可以仍然未知，因而逻辑推理与数据完整性检查需要分别安排。[OWL 2 Primer](https://www.w3.org/TR/owl2-primer/)

Playground 当前的自建模型提供两种生成导出配置：

- **Playground round-trip** 保留图标、颜色、数据绑定等项目元数据，便于回到编辑器继续工作。
- **Standards-oriented OWL + SHACL** 用标准词汇表达受支持的模型部分，省略未映射的展示与绑定信息。

其关系参与默认可选，导出不会凭空补上关系的 `sh:minCount`。读到 `1:N` 时，应进一步核对它表达了哪个方向的最大数量，以及业务是否另有必填要求。[官方导出规范](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/docs/rdf-export-profiles.md)

## 导入、查询与联网功能的实际边界

**导入文档与自建模型有不同的编辑范围。** 当前支持 RDF/XML 源文件，保留原字节和完整 RDF 图，画布显示的是其中的可视化投影。源文件模式只开放有限的标签、注释与直接命名类继承关系编辑；完整文档中的其他语句继续保留。当前不支持 Turtle 输入，保存的 SHACL 与外部引用也保持惰性，不执行规则或抓取外部资源。[官方功能与导入说明](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/README.md)

**自然语言查询是本地概念演示。** 该版本的 `processQuery` 根据英语关键词、句式、当前模型及咖啡店示例的预置回答展示查询如何对应实体与关系。它没有在这条路径中调用 LLM 或访问真实业务数据库；真实数据接入、查询正确性和权限控制需要在实际系统中另行实现。[查询实现](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/src/data/queryEngine.ts)

**默认静态站与可选服务分别部署。** 官方 GitHub Pages 发布静态前端；AI 构建器默认关闭，启用时需要独立、受保护的生成网关。生成结果是本体定义草稿，需要人工审查；GitHub 登录和目录 PR 功能也涉及联网与独立配置。试用时宜采用公开或虚构材料，并先了解所选功能会把数据发送到哪里。[生成连接器文档](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/docs/generation-connectors.md)

## 将交互图放入网页

当前官方嵌入指南使用独立容器和 `ontology-embed.js`：

```html
<div class="ontology-embed"
     data-catalogue-id="official/cosmic-coffee"
     data-catalogue-base-url="https://microsoft.github.io/Ontology-Playground/"
     data-theme="light"
     data-height="500px">
</div>
<script src="https://microsoft.github.io/Ontology-Playground/embed/ontology-embed.js"></script>
```

这段代码来自[官方嵌入指南](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/docs/embed-guide.md)。它会从外部站点加载脚本和模型资源；实际嵌入前应核对内容安全策略、第三方依赖与发布许可。本文未在站内启用该脚本，也未实测浏览器交互。

## 继续到城市科学

[[../Philosophy/urban-science-ontology|用本体论分析城市科学]]将这套思路用于一个旧校舍转作公共图书馆的教学情境，继续讨论建筑身份、设施用途、机构、时间、城市边界和观测证据。概念入门见 [[../Philosophy/ontology|本体论]]。

本文依据公开介绍、固定版本官方文档与源码整理，未安装项目、运行其测试、验证全部标准互操作性，或连接 Fabric、AI 网关与 GitHub 发布功能。
