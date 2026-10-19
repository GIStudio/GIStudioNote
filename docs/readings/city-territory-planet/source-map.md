# 《城市，地域，星球》书目导读依据

核验日期：2026-10-19。交付为公开书目导读，不是全书精读。唯一维护状态见 `docs/knowledge-maintenance.md`。

## 主张与来源

| 主张或用途 | 来源与定位 | 边界 |
| --- | --- | --- |
| 2019 年 10 月，第一版，248 页，ISBN 9787100165518 | [商务印书馆](https://www.cp.com.cn/book/dcdc6cae-6.html)，书目字段 | 零售转录的 2019-09、247 页与此不一致，以出版社为准 |
| 英文对应题名，中文文集与 New Urban Spaces 分列 | [作者出版物目录](https://urbantheorylab.net/publications/?author=neil-brenner)，2019 年两书记录 | 不推定存在同名独立英文原版或逐章对应版本 |
| 李志刚、徐江、曹康等译 | 出版社“译者简介”；[作者 2018 年履历](https://www.gsd.harvard.edu/wp-content/uploads/2018/08/0.-Brenner-CV-August-2018.pdf)，第 6 页书目条目 | 履历中的预定出版年不替代实际出版记录 |
| 两部分与主题阅读路线 | [零售目录转录](https://www.megbook.com.tw/mall/detail.jsp?proID=3432141)，“目录” | 仅用于目录定位；不以商品简介证明理论；阅读顺序由本页提出 |
| 作者当前身份与历史书介区别 | [芝加哥大学 2026 年官方新闻](https://news.uchicago.edu/story/four-uchicago-scholars-receive-2026-guggenheim-fellowships)，Neil Brenner 段 | 不将出版时期的哈佛身份写成现任职位 |
| 批判理论的四要素 | [Brenner 2009 作者页面](https://urbantheorylab.net/publications/what-is-critical-urban-theory/)，摘要 | 概念解释限于摘要可支持内容；住房例子是解释，不是论文实证结果 |
| 全球化包含地域组织的重构与尺度重组 | [Brenner 1999 正式出版页](https://journals.sagepub.com/doi/pdf/10.1080/0042098993466)，摘要与书目 | 不直接外推欧盟结论至所有国家 |
| 新自由主义化的差异性、制度实验、政策传播与规则框架 | [Brenner、Peck、Theodore 2010](https://onlinelibrary.wiley.com/doi/10.1111/j.1471-0374.2009.00277.x)，Abstract | 不把所有市场行为等同于新自由主义化 |
| 重新思考固定有界城市类型与认识框架 | [Brenner、Schmid 2015 作者页面](https://urbantheorylab.net/publications/towards-a-new-epistemology-of-the-urban/)，摘要 | 没有复述或声称读完七条命题的完整论证 |
| 城市与支撑城市生活的非城市地域关系 | [Brenner、Katsikis 2020](https://onlinelibrary.wiley.com/doi/10.1002/ad.2521)，摘要；[UTL 研究介绍](https://urbantheorylab.net/)，Background and Overview | 2020 论文是后续文献；Wiley 记录为 90(1)，不沿用 UTL 目录中 90(3) 的差异 |
| 对城市科学和 GeoAI 的三个研究设计问题 | 根据以上理论提出的延伸问题 | 不是书中结论，不承诺算法改进，不使用私人研究背景 |

## 要求核对

| 要求 | 状态 | 依据 |
| --- | --- | --- |
| R1 中文、自包含、面向城市研究读者的资料导读 | done | 正文含书目、概念解释与阅读路线，无固定字数要求 |
| R2 关键事实可定位，保留年份与出版版本 | done | 上表、6 个文内引用键及书目；实证外推保持边界 |
| R3 来源、解释、缺口与冲突保持区分 | done | 未获取全书正文；出版页数以出版社为准；后续论文和研究应用单独说明 |
| R4 接受要求与 R1–R5 均登记 | done | 本表；发布状态在唯一维护入口更新 |
| R5 实质修订披露 | n/a | 新建导读，非修订既有文章 |
| 推送与线上发布 | done | 内容提交 `ce098fcbfd52ecaed38d18b6dd4db57906667f39` 已推送，匹配部署 `39234568516` 成功；正式页与两个导航均返回 HTTP 200 |

## 已执行检查

- 新正文和哲学索引的公开内容严格扫描无错误、无警告。阅读索引的既有 citation key 中 `Foundations` 命中 `NDA` 子串，人工核对是书目名称假阳性，不修改无关条目。
- 中文教学行文检查通过，正文汉字计数 2112；检查器不替代事实核验。
- Node.js 22.16.0 下 `npm run check:content` 通过，审计 172 个 Markdown 文件和 21 个资源，生成 781 个文件及 3 个旧路径跳转。
- 生成 HTML 中标题、未逐章核读说明、书目表格、6 条引用和两个导航入口可见；译者采用“李志刚等”的简写，避免当前解析器把 BibTeX 的 `others` 当作真实人名输出。主要译者姓名仍保留在正文书目表中。
- 内容提交已登记每日推送队列并实际推送至 `origin/v5`；[对应 Pages 部署](https://github.com/GIStudio/GIStudioNote/actions/runs/39234568516) 的 commit 与内容提交一致，结论为 success。
- [正式页](https://notes.gistudio.xyz/reading/city-territory-planet-critical-urban-theory)、[阅读索引](https://notes.gistudio.xyz/reading/)及[哲学索引](https://notes.gistudio.xyz/philosophy/)返回 HTTP 200；标题、独有正文、书目表、译者简写、6 条参考文献及新增导航均已在线核对。
- 原有 `.gitignore`、`content/index.md` 和 `.zcodeignore` 三项改动保持原状，未进入本次内容提交。

停止条件：公开页、两个导航及六条书目通过检查，限定提交已推送，匹配 Pages 部署成功，正式页面返回 HTTP 200 且标题、正文和参考文献可见。未完成全书精读不属于本次资料导读的缺口补写授权。

停止条件已满足；本次无剩余资料整理或发布缺口。
