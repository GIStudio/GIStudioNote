---
title: TAZ 交通分析区与各地分区实践
description: 介绍交通分析区在出行需求模型中的作用，以及不同地区的分区与统计地理关系。
tags:
  - GIS
  - 空间单元
  - 交通规划
  - 城市分析
verified_at: 2026-10-28
---

# TAZ 交通分析区与各地分区实践

交通分析区（Traffic Analysis Zone，TAZ）是交通需求分析中组织人口、就业和出行数据的地理单元。模型用起点区和终点区描述出行，形成区域之间的 OD 矩阵；不同城市会根据道路网络、调查和预测用途设计分区。

TAZ 与行政区、人口统计区、地块可以相互关联，但它们的边界、目的和年份不必一致。

## TAZ 如何进入交通模型

在常见的四阶段模型中，研究者先估计各区的出行产生与吸引，再估计区与区之间的出行分布，接着分析方式选择及交通分配。模型细节和步骤的实施顺序因项目而异，参见 [[four-step-model|四阶段模型]]。

模型往往用区域中心点或其他连接方式表示区域与道路网络的关系。这需要对区内出行、区内距离和接入位置作近似；并非所有模型都把区内出行忽略。区划越细，空间差异可能表达得更充分，OD 表也更稀疏，调查、标定和计算需求可能增加。

选区时需要结合用地与人口分布、道路阻隔、数据可获得性、跨期一致性与预测任务。分区设计本身会影响统计结果，参见 [[maup-and-gerrymandering|MAUP 与杰利蝾螈]]。

## 不同地区的实践

### 美国：TAZ 和 TAD

美国普查局将 TAZ 描述为州和地方交通机构划定的专用统计地理单元，主要服务通勤与工作地点等交通数据；交通分析地区（TAD）在适用时可由 TAZ 聚合。[美国普查局地理说明](https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_geography_details.html)

普查局提供的 TIGERweb 图层中，TAZ 图层有 2000 和 2010 年版本。下载时应明确所用版本，而不是从网页服务名称推断所有图层均为 2020 年边界。[图层目录](https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/PUMA_TAD_TAZ_UGA_ZCTA/MapServer)

### 英国：统计区和模型分区

英格兰与威尔士的 2021 普查提供 OA、LSOA 和 MSOA 等统计地理层级。[ONS 2021 地理说明](https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeographies/census2021geographies)

交通模型也会划定符合自身用途的分区。伦敦交通局指南建议结合行政边界、需求模型和当地出行活动考虑分区；赫特福德郡 COMET 模型则以 MSOA 为基础。这两个例子说明统计边界可以作为模型分区的基础，具体做法由模型决定。[伦敦交通局指南](https://content.tfl.gov.uk/traffic-modelling-guidelines.pdf)；[赫特福德郡模型](https://www.hertfordshire.gov.uk/services/highways-roads-and-pavements/business-and-developer-information/transport-modelling/transport-modelling-in-hertfordshire.aspx)

### 德国：Verkehrszellen

德国使用交通小区（Verkehrszellen）等术语。柏林交通部门发布交通小区及更细分单元的名称、代码与边界说明，版本变化时应核对代码和边界的对应关系。[柏林交通数据](https://www.berlin.de/sen/uvk/mobilitaet-und-verkehr/verkehrsdaten/teilverkehrszellen-und-verkehrszellen/)

### 日本：都市圈 PT 调查分区

日本都市圈的人次出行（Person Trip，PT）调查记录出行目的、时间、方式和起终点。京阪神都市圈调查将地点编码到一定范围的分区，以便汇总与分析。日本国土交通省也说明，全国城市交通特性调查与都市圈 PT 调查的用途和能否估计区间 OD 总量不同，使用数据前应区分调查类型。[京阪神 PT 指南](https://www.kkr.mlit.go.jp/plan/pt/topics/pt_guide-01.html)；[全国调查说明](https://www.mlit.go.jp/toshi/tosiko/toshi_tosiko_tk_000033.html)

### 中国内地：交通小区

交通小区是城市交通规划中组织出行分析的常见单元。具体边界与规模由城市和项目的规划范围、调查与模型要求决定，不宜套用统一人口阈值。交通运输部的城市公共交通规划指南列出基于现状调查进行客流预测和采用四阶段方法的做法。[城市公共交通规划编制指南](https://xxgk.mot.gov.cn/jigou/ysfws/202006/t20200623_3315097.html)

### 香港：规划统计区与交通模型

香港规划署的边界数据采用一级、二级及小规划统计区（PPU、SPU、TPU）编码。2021 年普查的 TPU 下分单元区；2001–2016 年版本使用街段区或村落统计区。TPU 用于规划和统计数据组织，并不自动等同于某个交通模型的 TAZ；分析交通时应核对具体模型、调查或项目所采用的区划和版本。[规划署数据规范](https://www.pland.gov.hk/open_data/tpu_sb_vc/Boundary_of_TPU_and_Subunit_Data_Specification_v1.0.pdf)；[边界数据目录](https://data.gov.hk/tc-data/dataset/hk-pland-pland1-boundaries-of-tpu-sb-vc)

## 与邮编、地块和统计区如何关联

邮政编码面向投递，统计区用于发布统计数据，交通区用于特定交通分析。即使名称相似，也要先确认区域定义和版本，再选择地址匹配、点落区或面叠加等方法。跨界对象的分配方法需要明示；面积加权会引入区内均匀分布等假设，不能保证还原个人出行。

其他空间单元的尺度、挂接与 MAUP 问题，参见 [[spatial_units_report|城市空间分析中的四类空间单元]]；项目尺度的分析见 [[traffic-impact-assessment|交通影响评估]]。
