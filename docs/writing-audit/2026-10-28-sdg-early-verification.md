# SDG 专题索引与目标 1–9 数据核验

核验日期：2026-10-28。范围仅为 `content/Sustainability/SDG/index.md` 和目标 01–09 页面；各目标保留原有学习内容，将“官方监测任务”改为更准确的“相关监测问题”，注明具体目标是摘要并链接联合国原文。数据库的具体国家和年份需逐指标确认。

| 页面 | 主要核验与修订 | 主要来源 |
| --- | --- | --- |
| 专题索引 | 当前框架已纳入 2025 年综合审查及 2026 年年度调整，为 234 个不重复指标、251 次列示；OSDG 2023.10 文本与标签判断分开；SDR 2026 的 193 国资料和 169 国排名分开，说明其非官方指数属性。 | [联合国指标清单](https://unstats.un.org/sdgs/indicators/indicators-list/)、[OSDG](https://zenodo.org/records/8397907)、[SDR 2026](https://dashboards.sdgindex.org/chapters/part-2-the-sdg-index-and-dashboards/) |
| 01 无贫穷 | 世行 2025 年将国际贫困线由每日 2.15 国际美元（2017 PPP）调整为 3.00 国际美元（2021 PPP）；UNDP 2026 MPI 覆盖 108 国；区分全球 MPI、国家定义及调查簇资产指数。 | [世行贫困线](https://www.worldbank.org/en/news/factsheet/2025/06/05/june-2025-update-to-global-poverty-lines)、[UNDP MPI](https://hdr.undp.org/content/2026-global-multidimensional-poverty-index)、[SustainBench DHS](https://sustainlab-group.github.io/sustainbench/docs/datasets/dhs.html)、[目标 1](https://sdgs.un.org/goals/goal1) |
| 02 零饥饿 | 核对农业统计覆盖；说明 GlobeLand30 耕地类本身不提供作物品种或复种指数。 | [FAOSTAT](https://faostat.fao.org/)、[GlobeLand30 类别](https://isprs-gis-sdg.readthedocs.io/en/latest/part2/2_1.html)、[目标 2](https://sdgs.un.org/goals/goal2) |
| 03 良好健康 | 去掉未经证实的所有指标、健康风险数量和统一时间覆盖；注明 DHS 申请与隐私约束。 | [WHO GHO](https://www.who.int/data/gho)、[IHME GBD](https://www.healthdata.org/gbd)、[DHS](https://dhsprogram.com/)、[目标 3](https://sdgs.un.org/goals/goal3) |
| 04 优质教育 | 删去未经证实的完整覆盖和样本数；女性教育标签为调查簇级。 | [UNESCO UIS](https://uis.unesco.org/)、[SustainBench DHS](https://sustainlab-group.github.io/sustainbench/docs/datasets/dhs.html)、[目标 4](https://sdgs.un.org/goals/goal4) |
| 05 性别平等 | 区分指标缺测和 WEF 2024 报告的独立指数及覆盖。 | [UN Women](https://data.unwomen.org/)、[WEF 2024](https://www.weforum.org/publications/global-gender-gap-report-2024/)、[目标 5](https://sdgs.un.org/goals/goal5) |
| 06 清洁饮水 | 区分 GRACE 陆地总水储量与借助其他数据或模型推断的地下水；保留目标 6.6 原始期限。 | [NASA GRACE](https://grace.jpl.nasa.gov/resources/42/grace-and-grace-fo-track-californias-land-water-changes/)、[UN-Water](https://sdg6data.org/en/)、[目标 6](https://sdgs.un.org/goals/goal6) |
| 07 清洁能源 | 区分 IEA 产品开放与付费；指标 7.2.1 的分母是终端能源消费而非发电量。 | [IEA](https://www.iea.org/data-and-statistics)、[目标 7](https://sdgs.un.org/goals/goal7) |
| 08 体面工作 | 区分 ILO 报告值与模型估计；夜间灯光为代理指标，跨传感器须核对口径；保留 8.6 原始期限。 | [ILOSTAT](https://ilostat.ilo.org/data/)、[DMSP](https://eogdata.mines.edu/products/dmsp/)、[VIIRS](https://eogdata.mines.edu/products/vnl/)、[目标 8](https://sdgs.un.org/goals/goal8) |
| 09 产业与创新 | 世界银行页面改称发展指标中的基础设施专题；去除未经证实的统一覆盖年份。 | [UNESCO UIS](https://uis.unesco.org/)、[世行基础设施专题](https://data.worldbank.org/topic/infrastructure)、[目标 9](https://sdgs.un.org/goals/goal9) |

## 检查与边界

- 公开内容检查覆盖 10 页：0 错误、0 警告。
- 中文科普文风检查覆盖 10 页：9 页无命中；1 页提示年份连接号，经人工确认是正常日期范围。
- 对上述 10 页运行 `git diff --check`，通过。
- IRENA 网站返回 403，未能核实具体年份和覆盖数字；页面已删除相关未经证实的数字，仅保留数据入口和一般描述。
- 未执行全站构建，未对所有历史指标逐项取数；数据分析应在下载时再次核对版本、调查年份和缺失情况。
