# UTL 公开笔记来源与验收

核验日期：2026-10-19。交付页为 `content/Reading/urban-theory-lab.md`；当前发布状态统一维护于 `docs/knowledge-maintenance.md`。

## 来源与关键主张

| 主张 | 公开来源与定位 | 范围 |
| --- | --- | --- |
| 2012 年哈佛 GSD 创立，2020 年起迁至芝加哥大学，目前依托 CEGU | [UTL 官网](https://urbantheorylab.net/)，Background and Overview、Support | 不将哈佛写为现有依托；不把所有资助方视为共同管理机构 |
| CEGU 于 2022 年 6 月成立，属于社会科学学部的跨学科教学研究平台 | [CEGU About](https://cegu.uchicago.edu/about/)，机构介绍 | 直连有超时；检索返回的官方页面正文可核对日期、学部与教学项目 |
| 当前名单为芝加哥 11 人、外部伙伴 12 人，共 23 人 | [People](https://urbantheorylab.net/people/)，前两类名单 | 只计现有两类，不计 Former Research Affiliates 和 Alumni；不推定全职编制或博士指导关系 |
| 成员身份、所在机构与研究主题 | 正文两张表中的 23 个个人主页，姓名链接指向原始介绍 | 复用上一轮已逐人核对的材料，本次重新核对总目录及发生变化的人员主页 |
| Ghosh 当前为芝加哥大学博士后，已在哈佛完成博士研究 | [Ghosh 主页](https://urbantheorylab.net/people/swarnabh-ghosh/)，职务栏与人物介绍；当前总目录 | 上一轮聊天采用的哈佛博士候选人分类已过时，本页采用当前 11＋12 分类；旧邮箱不作为当前任职证据 |
| NTNU、INTERPRT 是 Climate Rights 的项目伙伴 | [Climate Rights](https://urbantheorylab.net/projects/climate-rights/)，项目团队与研究介绍 | 团队自述；不声称胜诉或法庭全部采纳证据 |
| FIU 与 UTL 合作沿海韧性项目 | [Remapping Resilience](https://urbantheorylab.net/projects/remapping-resilience-urban-ecological-infrastructures-of-climate-change-adaptation-in-southeastern-florida/)，项目介绍 | FIU 与成员 Wakefield 所在 FAU 区分 |
| Data-Spheres 的四领域、2021 装置、12 个初始数据集与后续 18 图层 | [项目页](https://urbantheorylab.net/projects/data-spheres-of-planetary-urbanization/)，首三段 | 项目记录；可视化不作为因果证明 |
| 化石能源合作项目与后续计划 | [Shatter Zone 项目](https://urbantheorylab.net/projects/capitalist-urbanization-fossil-energy-and-the-shatter-zone/)，研究介绍与末段 | 已发表作品、当前研究和未来计划分开表述 |
| Black Southland 社区档案工作 | [项目页](https://urbantheorylab.net/projects/archiving-black-southland/)，项目介绍 | 不复述无关人口排名或个人家庭信息 |
| 理论概念与书目入口 | 既有书目键 `brennerWhatCriticalUrbanTheory2009`、`brennerKatsikisOperationalLandscapes2020`、`brennerCityTerritoryPlanet2019` | 复用已经核实的正式记录，生成可见参考文献表；不宣称全书精读 |

行政职衔边界：Brenner 的 UTL 主页与部分 CEGU 页面对 CEGU 主席身份更新不同步；本页仅采用可核对的 UTL 主任与城市社会学教授身份，不另推定现任 CEGU 主席。

## 要求核对

| 要求 | 状态 | 依据 |
| --- | --- | --- |
| R1 中文公开笔记涵盖介绍、组织与成员 | done | 正文定义、关系表、11＋12 人员表及项目分析 |
| R2 关键事实与来源绑定 | done | 上表、正文逐人主页和项目链接、3 个正式文献引用键 |
| R3 保留时效、来源自述与分析边界 | done | 当前人数和职务重新核对；项目与因果、法律结论区分 |
| R4 记录所有接受要求与 R1–R5 | done | 本表及唯一维护入口 |
| R5 从聊天调研转成网站笔记的实质调整 | done | 更新 Ghosh 身份和两类人数；去除聊天指代，补双向内链与公开资料入口 |
| 双向关联书目导读及专题导航 | done | 生成 HTML 中新页与导读互链，阅读与哲学索引包含新入口 |
| 公开边界、行文、全量构建 | done | 新页、导读与哲学索引严格公开扫描无问题；新页中文教学行文检查通过；Node 22.16.0 下全量检查通过 |
| 限定提交、推送与线上发布 | done | 内容提交 `ec84dc435c071a6352292f0a078e5edb6923c8db` 已推送，匹配 Pages 部署 `39255242006` 成功；正式页、导读及两个索引返回 HTTP 200 |

## 检查依据

- `npm run check:content` 审计 173 个 Markdown 文件及 21 个资源，TypeScript 与 Quartz 全量构建通过，生成 784 个文件及 3 个旧路径跳转。
- 生成页中的三张表格、11＋12 条成员记录、3 条自动参考文献与引用锚点均已读取核对；Ghosh 仅出现在芝加哥博士后分类中。
- 公开内容严格扫描覆盖新页、导读与哲学索引，结果为 0 错误、0 警告；阅读索引仅新增一个已验证内部链接，其既有书目键含 `Foundations`，对应此前已人工核对的 `NDA` 子串假阳性，不修改无关书目。
- 中文教学行文检查通过，汉字计数 2532，无失败或提醒；这项模式检查不代替来源核验。
- 内容提交已登记既有每日推送队列并实际推送至 `origin/v5`；[匹配 Pages 部署](https://github.com/GIStudio/GIStudioNote/actions/runs/39255242006) 的 head SHA 与内容提交一致，结论为 success。
- [正式页](https://notes.gistudio.xyz/reading/urban-theory-lab)、[导读页](https://notes.gistudio.xyz/reading/city-territory-planet-critical-urban-theory)、[阅读索引](https://notes.gistudio.xyz/reading/)与[哲学索引](https://notes.gistudio.xyz/philosophy/)均返回 HTTP 200。核对范围限定在实际正文中，包括成员表 11＋12 行、三张表、3 条参考文献、Ghosh 博士后身份及页面互链，不只检查侧栏链接。
- 原有 `.gitignore`、`content/index.md` 与 `.zcodeignore` 三项改动保持原状，未进入本次提交。GitHub 推送回执另提示 5 项依赖安全告警（3 high、2 moderate），属于独立依赖维护事项，本次没有调整依赖或将其解释为内容构建失败。

停止条件：新页与书目导读互链、两个索引入口和三条参考文献生成正常；公开边界与全量构建检查通过；限定提交已推送、对应 Pages 部署成功，正式页面返回 HTTP 200 且成员人数、表格与互链可见。原有三项无关改动不进入提交。

停止条件已满足，本次无剩余发布缺口。
