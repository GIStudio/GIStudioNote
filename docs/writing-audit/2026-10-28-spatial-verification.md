# 空间单元、交通区与香港人口资料核验

核验日期：2026-10-28。范围为 `content/Data/spatial_units_report.md`、`taz-traffic-analysis-zone.md` 和 `hk_pop.md`；没有读取私人研究资料。

## 四类空间单元

- 删除组会、特定项目方案和未经统一实验支持的全局优劣排序，保留基于问题、边界、尺度与数据挂接的比较方法。
- [H3 官方面积表](https://h3geo.org/docs/core-library/restable/)：0–15 级，共 16 级，每级 12 个五边形；7、9、10 级平均六边形面积分别约为 5.161、0.105、0.015 平方公里；个体面积随位置变化。
- [H3 层级说明](https://h3geo.org/docs/highlights/indexing/)：逻辑父子关系精确，几何包含关系近似；比较父级聚合与原始点直接编码时需检查边界情况。
- [香港规划署边界规范](https://www.pland.gov.hk/open_data/tpu_sb_vc/Boundary_of_TPU_and_Subunit_Data_Specification_v1.0.pdf)：2021 年 TPU 下分单元区；2001–2016 年使用街段区或村落统计区。地块、TPU 和交通模型分区不可直接等同。
- 不以“六边形边缘效应最小”或“对象缓冲语义最佳”代替具体任务验证；指出缓冲区可重叠及未覆盖区域。

## TAZ 与各地实践

- [美国 Census TIGERweb](https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_geography_details.html)及[图层目录](https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/PUMA_TAD_TAZ_UGA_ZCTA/MapServer)：美国普查局 TAZ 属交通专用统计地理，图层中相应 TAZ 为 2000 和 2010 年版本，不根据服务名称误判为 2020 年。
- [ONS](https://www.ons.gov.uk/methodology/geography/ukgeographies/censusgeographies/census2021geographies)、[伦敦交通局](https://content.tfl.gov.uk/traffic-modelling-guidelines.pdf)、[赫特福德郡](https://www.hertfordshire.gov.uk/services/highways-roads-and-pavements/business-and-developer-information/transport-modelling/transport-modelling-in-hertfordshire.aspx)：英格兰和威尔士统计区可服务模型；英国亦有按交通任务设计的模型分区，删除“英国没有专门交通分析区”。
- [柏林交通数据](https://www.berlin.de/sen/uvk/mobilitaet-und-verkehr/verkehrsdaten/teilverkehrszellen-und-verkehrszellen/)、[日本京阪神 PT 指南](https://www.kkr.mlit.go.jp/plan/pt/topics/pt_guide-01.html)、[中国交通运输部规划指南](https://xxgk.mot.gov.cn/jigou/ysfws/202006/t20200623_3315097.html)：保留各地具体做法，移除缺乏同口径支撑的数量和跨地区排名。
- 香港 TPU 是规划统计单元，具体交通模型是否采用及其版本需另核查，不等同全部香港 TAZ。

## 香港人口

- [2021 普查背景](https://www.census2021.gov.hk/en/background.html)及[技术报告](https://www.census2021.gov.hk/doc/pub/21c-technical-report.pdf)：约九成住户简短点算，约一成详细调查；详细调查采用不等比例分层系统抽样，不可把各地域人口数当作抽样层级样本量。
- [2026 政府统计处说明](https://www.censtatd.gov.hk/en/chat20260319.html)：自 2026 年起结合行政资料，每五年约一成住户详细访问，其余约九成无须填写；该安排与 2021 不同。
- 保留人口定义、估算精度、隐私及基尼系数口径说明，去除缺乏依据的原有 2,100／2,400／21,000 抽样说法。

## 检查与边界

- 三页公开内容检查 0 错误、3 警告；人工核对为公开的香港规划署 URL 被误识别为私人语境。
- 科普文风检查：两页无命中；一页命中日期连接号和用于明确操作的“对齐”，保留。
- 三页 `git diff --check` 通过。2021 技术报告按官方检索结果核对抽样段落；未对全报告全部指标作核验。历史数据取用应复核具体年份、边界、元数据和发布限制。
