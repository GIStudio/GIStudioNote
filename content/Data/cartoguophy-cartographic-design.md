---
title: CartoGuophy 制图作品导览：地形、多变量与 LEGO 地图
description: 从 CartoGuophy 的代表作品学习地图层级、多变量符号、空间聚合、气候图表与实体地形表达。
tags:
  - GIS
  - 制图学
  - 地理可视化
  - 地形
  - 地图设计
source: https://cartoguophy.com/
verified_at: 2026-10-28
---

[CartoGuophy](https://cartoguophy.com/) 是 Atlas（Chenxiao）Guo 的制图作品网站，收录地形与旅游地图、灾害与气候专题图、交互地图，以及 LEGO 实体和数字地图。作者在威斯康星大学麦迪逊分校攻读制图学／GIS 博士，研究与创作涉及自然灾害、地理空间分析和地图表达。[大学介绍](https://geography.wisc.edu/gis/map-chat-with-atlas-guo-december-4/)

这个作品集适合用来学习一张地图如何组织信息。下面选取五组作品，分别观察底图与主题的层级、多变量符号、地图中的统计图表、实体媒介和轨迹聚合。作品机制依据作者说明；学习建议是本文据此归纳的阅读方法。

## 按想学的问题选择作品

| 想理解的问题 | 推荐原作 | 阅读重点 |
| --- | --- | --- |
| 地形、交通与景点怎样放在一起？ | [淄博市文旅地图](https://cartoguophy.com/maps/zibo.html) | 底图、主题符号、文字与附图的分工 |
| 多种灾害指标怎样同时显示？ | [United States of Rising Hazards](https://cartoguophy.com/maps/us_rising_hazard.html) | 复合符号、空间聚合与交互查询 |
| 地图怎样表现季节变化？ | [Köppen Climates Visualized](https://cartoguophy.com/maps/koppen.html) | 月度图表、统一图例与空间位置 |
| 高程怎样转成积木？ | [LEGO Map of Wisconsin](https://cartoguophy.com/lego/lego_wisconsin.html) | 格网尺度、高程分级与实体图例 |
| 大量轨迹怎样成为可读的流向图？ | [Revealing Hurricane Harvey 2017](https://cartoguophy.com/maps/revealing_hurricane_harvey.html) | 阶段划分、连接强度与显示筛选 |

完整浏览入口是[作品集](https://cartoguophy.com/portfolio.html)和 [LEGO 专页](https://cartoguophy.com/lego.html)。后者区分实体搭建、三维渲染和二维图形，阅读时可先确认作品的媒介。

## 地形底图与主题信息各负其责

《淄博市文旅地图》用分层设色和山体阴影表现地形，再突出旅游目的地、交通枢纽与线路；山东省位置图和中心城区附图提供另外两个观察尺度。作者还将公交旅游线路作了类似地铁线路图的表达。[原作与设计说明](https://cartoguophy.com/maps/zibo.html)

这里涉及地图的**视觉层级**：让读者能辨认主要信息、辅助信息和背景。看这幅地图时，可以依次寻找景点、交通和地形，观察符号、文字与底色怎样支持这几个任务。

山体阴影模拟地表在指定光照方向下的明暗，取决于坡度、坡向和光源位置；分层设色则用颜色对应高程区间。两者结合，分别帮助识别地貌形态和高程层次。具体高度仍需依据图例、等高线或高程数据读取。[ArcGIS Pro 山体阴影说明](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/hillshade-function.html)

附图也有明确用途：位置图帮助读者找到区域，城区图把更密集的街道和目的地放到适合阅读的尺度。制作同类地图时，可先列出读者要找的地点与路线，再决定主图和附图分别承担什么。

## 多变量地图兼顾整体分布与单项查询

《United States of Rising Hazards》使用 FEMA 国家风险指数（NRI），将 18 类自然灾害的县级分数转到六边形单元。每个单元放置同一结构的多变量符号，以颜色区分灾种、透明度表达相应风险高低，并提供图层切换、搜索和弹窗查询。[作者说明](https://cartoguophy.com/maps/us_rising_hazard.html)

这种反复放在各个位置的复合符号，也称为 **glyph**。读者先观察不同地区的符号组合，再查询具体灾种与数值。图例需要解释符号中每个部分的位置和颜色，交互则提供详细信息的读取入口。该作品获得 NACIS 2025 学生动态地图竞赛个人组奖项；主办方页面同时刊载了设计与计算说明。[NACIS 官方记录](https://nacis.org/awards/2025-sdmc-individual-winner/)

这幅图还适合学习**空间支持单元**，即一个数值所对应的空间范围。其六边形面积为 1,000 平方英里，在 Albers 等积投影下生成；数值由县级分数按县与六边形相交面积加权平均得到。因此，六边形表达的是原县级指标经过转换后的分布，单元内部的细小差异仍需更细数据才能分析。[空间聚合方法](https://cartoguophy.com/maps/us_rising_hazard.html)

将它用于研究时，应同时保留原指标定义、源数据单元和转换方法。有关分区改变如何影响统计结果，可接着阅读 [[maup-and-gerrymandering|MAUP]] 和 [[spatial_units_report|空间单元选择]]。

## 把月度变化嵌入地理空间

《Köppen Climates Visualized》将月度气温、降水图表放在地图位置上，用环形月份顺序表现年内变化，并配合放大的图例及各气候类型的汇总图。[原作与设计说明](https://cartoguophy.com/maps/koppen.html)

这里的核心是**地图与统计图表的结合**：位置回答“在哪里”，图表回答“这一地点的季节变化怎样”。读图时先在图例中确认月份方向、温度刻度和降水编码，再比较不同地点。顶部示例图中，南半球地点的月份顺序移位六个月，同一角度对应的月份应按图中标注读取。

同类图表只有在刻度和编码一致时才便于比较。季节性图形描述的是年内周期；讨论长期气候变化，还需要不同时段、口径一致的数据。使用作品中的结论前，也应检查其底层数据的时期与空间分辨率。

## LEGO 地图把采样与分级变成实体结构

《LEGO Map of Wisconsin》在 32×32 底板上表示威斯康星州，每个 1×1 单元对应地面 10×10 平方英里的范围。作品将高程分为五档，用高度与颜色配合表达，并用透明蓝色积木表示主要湖泊，另加城市标记和图例。[作品说明](https://cartoguophy.com/lego/lego_wisconsin.html)

这让两个抽象操作变得直观：**空间离散化**决定一格对应多大范围，**高程分级**决定连续的高程值如何归入有限档位。格子大小和档数共同影响山脊、谷地、岸线能保留多少细节；读者能从实体结构看到概括后的地形。

在 Esri 的访谈中，作者介绍了选择投影与比例、建立规则格网、提取高程或水深、设计符号，再制作实体模型或数字模型的流程。这为练习提供了可跟随的顺序。[Esri ArcUser 访谈](https://www.esri.com/about/newsroom/arcuser/designing-lego-maps-brick-by-brick)

WLIA 官方记录确认，这件作品获得 2024 年最佳学生地图、最独特地图第一名，以及两项评选奖。获奖说明其设计受到专业组织认可；教育使用的具体效果仍需结合学习对象和实际教学评价。[WLIA 2024 获奖记录](https://www.wlia.org/news/2024-wlia-map-contest-awards---the-champions-of-cartography)

## 轨迹聚合会改变读者看到的流动

《Revealing Hurricane Harvey 2017》以 Twitter 数据推导的轨迹为基础，展示飓风期间的空间联系。四幅分阶段地图在核心统计区（Core-Based Statistical Area，CBSA）层级聚合轨迹；线宽和透明度共同编码连接量，图中只显示较强连接。出行方式分类还使用了机器学习与人工标注资料。[原作与方法概述](https://cartoguophy.com/maps/revealing_hurricane_harvey.html)

读者需要把数据来源与显示规则一起读进结论：图上的流动对应这批社交媒体记录所支持的联系，且经过区域聚合和强度筛选。弱连接被隐藏后，画面更简洁，其数量与去向也不再直接可见。要讨论总体撤离规模或完整交通流量，需要额外的数据覆盖与代表性证据。

因此，复用这种表达时，应交代轨迹怎样生成、时间怎样分段、地点怎样归区，以及哪些连接被显示。轨迹本身的虚假往返与清洗问题可参见 [[trajectory-ping-pong-effect|轨迹数据的乒乓效应]]。

## 把作品阅读转成自己的制图练习

可以选择一个熟悉地区的公开高程数据，分别制作连续设色图和五档格网图。记录格宽、单元取值方式、分级阈值及颜色，再尝试从两幅图辨认同一处山脊、河谷或湖泊。这个练习用于观察表达选择怎样改变可读内容，不预设哪一种形式在所有任务中更好。

阅读其他作品时，也可保留四个问题：地图服务谁、每个数值代表什么、符号怎样编码、哪些细节经过概括或筛选。沿这些问题看作品，更容易把一种视觉风格转化为可说明、可复用的制图方法。

## 来源与作品使用

本文依据作者作品说明、大学介绍、NACIS 与 WLIA 官方记录及 Esri 文档，核验于 2026 年 10 月 28 日；未重新计算原作数据、复现制图流程或实测交互应用。作品中的数量与方法保留各自案例的适用范围。

CartoGuophy 标注保留所有权利。本文链接原作供阅读，不转载地图文件；将原图用于文章、展览、课程材料或其他发布场景时，应另行确认许可并保留作者署名。
