---
title: 似然、负对数似然与交叉熵
description: 从分类概率出发，解释似然、负对数似然和交叉熵的关系、适用条件、数值实现与评价边界。
type: concept
status: active
updated: 2026-08-26
source_count: 13
source_paths:
  - https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html
  - https://docs.pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html
  - https://docs.pytorch.org/docs/stable/generated/torch.nn.LogSoftmax.html
  - https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html
  - https://docs.pytorch.org/docs/stable/generated/torch.logsumexp.html
  - https://doi.org/10.1098/rsta.1922.0009
  - https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
  - https://doi.org/10.1214/aoms/1177729694
  - https://journals.ametsoc.org/doi/abs/10.1175/1520-0493%281950%29078%3C0001%3AVOFEIT%3E2.0.CO%3B2
  - https://doi.org/10.1007/BF00994018
  - https://research.google/pubs/rethinking-the-inception-architecture-for-computer-vision/
  - https://openaccess.thecvf.com/content_ICCV_2017/papers/Lin_Focal_Loss_for_ICCV_2017_paper.pdf
  - https://proceedings.mlr.press/v238/popordanoska24a.html
aliases:
  - 似然与交叉熵
  - Likelihood NLL and Cross Entropy
  - PyTorch 分类损失
tags:
  - 深度学习
  - 机器学习
  - 概率模型
  - likelihood
  - cross-entropy
  - pytorch
verified_at: 2026-08-26
---

# 似然、负对数似然与交叉熵

## 一句话定义

似然衡量模型给已观察答案分配了多少概率，负对数似然把最大化似然改写成可最小化的损失，而单标签 softmax 分类中的交叉熵与真实类别的负对数似然相等。

## 先用一个具体例子

假设模型只区分猫、狗和兔。一张图片进入模型后，得到下面的概率分布。

| 候选类别 | 模型分配的概率 |
|---|---|
| 猫 | 0.80 |
| 狗 | 0.15 |
| 兔 | 0.05 |

三个概率之和为 1。若分类规则选择概率最大的一项，模型会把图片判为猫。概率分布和分类结果是两个对象。前者保留模型对全部类别的分配，后者只保留决策规则选中的类别。

若人工标注是猫，模型给观察到的答案分配了 0.80。单样本负对数似然为

$$
-\log 0.80 \approx 0.223.
$$

若人工标注是兔，同一组输出只给观察到的答案分配了 0.05。损失变为

$$
-\log 0.05 \approx 2.996.
$$

损失由真实类别对应的概率决定。模型越排斥已经观察到的答案，惩罚越大。

工程中常把 0.80 称为模型置信度。这个数字描述当前模型的概率分配，没有人的主观确定感，也没有自动获得真实世界中的频率解释。只有经过校准检验后，模型反复给出 0.80 的一组预测才有资格与约 80% 的经验正确率对应。

## 基本解释

### 概率与似然观察不同方向

概率从模型和参数出发，问可能观察到什么数据。似然固定已经观察到的数据，比较哪些参数对这些数据给出更高支持。

以抛硬币为例。正面概率记为 $p$。连续抛 10 次得到 7 次正面和 3 次反面后，参数 $p$ 的似然函数写成

$$
L(p)=p^7(1-p)^3.
$$

其中 7 次正面与 3 次反面已经固定。改变 $p$ 可以比较不同参数对这批数据的支持程度。该函数在 $p=0.7$ 处达到最大值，所以最大似然估计为 $\hat p=0.7$。

似然函数不是参数 $p$ 的概率分布。若要讨论观察数据以后 $p$ 自身的概率，需要先指定参数的先验分布，再进行贝叶斯推断。

### 数据集似然怎样变成 NLL

训练集记为

$$
\mathcal D=\{(x_i,y_i)\}_{i=1}^{N}.
$$

这里，$x_i$ 是第 $i$ 个输入，$y_i$ 是对应的真实标签，$N$ 是样本数，$\theta$ 是模型参数。若各样本标签在给定输入和模型参数后条件独立，整批数据的条件似然为

$$
L(\theta;\mathcal D)
=\prod_{i=1}^{N}p_\theta(y_i\mid x_i).
$$

每一项 $p_\theta(y_i\mid x_i)$ 都是模型分给真实标签的概率。大量小概率直接连乘容易发生[浮点下溢](#浮点下溢为什么发生)，对数可以把乘积改成求和，同时保留最优参数的位置。

$$
\arg\max_\theta L(\theta;\mathcal D)
=\arg\max_\theta \log L(\theta;\mathcal D).
$$

训练程序通常采用最小化接口，于是再取负号。

$$
\mathcal L_{\mathrm{NLL}}(\theta)
=-\sum_{i=1}^{N}\log p_\theta(y_i\mid x_i).
$$

自然对数对应的信息单位是 [nat](#nat-是什么)，以 2 为底的对数对应 bit。机器学习库通常使用自然对数。

乘积形式依赖条件独立假设。时间序列、交通流、图结构和同一对象的重复观测可能相互依赖。此时需要把依赖写入联合分布、条件结构或采样设计，不能只把相关观测当作独立样本相乘。

## 核心机制

### 从 logits 到交叉熵

神经网络一般输出任意实数 logits。若三个类别的 logits 为

$$
z=(2,1,0),
$$

softmax 会把它们转换成总和为 1 的概率。

$$
p_k=\frac{e^{z_k}}{\sum_{j=1}^{K}e^{z_j}}.
$$

这个例子得到近似分布

$$
p\approx(0.6652,0.2447,0.0900).
$$

若真实类别是猫，单样本 NLL 约为 $0.4076$。若真实类别是兔，损失约为 $2.4076$。损失只读取真实类别的位置，但该位置的 softmax 概率由全部 logits 共同决定。

真实标签也可以写成概率分布 $q$。猫的 one-hot 标签为

$$
q=(1,0,0).
$$

预测分布 $p$ 相对于目标分布 $q$ 的交叉熵为

$$
H(q,p)=-\sum_{k=1}^{K}q_k\log p_k.
$$

one-hot 标签只有真实类别位置为 1，求和因此只剩

$$
H(q,p)=-\log p_y.
$$

这就是单样本 NLL。两者的等价关系有明确条件。

```text
单标签分类
+ 类别索引或 one-hot 目标
+ softmax 概率模型
= 交叉熵等于真实类别的 NLL
```

软标签和 label smoothing 会让 $q$ 的多个位置同时非零。此时交叉熵仍按完整分布计算，无法缩写成单个 $-\log p_y$。

交叉熵还可以分解为

$$
H(q,p)=H(q)+D_{\mathrm{KL}}(q\Vert p).
$$

训练时目标分布 $q$ 固定，$H(q)$ 不随模型改变。最小化交叉熵因此等价于最小化这个方向的 KL 散度。

### 梯度怎样推动模型

softmax 交叉熵对第 $k$ 个 logit 的梯度为

$$
\frac{\partial\ell}{\partial z_k}
=p_k-\mathbb{I}(k=y).
$$

真实类别位置的梯度是 $p_y-1$，梯度下降会提高该类别的 logit。其他位置的梯度是 $p_k$，梯度下降会压低这些 logits。模型由此扩大真实类别相对于其他类别的优势。

softmax 只依赖 logits 之间的相对差异。给全部 logits 加上同一个常数不会改变概率。

$$
\operatorname{softmax}(z+c\mathbf 1)
=\operatorname{softmax}(z).
$$

## NLL 降低不保证分类指标改善

NLL 是连续的概率损失。真阳性、假阴性、精确率和召回率需要先指定正类，再用阈值把概率变成离散判断。

假设把猫定义为正类，并采用 0.50 的判断阈值。

| 正确答案 | 猫的概率变化 | 阈值判断 | NLL |
|---|---|---|---|
| 猫 | 0.40 到 0.70 | 假阴性变为真阳性 | 降低 |
| 猫 | 0.60 到 0.80 | 仍为真阳性 | 降低 |
| 非猫 | 0.40 到 0.20 | 仍为真阴性 | 降低 |

第一行跨过阈值，真阳性数增加，假阴性数减少。后两行的离散分类没有变化，NLL 仍然降低。概率损失能够分辨同一阈值区域内的预测强弱，混淆矩阵只记录阈值两侧的类别。

因此，较低 NLL 可以支持更好的概率预测，却不保证准确率、召回率或假阴性率同步改善。阈值、类别比例、概率校准、数据分布和错误成本都会影响部署指标。疾病筛查或安全告警等任务需要在验证集上直接选择工作点，并同时报告漏检与误报的代价。

## 历史发展

| 时间 | 发展 | 改变了什么 |
|---|---|---|
| 1922 | [R. A. Fisher](https://doi.org/10.1098/rsta.1922.0009) 系统讨论似然与参数估计 | 似然成为统计估计的核心原则之一 |
| 1948 | [Claude Shannon](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) 建立信息熵与通信理论 | 对数信息量、熵与编码获得统一数学语言 |
| 1950 | [Glenn Brier](https://journals.ametsoc.org/doi/abs/10.1175/1520-0493%281950%29078%3C0001%3AVOFEIT%3E2.0.CO%3B2) 提出概率预测的二次评分 | 概率分布可以用对数损失之外的严格评分评价 |
| 1951 | [Kullback 与 Leibler](https://doi.org/10.1214/aoms/1177729694) 提出信息判别量 | 分布差异与交叉熵获得直接联系 |
| 1995 | [Cortes 与 Vapnik](https://doi.org/10.1007/BF00994018) 发展支持向量网络 | margin 与 hinge loss 形成概率损失之外的分类路线 |
| 2016 至 2017 | [label smoothing](https://research.google/pubs/rethinking-the-inception-architecture-for-computer-vision/) 与 [focal loss](https://openaccess.thecvf.com/content_ICCV_2017/papers/Lin_Focal_Loss_for_ICCV_2017_paper.pdf) 进入视觉模型 | 训练开始显式处理过度集中和极端类别不平衡 |

这条发展线汇合了统计估计、信息论与可微优化。深度学习沿用其数学结构，并把它实现为可在大批量 logits 上稳定计算的训练目标。

## 当前发展

截至 2026 年 8 月，softmax 交叉熵仍是单标签多分类和自回归语言模型下一 token 预测的基础目标。研究重点集中在标准目标与真实数据条件之间的偏差。

Label smoothing 用软目标降低模型对硬标签的极端集中。它可能改善泛化或校准，也可能削弱类别间的细粒度信息，是否使用需要由目标任务验证。

Focal loss 给简单样本较低权重，使密集检测中的大量背景样本较少主导总损失。它针对特定的不平衡结构，没有成为普通分类任务的通用替代品。

概率校准仍需独立评价。有限样本、模型错设、正则化和分布变化都可能让较低 NLL 与过度自信同时出现。分类准确率和概率校准回答不同问题，应分别报告。

大语言模型用真实下一个 token 的交叉熵训练。生成时还要使用 temperature、top-k 或 top-p 等解码规则。训练损失降低无法直接推出事实正确性、推理能力或最终生成质量提高。

## 相关概念、替代方案与竞品

下表只比较分类训练与概率评价中的邻近目标。

| 方法 | 直接优化的对象 | 适合情形 | 主要限制 |
|---|---|---|---|
| Softmax Cross Entropy | 互斥类别中真实类别的对数概率 | 单标签多分类与 token 预测 | 对错标和极端不平衡敏感 |
| Binary Cross Entropy | 每个标签独立成立的概率 | 二分类与多标签任务 | 不表达类别互斥关系 |
| Brier Score | 概率与结果向量的平方距离 | 概率评价与校准分析 | 对极低真实类别概率的惩罚较温和 |
| Hinge Loss | 正确类别相对其他类别的 margin | SVM 与重视决策边界的任务 | 原始输出没有直接概率语义 |
| Focal Loss | 动态加权后的交叉熵 | 密集检测与极端类别不平衡 | 聚焦参数会改变样本权重与概率质量 |
| KL Divergence | 一个完整分布对另一个分布的逼近 | 软目标、蒸馏与变分推断 | 两个方向的含义不同 |
| Mean Squared Error | 输出与目标之间的平方距离 | 连续值回归 | 用于 softmax 分类时通常不匹配概率几何 |

选择取决于标签是否互斥、任务是否需要概率、类别是否失衡、标签是否可靠，以及下游决策怎样计算代价。

## 上游与下游

```text
数据与标签
→ 概率模型假设
→ 网络输出 logits
→ softmax 或 sigmoid
→ NLL 或 Cross Entropy
→ 反向传播与参数更新
→ 预测概率
→ 分类、采样、校准与风险决策
```

上游的标签形式决定损失含义。互斥类别通常使用 softmax，可同时成立的多个标签通常使用独立 sigmoid。相关样本若被当成独立样本，似然与不确定性估计可能失真。

下游若只使用 top-1 类别，概率排序可能已经够用。医疗风险、自动驾驶和资源分配依赖概率质量，还要检查校准、分布变化与错误成本。生成任务则需要解码规则把逐 token 分布变成序列。

## 存在意义

NLL 把统计推断原则变成连续、可微的训练信号。模型稍微提高真实答案的概率时，损失会平滑变化，反向传播能够据此调整参数。样本损失还可以求和或求平均，适合小批量和并行训练。

若直接优化分类正确与否对应的 0 至 1 损失，只要预测类别没有翻转，目标就几乎不变，梯度下降难以获得方向。MSE 与 hinge loss 能替代部分任务，但它们表达平方误差或 margin，没有同样的条件概率解释。

## 重要性与必要性

当模型假设标签来自 categorical 分布，并希望通过最大似然学习条件概率时，NLL 是自然目标。任务只要求排序、margin、连续误差或特定决策效用时，它可以被替代。标签噪声严重、类别极不平衡或错误成本高度不对称时，标准交叉熵通常需要配合权重、采样、稳健损失或阈值设计。

## 适用条件、限制与常见误区

使用 softmax 交叉熵前应检查以下条件。

- 每个样本只有一个互斥类别。
- 模型为每个类别输出一个 raw logit。
- 标签具有足够可信度。
- 数据依赖结构已经由模型或采样方法处理。
- 最终任务允许用平均对数损失表达训练偏好。

常见错误包括以下几类。

- 先做 softmax，再把概率传给 `CrossEntropyLoss`，造成重复变换。
- 把 raw logits 直接传给 `NLLLoss`，忽略它要求 log-probabilities。
- 把互斥多分类和多个标签可同时成立的任务混在一起。
- 把更低 NLL 直接解释成更高准确率或更低假阴性率。
- 忽略 `sum` 与 `mean` 的梯度尺度差异。
- 用训练集低损失代替泛化、校准和分布外评估。
- 比较序列损失时，没有说明按 token、序列还是批量归约。

## 如何实际使用

### PyTorch 选择表

| 任务 | 模型输出 | 标签 | 推荐接口 |
|---|---|---|---|
| 单标签多分类 | 每类一个 raw logit | 整数类别索引 | `CrossEntropyLoss` |
| 已计算 log-probabilities | `log_softmax` 结果 | 整数类别索引 | `NLLLoss` |
| 单输出二分类 | 一个 raw logit | 0 到 1 的目标 | `BCEWithLogitsLoss` |
| 多标签分类 | 每个标签一个 raw logit | 同形多热或软目标 | `BCEWithLogitsLoss` |
| 单标签软目标 | 每类一个 raw logit | 每行总和为 1 的目标分布 | `CrossEntropyLoss` |

类别索引目标下，下面两条路径在权重、忽略规则和归约方式一致时等价。[PyTorch 的 `CrossEntropyLoss` 文档](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)也将这种计算描述为 `LogSoftmax` 与 `NLLLoss` 的组合。

```python
import torch
import torch.nn.functional as F

logits = torch.tensor(((2.0, 1.0, 0.0),))
target = torch.tensor([0])

loss_a = F.cross_entropy(logits, target)

log_probs = F.log_softmax(logits, dim=1)
loss_b = F.nll_loss(log_probs, target)

assert torch.allclose(loss_a, loss_b)
```

多分类损失可以写成

$$
\ell=-z_y+\log\sum_j e^{z_j}.
$$

直接计算指数可能溢出。令 $a=\max_j z_j$，稳定形式为

$$
\log\sum_j e^{z_j}
=a+\log\sum_j e^{z_j-a}.
$$

实际代码应把 raw logits 直接交给 `CrossEntropyLoss`。库会采用稳定的 log-softmax 与 log-sum-exp 计算。

### 使用前的决策清单

1. 检查标签是否互斥。互斥类别通常选择 softmax，多标签任务通常选择 sigmoid。
2. 确认是否需要可信概率。若需要，应在准确率之外评价 NLL、Brier score 和校准。
3. 检查类别不平衡。必要时比较重采样、类别权重或 focal loss。
4. 检查标签噪声。必要时增加数据清洗、稳健损失或置信学习方法。
5. 检查训练目标与下游指标是否对应。排序、生成和风险决策需要独立评价。
6. 写清归约单位。说明损失按样本、token、序列还是有效权重平均。

## 附录

### 浮点下溢为什么发生

计算机用有限位数保存浮点数，因此能够表示的正数有一个下限。一个正数小到超出当前浮点格式的表示范围时，计算结果会被舍入为零。这个过程称为浮点下溢。

概率连乘很容易进入这个区域。假设 200 个相互独立的观测都得到 0.01 的条件概率，联合概率为

$$
(0.01)^{200}=10^{-400}.
$$

普通双精度浮点数无法直接表示这个正数，程序得到的乘积可能已经是零。随后计算对数会得到 $\log 0=-\infty$，原有概率之间的差异也随之丢失。

对数空间保留了这次计算。先对每一项取对数，再把结果相加，可得

$$
200\ln(0.01)\approx-921.03.
$$

这个结果仍是有限数。最大似然训练因此直接累加 log-probability，数值实现还会使用 log-sum-exp 等稳定算法。已经下溢为零的乘积无法通过事后取对数恢复。

浮点下溢也可能出现在 softmax 中。很小的 logit 经过指数运算后可能接近零。稳定实现会先减去最大 logit，再完成指数与求和，减少溢出和下溢带来的数值损失。

### nat 是什么

nat 是使用自然对数度量信息量时的单位。事件 $x$ 的自信息定义为

$$
I(x)=-\ln p(x).
$$

若事件概率为 $p(x)=e^{-1}$，它的自信息正好是 1 nat。概率越低，观察到该事件提供的信息量越大。

bit 使用以 2 为底的对数。nat 与 bit 只相差一个固定换算系数。

$$
1\ \mathrm{nat}=\log_2 e\approx1.4427\ \mathrm{bit},
$$

$$
1\ \mathrm{bit}=\ln 2\approx0.6931\ \mathrm{nat}.
$$

使用自然对数计算 NLL 时，单个样本的损失单位是 nat，平均 NLL 的单位则是 nat per sample。语言模型按 token 求平均时，通常写成 nat per token。改用以 2 为底的对数会把损失和梯度统一缩放，最优参数位置保持不变。

NLL 相差 1 nat 还有直接的概率含义。对同一个真实答案，较高损失对应的预测概率缩小了 $e$ 倍。这个解释依赖两项损失使用相同的对数底、归约单位和样本条件。

## 参考资料与证据边界

- [PyTorch `CrossEntropyLoss`](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html)
- [PyTorch `NLLLoss`](https://docs.pytorch.org/docs/stable/generated/torch.nn.NLLLoss.html)
- [PyTorch `LogSoftmax`](https://docs.pytorch.org/docs/stable/generated/torch.nn.LogSoftmax.html)
- [PyTorch `BCEWithLogitsLoss`](https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html)
- [PyTorch `logsumexp`](https://docs.pytorch.org/docs/stable/generated/torch.logsumexp.html)
- [Proper Calibration Error](https://proceedings.mlr.press/v238/popordanoska24a.html), AISTATS 2024

历史部分使用 Fisher、Shannon、Brier、Kullback 与 Leibler、Cortes 与 Vapnik 的原始论文。工程接口依据 2026 年 8 月 26 日访问的 PyTorch 官方文档。当前发展部分只概括稳定实践和代表性研究方向，没有证明某种损失在所有数据集上占优。标签噪声、长尾学习、概率校准和语言模型训练目标仍需针对具体任务检索与实验。
