# HANDOFF — RL 专题站双站点部署

> 面向后续维护者（人或 AI 会话）。本文件不在 `content/` 下，**不会被发布到任何公开站点**。
> 搭建时间：2026-09-05。全链路已验证通过。

## 这套东西是什么

`content/RL/` 下的 Markdown 是**唯一内容源**，由两个渲染器共用：

```
                    ┌─ Quartz (deploy.yml, 每次 push v5 都跑)
content/RL/**/*.md ─┤     → GitHub Pages → notes.gistudio.xyz/RL/…
                    └─ MkDocs Material (deploy-rl.yml, 仅 RL 相关文件变化才跑)
                          → 推到 wsqstar/reinforceyourRL 的 gh-pages
                          → gistudy.net/reinforceyourRL/
```

背景：reinforceyourRL 原是独立仓库（MkDocs 手动 `gh-deploy`，最后一次 2024-11-08）。
2026-09-05 起内容真源迁入本仓库，原仓库降级为**纯部署目标**（只剩 gh-pages 分支有用，
其 main 分支上的 docs/、site/ 已是历史存档，不再更新）。

## 触发规则（关键语义）

| 本次 push 改了什么 | Quartz 主站 | RL 专题站 |
|---|---|---|
| `content/RL/**`、`rl-site/**` 或 `.github/workflows/deploy-rl.yml` | 更新 | **更新** |
| 其他任何文件 | 更新 | 不动（workflow 根本不触发） |

- Quartz 部署：`deploy.yml`（push v5 → build → GitHub Pages），与 RL 无关的部分照旧。
- RL 部署：`deploy-rl.yml` 用 GitHub Actions 原生 `paths:` 过滤实现条件触发。

## 各文件职责

| 路径 | 职责 |
|---|---|
| `content/RL/**` | RL 内容本体（Quartz 与 MkDocs 共用） |
| `rl-site/mkdocs.yml` | RL 专题站的 MkDocs 配置：`docs_dir: ../content/RL`（相对本文件解析）、Material 主题、中文 nav、roamlinks 插件 |
| `.github/workflows/deploy-rl.yml` | 条件部署 workflow（装 mkdocs-material + mkdocs-roamlinks-plugin → build → peaceiris/actions-gh-pages 推外部仓库） |
| `rl-site/site/` | 本地构建产物，已在 .gitignore 忽略 |

## Secret

- 名字：`RL_DEPLOY_TOKEN`（本仓库 Settings → Actions secrets）
- 本体：fine-grained PAT，**仅授予 wsqstar/reinforceyourRL 的 contents 读写**（最小权限），
  存于维护者本地 `D:\workspace\.env`，不入仓库。
- 用途：peaceiris action 跨仓库推送 gh-pages（组织仓库 → 个人仓库，GITHUB_TOKEN 干不了这事）。
- 轮换：重新生成 PAT（同样只给 reinforceyourRL）→ 更新 .env → 更新仓库 secret 即可。

## 常见修改场景

- **改 RL 内容**：直接编辑 `content/RL/**/*.md`，两个站点自动同步更新，无需其他操作。
- **改 RL 站外观/导航**：改 `rl-site/mkdocs.yml`（theme、nav）。本地预览：
  `py -3.12 -m mkdocs serve -f rl-site/mkdocs.yml`。
- **加新页面**：文件放进 `content/RL/`，并同步更新 mkdocs.yml 的 nav（Quartz 不需要 nav，
  MkDocs 不加 nav 也能跑但顺序按字母排）。
- **动 workflow**：`deploy-rl.yml` 自身路径已纳入触发过滤，改完 push 即自测。

## 已知坑（踩过的）

1. **`setup-python` 不要加 `cache: pip`**——仓库没有 requirements 文件时缓存 key 解析直接失败（第一次部署就死在这）。
2. **跨分区 wikilink 不解析**：RL 页面里 `[[Deep Learning]]` 指向 dl 分区，MkDocs 子站范围内
   找不到目标，构建时留 WARNING、渲染为普通文本。Quartz 主站不受影响。属预期限制。
3. `concepts/MDP.md` 有一条相对链接 `../../Reinforcement Learning` 与 MkDocs 的解析不一致，
   构建时留 INFO 并原样保留，不影响出站。
4. **不要在 reinforceyourRL 仓库再手动 `mkdocs gh-deploy`**——gh-pages 已由 CI 接管，手动推会
   绕过内容源（那边已没有最新内容）。

## 未来收尾（整体迁移完成后）

1. 删除 `.github/workflows/deploy-rl.yml` 与 `rl-site/`。
2. gistudy.net 域名做 301 → `https://notes.gistudio.xyz/RL/`。
3. reinforceyourRL 仓库归档，README 加一句指向新地址。

## 验证 / 排查命令

```bash
# 本地构建测试（改配置后先跑这个）
py -3.12 -m mkdocs build -f rl-site/mkdocs.yml

# 查 CI 运行状态（需 GitHub 凭据）
curl -s -H "Authorization: Bearer <token>" \
  "https://api.github.com/repos/GIStudio/GIStudioNote/actions/workflows/deploy-rl.yml/runs?per_page=2"

# 确认部署产物
curl -s https://www.gistudy.net/reinforceyourRL/ | grep -c 'md-typeset'   # >0 = 新构建在线
```
