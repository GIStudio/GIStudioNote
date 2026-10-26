# 视觉模型专题：当前执行计划

## 用户目标与边界

建立公开的视觉模型专题，至少 10 篇图文并茂的长文，兼顾科普与深入；覆盖计算机视觉历史、模型演变、通用理论的兴起与局限、ViT、CLIP、patch 方案、近期模型、视觉塔及其接入系统的方式；提交并发布到 GIStudio Notes。内容仅依据公开论文、作者材料和官方实现，不读取或透露私人研究方向。

本计划采用 12 篇正文加一个专题首页，放在 `content/AI/Vision/`。长文以实质解释而非字数凑齐为准；内部最低检查为每篇至少 1600 个中文正文字符、两幅有解释作用的原创图、相邻来源、具体算例或可追踪流程、适用边界及继续阅读。字数、标题或静态检查不能代替内容审阅。全部文章完成后统一接入现有 AI、DL、LLM 导航并发布，不把首页或来源清单计入 10 篇。

## 正文与依赖

| 序号 | 文件 | 核心问题 | 状态 |
| --- | --- | --- | --- |
| 01 | history-and-theories.md | 从场景重建到可迁移表示，哪些理论被保留、哪些假设失去主导地位 | done：2248 字、2 图，已上线 |
| 02 | classical-features-and-geometry.md | 边缘、SIFT、HOG、几何验证怎样把像素变成证据 | done：1959 字、2 图，已上线 |
| 03 | convolutional-networks.md | 卷积、监督学习、残差与现代 ConvNet 分别解决什么 | done：1912 字、2 图，已上线 |
| 04 | detection-segmentation-and-prompts.md | 分类、检测、分割、提示分割如何改变输出与监督 | done：1891 字、2 图，已上线 |
| 05 | vision-transformers.md | ViT、DeiT、Swin 怎样组织空间关系与训练成本 | done：1736 字、2 图，已上线 |
| 06 | patches-resolution-and-tokens.md | patch、裁块、动态分辨率、打包、合并各改变哪一段 | done：1826 字、2 图，已上线 |
| 07 | clip-siglip-and-alignment.md | 图文对齐、负样本、SigLIP 与 SigLIP 2 的训练目标 | done：1721 字、2 图，已上线 |
| 08 | self-supervised-visual-learning.md | 对比、自蒸馏、MAE、DINOv3 怎样学可迁移表示 | done：1950 字、2 图，已上线 |
| 09 | vision-towers-and-connectors.md | 视觉塔、投影器、查询重采样、交叉注意力、DeepStack 的接口差异 | done：2070 字、2 图，已上线 |
| 10 | video-memory-and-world-models.md | 空间 token 怎样扩展到时间、记忆与动作预测 | done：1705 字、2 图，已上线 |
| 11 | visual-systems-and-evaluation.md | 输入处理、检索、问答、OCR、坐标与工具执行怎样形成可验证系统 | done：1808 字、2 图，已上线 |
| 12 | frontier-models-and-open-problems.md | 截至核验日的公开新模型及其证据、实现与未知项 | done：2145 字、2 图，已上线 |

上述题目为执行组织选择，不将行业叙事写成模型全面替代关系。新旧方法是否继续有用，以目标、输入假设和评价证据分别讨论。

## 当前状态与发布证据

- 已发布：[视觉模型的发展与系统接入](https://notes.gistudio.xyz/ai/vision/)，12 篇正文共 22971 个中文字符（含回链，英文、公式及图注未据此凑数）、24 幅原创 SVG；首页不计入正文数量，旧文未计入新专题。
- 内容提交 `9fed65c2b142d0a3ced2abf805f7044caaafd339` 已推送 `origin/v5`；匹配 [Pages 工作流 40259736900](https://github.com/GIStudio/GIStudioNote/actions/runs/40259736900) 的 build 与 deploy 均成功。
- 16 个候选页面公开扫描零错误零警告；197 个 Markdown、45 个资源通过 Node 22.16.0 全量检查。全部专题实际参与生成，不再由 draft 过滤。
- 完整模式检查 12 篇、图件与教学算术；生成 HTML 与线上检查均覆盖 13 个专题页、3 个导航入口、24 个图文件，并核对各页标题、68 条逐页书目、16 个展示公式和全部正文内链。线上均返回 HTTP 200。
- 十二篇及首页实际桌面渲染已查看，图件预览全部检查，书目作者格式已修正。正文、来源覆盖与研究判断的边界见 `source-map.md`，不将离线算例当成模型实验。
- 起始的 `.gitignore`、`content/index.md`、`.zcodeignore` 三项无关改动保留，未纳入提交。未访问私人研究、未安装模型、未操作真实集群。

## 完成所需证据

| 要求 | 需要检查的权威对象 | 当前状态 |
| --- | --- | --- |
| 至少 10 篇独立长文 | 实际 12 篇正文，逐篇内容审查和完整模式检查 | done |
| 每篇图文并茂 | 每篇两幅、共 24 幅原创图，源码、预览与线上图件 | done |
| 历史、理论与指定技术覆盖 | 第 1–9 篇及来源表，区分框架/架构/监督/系统 | done |
| 当前新模型 | 第 12 篇及原始材料，含 2026 年 OpenVision 3、SAM 3.1、Qwen3.8-Omni | done |
| 公开和版权边界 | 只用公开来源、原创图；16 页公开扫描通过 | done |
| 元数据、文献、链接、排版 | 全量构建、13 页 HTML、实际浏览器、24 图及数值断言 | done |
| 提交及发布 | 内容提交、匹配 Pages 成功，13 页、3 入口、24 图 HTTP 和内容验收 | done |

## 接续约定

本文件是专题唯一当前计划，项目入口仍为 `docs/knowledge-maintenance.md`。全部数量、内容、图件和线上验收已成立；未来维护以新材料或真实错误为依据，不把本专题写成穷尽整个视觉领域的综述。
