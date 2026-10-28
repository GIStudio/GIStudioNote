# CartoGuophy 作品导览来源与验收

日期：2026-10-28。交付：`content/Data/cartoguophy-cartographic-design.md`；接入 `content/Data/index.md`。受众为有基础 GIS 接触、希望学习制图表达的读者；以资源导览为主，用五组作品说明可复用知识。仅使用公开材料，不读取私人研究或联系作者。

## 主张与来源

| 来源 | 定位与支持范围 |
| --- | --- |
| [CartoGuophy 首页](https://cartoguophy.com/)、[作品集](https://cartoguophy.com/portfolio.html)、[LEGO 页](https://cartoguophy.com/lego.html) | 网站归属、题材和媒介范围、版权声明；不复算累计奖项数量 |
| [UW–Madison Map Chat](https://geography.wisc.edu/gis/map-chat-with-atlas-guo-december-4/) | About Atlas 的公开身份与研究／制图方向；独立检索亦核对地理系个人页 ongoing 学位，不刊联系信息或完整履历 |
| [淄博地图](https://cartoguophy.com/maps/zibo.html) | 原作介绍关于阴影与分层设色、交通符号、两处附图的说明；视觉层级的阅读建议由本文归纳 |
| [ArcGIS Pro Hillshade](https://doc.esri.com/en/arcgis-pro/latest/help/analysis/raster-functions/hillshade-function.html) | Overview：模拟光照、坡度与坡向、定性地形表达，区别于绝对高程 |
| [Rising Hazards 原作](https://cartoguophy.com/maps/us_rising_hazard.html) | FEMA NRI 18 灾种、1,000 平方英里 Albers 六边形、县级分数面积加权平均、颜色与透明度、查询功能 |
| [NACIS 2025 获奖页](https://nacis.org/awards/2025-sdmc-individual-winner/) | 独立确认个人组获奖；项目说明来自作者，不能当作独立精度评测或新的细尺度预测 |
| [Köppen 原作](https://cartoguophy.com/maps/koppen.html) | 月度气温降水环形排列、图例、类型汇总和南半球月份移位。未将作者页面的基期与数据版本细节重写成已经独立核实的数据集史 |
| [Wisconsin LEGO 原作](https://cartoguophy.com/lego/lego_wisconsin.html) | 32×32、10×10 平方英里／单元、五档高程、城市与湖泊符号；空间离散化和分级为据此解释 |
| [Esri ArcUser Winter 2026 访谈](https://www.esri.com/about/newsroom/arcuser/designing-lego-maps-brick-by-brick) | 作者自述投影／比例、格网采样、高程／水深、实体或数字制作。不是教学效果试验 |
| [WLIA 2024 获奖页](https://www.wlia.org/news/2024-wlia-map-contest-awards---the-champions-of-cartography) | 分别确认 Best Student、Most Unique 第一名、President’s Choice、People’s Choice (Adult) |
| [Harvey 原作](https://cartoguophy.com/maps/revealing_hurricane_harvey.html) | Twitter 轨迹、机器学习方式识别、四阶段 CBSA 聚合、线宽／透明度与强连接筛选；未验证原论文、分类精度或人群代表性 |

## 边界与编辑判断

- 新作，修订差异项不适用。未写成完整作者画像、奖项排行榜或软件评测。
- 未下载／转载地图或照片，不复制页面正文；原作保留版权，正文提供逐项直接链接。
- 地图表达机制、作者陈述与本文学习建议分别表述。县级指标重聚合不增加原数据的空间信息；轨迹来源和显示筛选限制结论范围。
- Esri 访谈的地理教育用途属于作者目标，未声称实证证实提升学习效果。
- 不继承上次任务的依赖更新、RL 附站认证或其他站点维护范围。

## 验收

| 项目 | 状态与证据 |
| --- | --- |
| 来源写作 R1–R3 | 完成：中文资源导览及五组知识解释，关键主张对应上述来源，方法与建议有边界 |
| R4 与站点适配 | 两页公开扫描 0 错误／0 提醒；新页中文科普检查无命中；Node 22.16.0 下 `npm run check:content` 通过，199 个 Markdown、45 个资源，4 个草稿过滤，生成 880 个文件与 3 个兼容重定向；生成正文含 1 张表、19 个外部来源链接，数据索引及 3 个相关概念回链已核对；线上正文待发布后确认 |
| R5 修订说明 | 不适用：新文章 |
| 发布 | 待限定提交、推送 `v5`、匹配 Pages 成功及正式 URL 核验；以上条件完成后停止 |

冷读修订：将 Harvey 分阶段图的统计单元精确为 CBSA；南半球月份移位限定为顶部示例图。其余关键数字及获奖记录与来源一致。未将来源说明当作独立实测。
