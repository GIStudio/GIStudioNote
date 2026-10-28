# SDG 10–17 和生态效率页面核验

核验日期：2026-10-28。范围为各页目标摘要、数据集简介和荷日比较的主要数据及推断；数据平台所有条目与版本未逐条复查。

| 页面 | 核验与修改 | 主要来源及剩余边界 |
| --- | --- | --- |
| SDG 10 | 10.1 补全低收入群体收入增长快于全国平均；WIID 与 WID 按版本及国家说明覆盖和估算 | [联合国框架](https://unstats.un.org/sdgs/indicators/indicators-list/)、[WIID](https://www.wider.unu.edu/database/world-income-inequality-database-wiid)、[WID 方法](https://wid.world/methodology/) |
| SDG 11 | 更正 WorldCover 为 2020、2021 两版，说明算法变化；城市及空气数据以具体系列为准 | [ESA WorldCover](https://esa-worldcover.org/en/data-access)、[CAMS](https://atmosphere.copernicus.eu/data) |
| SDG 12 | 区分食物损失和浪费的供应链阶段；更正电子废物数据来源 | [FAO 测量说明](https://www.fao.org/platform-food-loss-waste/food-loss/food-loss-measurement/en/)、[Global E-waste Monitor](https://globalewaste.org/) |
| SDG 13 | 砖窑数据为孟加拉国 2018–19 影像及存在标签，不能直接作为排放量；标注温度异常基准期 | [SustainBench](https://sustainlab-group.github.io/sustainbench/docs/datasets/sdg13/brick_kiln.html)、[NASA GISTEMP](https://data.giss.nasa.gov/gistemp/) |
| SDG 14 | 区分渔业产量与资源状态；CGOF 各变量覆盖不再给出未证实的年份和分辨率 | [FAO](https://www.fao.org/statistics/data-collection/fishery-and-aquaculture/en)、[CGOF 公开案例](https://www.nda.gov.cn/sjj/zhuanti/ztsjysx/sjysal/0303/ff808081-9b5e8657-019c-b2f08cfb-08c6.pdf)。CGOF 逐变量技术规格仍需核验 |
| SDG 15 | 更正 FRA 2025 国家通讯员网络覆盖 194 个国家和地区；红色名录限定为已评估物种 | [FAO FRA](https://www.fao.org/forest-resources-assessment/en/)、[IUCN](https://www.iucnredlist.org/) |
| SDG 16 | WGI 与 CPI 限定为治理及公共部门腐败感知估计，数据可能修订 | [世界银行 WGI](https://datacatalog.worldbank.org/search/dataset/0038026/worldwide-governance-indicators)、[CPI 方法](https://www.transparency.org/en/news/how-cpi-scores-are-calculated) |
| SDG 17 | 消除子目标与指标数量混淆，援助及 ICT 覆盖按实际系列核验 | [联合国数据](https://unstats.un.org/sdgs/dataportal)、[OECD ODA](https://www.oecd.org/en/data/insights/data-explainers/2024/07/frequently-asked-questions-on-official-development-assistance-oda.html)、[ITU](https://www.itu.int/en/ITU-D/Statistics/pages/stat/default.aspx) |
| 荷日生态效率 | 删除国家路径二分与未经支持的跨国优劣、因果断言；分别说明项目估计、材料足迹和绿色铁情景与核算边界 | [Cefic](https://cefic.org/case-study/turning-waste-heat-into-climate-action-botlek-steam-network/)、[EEA](https://www.eea.europa.eu/en/europe-environment-2025/countries/netherlands/circular-material-use-rate)、[OECD](https://www.oecd.org/en/publications/environment-at-a-glance-country-notes_59ce6fe6-en/netherlands_d05be180-en.html)、[REI](https://www.renewable-ei.org/en/activities/reports/20251215.php)、[Agora](https://www.agora-industry.org/publications/the-role-of-green-iron-trade-in-accelerating-steel-transformation)。未独立验证项目运行数据或完成生命周期评价 |

公开内容审计：9 页 0 错误；SDG 14 国家数据局公开案例触发私人研究词语警告，人工确认链接为公开案例。写作检查中的“能力建设”为正式目标术语、破折号属于标题；已人工判断。git diff --check 通过。
