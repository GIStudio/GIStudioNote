# Ontology Playground 与城市科学本体分析

日期：2026-11-01。接受范围为公开项目／知识资源解析、城市科学的本体论分析、站点关联及推送发布。明确排除用户个人研究方向与私人材料；不读取研究计划、私人知识库或历史课题。示例为虚构的旧校舍转公共图书馆。

## 交付与组织

- 工具页：`content/tools/ontology-playground.md`，来源文章场景，解释资源结构、操作思路与版本边界。
- 分析页：`content/Philosophy/urban-science-ontology.md`，概念笔记场景，解释城市对象、关系、制度、时间、边界、观测及教学模型。
- 关联工具索引、哲学索引与既有本体论页，不改原有二十篇专栏结构；Batty 正式期刊条目加入公共 `bibliography.bib`。

## 来源、定位与覆盖

| 来源 | 已读与支持范围 |
| --- | --- |
| [用户给定的冬奇实验室文章](https://home.wonlab.top/blog/open-source-projects/183-ontology-playground) | web 首次 502，直接只读 HTTP 200，提取 article 正文；用作发现入口。中文介绍中的嵌入参数、静态部署与自然语言能力按当前官方版本重核 |
| [官方仓库提交](https://github.com/microsoft/Ontology-Playground/commit/7bf7acb427424ce68f917fa26f484fb06ca42051) | GitHub API 确认当前 main 为该提交，日期 2026-10-22；固定快照，避免旧搜索缓存 |
| [README](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/README.md) | Preview、课程、目录、设计器、静态官方部署、MIT；不移植 star 数或旧版本性能／安全评测 |
| [queryEngine.ts](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/src/data/queryEngine.ts) | 完整只读源码：processQuery 为本地英语模板、关键词与预置回答，无 LLM／真实数据库访问 |
| [rdf-export-profiles.md](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/docs/rdf-export-profiles.md) | 完整源保留与视觉投影、源支持文档受限编辑、自建模型两种导出、关系可选、无关系 minCount、惰性规则、Turtle 不支持 |
| [embed-guide.md](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/docs/embed-guide.md) | 容器、data-catalogue-id、catalogue-base-url 与 /embed/ontology-embed.js；只读 HTTP 核验脚本200，博客/widget.js为404；未执行嵌入脚本 |
| [generation-connectors.md](https://github.com/microsoft/Ontology-Playground/blob/7bf7acb427424ce68f917fa26f484fb06ca42051/docs/generation-connectors.md) | 默认关闭、定义草稿与实例数据区别、受保护网关与人工审查，未部署服务 |
| [SEP Logic and Ontology](https://plato.stanford.edu/entries/logic-ontology/#Onto) | §3.1 哲学本体论含义与争论，不等同工程类图 |
| [SEP Social Institutions](https://plato.stanford.edu/entries/social-institutions/) | 导言及§1：组织、角色、规范、实践及不同制度理论。本文不宣称这些概念在所有理论中只有一种关系 |
| [OWL 2 Overview](https://www.w3.org/TR/owl2-overview/)、[Primer](https://www.w3.org/TR/owl2-primer/) | 形式词汇、类／属性／个体及开放世界语义；不把语法通过当作事实证成 |
| [SHACL](https://www.w3.org/TR/shacl/) | Abstract、Core cardinality：形状图与数据图、minCount/maxCount，用于指定完整性条件；未声称 Playground 执行这些规则 |
| [OECD cities/FUA](https://www.oecd.org/en/data/datasets/oecd-definition-of-cities-and-functional-urban-areas.html) | Defining cities and functional urban areas：人口密度、连续格网、工作通勤联系。指标分母后果为据此分析 |
| [CityGML 3.0](https://docs.ogc.org/is/20-010/20-010.html) | §7.6 Dynamizer、§7.13 Versioning 及城市对象语义模型；未称为覆盖社会制度的完整城市本体 |
| [SOSA/SSN](https://www.w3.org/TR/vocab-ssn/) | Abstract、§4.3、§4.6：观测、对象、属性、过程、结果、时间及单位关联 |
| [Batty 正式出版](https://www.sciencedirect.com/science/article/abs/pii/S0264275111001375)、[UCL 工作论文页](https://www.ucl.ac.uk/bartlett/publications/2011/nov/casa-working-paper-170) | 正式版为2012 Cities 29 Suppl.1 S9–S16、DOI 10.1016/j.cities.2011.11.008；2011为工作论文。使用出版记录及公开摘要的网络、互动、移动与形态总体论述，不写成全文精读 |

## 编辑及实施边界

- 两篇为新文章；八类教学模型、旧校舍情境及能力问题由本文综合，非项目内置城市本体或经实验验证的共识。
- 未生成或提交真实城市实例数据，不登录外部服务，不发 PR，不安装上游依赖，不调用 AI 网关；不启用外部嵌入脚本。
- 类、现实对象、用途、组织、事件和观测分别解释。形态／行政／功能范围按定义保留；概念、逻辑、数据条件和经验验证分别检查。
- 保留站点已有未提交文件；不重启先前暂停的依赖告警或 RL 附站任务。

## 要求与验收

| 要求 | 状态与证据 |
| --- | --- |
| 分析整理给定知识资源 | 已完成初稿及固定来源核验；官方与博客差异分别说明 |
| 城市科学本体分析 | 已完成概念解释、贯穿案例、对象／关系／时空／观测分析及八类教学模型 |
| 排除个人研究方向 | 仅使用本次公开材料和虚构公共设施情境；未读取私人研究资料 |
| source-brief R1–R4 / concept-note R1–R6 | 完成：两篇独立冷读及本地、线上检查。修订了本体承诺与认识论证据的区分、服务与活动的称谓，运营关系显式携带有效时段；来源、例子与模型范围分别说明 |
| source-brief R5 | 不适用：新文章；实际冷读修订已记录于上一项 |
| 推送发布 | 完成：内容提交 `7ae585153d820a6c0d36297dd911616b987a06e0` 已到远端 `v5`；匹配 [Pages 41281767281](https://github.com/GIStudio/GIStudioNote/actions/runs/41281767281) 成功；两篇正文、工具索引、哲学索引及本体论页共5个正式URL均HTTP 200，实际正文中的标题、独有内容、链接、4张表与1条自动参考文献已核对；达到停止条件 |

## 本地检查

- 五个涉及公开页面运行隐私扫描：0 错误、1 提醒。提醒来自 `Standards-oriented` 中 `NDA` 的词内误匹配，已核对为公开导出配置名称；无私人路径或研究内容。
- 两篇新文使用中文科普 profile 检查，无失败与提醒；程序只定位行文模式，不替代概念、事实或隐私审阅。
- Node 22.16.0 下 `npm run check:content` 通过：201 个 Markdown、45 个资源，过滤4个草稿，生成885个文件及3个兼容重定向。新文件未跟踪时的本地Git日期警告由正式提交后的CI构建处理。
- 生成工具页含1张表、14个外部链接；城市页含3张表、8个外部链接和1条自动生成的Batty论文条目（`bib-battybuildingsciencecities2012`），DOI与2012正式出版信息已核对。
- 三处导航／回链可见；嵌入代码仅在代码区显示，未加载或执行第三方嵌入脚本。`git diff --check` 通过。

## 线上交付

- [Ontology Playground 工具与知识资源解析](https://notes.gistudio.xyz/tools/ontology-playground)
- [用本体论分析城市科学](https://notes.gistudio.xyz/philosophy/urban-science-ontology)
- 工具目录、哲学目录和原本体论页的导航均核对到正文区域，而非仅检查侧栏出现链接。
- 保留原有 `.gitignore`、`content/index.md`、`.zcodeignore` 三项工作树改动，不纳入本任务提交。

## 交互图谱扩展（2026-11-01）

本阶段新增用户要求：用 Ontology Playground 制作城市科学教学模型的交互图，嵌入原分析文章并发布，继续排除个人研究方向。上文“未启用嵌入”的记录对应首轮文章交付；本阶段新增以下实现。

- 唯一模型源为 `content/assets/urban-ontology/model.json`：8 类、48 个类属性、10 种关系、6 个关系属性。仅含类型定义和枚举选项，无真实城市实例、数据绑定或私人材料。
- `viewer.htm` 使用官方 `/embed/ontology-embed.js`，固定 SHA-384 完整性校验；部件需从 Microsoft GitHub Pages 加载。上游脚本变化时，校验将阻止加载，须核对新版本后更新完整性值；文本说明与下载文件保持独立可读。
- 模型通过 `data-ontology-inline` 传入。该版本按 `JSON.parse(atob(...))` 解码，生成器先将非 ASCII 字符转为 JSON Unicode 转义，再 Base64，避免中文与 emoji 损坏。
- 官方 `shareCodec.ts` 核对完整模型分享链接；打开分享页后用 **Open Designer** 编辑。分享只包含本教学模型及空 `bindings`，未提交目录 PR 或连接账户。
- 独立嵌入页避免 Quartz SPA 导航时脚本不重新初始化。文章 iframe 允许脚本与用户打开新窗口，不授予同源权限；页内 CSP 限定脚本地址、内联启动脚本哈希并禁止连接接口，设置 `no-referrer`。这些是代码边界，未宣称完成动态安全认证。
- 官方 `serializer.ts` 生成 `model.rdf` 与 `model-standards.rdf`。后者含 OWL 和 SHACL 属性形状；关系属性由上游标准配置表达。未运行 OWL 推理或 SHACL 实例验证，不将文件可解析等同于城市模型已验证。
- 固定来源仍为 `7bf7acb427424ce68f917fa26f484fb06ca42051`。生成器核对四个上游模块的文件哈希，再复用其 schema、Designer 校验、分享解码器和序列化器；未安装或运行上游完整应用及其测试。
- 语义复核将两条证据边的显示名调整为“用途证据来源”和“事件证据来源”，与指向 `EvidenceRecord` 的箭头一致；保留用途／运营有效期、多个城市范围定义、建筑层级观测及证据不确定性。

### 更新方法

准备上述固定提交的官方源码，在仓库固定 Node 环境中运行：

```bash
node scripts/build_urban_ontology_embed.mjs --upstream /path/to/Ontology-Playground
node --test scripts/tests/urban_ontology_embed.test.mjs
npm run check:content
```

生成器会更新同目录 HTML、两种 RDF 与 manifest，模型变更只编辑 `model.json`。修改脚本来源、版本或完整性值时，重新核对官方部署部件与接口；不自动接受浮动版本。

### 本阶段核验

- 官方 schema、Designer 校验、官方分享解码及中文／emoji 内联往返通过；分享编码长度 4422 字符，低于官方 32000 限制。
- 定向测试覆盖类型／关系端点、编码、分享载荷、时间与证据、CSP／加载回退、生成文件及文章 iframe。界面按当前工作约定由用户手动检查，`manifest.json` 保留 `browserChecked: false`。
- 7 项定向测试通过；两种 RDF 均通过 XML 解析，标准配置生成 11 个 OWL 类（含 3 类关联对象）与 74 个 SHACL 属性形状，Playground 配置保留 8 个类和 10 个对象属性。
- 两篇正文中文科普检查无失败／提醒。公开扫描 4 个文件，0 错误、6 提醒，均为公开标识符中的 `NDA` 词内匹配或编码串误匹配；已按可解码的模型源核对。Node 22.16.0 下全量内容检查通过，201 个 Markdown、50 个资源，过滤 4 个草稿，输出 890 个文件及 3 个兼容重定向。
- 官方部件设置 `autoungrabify: true`，只读画布允许背景平移、缩放与点选，节点位置编辑在完整 Designer 中进行；已按此修正文案。嵌入模式的剪贴板功能受浏览器权限限制，文件入口可单独使用。
- 生成产物检查发现 Quartz 会在链接和资源输出时移除 `.html` 后缀；查看器改用可保留后缀的 `.htm` 静态 HTML，iframe 与独立窗口使用本站绝对 URL。下载链接加 `data-router-ignore`，让浏览器处理文件而非进入 Quartz SPA 导航。
- 内容提交 `cf27f8b7ff3c0f27d330642933a185450a1d2bf5` 已推送至 `origin/v5`，匹配 [Pages 41283400910](https://github.com/GIStudio/GIStudioNote/actions/runs/41283400910) 成功。两篇正式正文和 5 个静态文件共 7 个 URL 均返回 HTTP 200；文章 iframe 与下载入口已核对，查看器为 `text/html`，JSON 为 `application/json`，两种 RDF 为 `application/rdf+xml`，线上 5 个文件与本地版本逐字节一致。
- [嵌入图谱的分析文章](https://notes.gistudio.xyz/philosophy/urban-science-ontology) · [独立图谱页](https://notes.gistudio.xyz/assets/urban-ontology/viewer.htm)。代码与 HTTP 检查不等同于平移、缩放、点选等浏览器行为验收；未做该项验收，保留用户手动检查的边界。
