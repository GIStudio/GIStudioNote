# City2Graph 项目介绍：来源与范围

核验日期：2026-11-18。正文为 `content/Graph/city2graph.md`，接入图学习与城市计算索引。按站点范围只使用公开主源。

| 正文位置 | 查阅来源与核对内容 |
| --- | --- |
| 开头和四类构图 | [项目首页](https://city2graph.net/latest/index.html)与[原论文](https://doi.org/10.1016/j.compenvurbsys.2026.102492) §3、表 2；[形态](https://city2graph.net/latest/api/morphology.html)、[公交案例](https://city2graph.net/latest/examples/gtfs.html)、[OD](https://city2graph.net/latest/api/mobility.html#od_matrix_to_graph)与[邻近](https://city2graph.net/latest/api/proximity.html)各自给出输入、节点和边的含义。A/B/C 及 12、18 分钟纯为教学设定。 |
| 元路径与数据转换 | 正式版 §3.1.5 和 §3.2；[元路径文档示例](https://city2graph.net/latest/examples/add_metapaths.html)与[转换 API](https://city2graph.net/latest/api/graph.html)，分别核对按类型串接、按成本投影、特征选择和几何保留条件。 |
| 利物浦实验 | 正式版 §4.1–4.6.1、图 12–13、表 3；1,624 个 OA、23 项指标、步行和多式联运阈值均为 900 秒，联运层排除已有步行边。表 3 对聚类数 2–50 取均值：0.19 与 0.37/0.39/0.38，后者的纯结构版本为 0.15/0.17/0.09。区分输入关系与编码器改变、内部聚类指标与外部验证。未重跑论文实验。 |
| 版本与应用边界 | [PyPI 1.1.0](https://pypi.org/project/city2graph/1.1.0/)、[GitHub v1.1.0 发布说明](https://github.com/c2g-dev/city2graph/releases/tag/v1.1.0)、[合成 GTFS 指南](https://city2graph.net/latest/api/gtfs_generation.html)、论文 §5 和[案例仓库](https://github.com/c2g-dev/city2graph-case-study)的 Data sources and copyright 小节。1.1.0 版本能力与论文案例分开。 |

正文复核 R1–R6：定义、A/B/C 示例、来源锚点、构图与证据边界、项目介绍范围、独立可读性均有上述对应正文。公开内容扫描把开源库名 `GeoPandas` 的字母子串识别为保密提醒，经句级核对为误报。部署状态以 Pages 工作流与[线上正文](https://notes.gistudio.xyz/graph/city2graph)为准。
