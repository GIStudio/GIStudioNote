---
title: Qwen3.8-Flash-Next 采用的 N-gram Embedding 是什么？
description: 解释 Qwen3.8-Flash-Next 如何用 bigram 和 trigram 查表增加局部模式容量，以及 Host Memory 卸载、异步预取的作用与限制。
type: concept
status: active
updated: 2026-08-27
source_count: 7
source_paths:
  - https://qwen.ai/blog?id=qwen3.8-flash-next
  - https://github.com/QwenLM/Qwen3.8-Flash-Next
  - https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf
  - https://huggingface.co/Qwen/Qwen3.8-Flash-Next-FP8/blob/main/README.md
  - https://arxiv.org/abs/2207.06366
  - https://arxiv.org/abs/2502.01637
  - https://arxiv.org/abs/2601.07372
aliases:
  - Qwen3.8 N-gram Embedding
  - Qwen3.8-Flash-Next 局部模式记忆
  - Qwen N-gram 查表
  - dl/qwen3-8-flash-next-n-gram-embedding
tags:
  - 深度学习
  - 大语言模型
  - Qwen
  - embedding
  - n-gram
  - 模型架构
verified_at: 2026-08-27
---

# Qwen3.8-Flash-Next 采用的 N-gram Embedding 是什么？

## 一句话定义

N-gram Embedding 在 Qwen3.8-Flash-Next 中充当可训练的局部上下文查表层，通过当前位置及前序 token 组成的短序列取回向量，以很少的额外计算扩展模型容量。

这里的 Embedding 是语言模型内部表示，不是用于语义检索的文本向量服务。

## 先用一个具体例子

假设分词器把 `New York City` 切成三个 token。普通 token embedding 处理 `City` 时，只按 `City` 的 token ID 取回一个向量。N-gram Embedding 还可以利用下面两个局部片段。

| N-gram | 当前位置 | 提供的信息 |
|---|---|---|
| `York City` | `City` | 当前 token 与前一个 token 的组合 |
| `New York City` | `City` | 当前 token 与前两个 token 的组合 |

这些短序列分别对应 bigram 和 trigram。模型用它们确定查表位置，取回附加向量，再把局部模式表示送入后续网络。这样一来，`City` 位于 `New York City` 和其他语境中时，可以获得不同的局部补充信息。

这个例子只说明查表逻辑。Qwen 官方公开资料没有把某个自然语言短语对应到具体表项，也没有声称表中每一行都能由人直接解释。

## 基本解释

### 从单 token 查表扩展到局部上下文查表

普通输入 embedding 可以写成

$$
e_t=E[x_t].
$$

$x_t$ 是位置 $t$ 的 token ID，$E$ 是普通 token embedding 表，$e_t$ 是查到的向量。这个操作只使用当前位置的 token ID。

N-gram Embedding 增加了一组局部键。以 bigram 和 trigram 为例，当前位置的键可以抽象写成

$$
k_t^{(2)}=g_2(x_{t-1},x_t),
$$

$$
k_t^{(3)}=g_3(x_{t-2},x_{t-1},x_t).
$$

$g_2$ 和 $g_3$ 把 token 序列确定性地映射到查表位置。模型随后从 N-gram 表 $M$ 中读取局部向量。

$$
m_t=M_2[k_t^{(2)}]\oplus M_3[k_t^{(3)}].
$$

$M_2$ 和 $M_3$ 是不同 N-gram 阶数的表，$\oplus$ 表示实现设定的组合与投影。Qwen 技术报告明确给出了短 N-gram 查表和表示增强过程。公开概览未完整展开生产实现中的每个索引与组合细节。因此，上式用于解释结构，不能视为全部内核代码的逐行复现。

### Qwen3.8-Flash-Next 怎样配置它

Qwen 官方模型卡列出的主模型规模为 125B 参数，每个 token 激活约 6B 主模型参数。模型另外包含 51B N-gram Embedding 参数，并把 N-gram 表规模列为 2000 万个槽位，使用 bigram 和 trigram。整个模型只设置一个 N-gram Embedding 层，位置在第 2 层附近。[Qwen 官方模型卡](https://huggingface.co/Qwen/Qwen3.8-Flash-Next-FP8/blob/main/README.md)

51B 描述表的总容量。一次 token 处理只读取少量相关表项，因此不能把这 51B 理解为每个 token 都参与矩阵计算的激活参数。

## 核心机制

### 查表为何只增加很少计算

矩阵层需要让输入与大量权重相乘。Embedding 查表只需计算少量索引并读取对应行。N-gram 表即使包含很多参数，一次前向过程仍只访问当前局部上下文命中的小部分向量。

这给模型增加了一条稀疏容量路径。

```text
token 序列
   ├─ 当前 token ID → 普通 token embedding
   └─ bigram 与 trigram → 确定查表位置
                              ↓
                       N-gram 局部向量
                              ↓
                    在浅层增强 token 表示
                              ↓
                GDN、QSA、MoE 等后续模块
```

Qwen 团队把它描述为主干网络之外的容量扩展。它适合承载反复出现的局部搭配、实体片段、代码组合和其他短程模式。后续网络继续负责跨位置组合、长程信息处理与输出预测。[Qwen 官方技术报告](https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf)

### Host Memory 卸载怎样工作

Host Memory 通常指 CPU 内存。完整 N-gram 表可以保存在 CPU 内存中，只把当前批次需要的少量向量传给 GPU。

N-gram 的查表位置由已经出现的 token 决定，所以系统能够提前计算索引。Qwen 把该模块放在第 2 层，使数据预取可以与第 1 层计算重叠。

```text
CPU 内存保存 N-gram 表
          ↓ 提前确定所需表项
异步传输少量向量到 GPU  ←→  GPU 计算第 1 层
          ↓
第 2 层使用已经到达的局部向量
```

这种安排降低 N-gram 表对 GPU 常驻显存的要求。实际延迟仍受 CPU 内存带宽、CPU 与 GPU 互连、批大小、访问局部性和推理框架实现影响。异步预取只有在传输能被模型计算覆盖时，才接近官方所说的低额外延迟。

## 历史发展

N-gram 语言模型长期使用相邻词序列估计下一个词的概率。Transformer 普及后，研究者开始把 N-gram 重新作为神经网络内部的显式局部表示。

2022 年的 N-Grammer 使用离散潜在表示构造 N-gram，并以稀疏操作增强 Transformer。它证明了局部 N-gram 表示可以作为扩大主干模型之外的一条路线。[N-Grammer 论文](https://arxiv.org/abs/2207.06366)

2025 年的 SCONE 进一步强调可扩展、上下文化和可卸载。它把常见 N-gram 的向量预先计算并保存在加速器外部，使输入 embedding 容量可以增加，而推理阶段的加速器 FLOPs 保持较低。[SCONE 论文](https://arxiv.org/abs/2502.01637)

2026 年的 Engram 把这类模块概括为条件记忆，并讨论它与 MoE 条件计算的互补关系。Qwen3.8-Flash-Next 随后把单层 N-gram Embedding、浅层放置和 Host Memory 预取整合进一个公开权重的大模型架构。[Engram 论文](https://arxiv.org/abs/2601.07372) [Qwen 官方发布说明](https://qwen.ai/blog?id=qwen3.8-flash-next)

## 当前发展

截至 2026 年 8 月 27 日，Qwen3.8-Flash-Next 是这套架构的开放权重版本，也是 Qwen 团队对 Qwen4 架构方向的提前展示。Qwen3.8-Flash 是基于它提供的云端生产版本，默认加入更长上下文和官方内置工具等生产功能。[Qwen 官方仓库](https://github.com/QwenLM/Qwen3.8-Flash-Next)

官方技术报告的消融实验显示，加入 N-gram Embedding 后，多项预训练评测相对无 N-gram 基线有所改善。扩大 N-gram 词表会持续降低训练损失，下游任务表现却可能饱和或波动。表更大因此不等于任务能力按参数量同步增长。[Qwen 官方技术报告](https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf)

## 相关概念、替代方案与竞品

下面的比较只回答一个问题，即模型怎样在控制每 token 计算量时增加容量或获得信息。

| 方法 | 每个 token 的主要动作 | 优势 | 主要限制 |
|---|---|---|---|
| N-gram Embedding | 根据局部 token 序列读取少量表项 | 计算少，适合卸载，显式利用短程模式 | 占用大量存储，依赖访存和局部模式覆盖 |
| MoE | 路由到少数专家并执行矩阵计算 | 增加可训练计算能力 | 仍有矩阵计算和专家通信成本 |
| Dense FFN | 每个 token 使用同一组完整权重 | 实现直接，硬件支持成熟 | 参数增加会直接提高每 token 计算量 |
| RAG | 从外部文档库检索文本再放入上下文 | 知识可更新，也能保留来源 | 需要检索系统，占用上下文并引入检索误差 |
| KV Cache | 保存当前序列已经计算的注意力键和值 | 避免生成时重复计算历史 token | 不增加训练得到的知识容量，长度越大越占内存 |

N-gram Embedding 与 RAG 可以同时存在。前者属于模型权重，内容由训练得到。后者在运行时读取外部资料，适合更新频繁且需要来源追踪的知识。

## 上游与下游

它的上游包括分词结果、N-gram 键构造规则、训练语料中的局部模式，以及能够承载大表的内存层级。它的直接输出是当前位置的附加表示。

下游的 GDN、Qwen Sparse Attention、MoE 和输出层会继续处理这些表示。N-gram Embedding 提供局部线索，最终预测仍由完整模型共同产生。部署系统还要决定表留在 GPU、CPU 内存还是其他存储层级，以及如何安排预取和缓存。

## 存在意义

没有这类模块时，模型需要在 Transformer 主干参数中反复学习局部短语和固定组合。扩大主干通常会同时增加计算量。N-gram Embedding 允许系统把一部分容量放到稀疏访问的查表参数中，从存储换取模型容量。

它让大模型扩展多出一个可调维度。研究者可以在主干计算、MoE 专家和条件记忆之间重新分配参数，而不必把所有容量都变成每个 token 必须执行的矩阵乘法。

## 重要性与必要性

这项设计对显存受限、CPU 内存较充足的推理环境尤其有吸引力。它也适合希望扩大模型容量，同时严格控制每 token FLOPs 的训练和部署方案。

它并非所有语言模型都必须采用。小模型可能不需要这块大表。显存充足的服务、局部模式收益有限的任务，以及 CPU 与 GPU 传输较慢的设备，也可能从普通 embedding、MoE 或更小的查表模块获得更好的整体取舍。

## 适用条件、限制与常见误区

1. **N-gram 参数量不等于激活计算量。** 51B 是表的总容量，一次 token 只读取少量表项。
2. **低 FLOPs 不等于零延迟。** 查表、CPU 内存访问和设备间传输仍有成本。
3. **局部记忆不等于长程推理。** bigram 和 trigram 只直接编码很短的局部上下文。
4. **它不等于外部知识库。** 表中的内容不会像 RAG 文档那样随时更新，也不自带引用来源。
5. **更大的表不保证更好的下游结果。** Qwen 的消融结果显示训练损失与下游评测可能不同步。
6. **卸载能力依赖推理框架。** 模型架构允许 Host Memory 卸载，不代表每个运行库和硬件组合都已实现同样的预取效率。
7. **表项难以逐行解释。** 一个命中的向量是训练得到的表示，不能直接当成人类可读的事实记录。

## 如何实际使用

阅读模型参数时，先把主模型参数、每 token 激活参数和 N-gram 表参数分开。评估本地部署时，再分别估算 GPU 权重、KV Cache、N-gram 表所在的 CPU 内存，以及 CPU 与 GPU 之间的传输带宽。

比较两个推理方案时，至少记录下面四项。

1. Prefill 吞吐与延迟。
2. Decode 吞吐与首 token 后的单 token 延迟。
3. GPU 显存、CPU 内存和内存映射文件占用。
4. 开启与关闭卸载时的同一任务质量和速度。

模型能力评估还应加入无 N-gram 或更小 N-gram 表的消融。只比较总参数量无法判断收益来自局部查表、主干网络还是部署系统。

## 参考资料与证据边界

- [Qwen3.8-Flash-Next 官方发布说明](https://qwen.ai/blog?id=qwen3.8-flash-next)
- [Qwen3.8-Flash-Next 官方仓库](https://github.com/QwenLM/Qwen3.8-Flash-Next)
- [Qwen3.8-Flash-Next 官方技术报告](https://github.com/QwenLM/Qwen3.8-Flash-Next/blob/main/tech_report.pdf)
- [Qwen3.8-Flash-Next 官方模型卡](https://huggingface.co/Qwen/Qwen3.8-Flash-Next-FP8/blob/main/README.md)
- [N-Grammer 论文](https://arxiv.org/abs/2207.06366)
- [SCONE 论文](https://arxiv.org/abs/2502.01637)
- [Engram 论文](https://arxiv.org/abs/2601.07372)

Qwen 架构、参数和消融结论来自官方发布资料与技术报告。机制对比同时参考 N-Grammer、SCONE 和 Engram 的公开论文。自然语言例子用于说明局部查表过程，不代表官方披露了对应表项。当前开发状态最后核验于 2026 年 8 月 27 日。
