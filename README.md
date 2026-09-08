# [GIStudio Notes](https://notes.gistudio.xyz/)

开放共建的 GIS、GeoAI、图学习、强化学习与深度学习知识库。

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally get clues as to what the world is and what might be important.” — Richard Hamming

本站使用 [Quartz 5](https://quartz.jzhao.xyz/) 将 `content/` 中的 Markdown 笔记发布为数字花园。

## Start here / 项目交接

继续维护项目前，先阅读 [`docs/knowledge-maintenance.md`](docs/knowledge-maintenance.md)。该文档记录公开内容边界、当前维护状态、引用规范和发布验收要求。

## 本地环境

仓库固定使用 Node.js 22.16.0：

```bash
nvm use
npm ci
npm run install-plugins
```

Quartz 5 使用 `quartz.config.yaml` 描述站点、插件和布局；插件索引由安装命令生成，不提交 `.quartz/`。

## 编写和预览

笔记统一放在 `content/`。新增或整理文档时遵循
[`docs/knowledge-maintenance.md`](docs/knowledge-maintenance.md) 中的元数据、链接和合并规则。

```bash
# 启动本地预览
npm run notes

# 等价入口
npm start
```

## 提交前检查

```bash
npm run check:content
git diff --check
```

`check:content` 会依次执行元数据与链接审计、TypeScript 检查和 Quartz 完整构建。

## 发布

推送 `v5` 分支后，GitHub Actions 会使用 Node.js 22.16.0 安装依赖和 Quartz 插件、审计内容、构建站点并发布到 GitHub Pages。

```bash
git push origin v5
```

`content/RL/` 同时是强化学习专题站（[gistudy.net/reinforceyourRL](https://www.gistudy.net/reinforceyourRL/)）的内容源：RL 相关文件变化时额外触发 MkDocs 构建并部署到原站地址。双站点架构、Secret 与排查指南见 [`rl-site/HANDOFF.md`](rl-site/HANDOFF.md)。

## 更新 Quartz

Quartz 5 的内核更新命令为：

```bash
npx quartz upgrade
npm ci
npm run install-plugins
npm run check:content
```

升级前保持工作树干净；遇到配置、插件或 URL 变化时，应先在独立分支完成构建与页面回归。

## 写作约定

- 内部知识连接可使用 Obsidian Wikilink。
- 长期维护或跨工具链接优先使用标准 Markdown 链接。
- 引用使用 Pandoc citation key，例如 `[@citationKey]`；条目维护在 `bibliography.bib`。
- arXiv 论文使用双链接：论文标题或编号链接到官方 `/abs/<id>` 摘要页，随后单独给出 `/trackback/<id>`。Trackback 只用于向 arXiv 通知本站讨论，不替代 DOI、正式出版页、citation key 或 arXiv 摘要页。
- 不将私人内容放入公开 `content/`，并保留来源、状态和更新时间信息。

## 参考

- [Quartz 官方文档](https://quartz.jzhao.xyz/)
- [Markdown Guide](https://www.markdownguide.org/)
