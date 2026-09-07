---
title: TAZ 交通分析区与各国同类分区体系
description: 交通分析区（TAZ）的定义、四阶段模型中的角色、划定原则，以及美国、英国、德国、日本、中国内地与香港的类似实现对比。
tags:
  - GIS
  - 空间单元
  - 交通规划
  - 城市分析
---
# TAZ 交通分析区与各国同类分区体系

**一句话定位**：TAZ（traffic/transportation analysis zone）是传统交通需求模型中最基本的地理单元——研究区被划分为互不重叠的分区，出行的发生与吸引、OD 矩阵都以分区为单位汇总；各国的「同类实现」差别不在概念，而在**由谁划定（交通部门 vs 统计部门）与层级结构**。

---

## 1. TAZ 是什么

- **定义与角色**：TAZ 是常规交通规划模型中最常用的地理单元（[Wikipedia: Traffic analysis zone](https://en.wikipedia.org/wiki/Traffic_analysis_zone)），研究区被划分为互不重叠的分区，每个分区挂接社会经济数据（家庭收入、机动车保有、就业等），四阶段模型的**出行生成**与**出行分布**两步都以「分区→分区」的 OD 对为计算单位。
- **规模指导**：都市级模型中单区人口常在 3,000 人以下；空间上中心商务区可细到街区甚至建筑，郊区/外缘则很大（Wikipedia 综述）。分区越多计算负担越大，实践中常合并小区以降规模。
- **构词来源**：TAZ 通常由人口普查的 block/block group/tract 聚合而成（[EASI Demographics](https://www.easidemographics.com/trshelp/html/traffic_analysis_zone.htm)）——即先有统计单元，再套交通边界。
- **已知问题**：区内出行（intrazonal trips）的内部距离被忽略、跨区出行被截断（trip crossing），分区方式本身就是 MAUP 的来源；划定质量直接影响需求预测合理性（[Transport Policy 2022](https://ideas.repec.org/a/eee/trapol/v127y2022icp1-14.html)）。改进方向包括多源数据自动划区（[MDPI Applied Sciences 2024](https://www.mdpi.com/2076-3417/14/13/5964)、[Journal of Transport Geography 2025](https://www.sciencedirect.com/science/article/pii/S0966692325002157)）、以及以个体/活动为基础的模型绕开集计分区。

## 2. 各国（地区）的类似实现

### 美国：TAZ / TAD（普查官方地理实体）
- 普查局将 TAZ 列为**官方普查地理实体**，由州 DOT / MPO 划定并提交，经 TIGER/Line 发布边界（[2010 TAZ 边界文件](https://www2.census.gov/geo/tiger/TIGER2010/TAZ/2010/)）；TAD（traffic analysis district）是 TAZ 的上一级聚合，提供更粗的分析地理（[data.gov TAD 说明](http://catalog.data.gov/dataset/tiger-line-shapefile-2011-2010-nation-u-s-2010-census-traffic-analysis-district-tad-nation)）。
- 数据通道是 **CTPP**（Census Transportation Planning Products，FHWA 与 AASHTO 联合支持），按 TAZ 汇总通勤 OD 等数据（[TRB Census Committee: TAZ delineation for CTPP](http://www.trbcensus.com/newsltr/sr0111.pdf)）。
- 区域实践示例：[普吉特湾区域委员会](https://www.psrc.org/faq/what-traffic-analysis-zone-taz)以 TAZ 作为区域出行需求模型的运行与结果汇报单元。

### 英国：OA → LSOA → MSOA（统计区承担交通分析职能）
- 英国没有专门的「交通分析区」，交通分析与通勤 OD 普遍借用普查统计区层级：OA → LSOA（约 1,500 人/650 户）→ MSOA（约 5,000–15,000 人，由 4–5 个 LSOA 组成）（[ONS Census 2021 geographies](https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeographies/census2021geographies)、[OCSI 入门指南](https://ocsi.uk/2019/03/18/lsoas-leps-and-lookups-a-beginner-guide-to-statistical-geographies/)）。
- 苏格兰对应物是 **Data Zone / intermediate zone**，北爱尔兰用 SOA（[UK Data Service 指南 PDF](https://ukdataservice.ac.uk/app/uploads/censusgeography2022-10-18.pdf)）。普查「通勤出行」数据直接以 MSOA/LSOA 发布（[Census 2021 travel to work 示例](https://www.arcgis.com/home/item.html?id=4cfdf60f110b4d0e9b86d87331b6cb01)）。

### 德国：Verkehrszellen（交通小区）
- 需求模型以 **Verkehrszellen**（交通小区）为 OD 计算单元；柏林官方划分为 323 个交通小区，并有更细的 **Teilverkehrszellen**（部分交通小区），由市统计部门发布、广泛用于出行报告（[地址级区内距离计算](https://www.researchgate.net/publication/354312525_Address-based_computation_of_intra-cell_distances_for_travel_demand_models)）。
- 州级宏观模型同样以交通小区为骨架，如巴伐利亚州模型约 6,500 个小区（[ResearchGate](https://www.researchgate.net/publication/337620173_Transport_demand_model_for_the_Free_State_of_Bavaria_-_basis_for_local_transport_planning)）；经典需求模型如德累斯顿 EVA（[TRID](https://trid.trb.org/View/943081)）、四阶段模型综述见 [Friedrich (ISV Stuttgart)](https://www.isv.uni-stuttgart.de/vuv/publikationen/downloads/2011_Friedrich_Nachfragemodelle_Heureka2011_mit_Deckblatt.pdf)。

### 日本：PT 调查的多级ゾーニング（分区）体系
- 日本都市圈「パーソントリップ调查」（person trip survey）自 1960 年代起持续开展，出行起讫点通过**ゾーニング**编码到多级分区体系：典型为 小ゾーン → 計画基本ゾーン（规划基本区），并保持与既往调查的分区连续性（[东京都市圈 PT 数据说明](https://www.tokyo-pt.jp/data/01_01)、[总务省资料 PDF](https://www.soumu.go.jp/main_content/000588038.pdf)、[京阪神 PT 指南](https://www.kkr.mlit.go.jp/plan/pt/topics/pt_guide-01.html)）。
- 近年调查设大/中/小三级分区，最细到街区（条町目）级，且与市町村边界对齐以便地方政府分析预测（[道央都市圈 PT 分区设定 PDF](https://www.douou-pt.jp/pdf/1/)）；东京圈已开展五次 PT 调查（1968–2008，[EASTS 论文 PDF](https://easts.info/on-line/proceedings/vol10/pdf/1421.pdf)）。

### 中国内地：交通小区
- 城市交通规划中的对应概念是**交通小区**，划分常遵循：以行政区划/自然屏障为界、区内用地性质相对一致、规模适中（控制区内出行比例）、与路网和交通设施分布协调（[基于手机 OD 的区域交通需求预测](https://html.rhhz.net/GLJTKJ/1557992972651-592016055.htm)）。
- 国家标准《国土空间交通规划编制指南》规定交通小区划分不大于区县级单元，并以小区出行产生/吸引量、分方式 OD 为基本分析量（[标准文本](https://kass.sacinfo.org.cn/kfs/token/download/xzdjaieldnkzgxpe)）；居民出行调查与 OD 调查是数据来源（[交通运输部编制指南](https://xxgk.mot.gov.cn/jigou/ysfws/202006/t20200623_3315097.html)）。
- 针对国内划分多靠定性经验的问题，有基于区内出行比例的小区半径定量计算方法（[长安大学学报 PDF](https://transport.chd.edu.cn/cn/article/pdf/preview/200701015.pdf)）；手机信令等大数据正在改造传统调查（[城市综合交通调查的规范与创新 PDF](https://www.chinautc.com/upload/accessorychinautc/2016419125474562441.pdf)）。

### 香港：TPU 体系
- 香港的对应物是规划统计区层级：**总规划统计区（TPA）→ 次规划统计区（SPU）→ 小规划统计区（TPU）→ 单元区（VC）**；2021 年普查全港分 9 个 TPA、52 个 SPU、292 个 TPU（[CSDI 数据集](https://portal.csdi.gov.hk/csdi-webpage/dataset/pland_rcd_1637289585582_55577)）。
- TPU 由规划署划界、统计处用于普查发布（[TPU 基本统计表 PDF](https://www.censtatd.gov.hk/en/data/stat_report/product/B1120024/att/B11200242001XXXXB0400.pdf)），也是交通影响评估（TIA）中常用的基础分析单元；边界可从 [DATA.GOV.HK](https://data.gov.hk/tc-data/dataset/hk-pland-pland1-boundaries-of-tpu-sb-vc) / CSDI 下载。

## 3. 横向对比

| 国家/地区 | 单元名称 | 划定主体 | 与普查关系 | 层级 |
|---|---|---|---|---|
| 美国 | TAZ / TAD | MPO、州 DOT | 普查官方实体，CTPP 按区发布通勤 OD | TAD ⊃ TAZ ⊃ block |
| 英国 | LSOA / MSOA（苏格兰 Data Zone） | 统计机构（ONS 等） | 本身就是普查统计区 | OA → LSOA → MSOA |
| 德国 | Verkehrszelle | 交通规划机构/市统计部门 | 多数独立于普查小区 | 州模型约 6,500 区；柏林 323 区+细分 |
| 日本 | 交通ゾーン（小ゾーン/計画基本ゾーン） | 都市圈交通计划协议会 | PT 调查自有体系，强调跨期连续 | 多级（大/中/小/细目） |
| 中国内地 | 交通小区 | 规划编制单位 | 独立划定，不大于区县 | 交通大区 → 小区 |
| 香港 | TPU | 规划署 | 普查统计发布单元 | TPA → SPU → TPU → VC |

共同点是所有体系都在回答同一组权衡：**分区粒度（计算成本 vs 空间精度）、边界语义（行政/统计对齐 vs 用地/出行同质）、跨期可比性**。美国与日本由交通部门主导、另建交通专用边界；英国与香港直接复用统计区，省去数据对接但牺牲用地同质性；德国介于两者之间。

与网格/H3/地块等四种划分策略的关系见 [[spatial_units_report|四种空间单元划分策略对比]]——TAZ 属于其中的「语义边界对齐较高、数据挂接较难」一端，且是唯一以「出行 OD 建模」为原生目的的分区体系。
