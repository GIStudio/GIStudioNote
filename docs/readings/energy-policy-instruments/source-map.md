# 能源政策工具笔记的来源与验收

核验日期：2026-10-20。交付页为 `content/Sustainability/energy-policy-instruments.md`；发布状态统一维护于 `docs/knowledge-maintenance.md`。

## 范围与读者

面向第一次接触能源政策分类的读者，解释 command-and-control policies 与 fiscal policies 的机制、实例、适用条件和区别。碳税、财政补贴与排放交易只展开到辨别工具所需的深度，不提供特定国家的税务或法律建议，不作总体效果排名。

## 来源地图

以下均为公开官方来源；只使用实际读取的章节或页面内容，不视为完整文献综述。

| 编号 | 来源与类型 | 实际读取位置及支持主张 | 边界 |
| --- | --- | --- | --- |
| S1 | [IPCC AR6 WGIII 第 13 章](https://www.ipcc.ch/report/ar6/wg3/chapter/chapter-13/)，2022，官方评估报告 | 表 13.1；13.6.4、13.6.4.1、13.6.4.2 的官方检索正文；经济、监管及其他工具分类，绩效与技术标准的区别 | 直连正文失败，已通过限定到同一官方页面的检索返回核读上述段落；未据此推定现行国家法规；command-and-control 在该章有偏狭义的技术标准用法 |
| S2 | [IMF Fiscal Policy: Taking and Giving Away](https://www.imf.org/en/publications/fandd/issues/series/back-to-basics/fiscal-policy)，2019-06-28，官方概念说明 | Overview、How fiscal policy works；政府税收与支出、财政与货币政策区别；作者 Mark Horton、Asmaa El-Ganainy | 只用于一般财政定义，不以宏观刺激材料证明具体能源补贴效果 |
| S3 | [IEA Energy Efficiency Policy Toolkit — Buildings](https://www.iea.org/reports/energy-efficiency-policy-toolkit/buildings)，当前页面引用年份 2026，官方工具说明 | Introduction、Regulation、Information、Incentives；建筑能效规范、最低能效要求、改造资助、退税与信息工具的组合 | 不复述页面的减排幅度或预测数字；绿色贷款等金融激励不自动等于财政支出 |
| S4 | [World Bank Pricing Carbon](https://www.worldbank.org/en/programs/pricing-carbon)，官方概念说明 | What Is Carbon Pricing，官方检索正文完整定义段；碳税预设价格、总量型 ETS 设定配额总量并形成市场价格 | 直连失败；只采用概念定义，页面旧覆盖率与国家数量不作为当前事实；不把所有 ETS 都说成绝对总量制 |
| S5 | [OECD PINE 数据库说明](https://www.oecd.org/en/data/datasets/policy-instruments-for-the-environment-pine-database.html)，官方数据库文档 | About；Environmentally-beneficial subsidies and payments；Tradable permits and offsets；税费、补贴、可交易许可不同工具及拍卖收入的例子 | 没有下载微观数据；不使用当前数据库数量或跨国绩效结论 |
| S6 | [IPCC AR6 WGIII Summary for Policymakers](https://www.ipcc.ch/report/ar6/wg3/chapter/summary-for-policymakers/)，2022，官方评估报告 | E.4.2 碳定价收入用于支持低收入家庭的分配安排，官方检索正文 | 仅支持政策设计的一般可能性，不保证任何组合必然公平或有效 |

## 主张与例子的对应

- 定义及非穷尽分类依据 S1、S2；建筑工具实例依据 S3。
- 碳税和总量型 ETS 的价格与数量区别依据 S4；收入与工具机制分开分析，结合 S5。
- “额外减排是否发生”“预算是否集中给原本就会投资的主体”等是由工具机制推导的评价问题，不冒充已完成的因果评估。
- 供暖改造算例为明确标注的教学设定：原排放 100 吨 CO₂/年，减排 20 吨/年，税率 50 元/吨 CO₂，年度化改造成本分别为 800 元/年和 1600 元/年。只比较改造成本与碳税，未计燃料节省等其他收益；不代表中国现行碳税或真实工程成本。
- 组合政策是解释用途的示意设计，引用 S3、S6 说明其一般依据，不写成实证最优方案。

## 要求核对

| 要求 | 状态 | 检查位置或待验条件 |
| --- | --- | --- |
| R1 对象与读者任务明确 | done | 首段和分类边界，主读者为政策分类入门者 |
| R2 例子可跟随且数字、单位完整 | done | 供暖改造案例；5000、4800、5600 元/年及增减额核算一致 |
| R3 重要主张可追溯 | done | 上述六项来源；5 条自动参考文献及 SPM E.4.2 官方直链 |
| R4 条件、替代工具及反例有意义 | done | 绩效与技术标准、成本变化反例、ETS、货币与金融激励边界 |
| R5 用户要求的两类工具均完整保留 | done | 两类独立解释、案例、对照表及组合政策 |
| R6 不重开来源也能理解与使用 | done | 定义、算例、比较与五项阅读政策的问题 |
| 公开边界、行文、全量构建 | done | 四页公开扫描无错误或警告；2624 汉字的教学行文检查通过；全量构建通过 |
| 限定提交、推送、部署及正式页 | done | 内容提交 `a503d3623a3e7b149e1bb999431bb601ee38bb2a` 已推送，匹配 Pages 工作流 `39386479677` 成功；四个正式页面 HTTP 200，正文与导航已核对 |

初始工作树中 `.gitignore`、`content/index.md` 和 `.zcodeignore` 属于本次任务之外的改动，保持原状。

## 本地检查

- Node 22.16.0 下 `npm run check:content` 通过，覆盖 174 个 Markdown 文件和 21 个资源；TypeScript 与 Quartz 全量构建通过，生成 789 个文件及 3 个旧路径跳转。
- 已读取实际生成 HTML：新页有 2 张表、5 条自动参考文献、13 处渲染后的引用及 SPM 官方链接，未残留未解析引用键；可持续发展、SDG 7 与 SDG 13 三页的正文入口均存在。
- 当前引用插件使用带 citation id 的文本 span；验证已按引用键匹配对应 bibliography id，不将其误报为可点击的引用跳转。SPM 使用官方直链，避免同年机构作者多条记录时正文与文末的消歧不一致。
- 供暖算例为生成的教学数据，已核对 100 × 50 = 5000，80 × 50 + 800 = 4800，80 × 50 + 1600 = 5600；没有进行真实政策效果估计。
- 公开扫描覆盖新页及三处导航，结果为 0 错误、0 警告；行文模式检查通过不等于因果证据核验。

## 发布核验

- 内容提交 `a503d3623a3e7b149e1bb999431bb601ee38bb2a` 已登记既有每日推送队列，并因本次明确的发布请求实际推送至 `origin/v5`；仓库默认分支仍为 `v5`。
- [匹配 Pages 工作流](https://github.com/GIStudio/GIStudioNote/actions/runs/39386479677) 的 head SHA 与上述提交一致，构建和部署均成功。
- [正式笔记](https://notes.gistudio.xyz/sustainability/energy-policy-instruments)返回 HTTP 200；实际 article 正文包含年度化成本、4800 与 5600 元算例、公共投入、总量型 ETS 的解释、2 张表、5 条自动参考文献、13 处渲染引用和 SPM 官方链接。
- [可持续发展](https://notes.gistudio.xyz/sustainability/)、[SDG 7](https://notes.gistudio.xyz/sustainability/sdg/sdg07-clean-energy/)和[SDG 13](https://notes.gistudio.xyz/sustainability/sdg/sdg13-climate-action/)均返回 HTTP 200，三页实际 article 中的新笔记链接已核对，不只检查侧栏。部署完成前的首次探测曾命中旧导航，完成后已复核通过。
- `.gitignore`、`content/index.md`、`.zcodeignore` 三项原有改动未进入内容提交。推送回执另提示仓库既有 5 项依赖安全告警（3 high、2 moderate）；本次未调整依赖，不将告警与已成功的内容检查混为一谈。

停止条件已满足，本次无剩余内容或发布缺口。
