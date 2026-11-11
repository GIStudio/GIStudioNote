# OpenAQ 空气质量数据：来源、口径与验收

范围：把 OpenAQ 的平台定位、收录标准、数据结构、时间语义、取数方式与许可整理成一份使用说明。目标是让读者判断「这份数据能不能用于自己的分析」，不排名平台、不评估具体站点精度，也不重跑任何 OpenAQ 的分析。核验日期：2026-11-11。

页面：`content/Data/openaq-air-quality-data.md`。索引：`content/Data/index.md` 新增「数据源与开放数据」一节。

## 主张与来源

| 正文主张 | 来源与核对位置 | 边界 |
| --- | --- | --- |
| 2015 年起聚合政府参考站，2021 年起接入传感器，现为美国非营利组织 | [About Us](https://openaq.org/about/)；[十周年](https://openaq.org/ten-years/) | 时间线来自机构自述；501(c)(3) 状态未在正文展开。 |
| 平台聚合物理浓度，不提供 AQI 一类指数 | [Platform](https://openaq.org/platform/) | 平台定位陈述；AQI Hub 等第三方指数工具不在平台内。 |
| 收录条件：开放许可、浓度为值而非指数、有坐标与时间戳、频率 10 分钟至 24 小时、固定地面监测 | [FAQ](https://docs.openaq.org/about/faq) | 是平台自述的入库门槛；实际站点是否满足仍需逐条核对。 |
| 优先参数为 PM2.5、PM10、NO2、NOx、NO、O3、SO2、CO、BC 及部分温湿度 | [About the API](https://docs.openaq.org/about/about) | 「优先」不等于全覆盖；PM1、PM4、CO2、CH4、UFP 仅少数站点。 |
| location → sensor → measurement 三层结构；`provider` 与 `owner` 分离；`isMonitor` 区分官方设备 | [Locations](https://docs.openaq.org/resources/locations)；[Instruments](https://docs.openaq.org/resources/instruments) | 字段含义；正文不推断任一站点的数据质量。 |
| `/measurements` 为原始值，`/hours`、`/days`、`/years` 为聚合值并返回 `summary` 与 `coverage` | [Measurements](https://docs.openaq.org/resources/measurements) | 聚合口径来自文档；未验证各端点在大时间窗下的实际性能。 |
| 时间戳表示区间结束；日期表示区间起点；同时返回 UTC 与本地时间；未指定时区时按站点本地时间解释 | [日期、时间与时区](https://docs.openaq.org/using-the-api/dates-datetimes) | 语义规则；跨时区比较的风险是本文的推论。 |
| `/days` 为本地时间 01:00 至次日 0:00 的小时均值平均 | [Measurements](https://docs.openaq.org/resources/measurements) | 文档原文口径；未测试边界日期的实际返回。 |
| `latest` 是序列最后一个值，不等于最新入库值 | [Latest](https://docs.openaq.org/resources/latest) | 文档说明；乱序上报时的具体表现未独立复现。 |
| API key 放在 `X-API-Key`；免费额度 60 次/分、2,000 次/时；超限 429 | [API Key](https://docs.openaq.org/using-the-api/api-key)；[Rate Limits](https://docs.openaq.org/using-the-api/rate-limits) | 额度为核验日数值，可能调整。 |
| 分页默认 100、最大 1,000；建议时间窗一年以内 | [Pagination](https://docs.openaq.org/using-the-api/pagination) | 官方建议，不是硬限制。 |
| `bbox` 与 `coordinates`+半径互斥，半径最大 25 公里，同时给出返回 422 | [Geospatial](https://docs.openaq.org/using-the-api/geospatial) | 参数规则；错误码来自文档。 |
| v1/v2 于 2025-01-31 退役，旧地址返回 410 | [About the API](https://docs.openaq.org/about/about) | 退役日期与状态码来自文档。 |
| S3 桶 `openaq-data-archive`，Hive 分区 `locationid/year/month`，日文件延迟约 72 小时 | [Open Data on AWS](https://docs.openaq.org/aws/about) | 分区与延迟来自文档；未下载文件验证。 |
| 许可逐 location 提供，含商业使用、署名、相同方式共享、修改、再分发等字段 | [Locations](https://docs.openaq.org/resources/locations)；[Licenses](https://docs.openaq.org/resources/licenses) | 字段是筛选条件，不是法律意见。 |
| 使用条款禁止页面抓取、一人一 key、禁止开发实质重复的托管服务 | [Terms of Use](https://docs.openaq.org/about/terms) | 条款原文；具体合规判断需法律意见。 |
| 2025 年 9 月口径：20 亿+ 数据点、20,700 站点、134 国、2,043 个中低收入国家站点、553 篇论文 | [十周年](https://openaq.org/ten-years/) | 机构自述的静态快照，不是实时计数。 |
| 2024 年全球评估：36% 国家、近 10 亿人未监测；略多于四分之一国家数据完整且易于获取 | Open Air Quality Data: The Global Landscape 2024（`openaqLandscape2024`） | 报告结论；本文不重算其抽样与判定规则。 |
| 低成本传感器需要现场校准，跨站点与跨季节可比性需单独验证 | Castell 等 2017（`castellCanCommercialLowCost2017`）；Kumar 等 2015（`kumarRiseLowCost2015`） | 一般性评估结论，不针对平台上的某一设备型号。 |

## 与原文口径的差异

| 常见说法 | 本文处理 |
| --- | --- |
| 「OpenAQ 是空气质量监测网络」 | 改写为聚合平台：它不运营站点，数据来自各国机构与传感器网络。 |
| 「OpenAQ 提供 AQI」 | 明确平台只提供浓度；AQI 由第三方按各自标准计算。 |
| 「平台上没有数据说明当地空气好」 | 改写为三重原因：站点未收录、参数未覆盖、许可未开放；与污染水平无关。 |
| 「站点数等于人口暴露覆盖」 | 加入布点偏向、参数不均与国别差异三条限制。 |
| 「传感器测的 PM2.5 可以直接和参考站混用」 | 要求先做校准与可比性验证，并建议分开报告。 |
| 「缺测可以按 0 处理」 | 明确缺测表示无观测；日均值前检查 `percentComplete`。 |

## 内容边界

- 所有平台侧事实以 2026-11-11 可访问的官方页面与文档为准；速率限制、字段名与收录标准都可能变动。
- 覆盖数字是 2025 年 9 月的机构自述快照，本文没有调用 API 复核站点数。
- 本文没有独立审计任何一个 `location_id` 的数据质量，也没有下载 S3 文件验证分区与延迟。
- 关于低成本传感器的判断引用两项评估研究的通用结论，不外推到具体设备或具体城市。
- AQI 跨系统不可比的说法是方法学推论，未逐一列举各国标准。

## 内容验收

- `npm run audit:content`：通过（209 个 Markdown、68 个资源）。
- 公开边界脚本：0 错误、0 提醒（页面与索引）。
- `npm run check:content`：通过（Node v22.16.0，941 个文件）。
- 渲染检查：标题、2 张表格、1 段 JSON 示例正常；正文引用全部改为指向具体文档页的链接；自动参考文献仅保留 4 条（两篇论文与 2024/2025 两份 OpenAQ 材料）。
- 发布：提交后推送至 `v5`，线上核验见 `docs/knowledge-maintenance.md`。
