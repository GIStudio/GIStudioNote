---
title: Agentero 如何把论文阅读变成 Agent 工作流
description: 解析开源论文工作台 Agentero 的本地 Vault、PDF 批注、ACP Agent、MCP 接口和 Zotero 兼容方式，并说明它适合哪些研究工作流。
type: project
status: active
source_count: 9
source_paths:
  - https://github.com/poco-ai/Agentero
  - https://github.com/poco-ai/Agentero/releases
  - https://docs.agentero.app/
  - https://docs.agentero.app/architecture/
  - https://docs.agentero.app/usage/read-and-organize/
  - https://docs.agentero.app/usage/agents/
  - https://docs.agentero.app/backend/mcp/
  - https://docs.agentero.app/usage/zotero/
  - https://docs.agentero.app/backend/telemetry/
tags:
  - AI
  - Agent
  - 文献管理
  - 论文阅读
  - 开源工具
  - Zotero
source: https://github.com/poco-ai/Agentero
verified_at: 2026-09-14
---

# Agentero 如何把论文阅读变成 Agent 工作流

[Agentero](https://github.com/poco-ai/Agentero) 是一个本地优先的开源科研工作台。它把论文导入、PDF 阅读、区域批注、Markdown 笔记和外部 AI Agent 放进同一个桌面应用。项目采用 MIT License，当前面向 macOS、Windows 和 Linux 发布安装包。

它所处理的问题来自科研资料的分散。论文及高亮可能保存在文献管理器中，长期笔记位于另一个知识库，AI 问答又留在独立的聊天记录里。Agentero 将这些内容组织成 Agent 可以读取和修改的本地工作目录，让一次阅读中的选区、提问和整理结果继续成为后续任务的上下文。

## 从一篇论文进入工作流

研究者可以通过 DOI、arXiv、标题搜索或 Zotero Connector 导入论文。Agentero 把 PDF、可读正文、笔记和批注放入同一个论文目录，并把结构化元数据写入本地 Catalog。打开论文后，工作区默认并排显示 PDF 和 `NOTES.md`。

阅读过程可以按下面的顺序进行。

```text
论文链接或标识符
        ↓
导入 PDF、正文和元数据
        ↓
并排阅读 PDF 与 NOTES.md
        ↓
高亮、视觉批注、翻译或提问
        ↓
把论文、选区和文件交给 Agent
        ↓
Agent 执行精读 Skill 并写回笔记
```

PDF 阅读器支持页码跳转、缩放、大纲和全文查找。文本选区可以转为高亮、翻译请求或 Agent 上下文。插图、表格、算法和公式还可以通过矩形区域建立视觉批注，裁剪图和批注记录保存在论文目录的 `marks/` 中。标注不会直接修改原始 PDF，也不会自动进入 `NOTES.md`。用户需要明确选择哪些材料进入笔记或对话。[阅读、标注与整理](https://docs.agentero.app/usage/read-and-organize/)

## 文件和数据库共同保存研究状态

Agentero 使用 Tauri 2 构建桌面外壳，前端采用 React 19 和 TypeScript，本地主机由 Rust 实现。应用的数据层包含普通文件和 SQLite Catalog。[架构总览](https://docs.agentero.app/architecture/)

| 数据 | 保存位置 | 作用 |
|---|---|---|
| PDF、TeX、Markdown、附件 | Vault 目录 | 保存可以由外部工具读取的研究材料 |
| `NOTES.md` | 单篇论文目录 | 保存摘要、精读和人工笔记 |
| 高亮与视觉批注 | `marks/` | 保存文本位置、区域截图和批注内容 |
| 论文元数据与阅读状态 | `.agentero/catalog.sqlite` | 支撑 Library、标签、筛选和状态管理 |
| 应用设置与使用记录 | 系统配置目录 | 保存界面、Agent 偏好和本机活动记录 |

这种混合结构提高了笔记和附件的可移植性，同时保留了结构化文献库的查询能力。备份时需要保存整个 Vault，包括 `.agentero/catalog.sqlite`。只复制 Markdown 会丢失部分论文元数据、标签和阅读状态。

## ACP 让 Agent 进入当前 Vault

Agentero 使用 BYOA，也就是 Bring Your Own Agent。用户自行安装和登录 Codex、Claude、Gemini、Kimi Code 或其他兼容 Agent，Agentero 负责提供论文上下文、会话界面和权限控制，不在应用设置中托管这些模型的 API Key。[接入 Agent](https://docs.agentero.app/usage/agents/)

应用内 Agent 通过 Agent Client Protocol，也就是 ACP 接入。Agent 会以当前 Vault 为工作目录，可以读取当前论文、被提及的文件和显式加入的选区。后续消息在任务执行期间进入等待队列，当前回复结束后再发送。文件和工具权限提供三种模式。

| 权限模式 | 行为 |
|---|---|
| `restricted` | 默认限制可能修改系统或文件的操作 |
| `ask` | 遇到相关操作时请求用户确认 |
| `auto` | 自动批准 Agent 请求的操作 |

内置 `paper-reader` Skill 可以生成论文精读并写入 `NOTES.md`。自动精读默认关闭；开启后，论文资源准备完成且尚未标记为已读时，系统可以自动启动任务。这个能力把“阅读结束”变成可执行的文件更新，因此应配合受限权限、版本控制和写入审查使用。

## MCP 将论文库开放给外部客户端

Agentero 还内置 Streamable HTTP MCP Server。打开设置开关后，它通过只绑定本机回环地址的默认端口提供论文元数据查询、论文导入和 `NOTES.md` 写入等工具。ChatGPT、Codex 或 MCP Inspector 可以通过这个接口操作当前本地 Vault。[MCP Server 文档](https://docs.agentero.app/backend/mcp/)

这个 MCP 接口没有自身鉴权，只应监听 loopback 地址。应用必须保持运行，远程 Vault 当前不提供该 MCP 服务。云端 ChatGPT 无法直接访问本机 loopback，官方文档给出的方案是通过带 Runtime API key 的出站安全隧道连接，而不是把 MCP 端口直接暴露到公网。

ACP 和 MCP 承担不同方向的连接。

| 协议 | 谁连接谁 | 典型用途 |
|---|---|---|
| ACP | Agentero 连接本机或远端 Agent | 在应用右侧面板中对话和执行 Skill |
| MCP | 外部客户端连接 Agentero | 从 ChatGPT 或 Codex 调用论文库和笔记工具 |

## 与 Zotero 的关系

Agentero 可以迁移已有 Zotero 文库，也兼容官方 Zotero Connector 的浏览器保存协议。研究者在浏览器中点击 Connector 后，可以把论文保存到当前 Agentero Vault。导入过程会优先使用浏览器已经取得的 PDF，缺少附件时再尝试 DOI 或 arXiv 的开放获取来源。[使用 Zotero Connector](https://docs.agentero.app/usage/zotero/)

当前集成提供迁移和增量导入，没有把 Agentero 建成 Zotero 数据库的持续双向同步端。官方文档仍建议用 Zotero 管理完整 Zotero 数据库。两者的 Connector 服务还会竞争同一个本机端口，因此 Zotero 桌面端和 Agentero Connector 不能同时运行兼容服务。

需要稳定书目、引文样式和文字处理器集成时，Zotero 仍是更成熟的选择。需要把论文选区、视觉批注和 Markdown 文件直接交给 Agent 时，Agentero 提供了更集中的操作界面。组合使用时，应先明确哪一套系统负责书目元数据，避免迁移、修改和导出形成相互覆盖的记录。

## 本地优先具体意味着什么

论文、笔记、批注和 Catalog 默认保存在用户选择的本地 Vault。这个设计允许外部编辑器读取 Markdown，也便于用户自行备份或使用版本控制。

本地优先只描述存储和应用架构。接入云端 Agent 或翻译供应商后，显式发送的选区、提示和论文内容可能离开本机，实际范围取决于所选服务。处理受限材料或敏感研究数据时，需要分别检查 Agent、翻译服务、同步服务和安全隧道的数据政策。

官方发行版包含可关闭的 PostHog 遥测。当前文档显示遥测开关默认开启，并向美国区 PostHog 发送应用版本、操作系统、设备型号、已注册 Agent 类型和经过归类的行为事件。项目声明这些事件不包含 Vault 路径、论文标题、DOI、检索词、正文和批注内容。关闭设置后需要重新启动应用。本机 `usage.sqlite` 仍会保存使用记录。[遥测说明](https://docs.agentero.app/backend/telemetry/)

## 怎样在相近工具之间选择

下面的比较使用“主要工作对象”作为统一标准。

| 方案 | 主要工作对象 | 更适合的需求 | 需要承担的成本 |
|---|---|---|---|
| Agentero | 论文、选区、笔记和 Agent 任务 | 希望 Agent 直接参与阅读并写回本地文件 | 需要维护 Vault 与 Catalog，0.x 接口仍在变化 |
| Zotero | 书目、附件、引文和写作集成 | 需要稳定的引用管理与浏览器采集 | Agent 上下文和自动写回能力有限 |
| [Paperlib](https://github.com/Future-Scholars/paperlib) | 文献元数据、筛选和扩展 | 重视元数据抓取、RSS、搜索和插件式 AI 功能 | Agent 与笔记工作区的整合程度较低 |
| Obsidian 加外部 Agent | 通用 Markdown 知识库 | 已有成熟目录、模板和自动化规则 | 论文导入、选区定位和写回契约需要自行搭建 |

Agentero 的存在意义是降低跨应用传递上下文的成本。没有它时，同样的能力可以由文献管理器、Markdown 知识库和 Agent 工具组合完成，用户需要自行维护论文标识、文件路径、选区定位和笔记写回规则。它是否必要取决于研究者是否需要 Agent 直接操作论文工作区。只需要管理引文或偶尔总结单篇 PDF 时，现有文献管理器与通用对话工具已经足够。

## 当前成熟度与已知限制

截至 2026 年 9 月 14 日，最新正式版本为 v0.10.2，发布于 2026 年 9 月 12 日。[发布记录](https://github.com/poco-ai/Agentero/releases)显示项目仍在快速调整 PDF 双栏翻译、批注交互、Agent 会话、路径处理和论文导入。v0.10.1 曾删除部分 CLI 命令，并移除一个没有官方 ACP 支持的 Agent 后端。这些变化说明当前接口仍在收敛。

使用前还需要考虑以下限制。

- 扫描 PDF 没有文本层时，划词和搜索能力会受限。
- PDF 图、表、公式和算法的版面分析仍属于实验功能。
- 自动精读会修改 `NOTES.md`，输出质量和引用可追溯性取决于 Agent、Skill 与输入材料。
- 文件与 Catalog 共同保存状态，需要完整备份和恢复测试。
- 官方仓库和文档没有提供独立的回答正确率、阅读效率或长期文库可靠性评测。
- 使用云端 Agent、翻译或 S3 同步时，需要单独核查相应服务的数据处理方式。

功能存在不能证明它已经适合接管唯一文献库。更可靠的判断来自一次可回滚的试用。

## 一个安全的试用方案

1. 新建独立测试 Vault，不直接使用唯一的正式文库。
2. 导入少量开放获取论文，覆盖 DOI、arXiv 和浏览器 Connector 三种入口。
3. 首次测试关闭遥测与 S3 同步，Agent 权限保持 `restricted`。
4. 检查作者、年份、标识符、PDF、附件和导出 BibTeX 是否完整。
5. 测试文本高亮、视觉批注、自动精读和原文页码回跳。
6. 接入一个 ACP Agent，再单独测试外部 MCP，记录每次文件写入。
7. 模拟应用升级、异常退出和 Catalog 恢复，确认备份能够还原 Library 与笔记。

当元数据不漂移、笔记能回到原文、Agent 写入范围可控、升级后可以恢复时，才适合扩大文库规模。对于已经稳定运行的文献管理体系，Agentero 更适合作为新增的阅读与 Agent 协作层。

## 参考资料

- [Agentero GitHub 仓库](https://github.com/poco-ai/Agentero)
- [Agentero 官方文档](https://docs.agentero.app/)
- [架构总览](https://docs.agentero.app/architecture/)
- [阅读、标注与整理](https://docs.agentero.app/usage/read-and-organize/)
- [接入 Agent](https://docs.agentero.app/usage/agents/)
- [MCP Server](https://docs.agentero.app/backend/mcp/)
- [使用 Zotero Connector](https://docs.agentero.app/usage/zotero/)
- [遥测说明](https://docs.agentero.app/backend/telemetry/)
- [发布记录](https://github.com/poco-ai/Agentero/releases)

本文的功能、架构和版本信息来自项目仓库、官方文档与发布记录，核验日期为 2026 年 9 月 14 日。本文没有实际安装 Agentero，也没有独立测试 PDF 解析质量、Zotero 迁移完整性、Agent 回答正确率、长时间运行稳定性或第三方云服务的数据处理行为。
