---
title: GIStudio Notes 术语表
description: 汇总 GIS、GeoAI、人工智能、开发与研究阅读中反复出现的缩写和基础术语，并连接到站内深入笔记。
tags:
  - 术语表
  - GIS
  - GeoAI
  - AI
  - 研究方法
  - 索引
---

# GIStudio Notes 术语表

这个词典收录跨页面反复出现、又可能阻碍理解的术语。每个条目先给出够用的解释，再连接到更完整的概念页。只在一篇文章中使用的符号和局部概念，仍放在原文首次出现的位置或附录中。

## 地理空间与城市数据

### GIS

GIS 常指 Geographic Information System，中文通常译为地理信息系统，也可能指 Geographic Information Science，中文通常译为地理信息科学。前者偏向用于采集、管理、分析和表达空间数据的系统，后者研究空间信息及其表示、分析和使用所涉及的科学问题。阅读时要根据上下文判断作者谈的是工具系统还是学科。

### GeoAI

GeoAI 是 Geospatial Artificial Intelligence 或 Geographic Artificial Intelligence 的简称，中文常译为地理空间人工智能。它处理带有位置、距离、方向、邻接、尺度或空间过程的数据与任务。本站把空间关系和地理语境视为核心对象，相关入口见[[../AI/GeoAI/index|GeoAI 与自主地理智能]]。

### POI

POI 是 Point of Interest 的简称，中文常译为兴趣点。它通常表示具有名称、位置和类别的场所，例如车站、学校、商店或医院。POI 数据适合表达设施分布，不能单独证明设施质量、实际使用量或服务可达性。

## 人工智能与机器学习

### 机器学习 ML

机器学习让计算系统从数据中估计模式，并用这些模式完成预测、分类、表示或决策。它是人工智能中的一组方法，深度学习则使用多层神经网络完成其中一部分任务。模型能否迁移到新数据，仍取决于数据分布、任务定义、评价设计和使用条件。

### AI4Science

AI4Science 是 Artificial Intelligence for Science 的简称，中文可译为用于科学研究的人工智能或面向科学的人工智能。它把机器学习用于科学数据分析、模拟、预测、实验设计和发现过程。一个项目使用了 AI 工具，并不能单独证明它改进了科学发现，仍需检查科学问题、证据和验证方式。

### Autonomous GeoAI

Autonomous GeoAI 指能够围绕地理空间任务组织数据、模型、GIS 工具和多步行动的自主地理智能。系统通常需要读取空间状态、选择工具、执行操作、检查结果并处理失败，重要任务还需要人工监督。概念边界见[[../AI/GeoAI/autonomous-geoai|Autonomous GeoAI 概念与边界]]。

### LLM

LLM 是 Large Language Model 的简称，中文为大语言模型。它从大规模语言数据中学习词元序列的统计结构，并据此生成、补全或处理文本。模型输出仍需结合任务证据、工具结果和评价标准核验。相关入口见[[../AI/LLM/index|大语言模型]]。

### Agent

Agent 在人工智能语境中通常译为智能体。它接收环境或工具反馈，根据目标选择动作，并在多步过程中更新状态。只有一次模型调用的文本生成流程未必构成完整智能体，具体判断要看它是否具有持续状态、行动接口，以及能否利用反馈调整后续动作。GeoAI 场景见[[../AI/GeoAI/geoai-agent-architecture|GeoAI Agent 架构]]。

### NLP

NLP 是 Natural Language Processing 的简称，中文为自然语言处理。它研究计算机如何分析、生成和使用人类语言。分词、信息抽取、翻译、问答和文本生成都属于常见任务。站内案例见[[../DL/NER|命名实体识别]]。

### CV

CV 在人工智能页面中通常指 Computer Vision，中文为计算机视觉，研究机器如何从图像和视频中提取信息。它在个人履历或学术求职语境中也可能指 Curriculum Vitae。正文首次使用时应给出全称，避免把两个含义混在一起。

### CNN

CNN 是 Convolutional Neural Network 的简称，中文为卷积神经网络。它通过卷积核提取局部结构并逐层组合特征，常用于图像、栅格和其他规则网格数据。具体模型仍需说明输入尺度、网络结构和评价任务。

### EO

EO 是 Earth Observation 的简称，中文常译为地球观测。它利用卫星、航空平台、地面传感器等手段观察地表、海洋和大气。遥感是地球观测的重要技术来源，EO 数据还需要结合传感器、时间、空间分辨率和处理级别理解。

### AR 与 VR

AR 是 Augmented Reality 的简称，中文为增强现实，通常把数字内容叠加到用户所处的现实环境中。VR 是 Virtual Reality 的简称，中文为虚拟现实，通常让用户进入由计算机生成的沉浸式环境。两者都可能使用三维场景和空间定位，交互方式与现实环境参与程度不同。

### RL

RL 是 Reinforcement Learning 的简称，中文为强化学习。智能体在环境中采取动作并接收奖励，通过交互学习能够提高累计回报的策略。状态、动作、奖励和环境转移共同决定问题形式。学习入口见[[../RL/index|强化学习]]。

### MDP

MDP 是 Markov Decision Process 的简称，中文为马尔可夫决策过程。它用状态、动作、转移概率、奖励和折扣因子描述序贯决策问题，并为许多强化学习方法提供形式基础。详细解释见[[../RL/concepts/MDP|Markov Decision Process]]。

### GPU

GPU 是 Graphics Processing Unit 的简称，中文为图形处理器。它擅长并行执行大量结构相似的计算，因此广泛用于图形渲染和深度学习训练与推理。GPU 型号、显存容量和软件支持会直接影响模型能否运行以及运行成本。

## 软件、数据与研究基础设施

### API

API 是 Application Programming Interface 的简称，中文为应用程序编程接口。它规定一个软件组件可以怎样被其他程序调用，包括可用操作、输入、输出和错误约定。网页开发中的 API 可能表现为方法、事件或 URL。更通用的定义可参考 [MDN API 词条](https://developer.mozilla.org/en-US/docs/Glossary/API)。

### DOI

DOI 是 Digital Object Identifier 的简称，中文为数字对象标识符。它为论文、数据集和其他对象提供持久标识，并可通过 `https://doi.org/` 解析到当前登记位置。DOI 指向的位置可以更新，标识本身保持稳定。详细说明见 [DOI Foundation](https://www.doi.org/the-identifier/what-is-a-doi)。

### KDD

KDD 是 Knowledge Discovery in Databases 的简称，中文为数据库知识发现。它涵盖问题理解、数据选择、清洗、转换、数据挖掘、模式评价和知识表达等环节。数据挖掘是其中一个步骤。站内解释见[[../AI/KDD|数据库知识发现]]。

### SDG

SDG 是 Sustainable Development Goal 的简称，复数 SDGs 指联合国可持续发展目标。联合国在 2015 年通过了 17 项目标，覆盖社会、经济和环境议题。目标之间存在联系，引用具体目标时仍需回到相应指标、地域和时间范围。站内入口见[[../Sustainability/SDG/index|可持续发展目标]]，正式文本见[联合国目标页面](https://sdgs.un.org/goals)。

## 分类与使用原则

- 同一个缩写可能有多个展开形式，正文应在首次出现时给出当前语境下的全称。
- 词典提供最小定义，深入主张仍应回到专题页和原始来源。
- 软件版本、模型能力、数据规模与政策状态可能变化，应在相应页面记录核验日期。
- 新词条只有在多个页面重复出现并阻碍理解时才进入共享词典。

相关分类说明见[[development-status-classifications|联合国体系中的发达与发展中经济体分类]]。
