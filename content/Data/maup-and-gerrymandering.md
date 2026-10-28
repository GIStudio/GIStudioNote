---
title: MAUP 与杰利蝾螈：分区效应的统计面孔与政治面孔
description: 解释可变空间单元问题与杰利蝾螈式选区划分的联系：边界改变会影响区域统计和席位分配。
tags:
  - GIS
  - MAUP
  - 空间单元
  - 选区划分
  - 城市分析
---
# MAUP 与杰利蝾螈：分区效应的统计面孔与政治面孔

MAUP（modifiable areal unit problem，可变空间单元问题）描述空间统计结果对聚合单元划分的敏感性。Gerrymandering（杰利蝾螈式选区划分）则是为了政治利益调整选区边界。在选票分布保持不变时，不同边界可能带来不同的区域票数和席位分配，两者由此产生联系。

## 1. 统计问题与划区策略

二者分属空间统计与选举政治，可以从作用方式和结果上区分：

| | MAUP | 杰利蝾螈 |
|---|---|---|
| 所属领域 | 空间统计 / GIS | 选举政治与法律 |
| 本体 | 统计现象：结论对聚合单元敏感 | 政治策略：为结果改画边界 |
| 意图 | 无意——分析者并不想作弊 | 蓄意——边界为席位服务 |
| 可操作维度 | 尺度效应 + 分区效应 | 几乎只剩分区效应（选区数量与人口受法律约束） |
| 典型后果 | 相关系数、回归系数随单元漂移 | 同样的总票数，完全不同的席位数 |
| 对策 | 敏感性分析、多尺度稳健性检验 | 紧凑度与效率差距指标、法院与独立委员会 |

杰利蝾螈利用了结果对分区方式的敏感性；判断具体划区是否属于操纵，还需要考察其目的、选举规则及相关法律标准。

## 2. MAUP：换一把统计的尺子，结论跟着变

MAUP 说的事情很朴素：空间数据常以点（人、票、建筑、事件）存在，统计却往往按面（区）做；把点聚进面的那一步，**单元的数量与大小（尺度效应，scale effect）、边界的画法（分区效应，zoning effect）都会进入结果**（[Openshaw《The Modifiable Areal Unit Problem》，CATMOG 38，原文 PDF](https://www.uio.no/studier/emner/sv/iss/SGO9010/openshaw1983.pdf)）。更早的迹象可追到 Gehlke 与 Biehl（1934）对相关系数随聚合粒度变化的观察（[Wikipedia 综述](https://en.wikipedia.org/wiki/Modifiable_areal_unit_problem)）。

经典实验把这件事推到极端。Openshaw 与 Taylor（1979）用爱荷华州 99 个县的数据，反复计算「65 岁以上人口占比」与「共和党得票率」的相关系数：把县聚合成 6 个、12 个……数量不等的区，每次换一种聚法，生成约一百万个相关系数——取值几乎铺满从 −0.99 到 +0.99 的整个区间（见 [Openshaw 报告内的实验图](https://www.uio.no/studier/emner/sv/iss/SGO9010/openshaw1983.pdf)；[Andresen 2021 转述](https://www.crimrxiv.com/pub/g4bdjwld)）。

这个实验展示了聚合单元可修改时，统计结果对划分方式的敏感性。日常分析中，同一批人口分别按 H3、街区、行政区聚合，相关系数可能不同；200 m 与 1 km 网格聚合出的统计量也可能不同（详见 [[spatial_units_report|四种空间单元划分策略对比]]）。

## 3. 杰利蝾螈：同一机制，加上意图

杰利蝾螈比 MAUP 老。1812 年，马萨诸塞州州长 Elbridge Gerry 签署本党（民主共和党）主导的州参议院选区方案，其中 Essex County 一条选区形状酷似蝾螈，波士顿报纸随即造出「Gerry-mander」一词并配上政治漫画——而那张最初的地图干的事，正是把联邦党选民集中塞进少数选区（[Wikipedia: Gerrymandering](https://en.wikipedia.org/wiki/Gerrymandering)）。两百多年后，手法仍然只有两个，且经常组合使用：

- **Packing（集中）**：把对方票塞进少数区，让对方以大比分赢下少数席位，票力全部「浪费」在一边倒的区里。
- **Cracking（拆散）**：把对方票摊薄到多个区，让每个区都差一点，输得不多但场场都输。

一个可以自己验算的最小例子：50 位选民，5 个选区，每区 10 人；紫方 30 票（60%），橙方 20 票（40%）。

| 画法 | 各区构成 | 席位 | 结果 |
|---|---|---|---|
| 边界 A：橙方自然聚居在两处 | 3 个区 10 紫 0 橙 + 2 个区 0 紫 10 橙 | 紫 3 : 橙 2 | 席位比恰好等于票数比 |
| 边界 B：把橙方均匀拆散 | 每区 6 紫 4 橙 | 紫 5 : 橙 0 | 60% 的票换 100% 的席位 |

同一批选民、同样的选区数量、同样的人口约束，唯一变化的是边界——这正是 MAUP 的分区效应。区别只在于：画边界 B 的人**想要**这个结果。「浪费票」的视角可以把操纵程度量化：边界 B 里橙方 20 票全部浪费（每区 4 票都投给了输家），紫方每区只比对手多 2 票、几乎不浪费；Stephanopoulos 与 McGhee 的效率差距（efficiency gap）就是把两党浪费票之差标准化的度量（[Wikipedia: Efficiency gap](https://en.wikipedia.org/wiki/Efficiency_gap)，原论文 *Partisan Gerrymandering and the Efficiency Gap* 载 University of Chicago Law Review 第 82 卷，2015）。

## 4. 接口在哪里：分区效应的「武器化」

把两边的链条并排写出来，接口一目了然：

> 同一组选民/人口点 → **不同边界划分** → 不同的区域统计 →（赢家通吃规则）→ 不同的席位结果

学术文献里这条连接是显式的。GIS&T Body of Knowledge 把「空间实体聚合与立法选区划分」列为同一主题下的概念条目（[gistbok 条目](https://gistbok-ltb.ucgis.org/page/current/concept/GS-02-020)）；Duchin（2024）在离散几何与选举地理的综述中，把管理 MAUP 的混淆效应列为选区研究的核心问题之一（[Mathematical Social Sciences](https://www.sciencedirect.com/science/article/pii/S0962629823002184)）；Fowler（2024）干脆用 MAUP 框架来教重划选区（[Journal of Geography](https://www.tandfonline.com/doi/full/10.1080/19338341.2024.2373698)）。

爱荷华实验研究的是不同聚合方案下相关系数的变化；杰利蝾螈关注选区边界对席位的影响。二者的共同点是聚合边界会影响结果，具体统计量与政治过程各有不同。

## 5. 为什么不能画等号

第一，**归因不同**。MAUP 语境里没有坏人：分区敏感性是聚合这一步固有的，分析者的义务是报告它，而不是消除它。杰利蝾螈语境里有明确的行动者与目的，评价语言是「公平/操纵」，不是「偏差/稳健」。

第二，**操作维度不同**。MAUP 同时包含尺度与分区两个效应；而选区制下，联邦要求各选区人口近似相等（[Ballotpedia 综述](https://ballotpedia.org/Redistricting_ahead_of_the_2026_elections)），选区数量由席位配额决定——**杰利蝾螈的操作空间几乎只剩「怎么切」，即分区维度**。这也是它只算 MAUP 的「极端案例」而非全谱案例的原因。

第三，**对策不同**。对 MAUP，空间统计的方法论是敏感性分析：换几族单元、换几个尺度，报告结论的稳定区间。对杰利蝾螈，对策是制度与法律：紧凑度要求、效率差距等量化指标、独立划区委员会，以及法院。

顺带划清一个邻近概念：**生态谬误**（ecological fallacy）是「用区域统计推断个体」，MAUP 是「区域统计本身随分区而变」，杰利蝾螈是「有意选择分区以操纵区域统计」——三者在选区话题上经常同时出现，但不是一回事（[Wikipedia: Ecological fallacy](https://en.wikipedia.org/wiki/Ecological_fallacy)）。

## 6. 对空间分析者的清单

- 任何按区聚合的结论，先问一句：**换一套单元（H3 / 行政区 / 网格 / 自建区），结论还在吗？** 至少两族单元、两个尺度。这是 MAUP 的标准防御，受控对比设计见 [[spatial_units_report|四种空间单元划分策略对比]]。
- 做选区、TAZ、学区、服务区这类「人为可改边界」的研究时，把**中立基线显式建成分布**（大量满足约束的随机划分构成 ensemble），再判断实际划分是否离群——这是 [[taz-traffic-analysis-zone|TAZ 页]] 里「分区质量决定结论」的统计学版本。
- 报告方法时，把**分区方案本身**当作方法的一部分写出来：谁划的、按什么规则、对什么敏感。
- 记住权力维度：**谁有权改边界，谁就持有 MAUP 的杠杆**。这句话对选区成立，对 TAZ、统计区、服务半径同样成立（参见 [[four-step-model|四阶段模型]] 的分区依赖问题）。

## 7. 当前进展（核验于 2026-10-14）

- **检测方法**：效率差距 2015 年提出后进入联邦诉讼（Whitford v. Gill）；如今更主流的是 ensemble/MCMC 方法——生成数以千计满足法律约束的合法地图作为「中立基线」，检验实际地图是否为统计离群值，其数学基础见 Duchin（2024）综述。
- **法律与制度**：Rucho v. Common Cause（2019）之后，联邦法院不再审查党派杰利蝾螈，战场转移到州宪法与州法院（[Wikipedia: Rucho v. Common Cause](https://en.wikipedia.org/wiki/Rucho_v._Common_Cause)）。2026 年 4 月的 Louisiana v. Callais 判决改变了「种族在划区中的使用」的审查标准，随后引发多州连锁重划（[Ballotpedia: Redistricting ahead of the 2026 elections](https://ballotpedia.org/Redistricting_ahead_of_the_2026_elections)）。
- **十年中重划浪潮**：据 Ballotpedia（2026-09 更新）汇总，1970 年以来美国只在两个州发生过自愿的十年中重划，而 2024 与 2026 选举周期之间，已有十个州（AL、CA、FL、LA、MO、NC、OH、TN、TX、UT）换用了新国会地图，其中德州的新地图经最高法院允许用于 2026 年选举；表列潜在净效应为共和党 +10 席。对本文主题而言，这是「分区效应可被策略性利用」的活体展示——MAUP 的杠杆从未被这么密集地同时扳动过。

## 8. 参考资料与尚未验证内容

- **一手来源**：[Openshaw, *The Modifiable Areal Unit Problem*（CATMOG 38）原文 PDF](https://www.uio.no/studier/emner/sv/iss/SGO9010/openshaw1983.pdf)；[GIS&T Body of Knowledge：聚合与立法选区划分](https://gistbok-ltb.ucgis.org/page/current/concept/GS-02-020)；[Duchin 2024, *Discrete Geometry for Electoral Geography*](https://www.sciencedirect.com/science/article/pii/S0962629823002184)。
- **转述与综述**：[Wikipedia: Modifiable areal unit problem](https://en.wikipedia.org/wiki/Modifiable_areal_unit_problem)、[Wikipedia: Gerrymandering](https://en.wikipedia.org/wiki/Gerrymandering)、[Wikipedia: Efficiency gap](https://en.wikipedia.org/wiki/Efficiency_gap)、[Andresen 2021（犯罪分析视角的 MAUP 综述）](https://www.crimrxiv.com/pub/g4bdjwld)、[Ballotpedia 2026 重划跟踪页](https://ballotpedia.org/Redistricting_ahead_of_the_2026_elections)。
- **本页自构内容**：第 3 节的 50 人算例是为演示构造的。爱荷华实验「−0.99 到 +0.99」的极值以二手转述为准，未逐图核对 1979 年原文。
- 动态事实（2026 年选区诉讼与重划进展）核验于 2026-10-14（Ballotpedia 页面自身更新至 2026-09），此后会过时。
