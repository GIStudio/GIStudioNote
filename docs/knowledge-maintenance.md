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
- [blocked] 核实 Gander 的 arXiv Trackback 提交状态（原因：单篇客户端提交先遇到连接超时，随后一次系统 HTTP 请求没有返回可验证的响应；为避免重复提交，未继续重试；解阻条件：arXiv 返回明确客户端响应，或 Trackback 记录页出现该条目；下一动作：先检查 `/tb/2609.08977`，确认需要重试后使用单篇筛选参数）
- [plan] 定期复查时效性内容（触发：季度维护或上游更新；下一动作：运行内容审计并检查 `verified_at`）

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
