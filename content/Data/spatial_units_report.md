# 四种空间单元划分策略对比调研

> 组会用 · 2026-07-24 · 供 GeoFM 空间单元设计与 Urban Sandbox / TIA 工作流选型参考

**一句话定位**：四种策略是从「几何规则性」到「语义真实性」的谱系——正方形网格最规则、object-first buffer 最贴对象语义；选型本质是 MAUP、数据挂接成本与语义对齐三者之间的权衡。

---

## 1. 规则正方形网格（Regular Square Grid）

- **定义与几何**：按固定边长（如 250 m / 500 m / 1 km）在投影坐标系下平铺正方形像元；与栅格影像、遥感产品天然同构。
- **粒度与层级**：可四叉树式聚合（4 合一），但无统一全球编码标准，跨研究难以复现；不同投影下像元面积不一致（高纬度畸变）。
- **语义边界对齐**：低。边界任意切割地块、道路与社区，是典型的「强加边界」（imposed boundary）。
- **数据挂接**：最容易。重采样/面积加权即可接入遥感、人口栅格（WorldPop 类）、POI 计数；与 CNN/ViT 等图像式模型输入天然匹配。
- **边界效应与 MAUP**：中心到各邻居距离不一致（边邻居 vs 角邻居），各向异性邻域定义会引入方向性偏差；六边形网格在邻域距离均匀性上更优（见 [OSTI DGGS 对比](https://www.osti.gov/servlets/purl/2572460)、[Bousquin 2021, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8958999/)）。MAUP 的尺度效应显著：200 m 与 1 km 聚合结果可明显不同（[arXiv:1910.05125](https://arxiv.org/pdf/1910.05125)）。
- **典型用法**：遥感地物分类、人口/活动栅格化、图像式 GeoFM 输入；栅格单元常与行政单元在 MAUP 标度律研究中作对照（[上海城市功能区标度律研究](https://www.jjdl.com.cn/EN/abstract/article/1000-8462/73481)）。

## 2. H3 六边形层级网格（Uber H3）

- **定义与几何**：离散全球网格系统（DGGS），以正二十面体投影划分全球六边形像元，16 级分辨率（res 0–15）；res 7 ≈ 5.16 km²、res 9 ≈ 0.11 km²、res 10 ≈ 0.015 km²（[H3 官方分辨率表](https://h3geo.org/docs/core-library/restable/)）。
- **粒度与层级**：强。层级嵌套编码（子像元索引包含父像元），跨尺度聚合/上卷（rollup）为 O(1) 索引操作；全球统一、可复现。
- **语义边界对齐**：低-中。与正方形网格一样是强加边界，但像元形状更接近圆形、各向同性更好。
- **数据挂接**：非常容易。经纬度→cell 索引即完成空间连接，无需昂贵的 polygon join；Uber 最初为动态定价与出行分析构建（[Uber H3 介绍](https://www.uber.com/blog/h3/)【待核实：官方博客页面】），已被电信、物流、流行病学广泛采用。
- **边界效应与 MAUP**：邻居距离一致、边缘效应最小（[OSTI](https://www.osti.gov/servlets/purl/2572460)）；但 MAUP 尺度效应仍在，且不同分辨率间面积比 ≈ 7:1（非 2 的幂），跨分辨率面积加权需小心。
- **典型用法**：网约车/微出行需求聚合（[IROS'23 滑板车路径规划](https://cdcl.umd.edu/papers/iros23b.pdf)）、物流多级决策（[Polytechnique Montréal 2025](https://publications.polymtl.ca/71111/1/2025_AliShiri.pdf)）；社会隔离研究中将 H3 与人口普查区组合构造分析单元（[arXiv:2407.00404](https://arxiv.org/html/2407.00404v1)）。

## 3. 地块/街区单元（Parcel / Block）

- **定义与几何**：以地籍地块（parcel）或道路围合街区（block）为单元；形状、大小不一，贴合产权、用地与建成环境真实边界。香港语境下可对应地段（lot）/街块及统计用的 Tertiary Planning Unit (TPU) 体系【待核实：HK 规划署 TPU 层级细节】。
- **粒度与层级**：中。可向上聚合到街区→社区→行政区，但非严格嵌套（边界常跨越上级单元），聚合需面积加权。
- **语义边界对齐**：高。是城市治理、用地审批、TIA 申报的「原生单元」；T1 出行生成的出行率（trip rate）通常按用地性质挂接到 parcel/development site——香港 TIA 实践即以开发项目地块为单位套用 TPDM 出行率（[HK 运输署 TIA Checklist 2024](https://www.td.gov.hk/filemanager/en/publication/tia checklist for development projects_202410_v3.pdf)）。
- **数据挂接**：最难。需处理拓扑错误、权属变更、多源地址匹配；「parcels 是行为一致的单元，但数据复杂性长期压制其建模潜力」（Waddell 等，见 [Forecasting with Dynamic Microsimulation](https://escholarship.org/content/qt2x12q5pv/qt2x12q5pv_noSplash_06e38ab269bfea71ebaaa8c96304f948.pdf)）。
- **边界效应与 MAUP**：单元大小方差极大（微小地块 vs 大机构地块），小单元方差膨胀；zone effect 相对小（边界有语义），但跨城市/跨期比较困难。
- **典型用法**：UrbanSim parcel 级土地利用-交通一体化微观仿真（[UrbanSim 文档](https://cloud.urbansim.com/docs/general/documentation/urbansim.html)）；CityFM 等以 OSM 对象（道路/地块/POI）为节点的城市基础模型（[CityFM, arXiv:2310.00583](https://arxiv.org/html/2310.00583v3)）。

## 4. 对象优先缓冲区（Object-first Buffer）

- **定义与几何**：以道路、轨道站点、POI 等地理对象为中心建立缓冲区/影响域。两类实现：欧氏圆缓冲（计算简单但系统性高估可达覆盖）与**路网缓冲/等时圈**（network buffer / walkshed，更贴近步行体验，见 [UCL 纽约 TOD 研究](https://discovery.ucl.ac.uk/10115541/1/Liu_Final Paper 2.pdf)、[MDPI 2025 站点步行域研究](https://www.mdpi.com/2220-9964/14/5/205)）。
- **粒度与层级**：弱。缓冲半径本身是超参数（TOD 常用 400/800 m 站点域，[mediaTUM 综述](https://mediatum.ub.tum.de/doc/1546766/1546766.pdf)）；缓冲区互相重叠，不构成空间的严格划分（partition），聚合需去重/归属规则。
- **语义边界对齐**：最高（围绕真实对象与出行行为建模），但覆盖不完整——对象间空隙无单元归属。
- **数据挂接**：中。缓冲区内 POI/人口/用地混合度易统计（area-ratio 法），但重叠区重复计数、面积加权分摊需显式处理（[Southampton 论文综述](https://eprints.soton.ac.uk/413813/1/FINAL_e_thesis_for_e_prints_SHI_26416735.pdf)）。
- **边界效应与 MAUP**：传统 MAUP 框架不完全适用（非划分而是重叠覆盖）；主要偏差来源是缓冲类型（欧氏 vs 路网，丘陵城市两者覆盖面积差约 10%，[ResearchGate/Coimbra 研究](https://www.researchgate.net/publication/254609189_Using_GIS_for_Measuring_Transit_Stop_Accessibility_Considering_Actual_Pedestrian_Road_Network)）与半径选择。
- **典型用法**：TOD 类型学与站点域评估、2SFCA 可达性（其空间单元选择直接关联 MAUP 偏差，[ScienceDirect 2025 南京研究](https://www.sciencedirect.com/science/article/abs/pii/S1618866725003619)）；GeoFM 中「以对象为中心」的场景图/上下文窗口构造（如 UrbanFusion 多模态区域表征，[OpenReview](https://openreview.net/pdf/95c54db9d05003e696bfa135407d4236a0ee1854.pdf)）。

---

## 5. 四列对比总表

| 维度 | 正方形网格 | H3 六边形网格 | 地块/街区 | Object-first Buffer |
|---|---|---|---|---|
| 几何规则性 | 高（但邻居距离不一致） | 高（各向同性最优） | 不规则 | 不规则、可重叠 |
| 层级可聚合性 | 四叉树，无统一编码 | ★ 16 级嵌套编码，全球统一 | 近似嵌套，需面积加权 | 无层级，半径为超参数 |
| 语义边界对齐 | 低 | 低-中 | 高 | 最高（但覆盖不完整） |
| 数据挂接便利性 | ★ 最易 | 极易（索引即连接） | 最难（数据/拓扑成本） | 中（重叠需归属规则） |
| 主要偏差来源 | MAUP 尺度+分区效应、各向异性 | MAUP 尺度效应 | 小单元方差膨胀 | 缓冲类型/半径、重复计数 |
| 与 GeoFM/TIA 契合点 | 图像式输入、栅格数据 | 多分辨率 token、需求聚合 | T1 出行生成原生单元、UrbanSim | 站点域/TOD、对象级上下文 |
| 代表工作 | WorldPop 类栅格、标度律研究 | Uber 定价、IROS'23 路径规划 | UrbanSim、CityFM | 2SFCA、TOD 类型学、UrbanFusion |

## 6. 对双轨评估框架的意义

- **受控保真性对比轨**（同一数据、固定规模/面积，只换单元方案）：正方形与 H3 是理想的**受控基线对**——几何性质已知、尺寸可精确匹配（H3 res 9 ≈ 100 m 边长网格量级），任何性能差可归因于单元几何而非语义混杂，用于隔离 MAUP 分区效应。地块与 buffer 在该轨中引入语义与重叠混杂因素，宜作「真实条件」而非「受控条件」。
- **原生单元可用性轨**（使用下游任务本身的原生单元）：TIA 的原生单元是**开发地块/站点域**（HK TIA 以项目地块套 TPDM 出行率），需求建模原生单元是 TAZ/H3；该轨回答「模型能否在真实数据挂接约束下工作」。buffer 在 T4 长期情景评估中适合表达站点/走廊的影响域情景，但需先定义重叠归属规则才能产出可比的区域指标。
- **选型建议（供讨论）**：GeoFM 预训练单元用 H3（可复现、多尺度、挂接成本最低）；受控对比实验以「正方形 vs H3」隔离几何效应、以「网格 vs parcel」隔离语义效应；TIA 落地层保留 parcel/block 作为原生输出单元，内部计算可用 H3 聚合。

---

## 主要来源

- H3：[官方分辨率表](https://h3geo.org/docs/core-library/restable/) · [OSTI DGGS 对比](https://www.osti.gov/servlets/purl/2572460) · [Bousquin 2021 (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8958999/) · [arXiv:2407.00404](https://arxiv.org/html/2407.00404v1)
- MAUP：[arXiv:1910.05125](https://arxiv.org/pdf/1910.05125)（尺度/分区效应分解，引 Openshaw 1984）· [GIS Geography MAUP](https://gisgeography.com/maup-modifiable-areal-unit-problem/) · [ScienceDirect 2025 公园可达性 MAUP](https://www.sciencedirect.com/science/article/abs/pii/S1618866725003619)
- Parcel/Block：[UrbanSim 文档](https://cloud.urbansim.com/docs/general/documentation/urbansim.html) · [Dynamic Microsimulation (Waddell)](https://escholarship.org/content/qt2x12q5pv/qt2x12q5pv_noSplash_06e38ab269bfea71ebaaa8c96304f948.pdf) · [CityFM, arXiv:2310.00583](https://arxiv.org/html/2310.00583v3)
- Buffer：[UCL TOD 站点域](https://discovery.ucl.ac.uk/10115541/1/Liu_Final Paper 2.pdf) · [MDPI 2025 步行域](https://www.mdpi.com/2220-9964/14/5/205) · [mediaTUM 站点域综述](https://mediatum.ub.tum.de/doc/1546766/1546766.pdf)
- GeoFM：[GeoFM 概念 (Arribas-Bel)](https://me.darribas.org/2025/09/18/geofm-how-will-geofoundation-models.html) · [UrbanFusion (OpenReview)](https://openreview.net/pdf/95c54db9d05003e696bfa135407d4236a0ee1854.pdf)
- HK TIA：[运输署 TIA Checklist 2024](https://www.td.gov.hk/filemanager/en/publication/tia checklist for development projects_202410_v3.pdf)
