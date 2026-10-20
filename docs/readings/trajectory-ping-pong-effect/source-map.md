# 轨迹数据乒乓效应：来源与验收

核验日期：2026-10-20。交付页为 `content/Data/trajectory-ping-pong-effect.md`，当前发布状态维护在 `docs/knowledge-maintenance.md`。

## 范围与来源

概念笔记面向轨迹数据与城市出行分析入门者，聚焦手机网络小区振荡造成的虚假移动，同时区分 GPS 漂移和真实往返。不假定用户已经提供数据，不执行真实轨迹清洗，不提供可直接套用的通用阈值。

| 来源 | 类型与实际读取位置 | 用途及边界 |
| --- | --- | --- |
| Wang & Chen (2018), [正式记录](https://doi.org/10.1016/j.trc.2017.12.003)、[PMC 作者稿](https://pmc.ncbi.nlm.nih.gov/articles/PMC5789780/) | 原始研究；检索返回的作者稿 Introduction、3.1、4.3 及 Discussion 相关正文；出版方和 PubMed 核对书目 | 小区连接变化与地理移动区别、信号与负载因素、CDR 与 sightings 的采样边界、时间窗与序列处理。PMC 直连遇浏览器验证，Europe PMC 公共全文接口返回 500；不声称本轮直接读取了完整全文或全部实验 |
| Yin, Lin & Zhao (2021), [正式记录](https://doi.org/10.1016/j.cities.2020.103013)、[PMC 作者稿](https://pmc.ncbi.nlm.nih.gov/articles/PMC7809620/) | 原始研究；检索返回的 2.1、3.2、4.2 正文及出版方书目 | Cell-ID 是位置代理，振荡与孤立漂移的区别、时间窗规则、参数依赖数据分辨率和研究目的；不将论文的具体空间阈值推广为通用值 |
| Zhao et al. (2026), [出版方](https://www.sciencedirect.com/science/article/pii/S2214367X26001195)、[DOI](https://doi.org/10.1016/j.tbs.2026.101350) | 原始研究；实际读取出版方检索返回的摘要与 Introduction，Crossref 官方 DOI 元数据核对六名作者、2026 年 10 月、卷 45 和文章号 101350 | 低频采样下速度规则的局限。未核读方法与结果全文，不报告检出率或声称其方法全面优于旧方法；作者采用 Crossref 和正式 DOI 记录，不采用第三方作者推荐列表 |
| [GPS.gov — GPS Accuracy](https://www.gps.gov/gps-accuracy) | 官方文档；GPS Accuracy FAQs 中 Why Does GPS Sometimes Show Me in the Wrong Place 段 | 遮挡与建筑反射的多路径误差，仅用于区分 GPS 定位误差和小区连接振荡；不复述设备精度数字或旧频段状态 |
| [Ericsson — Leveraging LTE and 5G NR networks for fixed wireless access](https://www.ericsson.com/en/reports-and-papers/ericsson-technology-review/articles/leveraging-lte-and-5g-nr-networks-for-fixed-wireless-access) | 官方工程说明；检索返回的三扇区站址部署段 | 补充小区与物理站址不可简单等同的例子，不推断用户数据中的具体网络结构 |

## 教学内容与推断

- A、B 两小区代表坐标相距 600 米，09:00 至 09:02 每 30 秒交替一次，共 5 条记录，是明确标注的教学设定；人的真实位置在这个设定中保持不变。
- 朴素连线距离为 4 × 600 = 2400 米，首尾位移为 0；每段表观速度为 0.6 ÷ (30/3600) = 72 km/h；记录间隔改为 10 分钟时为 0.6 ÷ (10/60) = 3.6 km/h。这些是算例，不是实测结果。
- 假出行、停留分裂及跨区 OD 的影响是从算例和处理流程推导的条件性后果；不报告未运行的真实数据偏差比例。
- 真实短途折返、基站坐标不等于设备位置、同一交通分区内切换等反例用于检验解释，不将“看起来合理”当作真值。
- 处理建议是对上述方法机制的概括与应用判断，不是论文算法的逐项实现或新算法性能结论。

## 要求核对

| 要求 | 状态 | 验收依据 |
| --- | --- | --- |
| R1 对象与读者任务明确 | done | 首段定义与手机网络数据范围，区分观测与真实移动 |
| R2 例子可检查、单位与计算完整 | done | 5 条教学记录，2400 米、72 km/h 与 3.6 km/h 计算通过 |
| R3 重要事实可追溯 | done | 五项来源，3 条自动参考文献、6 处渲染引用、两个官方说明链接 |
| R4 边界与替代处理有意义 | done | 真实往返反例、GPS 区别、序列与停留方法比较及阈值局限 |
| R5 保留解释和发布两项请求 | done | 自包含公开页已完成并发布，正式正文与两处导航在线核对通过 |
| R6 能独立理解并用于判断 | done | 定义、原因、影响、处理及核对问题均可脱离来源阅读 |
| 公开边界、行文、构建与生成页 | done | 三页公开扫描及新页教学行文检查通过；新页、数据索引及四阶段模型生成页已核对 |
| 限定提交、推送、部署与正式 URL | done | 内容提交 `dc1799f35a56f25288bc63417a55b801583b3ab3` 已推送；匹配工作流 `39413346059` 成功，三个正式页面返回 HTTP 200 |

原有 `.gitignore`、`content/index.md` 与 `.zcodeignore` 三项无关改动保持原状。

## 本地检查

- Node 22.16.0 下 `npm run check:content` 通过：175 个 Markdown 文件及 21 个资源通过审计，TypeScript 与 Quartz 全量构建成功，生成 794 个文件及 3 个旧路径跳转。
- 新页、数据索引与四阶段模型通过严格公开扫描，0 错误、0 警告；新页中文教学行文检查通过，1812 汉字，无失败或提醒。检查器不验证事实或算法效果。
- 已解析生成的 article 正文：2 张表，首表 5 条教学记录；1 个展示公式且没有 KaTeX 错误；3 条作者、年份和 DOI 正确的参考文献；6 处渲染引用，没有残留引用键；GPS.gov 和 Ericsson 官方链接存在。
- 数据索引及四阶段模型的实际 article 中均有新页入口；新页回链四阶段模型及 TAZ。
- 算术核对为 4 × 600 = 2400 米，0.6 ÷ (30/3600) = 72 km/h，0.6 ÷ (10/60) = 3.6 km/h；没有把教学数据当作实测，未运行真实清洗或比较算法检出率。

## 发布核验

- 内容提交 `dc1799f35a56f25288bc63417a55b801583b3ab3` 已登记既有每日推送队列，并按本次发布请求实际推送至 `origin/v5`。
- [匹配 Pages 工作流](https://github.com/GIStudio/GIStudioNote/actions/runs/39413346059) 的 head SHA 与内容提交一致，构建及部署均成功。
- [正式笔记](https://notes.gistudio.xyz/data/trajectory-ping-pong-effect)返回 HTTP 200；title 与实际 article 中的教学设定、2400 米、72 km/h、3.6 km/h、真实折返和 GPS 漂移均已核对。正文包含 2 张表、1 个展示公式、3 条自动参考文献、6 处引用且没有 KaTeX 错误或残留引用键。
- [数据索引](https://notes.gistudio.xyz/data/)和[四阶段模型](https://notes.gistudio.xyz/data/four-step-model)返回 HTTP 200，两个实际 article 中的新页入口可见；新页对四阶段模型和 TAZ 的回链、GPS.gov 与 Ericsson 的官方链接均存在。
- 原有 `.gitignore`、`content/index.md`、`.zcodeignore` 三项改动未进入内容提交。推送仍提示仓库既有 5 项依赖安全告警（3 high、2 moderate），本次没有改变依赖，也未将其解释为内容检查失败。

本次解释与发布要求均已满足，无剩余内容或部署缺口。
