---
title: 视觉模型的发展与系统接入
description: 十二篇图文长文，贯穿计算机视觉历史、经典特征、CNN、ViT、图文对齐、自监督、视觉塔、视频与近期多模态系统。
tags:
  - AI
  - 计算机视觉
  - 深度学习
  - 多模态
  - 索引
verified_at: 2026-10-26
---

视觉模型把像素转成可用于识别、测量、描述或行动的表示。模型的发展既包括架构变化，也包括学习目标、图像组织方式和系统接口的变化。本专题用十二篇独立长文串起这些关系，配以原创机制图和可手算例子。

如果第一次系统接触计算机视觉，可按下表顺序阅读。如果已经熟悉神经网络，想理解多模态模型的视觉输入，可从第 5、6 篇进入，再读第 7–9 篇。关心视频、视觉智能体和模型选择，可在了解视觉塔后阅读最后三篇。

## 从任务与表示走到组合系统

| 篇章 | 阅读入口 | 这一篇解决的问题 |
| --- | --- | --- |
| 01 | [视觉史与理论框架](history-and-theories.md) | Marr、人工特征、深度学习与基础模型是什么关系，哪些“通用”承诺需要重新理解 |
| 02 | [经典特征与几何](classical-features-and-geometry.md) | SIFT、HOG、匹配和几何验证怎样从像素构成证据 |
| 03 | [卷积网络与残差学习](convolutional-networks.md) | 局部运算、权重共享、训练目标与残差连接分别解决什么 |
| 04 | [检测、分割与提示](detection-segmentation-and-prompts.md) | 从整图类别到框、像素和目标提示，输出责任怎样变化 |
| 05 | [ViT、DeiT 与 Swin](vision-transformers.md) | 图像如何成为序列，注意力、训练数据与局部窗口怎样配合 |
| 06 | [Patch、分辨率与 token](patches-resolution-and-tokens.md) | 切 patch、裁大图、打包与合并 token 到底在哪一步发生 |
| 07 | [CLIP、SigLIP 与图文对齐](clip-siglip-and-alignment.md) | 图文如何可比较，配对损失和零样本候选如何影响解释 |
| 08 | [自监督视觉学习](self-supervised-visual-learning.md) | SimCLR、MAE、DINO 与 DINOv3 分别从哪里取得学习信号 |
| 09 | [视觉塔与连接器](vision-towers-and-connectors.md) | 投影、查询瓶颈、交叉注意力与 DeepStack 怎样把图像接到语言模型 |
| 10 | [视频、记忆与世界模型](video-memory-and-world-models.md) | 时间、对象身份和动作条件怎样加入，预测与控制之间缺什么 |
| 11 | [视觉系统与评价](visual-systems-and-evaluation.md) | 输入变换、坐标、工具执行和任务验收怎样形成完整流程 |
| 12 | [近期模型与开放问题](frontier-models-and-open-problems.md) | 2025–2026 年统一表示、多目标记忆与原生视听系统改变了哪些环节 |

## 阅读时保留三个区别

ViT、卷积网络描述架构；CLIP、自监督重建描述训练方式；视觉塔、连接器描述组合系统里的职责。这些名称可以同时出现在一个模型中，不构成彼此排斥的分类。

整图表示、局部特征、回答文本与可执行动作，也需要不同评价。一个模型能做图文检索，不意味着它已经能精确读表或安全操作软件；一张清楚的注意力图，也不能代替测试集或实际任务结果。

各篇采用公开论文和官方实现，原图均为教学示意，算例不是模型实验。近期模型以 2026 年 10 月 26 日核对的材料为截面；论文、代码、权重和服务的可用范围分别说明，不给出跨条件的统一性能榜。

基础概念可接着阅读 [[AI/LLM/transformer-positional-encoding|Transformer 位置编码]]、[[DL/likelihood-nll-and-cross-entropy|似然与交叉熵]]、[[DL/dimensionality-reduction-visualization|表示的降维可视化]]。返回 [[AI/index|人工智能主题]]、[[DL/index|深度学习]] 或 [[AI/LLM/index|大语言模型]]。
