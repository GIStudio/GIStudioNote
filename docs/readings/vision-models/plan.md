# 视觉模型专题：当前执行计划

## 用户目标与边界

建立公开的视觉模型专题，至少 10 篇图文并茂的长文，兼顾科普与深入；覆盖计算机视觉历史、模型演变、通用理论的兴起与局限、ViT、CLIP、patch 方案、近期模型、视觉塔及其接入系统的方式；提交并发布到 GIStudio Notes。内容仅依据公开论文、作者材料和官方实现，不读取或透露私人研究方向。

本计划采用 12 篇正文加一个专题首页，放在 `content/AI/Vision/`。长文以实质解释而非字数凑齐为准；内部最低检查为每篇至少 1600 个中文正文字符、两幅有解释作用的原创图、相邻来源、具体算例或可追踪流程、适用边界及继续阅读。字数、标题或静态检查不能代替内容审阅。全部文章完成后统一接入现有 AI、DL、LLM 导航并发布，不把首页或来源清单计入 10 篇。

## 正文与依赖

| 序号 | 文件 | 核心问题 | 状态 |
| --- | --- | --- | --- |
| 01 | history-and-theories.md | 从场景重建到可迁移表示，哪些理论被保留、哪些假设失去主导地位 | doing：成稿 2240 字、2 图，待专题整体验收 |
| 02 | classical-features-and-geometry.md | 边缘、SIFT、HOG、几何验证怎样把像素变成证据 | doing：成稿 1951 字、2 图，待专题整体验收 |
| 03 | convolutional-networks.md | 卷积、监督学习、残差与现代 ConvNet 分别解决什么 | doing：成稿 1904 字、2 图，待专题整体验收 |
| 04 | detection-segmentation-and-prompts.md | 分类、检测、分割、提示分割如何改变输出与监督 | plan |
| 05 | vision-transformers.md | ViT、DeiT、Swin 怎样组织空间关系与训练成本 | plan |
| 06 | patches-resolution-and-tokens.md | patch、裁块、动态分辨率、打包、合并各改变哪一段 | plan |
| 07 | clip-siglip-and-alignment.md | 图文对齐、负样本、SigLIP 与 SigLIP 2 的训练目标 | plan |
| 08 | self-supervised-visual-learning.md | 对比、自蒸馏、MAE、DINOv3 怎样学可迁移表示 | plan |
| 09 | vision-towers-and-connectors.md | 视觉塔、投影器、查询重采样、交叉注意力、DeepStack 的接口差异 | plan |
| 10 | video-memory-and-world-models.md | 空间 token 怎样扩展到时间、记忆与动作预测 | plan |
| 11 | visual-systems-and-evaluation.md | 输入处理、检索、问答、OCR、坐标与工具执行怎样形成可验证系统 | plan |
| 12 | frontier-models-and-open-problems.md | 截至核验日的公开新模型及其证据、实现与未知项 | plan |

上述题目为执行组织选择，不将行业叙事写成模型全面替代关系。新旧方法是否继续有用，以目标、输入假设和评价证据分别讨论。

## 当前证据与下一步

- 起始分支 `v5`，工作树保留 `.gitignore`、`content/index.md`、`.zcodeignore` 三项无关改动；不纳入专题提交。
- 当前没有既存视觉专题；部分散见的模型笔记只作为后续导航对象，不把旧文自动重写或计入新专题数量。
- 已核对 MIT 的 1966 Summer Vision Project 记录、MIT Press 的 Marr 书目与框架说明、Lowe 的 SIFT 和 Dalal–Triggs 的 HOG 原文、NeurIPS 的 AlexNet 记录；来源位置和覆盖范围维护在同目录 `source-map.md`。
- 初步检索找到 2026 年 OpenVision 3、Qwen3.5/3.6 与 Qwen3.8 的公开原始材料，以及 SAM 3 官方仓库。检索命中不等于机制已核读，逐项核读后才进入正文。
- 前三篇已形成独立长文，6 幅 SVG 及本地 PNG 预览完成实际查看；段落与来源、五件以上具体材料、原创教学算术分别核对。公开扫描零错误零警告；中文教学检查无硬失败，非必要的翻案句已作局部修订。
- Node 22.16.0 下全量检查通过：187 个 Markdown、27 个资源；三篇仍标为 draft，构建确实将其排除，不能把该检查说成三篇公开渲染或发布已验收。
- 下一步：核读第 4–6 篇的原始论文，完成检测/分割、ViT、patch 与分辨率篇章及其图件；随后继续第 7–12 篇，不发布残缺的专题导航。

## 完成所需证据

| 要求 | 需要检查的权威对象 | 当前状态 |
| --- | --- | --- |
| 至少 10 篇独立长文 | 实际 Markdown 正文、逐篇内容审查和字数辅助检查 | doing |
| 每篇图文并茂 | 每篇至少两幅内容图、图注、源码与网页渲染 | plan |
| 历史、理论与指定技术覆盖 | 正文、来源表和章节之间的关系 | doing |
| 当前新模型 | 截至 2026-10-26 的官方材料、发表/发布状态及机制核读 | doing |
| 公开和版权边界 | 来源仅限公开材料，原创图，不转载论文整图/全文，公开内容扫描 | doing |
| 元数据、文献、链接、排版 | Quartz 生成页、数值断言、全量检查、逐页实际渲染 | plan |
| 提交及发布 | 限定提交、origin/v5、匹配 Pages 工作流、全部正式 URL 的正文与图片实测 | plan |

## 接续约定

本文件是专题唯一当前计划，项目入口仍为 `docs/knowledge-maintenance.md`。每次推进更新真实状态和下一动作；来源清单不冒充完整阅读，离线算例不冒充模型实验。目标保持 active，只有全部数量、内容、图件和线上验收成立才标为完成。
