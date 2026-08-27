# GIStudio Notes 知识维护规范

## 当前状态

- [done] 元数据、内部链接与 Quartz 构建基线（证据：`npm run check:content` 通过；2026-07-29）
- [done] Awesome Autonomous GeoAI 已拆分并发布（证据：commit `e2b185b`）
- [done] 全站知识架构复核（证据：2026-08-27 审计覆盖 120 个公开页面，孤立页、导航缺口、重复候选和未连接关系候选均为 0；人工决策见 `docs/knowledge-architecture/review.md`）
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

## 维护命令

```bash
source ~/.nvm/nvm.sh
nvm use
npm run audit:content
npm run audit:knowledge -- --write
npm run check:content
```

`audit:content` 检查元数据、标签、空正文、重复路径和内部链接。`check:content`
在审计后运行 TypeScript 检查和 Quartz 全量构建。

`audit:knowledge` 生成页面清单，并把孤立页、索引缺口、疑似重叠、未显式关联和词典候选写入 `docs/knowledge-architecture/`。这些结果用于人工复核，不能直接授权移动、合并或删除页面。

## 状态流转

- `[plan] -> [doing] -> [done]`
- `[plan] -> [blocked] -> [doing]`
- `[plan] -> [drop]`

同时最多维护三个 `[doing]` 项；每个阻塞项必须写清解阻条件。
