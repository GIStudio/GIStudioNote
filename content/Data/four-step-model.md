---
title: 四阶段模型
description: 四阶段模型（出行生成→分布→方式划分→分配）的结构、历史、各步骤输入输出与已知局限，以及活动基模型的替代路线。
tags:
  - 交通规划
  - 出行需求模型
  - 空间单元
---
# 四阶段模型

**一句话定位**：四阶段模型（four-step model）是出行需求预测的经典范式——按「生成多少出行 → 出行去哪里 → 用什么方式 → 走哪条路」四步依次计算，把土地利用和社会经济数据转换为路网流量与饱和度；它定义了 1950 年代以来交通规划行业的工作流，也因其集计、弱行为基础而被活动基模型逐步补充。

---

## 1. 模型结构与各步骤

四阶段模型的每一步输出是下一步的输入，空间骨架是 [[taz-traffic-analysis-zone|TAZ 交通分析区]]——前两步完全以「分区→分区」的 OD 对为单位。

1. **出行生成（trip generation）**：按 TAZ 估算出行发生量（production）与吸引量（attraction），通常以用地面积/岗位数/家庭特征为自变量的回归模型或出行率法（如美国 ITE Trip Generation 手册、香港运输署 Traffic Generation Survey）。
2. **出行分布（trip distribution）**：把各区的发生/吸引量配对成 OD 矩阵，经典方法是重力模型（gravity model，流量与活动规模成正比、与阻抗成反比）或增长系数法。
3. **方式划分（modal split）**：把 OD 对之间的出行分摊到小汽车/公交/步行等方式，常用 Logit 类离散选择模型。
4. **交通分配（traffic assignment）**：把方式划分后的出行分配到具体路网路径，经典算法有全有全无法（All-or-Nothing）、用户均衡（User Equilibrium / Wardrop 第一原理）与随机用户均衡（SUE）。

教材级综述见 [UTA Pressbooks 运输建模导论](https://uta.pressbooks.pub/oertransportlanduse/chapter/chapter-9-introduction-to-transportation-modeling-travel-demand-modeling-and-data-collection/)。

## 2. 历史脉络

模型起源于 1950 年代美国州际公路扩张期：早期的出行生成、分布与分流（diversion）模型在 1950 年代末组合为首个完整的四阶段应用（[McNally, "The Four Step Model", UC Irvine](https://escholarship.org/uc/item/0r75311t)，该文是引证最多的综述）；Chicago Area Transportation Study（CATS, 1955–1962）是标志性的早期实践。此后数十年它成为全球都市圈与国家层面需求预测的标准工具，各国在统计分区体系上落地为各自的「交通小区」实现（见 [[taz-traffic-analysis-zone|TAZ 交通分析区与各国同类分区体系]]）。

## 3. 已知局限

- **集计与弱行为基础**：以出行（trip）而非个人活动为分析对象，无法刻画出行链（trip chaining）与活动日程安排；步骤间缺乏行为一致性反馈（[Transport Reviews 2023 综述](https://www.tandfonline.com/doi/full/10.1080/01441647.2023.2198458)）。
- **分区依赖（MAUP）**：结果对 TAZ 划分方式敏感，区内出行被忽略、跨区出行被截断——分区质量直接决定预测合理性（详见 [[taz-traffic-analysis-zone|TAZ 页]] 第 1 节）。
- **静态集计假设**：单一时段、均值化参数，难以反映动态拥堵与个体异质性。

## 4. 替代与演进路线

- **活动基模型（activity-based model, ABM）**：以个体的一日活动日程为建模对象，自下而上聚合，行为基础来自随机效用理论；但在实际规划实践中的落地一直缓慢（[Transport Reviews 2023](https://www.tandfonline.com/doi/full/10.1080/01441647.2023.2198458)、[选择理论视角综述](https://findingspress.org/article/125431-a-review-of-activity-based-disaggregate-travel-demand-models)）。
- **代理基微观仿真**：与 ABM 结合并下沉到个体车辆/行人层面；四阶段与活动基的生成结果对比可见 [Tampa 案例研究](https://www.tac-atc.ca/en/knowledge-centre/technical-resources-search/conference-papers/comparison-of-trip-generation-results-from-activity-based-and-traditional-four-step-travel-demand-modeling-a-case-study-of-tampa-florida/)。
- **大数据校准**：手机信令、网约车 OD 等数据正在替代/校准传统居民出行调查，直接进入生成与分布两步。

## 5. 与交通影响评估的关系

四阶段模型是 [[traffic-impact-assessment|交通影响评估（TIA）]] 的方法内核：TIA 在项目尺度上运行同一套「生成 → 分布 →（方式划分）→ 分配」序列，区别在于范围（单项目 vs 全域）、粒度（地块出行率 vs 分区模型）与产出（路口饱和度与改善措施 vs 政策性路网规划）。
