---
title: OpenAQ 是什么：全球地面空气质量数据的聚合口径、接口与使用边界
description: 说明 OpenAQ 收录哪些地面空气质量数据、站点—传感器—测量值的数据结构、API v3 与 S3 归档的取数方式、时区与许可约束，并标出覆盖范围与传感器质量的使用边界。
tags:
  - 空气质量
  - 开放数据
  - 数据接口
  - 数据质量
  - 环境监测
verified_at: 2026-11-11
---

**OpenAQ 是空气质量数据的聚合平台，不是监测网络，也不发布空气质量指数。** 它把各国政府参考站和民间传感器上报的原始浓度，统一成同一套字段和接口；数据准不准、连不连续、能不能和别处比较，仍取决于原始提供方。

这个区别决定了它适合做什么。需要一份跨国的地面浓度序列、或者想先看看某座城市有没有公开监测点时，OpenAQ 省掉了逐国找网站、逐站写爬虫的工作。需要判断某地空气是否达标、或比较不同国家的 AQI 等级时，平台本身不提供答案。

## 一、它解决的是「找得到」和「对得上」

OpenAQ 从 2015 年开始聚合政府参考站数据，2021 年起接入空气传感器数据，现为美国非营利组织。[关于 OpenAQ](https://openaq.org/about/) [十周年回顾](https://openaq.org/ten-years/) 它强调六件事：把数据统一成可比格式、用物理浓度而不是指数、同时提供近实时与历史数据、附带站点元数据、开放 API、抓取软件开源。[API 简介](https://docs.openaq.org/about/about)

收录不是全量的。按官方说明，进入平台的数据需要满足这些条件：[数据收录说明](https://docs.openaq.org/about/faq)

- 有开放许可，允许再分发；
- 上报的是浓度值，不是 AQI 一类的指数；
- 带地理坐标和可用的时间戳；
- 上报频率在 10 分钟到 24 小时之间；
- 是固定的地面监测，不收卫星反演和机载观测。

平台优先收录 PM2.5、PM10、NO2、NOx、NO、O3、SO2、CO、BC，以及随源数据提供的温度和相对湿度；PM1、PM4、CO2、CH4、UFP 等只在少数站点出现。[API 简介](https://docs.openaq.org/about/about)

由此得到第一条使用边界：**站点集合是「OpenAQ 发现且被授权分享」的集合，不是世界监测站的普查。** 某地没有数据，不能推出当地空气好；反过来，平台上有站点，也不代表它代表整座城市。

## 二、数据结构：站点 → 传感器 → 测量值

API v3 的层级很清楚：一个 location 有多个 sensor，每个 sensor 只测一个 parameter，measurements 挂在 sensor 下。

| 层级 | 主要字段 | 用途 |
| --- | --- | --- |
| location | `id`、`name`、`country`、`provider`、`owner`、`coordinates`、`timezone`、`isMobile`、`isMonitor`、`instruments`、`sensors`、`licenses`、`datetimeFirst`/`datetimeLast` | 站点身份、责任方与许可 |
| sensor | `id`、`parameter`（名称与单位）、`datetimeFirst`/`datetimeLast`、`coverage`、`latest`、`summary` | 单个污染物的序列与完整度 |
| measurement | `value`、`parameter`、`period`、`coordinates`、`coverage` | 原始读数或聚合值 |

几个字段容易被忽略：

- **`provider` 与 `owner` 不是一回事。** provider 是把数据送上平台的组织，owner 是负责站点的组织；两者可以不同，引用时应分开写。[Locations 资源](https://docs.openaq.org/resources/locations)
- **`isMonitor` 区分官方监测设备与传感器。** `instruments` 里还记录设备名称和是否用于官方监测，这是后续判断数据质量的主要线索。[Instruments 资源](https://docs.openaq.org/resources/instruments) [Locations 资源](https://docs.openaq.org/resources/locations)
- **一个 sensor 只对应一个参数和一种单位。** 想把 PM2.5 与 PM10 拼在一张表里，需要自己按 `parameter` 与 `units` 对齐，而不是按列位置对齐。
- **原始值与聚合值分层提供。** `/measurements` 是上游报告的原始值；`/hours`、`/days`、`/years` 是小时、日、年均值，并返回 `summary` 与 `coverage` 两个对象。[Measurements 资源](https://docs.openaq.org/resources/measurements)

## 三、时间口径：时刻表示「区间结束」

OpenAQ 的时间戳是左开右闭的结束时刻：标为 03:00 的小时值，覆盖 02:00 到 02:59。日期（date）表示区间起点，日期时间（datetime）表示区间结束，官方文档明确区分了这两种含义。[日期、时间与时区](https://docs.openaq.org/using-the-api/dates-datetimes)

每条时间记录同时返回 UTC 与本地时间：

```json
{ "utc": "2019-07-11T20:00:00Z", "local": "2019-07-11T14:00:00-06:00" }
```

站点还带一个 IANA 时区标识（如 `America/Denver`）。请求里不写时区时，API 按站点所在地的本地时间解释输入时间；跨时区比较时应显式使用 UTC。[日期、时间与时区](https://docs.openaq.org/using-the-api/dates-datetimes)

聚合口径也要看清：`/days` 是本地时间 01:00 到次日 0:00 之间各小时均值的平均，`/years` 同理按本地日历年计算。[Measurements 资源](https://docs.openaq.org/resources/measurements) 这意味着日界线按站点所在时区划分，跨区拼接「同一天」并不是同一个物理时段。

`coverage` 给出期望记录数、实际记录数和完成百分比。先看覆盖率再决定要不要平均，比先平均再补解释更稳妥：一个 30% 完整的日均值，和 95% 完整的日均值不是同一种证据。[Measurements 资源](https://docs.openaq.org/resources/measurements)

另外，`latest` 不是「最新入库值」，而是该传感器序列中的最后一个值。上游乱序上报时，某条记录可能已经入库却不会出现在 latest 里，轮询 latest 不能保证拿到完整覆盖。[Latest 资源](https://docs.openaq.org/resources/latest)

## 四、三条取数路径

| 路径 | 适合 | 代价与限制 |
| --- | --- | --- |
| OpenAQ Explorer | 浏览、筛选、导出 CSV、建立关注列表 | 手工操作，不适合批量复现 |
| REST API v3 | 按站点、参数、时间窗、地理范围查询 | 需要注册并携带 API key；有速率与分页限制 |
| AWS S3 开放数据 | 下载多年历史、做批量分析 | 只有日文件，按站点与年月分区；有写入延迟 |

API 需要先注册账号取得 key，放在 `X-API-Key` 请求头里，不要写进前端代码。[API key](https://docs.openaq.org/using-the-api/api-key) 免费额度是每分钟 60 次、每小时 2,000 次；超限返回 429，响应头会给出已用量、剩余量和重置时间。[速率限制](https://docs.openaq.org/using-the-api/rate-limits)

分页默认每页 100 条，最大 1,000 条；查 `/measurements` 或 `/hours` 时，官方建议用 `datetimeFrom` 与 `datetimeTo` 把时间窗限制在一年以内，否则翻页会很慢。[分页](https://docs.openaq.org/using-the-api/pagination) 地理查询支持两种互斥写法：`bbox` 边界框，或 `coordinates` 加点半径（半径最大 25 公里），同时给出两种会返回 422。[地理查询](https://docs.openaq.org/using-the-api/geospatial)

v1 与 v2 已于 2025 年 1 月 31 日退役，旧地址现在返回 410 Gone，现有代码应迁移到 v3。[API 简介](https://docs.openaq.org/about/about)

需要整年或多年数据时，S3 更省事。存储桶是 `openaq-data-archive`，按 `records/csv.gz/locationid={id}/year={年}/month={月}/` 的 Hive 分区存放，每个文件是某站点某天的窄表（`location_id`、`sensor_id`、`datetime`、`lat`、`lon`、`parameter`、`units`、`value`）。日文件在日终后约 72 小时写入，缺数时可能被回补，也可以用 SNS 订阅对象创建事件。[Open Data on AWS](https://docs.openaq.org/aws/about)

最后一条容易被忽略：不要把 API 直接接到浏览器端。OpenAQ 不允许跨域请求，多用户页面也会很快撞上速率限制；官方建议自建后端代理并做缓存。[FAQ](https://docs.openaq.org/about/faq)

## 五、许可：许可跟着原始来源走

OpenAQ 汇集的是不同来源的数据，**没有一个覆盖全平台的统一数据许可**。每个 location 带自己的 `licenses` 列表，每条许可还标出生效时间段。[Locations 资源](https://docs.openaq.org/resources/locations)

`licenses` 资源把许可拆成几个可判断的开关：是否允许商业使用、是否要求署名、是否要求相同方式共享、是否允许修改、是否允许再分发，并给出原始许可链接。[Licenses 资源](https://docs.openaq.org/resources/licenses) 这些字段是筛选条件，不是法律意见；具体用途仍要回到原始许可文本。

署名有两层：按原始许可要求注明数据提供方，同时注明 OpenAQ 作为获取入口。即使原来源不强制，官方也建议把两者都写上。[使用条款](https://docs.openaq.org/about/terms)

使用条款还有几条硬约束：只能通过 API、导出功能等官方渠道下载数据，禁止从可视化页面抓取；一个人只能注册一个 key；不得用托管 API 开发与 OpenAQ 核心服务实质重复的产品。数据按「现状」提供，不保证准确、完整或不中断。[使用条款](https://docs.openaq.org/about/terms)

## 六、规模：数字能说明什么

截至 2025 年 9 月，平台自述聚合了超过 20 亿条数据，来自 134 个国家的 20,700 个站点，其中 2,043 个位于低收入和中等收入国家；官方统计有 553 篇论文或会议论文引用过这些数据。[@openaqTenYears2025]

这些数字说明平台的可及性，不说明代表性。三个原因值得记住：

1. **站点数不是人口暴露覆盖。** 城市监测站常布在交通干道或城市背景点，乡村、山区和工业区内部往往更少。
2. **参数覆盖不均。** 并非每个站点都测 PM2.5；气体污染物的站点密度通常更低。
3. **国别差异很大。** 2024 年的全球评估认为，36% 的国家、合计近 10 亿人没有在监测空气质量，且多数属于低收入或中低收入国家；只有略多于四分之一的国家提供了完整且易于获取的公开数据。[@openaqLandscape2024]

所以「OpenAQ 上查不到」和「当地没有污染」是两件事。做跨国比较时，样本本身就是有偏的，缺失机制与污染水平相关。

## 七、八个容易踩的坑

**单位不统一。** PM2.5 和 PM10 通常用 µg/m³，CO、NO2、O3、SO2 常以 ppm 上报。两列数值接近不代表浓度接近，换算前先确认 `parameter` 与 `units`。

**传感器不是参考站。** 低成本传感器经过现场校准后，可以在部分场景给出可用的 PM 估计；但读数受湿度、温度、老化与安装位置影响，跨站点、跨季节的可比性需要单独验证，不能因为都叫 PM2.5 就混在一起。[@castellCanCommercialLowCost2017; @kumarRiseLowCost2015]

**缺测不是零。** 没有记录表示没有观测，不表示浓度为 0。日均值前先看 `percentComplete`，并在方法里写明如何处理低覆盖天数。

**原始值与聚合值不能混用。** 原始读数、小时均值、日均值是三个层级的量；把某天的原始小时值直接和另一站的日均值比较，会引入口径差。

**接近零的负值不要静默截断。** 仪器噪声可能让原始读数略小于零。直接改成 0 会改变分布和均值，是否截断、如何截断都应记录。

**AQI 不能跨系统比较。** 各国的污染物清单、分段浓度和计算方法不同，同一个数值在不同国家含义不同；AQI Hub 这类工具的存在，本身就说明指数并不通用。

**站点会变。** 改名、迁移、换设备都会改变序列含义。用 `datetimeFirst`/`datetimeLast`、`instruments` 和坐标核对连续性，不要假设一个 `location_id` 永远对应同一套观测。

**去重不能只靠名称。** 同一实体可能由不同 provider 上报，坐标相近也不一定是同一站；合并时保留 `location_id` 和 `sensor_id`，并记录合并规则。

## 八、研究使用清单

- 记录检索日期、API 版本、`location_id`、`sensor_id`、参数、单位、聚合层级和覆盖率阈值。
- 保存查询参数与原始响应或数据快照；平台数据会回补和修订，事后无法复原当时的序列。
- 分析时把官方监测（`isMonitor`）与传感器分开，分别报告样本量和结论。
- 引用时同时署名原始提供方与 OpenAQ；许可要求逐站点核对。
- 对覆盖率做敏感性分析：换一个阈值，结论是否改变。
- 不把「平台上没有」写成「当地没有监测」或「空气质量良好」。

## 九、证据边界

本页依据 2026 年 11 月可访问的 OpenAQ 官方站点与 API 文档整理。速率限制、许可条款、字段名称和收录标准都可能调整，动手前应回到 [docs.openaq.org](https://docs.openaq.org/) 核对当前版本。

文中覆盖数字来自 OpenAQ 十周年页面（2025 年 9 月口径），不是实时计数；本页没有独立审计任何站点的数据质量。关于低成本传感器性能的判断，引用的是评估研究的一般结论，不针对平台上某个具体设备。

## 参考文献
