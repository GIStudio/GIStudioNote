---
title: AI 如何走向三维世界：生成式世界模型、具身智能体与表征学习
description: AI 如何走向三维世界：生成式世界模型、具身智能体与表征学习的核心概念、方法、项目与相关研究笔记。
tags:
  - RTFM
  - SIMA
  - SIMA 2
  - JEPA
  - I-JEPA
  - Energy-Based Model
  - EBM
  - 空间智能
---

# AI 如何走向三维世界：生成、行动与表征学习

## 为什么 3D / World Model 成为新焦点

近年来，"空间智能"与"世界模型"成为 AI 领域的热点话题。从 World Labs 的 RTFM 到 Google DeepMind 的 SIMA，再到 Yann LeCun 提出的 JEPA 与能量模型（EBM），这些工作分别对应着 AI 走向三维世界的不同层面：

```
生成可探索的世界  →  在世界中执行任务  →  学习世界表征  →  评估预测合理性
    (RTFM)              (SIMA)           (JEPA)           (EBM)
```

需要注意的是，**这四者不是同一层级的概念**：RTFM 和 SIMA 是具体的系统，JEPA 是一种表征学习架构，而 EBM 是更抽象的建模范式。本文尝试梳理这四条技术线索，展示 AI 如何从 2D 生成走向 3D 空间智能。

---

## 1. 生成世界：World Labs 的 RTFM

### 它生成的是什么

RTFM（Real-Time Frame Model）是由人工智能先驱李飞飞（Fei-Fei Li）创立的 **World Labs** 推出的**实时生成式世界模型**。它是一个基于自回归扩散 Transformer 的高效模型，能够在用户交互时实时生成视频，用于探索生成的 3D 世界和真实世界场景。([World Labs][1])

RTFM 不走传统 mesh、Gaussian splatting 等显式 3D 表示路线，而是从一张或多张 2D 图像出发，实时生成同一场景的新视角画面，并通过带位姿的帧记忆维持空间一致性和持久性。([World Labs][1])

更准确地说：

> RTFM 生成的是一个具有 3D 一致性和持久性的可交互世界体验；其内部并不显式输出传统 3D 几何，而是通过 posed frames 与注意力机制形成隐式空间记忆。

### 它不是传统 3D 建模

传统的 3D 建模（如游戏场景搭建）需要耗费大量人力和时间。RTFM 打破了这一限制，它能够在不需要传统显式 3D 建模的情况下，**仅凭借一张或少量 2D 图片，就能实时生成同一场景的新视角画面**。

### 核心：Learned Renderer + Posed-Frame Spatial Memory

**学习视觉规律，而非完整物理规律**

通过端到端的海量视频数据训练，RTFM 展示了从视频数据中学习视角变换、光照、反射、阴影等渲染相关规律的能力。它模糊了"从已有视角插值重建"和"从少量视角外推生成"的边界，更准确地说，这是一种 learned renderer。([World Labs][1])

**持久性的来源：带位姿的帧记忆**

RTFM 的"持久性"不来自完整 3D 重建，而来自带位姿的帧记忆：模型把历史帧组织在三维欧氏空间中，生成新视角时检索附近 posed frames 作为上下文。每一帧带有 3D 位姿，生成新帧时根据目标 pose 查询空间记忆，并通过 context juggling 检索附近帧作为上下文，从而避免上下文无限增长。([World Labs][1])

**实时运行的算力条件**

RTFM 报告能够在单张 NVIDIA H100 GPU 上以交互式帧率运行。使用时应结合这一硬件条件评估计算成本；它为交互式场景生成提供了一个可研究的实现。

---

## 2. 在世界中行动：Google DeepMind 的 SIMA / SIMA 2

### SIMA：从语言指令到 3D 行动

SIMA（Scalable Instructable Multiworld Agent，可扩展的、可听从指令的多世界智能体）是由 **Google DeepMind** 于 2024 年 3 月发布的**通用具身 AI 智能体**。([Google DeepMind][2])

**输入/输出是什么**

- **输入**：屏幕画面 + 人类语言指令
- **输出**：键盘鼠标动作

**训练方式**

SIMA 不依赖游戏内部 API 或硬编码逻辑，完全像人类一样通过"屏幕视觉输入 + 键盘/鼠标控制"进行交互。它使用视觉-语言多模态模型，结合视觉编码器（解析游戏画面像素）与大语言模型（理解自然语言指令），将两者嵌入到共享表征空间。训练数据来自人类玩家的游戏录像与对应的自然语言指令配对，通过动作令牌化（Action Tokenization）将连续控制转化为离散动作序列，学习跨环境的通用指令遵循能力。([Google DeepMind][2])

**测试环境**

在 9 款差异较大的 3D 虚拟环境中进行测试，包括：
- 《无人深空》(No Man's Sky)
- 《英灵神殿》(Valheim)
- 《Teardown》
- 《模拟山羊 3》(Goat Simulator 3)
- 《Wobbly Life》
- 《人类一败涂地》(Human: Fall Flat)
- 以及 3 个定制化的 Unity 研究环境

结果表明 SIMA 能够遵循超过 1000 种基本空间与语义指令，并在未训练过的新游戏中展现出零样本泛化能力。([Google DeepMind][2])

**目标定位**

SIMA 的目标是把自然语言指令转化为跨环境的动作序列，并在虚拟环境中执行用户指定的任务。([Google DeepMind][2])

### SIMA 2：从指令跟随到推理型游戏伙伴

SIMA 2 是 DeepMind 于 2025 年发布的后续版本，核心变化是引入 Gemini 作为推理引擎。([Google DeepMind][3])

**能力增强**

- **理解复杂目标**：从简单指令跟随发展到目标推理
- **解释行为**：能够解释自己的游戏行为并与用户对话
- **跨游戏迁移**：在未见过的游戏环境中展现更强泛化能力
- **自我改进**：通过与用户交互学习

**意义**

SIMA 2 把 embodied AI 从"技能执行器"推向"目标驱动的交互智能体"。DeepMind 将其视为迈向更通用具身智能的一步，但它距离现实机器人和开放物理世界仍有明显距离。([Google DeepMind][3])

---

## 3. 学习世界表征：JEPA

### 为什么不预测像素

JEPA（Joint Embedding Predictive Architecture，联合嵌入预测架构）是由 Yann LeCun 提出的一种学习架构，旨在解决传统生成式模型无法真正理解物理世界的局限性。([OpenReview][5])

I-JEPA（JEPA 在图像领域的变体）通过从图像的其他区域预测特定图像区域的"表征"（representations）来进行学习。它不需要人类进行显式的数据标注，就能发展出对视觉场景的抽象理解。([arXiv][4])

与传统生成模型（如预测下一个词或生成下一个像素）不同，JEPA 避免直接预测像素级细节，而是在表征空间中预测目标区域的 latent representation，从而让模型更关注可预测的抽象结构。([arXiv][4])

### 为什么预测 latent representation

像素包含纹理变化、光照扰动等细节。JEPA 在表征空间预测目标区域，旨在学习场景中可推断的结构。([arXiv][4])

### 与生成模型的区别

I-JEPA 论文明确将其定义为 non-generative self-supervised learning 方法：从图像的 context block 预测 target block 的 representation，而不是重建像素。([arXiv][4])

需要强调的是，I-JEPA 本身主要是视觉表征学习方法。LeCun 的 2022 立场文确实提出通过 world model、joint embedding architecture、自监督学习来构建 autonomous machine intelligence，但这仍是研究路线，不是已有结果。([OpenReview][5])

这一路线的目标是让模型在 latent space 中进行预测和规划，而不是必须在像素空间中生成完整未来。

---

## 4. 用能量评估合理性：EBM

### 能量函数是什么

能量模型（EBM, Energy-Based Model）是 Yann LeCun 长期推崇的一个统一机器学习的理论框架。它的核心思想是借用物理学中的"能量"概念，将人工智能的学习和推理过程，转化为寻找"最低能量状态"的过程。([cis.temple.edu][6])

在 EBM 中，模型的作用是计算一个标量能量函数 $E(x, y)$，用来衡量输入 $x$ 和输出 $y$ 之间的兼容度：
- 如果它们是正确、合理的组合，模型就会给出**低能量值**
- 如果是荒谬、不合理的组合，则给出**高能量值**

### 为什么适合世界模型

概率分布需要满足归一化条件；在某些高维模型中，计算归一化常数会很困难。EBM 先用能量函数为候选结果评分，可以通过能量差异比较兼容性。若要把能量转换成归一化概率，仍需要处理配分函数；训练和搜索的成本取决于具体方法。([cis.temple.edu][6])

### 难点是什么

在推理阶段，如何高效搜索低能量状态仍然是核心难点。因为模型需要在所有可能的输出选项中找到能量最低的那个，这本身可能是一个昂贵的优化过程。

---

## 5. JEPA 与 EBM 的关系

从 EBM 视角看，JEPA 可以被理解为在表征空间定义能量：预测表征与目标表征越接近，能量越低。它把世界建模从像素生成转向 latent-space prediction，但具体实现不一定表现为显式的能量最小化搜索。

可以用以下公式理解这种关系：

$$E(x,y) = D(f_\theta(x), g_\phi(y))$$

其中 $D$ 是距离函数，$f_\theta$ 和 $g_\phi$ 分别是输入和输出的表征编码器。当预测表征和目标表征距离小时，能量低；距离大时，能量高。

因此，JEPA 的训练可以被视为一种 energy-based formulation：通过最小化"预测的未来表征"与"真实的未来表征"之间的能量（误差距离）来进行学习。但这更多体现在训练阶段，推理时不一定进行显式的能量搜索。

---

## 6. 四条路线的关系

| 路线 | 代表 | 输入 | 输出 | 核心问题 | 主要局限 |
|------|------|------|------|----------|----------|
| **生成式世界模型** | RTFM | 图像 / 历史帧 / 位姿 | 新视角视频帧 | 如何实时生成持久、3D 一致的世界体验 | 3D 几何多为隐式，物理交互仍有限 |
| **具身智能体** | SIMA / SIMA 2 | 屏幕画面 + 语言指令 | 键盘鼠标动作 | 如何把语言目标转化为 3D 行动 | 主要在虚拟游戏环境，现实迁移仍困难 |
| **表征预测** | JEPA / I-JEPA | 局部观测表征 | 目标区域表征 | 如何学习抽象、可预测的世界结构 | 不直接生成可视内容，评估较间接 |
| **能量建模** | EBM | 条件 $x$ 与候选 $y$ | 能量 $E(x,y)$ | 如何评估预测与现实是否兼容 | 低能量搜索和训练稳定性仍是难点 |

---

## 7. 总结：从 2D 生成到 3D 空间智能

RTFM、SIMA、JEPA 和 EBM 分别涉及生成、行动、表征预测和能量建模。

- **RTFM** 关注如何生成一个可以被持续探索的视觉世界
- **SIMA** 关注如何让智能体在三维虚拟环境中根据语言目标执行动作
- **JEPA** 关注如何在表征空间中学习可预测的世界结构
- **EBM** 则提供一种用能量函数评估状态与预测是否兼容的建模框架

这些方向涉及视觉生成、空间记忆、动作控制、表征学习和规划；它们各自解决不同问题，也可能在具体系统中组合。

---

**参考资源**：

- [1] [RTFM: A Real-Time Frame Model - World Labs](https://www.worldlabs.ai/blog/rtfm)
- [2] [SIMA: Generalist AI Agent for 3D Virtual Environments - Google DeepMind](https://deepmind.google/blog/sima-generalist-ai-agent-for-3d-virtual-environments/)
- [3] [SIMA 2: A Gemini-Powered AI Agent for 3D Virtual Worlds - Google DeepMind](https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/)
- [4] [I-JEPA: Self-Supervised Learning from Images with a Joint Embedding Predictive Architecture - arXiv](https://arxiv.org/abs/2301.08243) · [Trackback 记录](https://arxiv.org/tb/2301.08243)
- [5] [A Path Towards Autonomous Machine Intelligence - Yann LeCun - OpenReview](https://openreview.net/pdf?id=BZ5a1r-kVsf)
- [6] [A Path Towards Autonomous Machine Intelligence - Yann LeCun - Temple University](https://cis.temple.edu/tagit/presentations/A%20Path%20Towards%20Autonomous%20Machine%20Intelligence.pdf)
