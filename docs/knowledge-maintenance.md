# GIStudio Notes 知识维护规范

## 当前状态

- [done] 元数据、内部链接与 Quartz 构建基线（证据：`npm run check:content` 通过；2026-07-29）
- [done] Awesome Autonomous GeoAI 已拆分并发布（证据：commit `e2b185b`）
- [done] 全站知识架构复核（证据：2026-08-27 审计覆盖 120 个公开页面，孤立页、导航缺口、重复候选和未连接关系候选均为 0；人工决策见 `docs/knowledge-architecture/review.md`）
- [done] arXiv 科学链接与 Trackback 双链接规范（证据：公开页面已改为 `/abs/<id>` + `/tb/<id>`，Pages workflow `34314222372` 发布通过；提交工具继续 POST `/trackback/<id>`；2026-09-09 线上抽检无客户端接口残留，且未重复提交此前 16 条记录）
- [done] 发布并修订降维可视化方法笔记（范围：PCA、t-SNE、UMAP 与 PaCMAP；证据：载荷、主成分方向和样本得分已经区分，PCA 的线性投影边界已经展开；8 条论文记录通过 citation key 自动生成 References，4 个官方文档单独列出；131 个 Markdown 文件审计及 Quartz 5 全量构建通过；Pages workflow `34336834059` 成功；2026-09-09 线上抽检确认参考文献表、论文链接与 KaTeX 公式可见）
- [done] 发布 Riemannian Metric Matching 结构化精读（范围：条件 CDC、低秩实现、实验边界、与降维方法的关系及 arXiv v1 符号校读；证据：公开内容审计与中文学术行文检查无问题，132 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；Pages workflow `34489559830` 成功；2026-09-10 线上抽检返回 HTTP 200，标题、KaTeX 公式、arXiv 双链接与自动生成的 References 可见；针对 arXiv:2606.14334 的单篇 Trackback 提交返回错误码 0，已进入 arXiv 审核流程，不等同于已公开展示）
- [done] 完成 Scaling Monosemanticity 本地结构化解读（范围：稀疏自编码器目标、规模实验、特征验证、行为干预、方法比较与未解决问题；证据：公开内容严格审计和中文学术行文检查无问题，133 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建，生成页包含 KaTeX、4 条自动参考文献及 arXiv 双链接；2026-09-12；本次请求未包含发布，未推送）
- [done] 发布 XPlant 1.0 项目解析（范围：Rhino 中的 Grasshopper 组件插件定位、61 个组件分类、参数化种植流程、GIS 与 HEC-RAS 分工、邻近工具及当前开发状态；证据：公开内容严格审计和中文学术行文检查无问题，133 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；内容提交 `33e2f3a`，Pages workflow `34759117217` 成功；2026-09-13 线上抽检返回 HTTP 200，标题、“61 个组件”和 Grasshopper 平台关系可见）
- [done] 新增“每周推书”入口与首期《场景》选读推荐（范围：书目核验、阅读理由、核心问题、阅读路线和空间决定论提醒；证据：新增页通过公开内容严格审计与中文公共行文检查，135 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；2026-09-13；本次请求未包含发布，未推送）
- [done] 发布 Gander 全模态交互智能体技术解读（范围：小脑与大脑的分层架构、一秒流式 chunk、交互数据、8% 抢话率的准确含义、任务准确率和音视频理解回退；证据：公开内容严格审计与中文学术行文检查无问题，134 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；内容提交 `a79db4c`，Pages workflow `34811625788` 成功；2026-09-14 线上抽检返回 HTTP 200，标题、指标解释、数据集尚未开放说明、arXiv 双链接与自动参考文献可见）
- [done] 发布 Agentero 开源论文阅读工作台调研（范围：本地 Vault 与 Catalog、PDF 和视觉批注、ACP 与 MCP 分工、Zotero Connector、遥测、同类工具比较及安全试用方案；证据：已删除个人工作流、私人路径和内部研究信息，公开内容严格审计与中文学术行文检查均无问题，135 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；内容提交 `9fd4707`，Pages workflow `34815188639` 成功；2026-09-14 线上抽检返回 HTTP 200，标题、“本地优先具体意味着什么”和安全试用方案可见）
- [done] 发布 BenchCAD 参数化 CAD 基准解读（范围：17,900 个可执行零件程序、四类任务、体素 IoU 与编辑归一化指标、论文结果、当前评分器差异、公开真值风险及模型代码执行安全；证据：依据 arXiv v2 全文、官方网站、数据集及代码提交 `52087ef4b08811c21c09b8b16d0ae36c70844865` 核验，公开内容严格审计与中文学术行文检查均无问题，136 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；内容提交 `7938d81`，Pages workflow `34822403870` 成功；2026-09-14 线上抽检返回 HTTP 200，标题、公式、参考文献与 Trackback 双链接可见，单篇 Trackback 已提交 arXiv 审核）
- [done] 发布 Windows Developer Config 项目解读（范围：整机配置、WSL Comfort、单语言 Workload、WinGet 与 DSC 机制、签名链、CI 覆盖及破坏性卸载边界；证据：依据 Microsoft 仓库提交 `06200f0819136c528e09533e3c8afac7e5f46ed7`、夜间 CI `36391406880` 与 Microsoft Learn 文档核验，公开内容扫描无错误且命名假阳性经人工复核，技术行文检查通过，141 个 Markdown 文件与 15 个资源通过 Quartz 5 全量构建；内容提交 `7b04892`，Pages workflow `36508219410` 成功；2026-09-29 线上抽检返回 HTTP 200，标题、源码快照与“幂等不等于无风险”段落可见）
- [done] 整理“端到端”共享术语页（范围：AI、加密、测试与业务流程中的两端、责任边界和常见误解；证据：公开内容严格审计与中文技术行文检查无问题，142 个 Markdown 文件与 15 个资源通过 Node 22.16.0 下的 Quartz 5 全量构建，生成页标题、术语表回链与外部来源链接可见；2026-09-29；本次请求未包含发布，未推送）
- [blocked] 核实 Gander 的 arXiv Trackback 提交状态（原因：单篇客户端提交先遇到连接超时，随后一次系统 HTTP 请求没有返回可验证的响应；为避免重复提交，未继续重试；解阻条件：arXiv 返回明确客户端响应，或 Trackback 记录页出现该条目；下一动作：先检查 `/tb/2609.08977`，确认需要重试后使用单篇筛选参数）
- [plan] 定期复查时效性内容（触发：季度维护或上游更新；下一动作：运行内容审计并检查 `verified_at`）

## NSFC 科研基金专题

- [done] 发布 `/nsfc/` 科研基金专题（2026-10-08；范围：专题首页、基金入门、申请流程、博士训练、选题和申请书写作，共六页；政策依据为 2026 年基金委指南、问答、管理办法及高校试点通知，训练建议与官方要求分别表述；证据：公开内容扫描无错误，英文 Foundation 命中 NDA 子串的名称假阳性已人工排除；六页中文教学行文检查通过，161 个 Markdown 文件与 15 个资源通过 Node 22.16.0 下的 Quartz 5 全量检查；内容提交 `9059560` 已推送至 `origin/v5`，对应 Pages workflow `37722954701` 成功；六个正式页面与站点首页、写作索引均返回 HTTP 200，标题、独有正文、首页三列表格及五个专题链接已在线核对；仓库原有 `.gitignore` 和站点首页引言改动保持未提交）

## Harness² 论文解读

- [done] 发布 Harness² 深度解读与 RSI 比较（2026-10-19；依据 arXiv `2610.14224v1` 全文 37 页、官方项目主页及源码提交 `1cfe254e8d25b15f37048c3730134686abe60335`；分析与核验见 `docs/readings/harness2-2026-evidence.md`；公开内容严格扫描与中文教学行文检查通过，171 个 Markdown 文件和 21 个资源通过 Quartz 5 全量检查；内容提交 `4b73453` 已推送至 `origin/v5`，对应 Pages workflow `39228480249` 成功；正式页面 `/ai/llm/harness2-recursive-agent-harnessing-and-rsi` 与 LLM 索引返回 HTTP 200，标题、正文、4 条自动参考文献、4 组 arXiv 双链接、2 个展示公式和 4 张表已在线核对；没有重跑基准或提交通知到 arXiv，原有三项工作树改动保持原状）

## 《城市，地域，星球》书目导读

- [done] 发布《城市，地域，星球》导读（2026-10-19；范围：正式书目核验、批判城市理论、尺度重组、新自由主义化、星球城市化和阅读路线；接入阅读与哲学专题导航；来源与冲突处理见 `docs/readings/city-territory-planet/source-map.md`；正文明确未逐章核读全书，研究应用与来源主张分别表述；公开内容扫描与中文教学行文检查通过，阅读索引既有书目名称的扫描假阳性经人工复核，172 个 Markdown 文件和 21 个资源通过全量构建；内容提交 `ce098fc` 已推送至 `origin/v5`，匹配 Pages workflow `39234568516` 成功；正式页面 `/reading/city-territory-planet-critical-urban-theory` 与两个专题索引均返回 HTTP 200，标题、正文、书目表、6 条自动参考文献及导航已在线核对；原有三项工作树改动保持原状）

## UTL 实验室介绍

- [done] 发布 UTL 实验室介绍（2026-10-19；范围：实验室定位、组织关系、11 位芝加哥大学研究人员与 12 位外部研究伙伴、代表项目和学习入口；已按当前官网将 Swarnabh Ghosh 更新为芝加哥博士后，来源与时效边界见 `docs/readings/urban-theory-lab/source-map.md`；公开边界与中文教学行文检查通过，173 个 Markdown 文件和 21 个资源通过 Node 22.16.0 下的全量构建；内容提交 `ec84dc4` 已推送至 `origin/v5`，匹配 Pages workflow `39255242006` 成功；正式页 `/reading/urban-theory-lab`、书目导读及阅读与哲学索引均返回 HTTP 200，实际正文中的三张表、23 位成员、Ghosh 博士后身份、3 条参考文献与双向链接已在线核对；原有三项无关工作树改动保持原状）

## 能源政策工具概念笔记

- [done] 发布命令与控制政策、财政政策的概念比较（2026-10-20；范围：标准类型、碳税、补贴、教学算例、排放交易边界及政策组合；交付页 `content/Sustainability/energy-policy-instruments.md`，关联可持续发展、SDG 7 与 SDG 13；六项官方来源与验收表见 `docs/readings/energy-policy-instruments/source-map.md`；四页公开边界扫描与新页中文教学行文检查通过，174 个 Markdown 文件和 21 个资源通过全量检查；内容提交 `a503d36` 已推送至 `origin/v5`，匹配 Pages 工作流 `39386479677` 成功；正式笔记及三处索引均返回 HTTP 200，实际正文中的 2 张表、5 条自动参考文献、13 处引用、SPM 官方链接与三处导航已在线核对；原有三项无关工作树改动保持原状）

## 轨迹数据乒乓效应

- [done] 发布轨迹数据的乒乓效应概念笔记（2026-10-20；范围：小区振荡、教学算例、表观速度、城市出行指标影响、真实往返与 GPS 漂移边界、识别和清洗；交付页 `content/Data/trajectory-ping-pong-effect.md`，关联数据索引与四阶段模型；五项来源及验收见 `docs/readings/trajectory-ping-pong-effect/source-map.md`；三页公开边界与新页中文教学行文检查通过，175 个 Markdown 文件和 21 个资源通过全量检查；内容提交 `dc1799f` 已推送，匹配 Pages 工作流 `39413346059` 成功；正式页、数据索引及四阶段模型均返回 HTTP 200，实际正文中的教学算例、2 张表、1 个展示公式、3 条自动参考文献、6 处引用及导航互链已在线核对；原有三项无关改动保持原状）

## SGNS 与词向量专题

- [done] 发布 7 页词向量专题（2026-10-22；范围：阅读导航、SGNS、负采样与 NCE、PMI 与矩阵分解、GloVe、fastText、图随机游走嵌入；接入 DL、Graph 与 LLM 索引；10 篇原始论文与验收见 `docs/readings/sgns-and-embeddings/source-map.md`；公开边界、中文教学行文、数值计算和桌面抽检通过，182 个 Markdown 与 21 个资源通过全量检查；内容提交 `e478b03` 已推送，匹配 Pages 工作流 `39707312881` 成功；7 个新页及 3 个索引均返回 HTTP 200，实际正文中的 13 条自动文献条目、22 处引用、9 张表、19 个展示公式、CPC 双链接与专题导航已在线核对；原有三项无关改动保持原状）

## Transformer 位置编码

- [done] 发布 Transformer 位置编码笔记（2026-10-22；范围：置换等变、正余弦与可学习绝对编码、Shaw、T5、ALiBi、RoPE、注入流程及外推边界；8 篇论文及官方实现的来源、数值检查与验收见 `docs/readings/transformer-positional-encoding/source-map.md`；公开、中文、数学、生成 HTML 与桌面抽检通过，183 个 Markdown 与 21 个资源通过全量检查；内容提交 `c2b1d60` 已推送，匹配 Pages 工作流 `39740661751` 成功；正式正文、LLM 索引及词向量专题均返回 HTTP 200，实际正文中的 8 条自动参考文献、10 处引用、3 张表、11 个展示公式、两组 arXiv 双链接与专题互链已在线核对；此前待同步的 SGNS 验收记录 `5e1bd40` 已同步，原有三项无关改动保持原状）

## Slurm 资源与作业管理

- [done] 发布 Slurm 渐进学习笔记（2026-10-23；范围：架构、分配与执行、CPU 资源形状、批处理、交互式作业、排队排错、GPU 与数组；来源与验收见 `docs/readings/slurm-workload-manager/source-map.md`；公开边界、中文行文、7 个 Bash 区块语法及本地 Python 算例核对通过，184 个 Markdown 与 21 个资源通过 Node 22.16.0 下的全量检查；内容提交 `0c0bd9b` 已推送，匹配 Pages 工作流 `39887373523` 成功；正文及开发索引均返回 HTTP 200，实际标题、13 条文献、15 处引用、4 张表、8 个代码区块与导航已在线核对；不访问私人集群或提交真实作业，原有三项无关改动保留）

## 公开页面的最小元数据

每个 `content/` 下的公开 Markdown 页面必须包含：

```yaml
---
title: 页面标题
description: 一句话说明页面解决什么问题
tags:
  - 主题标签
  - 内容类型标签
---
```

约束：

- `title`、`description`、`tags` 必填。
- 标签保持 2–8 个；技术缩写使用 `AI`、`GeoAI`、`GIS`、`LLM`、`RL`、`NER`、`NVM`。
- `draft: true` 仅用于不应发布的页面；不写冗余的 `draft: false`。
- 页面改名或合并时，用 `aliases` 保留旧路径。
- 单一外部来源可写 `source`；仓库快照同时写 `source_commit`。
- 多来源知识综合可写 `verified_at`，正文中仍需列出实际来源。
- 不手工维护 `created` 或 `modified`；Quartz 从 Git 历史生成。

## 内容边界

- 外部事实与个人判断必须可区分。
- 论文、项目和版本信息优先链接论文页、官方文档或官方仓库。
- 预印本应明确标记为预印本，不写成已同行评审结论。
- 尚未创建的概念页使用普通文本或明确的待扩展清单，不制造幽灵 wikilink。
- 重复页面合并到一个权威页面，旧路径通过 alias 继续可访问。

## arXiv 双链接与 Trackback

可见正文中的 arXiv 论文必须同时承担科学引用和 Trackback 状态查询两个职责。论文标题或编号首先链接到 `https://arxiv.org/abs/<id>`；紧接其后，再提供可在普通浏览器中打开的 `https://arxiv.org/tb/<id>`，例如：

```markdown
[论文标题](https://arxiv.org/abs/2604.19747) · [Trackback 记录](https://arxiv.org/tb/2604.19747)
```

正式出版版本存在时，DOI 或出版方页面仍是主要出版记录；arXiv 摘要页用于标明预印本版本。`/tb/<id>` 是读者可访问的 Trackback 记录页，不能替代 citation key、DOI 或摘要页。`/trackback/<id>` 则是 Trackback 客户端的 POST 提交接口，不支持普通浏览器访问，也不得写成公开 Markdown 链接。arXiv 只对 `/abs/<id>` 提供自动发现，并会审核 Trackback 后再决定是否公开显示；具体限制见 [arXiv Trackbacks 官方说明](https://info.arxiv.org/help/trackback.html)。

Trackback 必须在相关页面已经公开上线后提交。完整构建会生成可发送目标；默认命令只列出目标，不产生外部写入：

```bash
npm run trackback:arxiv
npm run trackback:arxiv -- --send
```

第二条命令会先确认正式站点仍包含对应的科学链接和 Trackback 记录页链接，再向 `/trackback/<id>` POST 提交。成功响应只表示进入 arXiv 的审核流程，不表示 Trackback 已经公开显示；不要因未立即显示而重复提交。

新页面只提交对应的单篇记录，避免重复发送其他已处理条目：

```bash
npm run trackback:arxiv -- --arxiv-id ARXIV_ID
npm run trackback:arxiv -- --send --arxiv-id ARXIV_ID
```

第一条命令应只列出预期页面与编号。编号不存在或页面未形成双链接时，命令会退出并阻止发送。

## 维护命令

```bash
source ~/.nvm/nvm.sh
nvm use
npm run audit:content
npm run audit:knowledge -- --write
npm run check:content
npm run trackback:arxiv
```

`audit:content` 检查元数据、标签、空正文、重复路径和内部链接。`check:content`
在审计后运行 TypeScript 检查和 Quartz 全量构建。`trackback:arxiv` 默认只从生成页面列出成对出现的 arXiv 科学链接与 Trackback 记录页链接。

`audit:knowledge` 生成页面清单，并把孤立页、索引缺口、疑似重叠、未显式关联和词典候选写入 `docs/knowledge-architecture/`。这些结果用于人工复核，不能直接授权移动、合并或删除页面。

## 状态流转

- `[plan] -> [doing] -> [done]`
- `[plan] -> [blocked] -> [doing]`
- `[plan] -> [drop]`

同时最多维护三个 `[doing]` 项；每个阻塞项必须写清解阻条件。
