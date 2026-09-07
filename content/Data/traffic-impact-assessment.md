---
title: 交通影响评估（TIA）
description: 交通影响评估的定义、标准流程（范围界定→数据→生成→分布→分配→路口分析）、香港实践（TPDM/TIA Checklist）与判定标准。
tags:
  - 交通规划
  - 交通影响评估
  - 香港
---
# 交通影响评估（TIA）

**一句话定位**：交通影响评估（Traffic Impact Assessment, TIA）在开发项目或道路工程尺度上预估其对周边交通的影响并给出改善措施——方法内核是 [[four-step-model|四阶段模型]] 的项目级应用，香港以运输署 TPDM 与 TIA Checklist 为规范框架。

---

## 1. TIA 是什么、何时需要

- **定义**：针对具体开发项目（住宅、商场、枢纽）或道路工程，量化其新增出行对周边路网、公共交通与行人设施的影响，判断是否超出可接受水平，并提出缓解措施的专项研究。
- **触发条件**：开发规模超过阈值（用地面积/单位数/新增出行量）、位于交通敏感路段，或规划申请/改动需要证明交通可行性。香港实务中，规划申请（s.16）与基建设施均常附 TIA 报告（[真实 TIA 报告示例：提交城规会的元朗申请](https://www.tpb.gov.hk/en/plan_application/Y_YL-MP_11/FI_20260120/Traffic_Impact_Assessment_1.pdf)）。

## 2. 标准流程

通用流程与四阶段序列一一对应（[Transoft 分步指南](https://www.transoftsolutions.com/civil-and-transportation/resources/blog/traffic-impact-assessment-a-step-by-step-guide/)、[PTV Vistro 方法说明](https://www.ptvgroup.com/en/products/traffic-traffic-engineering-software-ptv-vistro/knowledge-base/self-learning-and-training/traffic-impact-analysis)）：

1. **界定研究范围**：确定受影响路网、关键路段与路口、评估年份（通常含落成年与设计年）。
2. **数据收集**：路口流量、转向运动、排队、事故、公交载客；基准年现状。
3. **出行生成**：按用地类型套用出行率，得到项目高峰新增出行量。
4. **出行分布与方式划分**：按就业/商业分布等估计出行的方向分布，划分到小汽车/公交/步行等方式。
5. **交通分配**：把新增出行分配到路网，与背景交通叠加。
6. **路口与路段分析**：计算饱和度（v/c）、排队长度、信号配时需求，识别超限位置并提出改善措施（车道重划、信号优化、通道安排等）。

其中第 3–5 步就是 [[four-step-model|四阶段模型]] 的浓缩版：TIA 是项目尺度的四阶段应用，分析单元常以开发地块 + 周边路口为对象，而非全域 TAZ 分区（参见 [[taz-traffic-analysis-zone|TAZ 页]] 第 2 节香港部分）。

## 3. 香港实践

- **规范框架**：运输署《Transport Planning and Design Manual》（TPDM）是技术总纲——Volume 1 明确要求在 TIA 中识别关键路段/路口并提出缓解措施（[TPDM Volume 1](https://www.td.gov.hk/filemanager/en/content_5055/V1_08_2026.pdf)）；项目申报的操作规范见 [TIA Checklist for Development Projects](https://www.td.gov.hk/filemanager/en/publication/tia%20checklist%20for%20development%20projects_202410_v3.pdf)。
- **参数来源**：出行率采用运输署 Traffic Generation Survey（如 TD 05/2006，见 [立法会工务小组文件示例](https://www.legco.gov.hk/yr18-19/english/fc/pwsc/papers/pwsc20190111pwsc-110-1-e.pdf)），规划参数遵循《香港规划标准与指引》（HKPSG）。
- **模型与分区**：运输署维护分区交通模型（district-wide transport models）支撑较大范围的 TIA（[NZTA Transport Impact Guidelines Part 2 对香港实践的对比描述](https://www.nzta.govt.nz/resources/research/reports/327/docs/327-part2.pdf)）；基础统计/分析单元常用 [[taz-traffic-analysis-zone|TPU 体系]]，出行率则挂接到开发项目地块（parcel）。

## 4. 判定与局限

- **判定标准**：路口 v/c 饱和度阈值（香港常用 1.0 以下、信号路口按 TPDM 性能指标）、排队是否溢出、行人设施水平；超出则须提出补偿性改善使影响「可接受」。
- **常见局限**：出行率来自旧调查，低估绿色出行趋势；背景增长假设敏感；TIA 由申请方委托，存在动机偏差；单项目评估难以累积看待多个项目叠加的累积影响——这些也是各国把 TIA 与全域四阶段模型（或活动基模型）衔接的原因。
