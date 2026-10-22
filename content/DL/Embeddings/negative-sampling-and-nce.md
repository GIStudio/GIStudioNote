---
title: 负采样、NCE 与 InfoNCE：相似的样本，不同的目标
description: 从同一个正词对与噪声词对出发，比较 SGNS、NCE、InfoNCE、完整 Softmax 与层次 Softmax，解释概率归一化和噪声分布的作用。
tags:
  - NLP
  - 负采样
  - 对比学习
  - 表示学习
verified_at: 2026-10-22
---

**负采样是一种构造对照样本的办法，不是所有使用负样本的方法共用的损失函数。** SGNS、噪声对比估计（NCE）和 InfoNCE 都会比较数据与噪声，但它们比较的方式、概率含义和学习目的不同。

先看 [[sgns-pretraining|SGNS]] 的教学例子：观察到“道路—城市”，再从噪声分布抽出“咖啡”和“街区”。三个方法都可以使用这一组候选，不能仅凭样本外观就断定算法相同。

## SGNS：每个词对分别判别

记三个词对分数为 $s_0,s_1,s_2$，其中第一个是数据词对。SGNS 的损失是

$$
\ell_{\mathrm{SGNS}}=-\log\sigma(s_0)
-\log\sigma(-s_1)-\log\sigma(-s_2).
$$

每个分数分别经过 Sigmoid，三个输出不必相加为 1。训练要区分的是“来自语料窗口”还是“来自噪声采样”，不是直接求出完整词表上的上下文条件概率。NEG 是 word2vec 论文提出的替代训练目标。[@mikolovDistributedRepresentations2013]

## NCE：借助判别来估计概率模型

NCE 即 Noise-Contrastive Estimation。它将数据与已知噪声的分类问题，连接到未归一化概率模型的参数估计。噪声的**具体概率值**进入判别式，而不只是用来抽样。原始方法还允许把未知归一化常数作为待估参数；一致性结论有模型和统计条件，不能由“用了负样本”直接推出。[@gutmannNoiseContrastiveEstimation2010]

沿用词对语境，若每个数据样本配 $k$ 个来自 $Q(c)$ 的噪声，Bayes 公式给出以下条件形式。

$$
D_\theta(1\mid w,c)=
\frac{p_\theta(c\mid w)}{p_\theta(c\mid w)+kQ(c)}.
$$

其中 $p_\theta$ 是要估计的条件概率模型，$D_\theta$ 是数据来源的判别概率。其 logit，也就是对数优势，为

$$
\log\frac{D_\theta}{1-D_\theta}
=\log p_\theta(c\mid w)-\log(kQ(c)).
$$

这是将数据与噪声比例扩展到 $1:k$ 的解释性写法。它说明 NCE 为什么要校正噪声概率。SGNS 直接把 $u_w^\top v_c$ 当作判别分数，没有因此自动获得同一个语言概率模型。

## InfoNCE：在一组候选中找出正样本

InfoNCE 把一个正样本与若干负样本放进候选集合，使用集合内的分类损失。设正候选为 $c_0$，另有 $k$ 个负候选，正评分函数为 $f(w,c)>0$。

$$
\ell_{\mathrm{InfoNCE}}
=-\log\frac{f(w,c_0)}{\sum_{j=0}^{k}f(w,c_j)}.
$$

取 $f(w,c)=\exp(s(w,c))$，便得到候选集合上的 Softmax 交叉熵。提高某个候选的分数会改变其他候选分到的概率，这与 SGNS 的独立 Sigmoid 不同。此处归一化的是当前候选集合，不是整个词表。CPC 原文用它学习表示，但不能把任意负采样策略的效果或互信息解释一并照搬。[@oordContrastivePredictiveCoding2018]

例如三个分数都为 0，InfoNCE 的正样本损失是 $\log3\approx1.099$；SGNS 则是 $3\log2\approx2.079$。两种目标的数值尺度不同，不能比较谁的损失较小就判断谁更好。

## 与完整 Softmax、层次 Softmax 怎么区分

完整 Softmax 将分数转为词表上的条件分布。

$$
P(c\mid w)=\frac{\exp(s(w,c))}{\sum_{c'\in\mathcal V}\exp(s(w,c'))}.
$$

$\mathcal V$ 是词表，分母遍历全部候选词。层次 Softmax 则把输出词组织成树，用从根到叶的二元决策概率乘积定义词概率；计算成本取决于路径长度，平衡树约为 $O(d\log V)$。它不需要为每次更新遍历所有叶子。[@mikolovDistributedRepresentations2013]

| 训练方式 | 这里的概率或分数表示什么 | 噪声分布的作用 |
| --- | --- | --- |
| 完整／层次 Softmax | 完整输出空间上的条件概率 | 定义本身不依赖负采样 |
| SGNS | 单个词对的数据／噪声判别 | 抽样并改变对照项权重 |
| NCE | 用带噪声校正的判别式估计概率模型 | 既用于抽样，也进入判别式 |
| InfoNCE | 当前候选集合中的分类概率 | 候选生成机制影响学习问题 |

## 什么才是“负”

负标签描述采样来源，不等于人工确认的“错误含义”。“街区”可能与“道路”高度相关，却仍被当作噪声抽中；同一词对也可能同时在数据与噪声中出现。对照学习中的假负样本问题与具体任务、采样和标签定义有关。

因此，$k$ 增大不只是“多算几次”，$Q$ 改变也不只是加速技巧。它们会改变判别问题的相对权重。SGNS 的这种变化怎样体现为点积偏移，可以接着看 [[pmi-matrix-factorization|PMI 与矩阵分解]]。

InfoNCE 采用的论文为 2018 年预印本，本文核读 v2（2019-01-22）：[CPC 原文](https://arxiv.org/abs/1807.03748) · [Trackback 记录](https://arxiv.org/tb/1807.03748)。这组双链接不表示已提交 Trackback。

返回 [[DL/Embeddings/index|词向量与表示学习专题]]。分类损失的共同基础见 [[DL/likelihood-nll-and-cross-entropy|NLL 与交叉熵]]。

## 参考文献
