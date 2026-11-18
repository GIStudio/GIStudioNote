# 表征学习专题：问题覆盖与来源

核验日期：2026-11-18。目录位于 `content/AI/GenAI/Representation-Learning/`。主文 `index.md` 以同词异义为贯穿场景，独立讲完表征的学习、计算、读出、验证、迁移和生成。独立文章只展开查表与离散码、权重绑定推导、探针控制任务、LoRA 的矩阵预算和潜扩散实现。表中来源是正式出版文本或作者报告；实现条件另查对应项目文档。

| 正文 | 覆盖的问题 | 来源与位置 |
| --- | --- | --- |
| 主文：表征与训练 | 输入查出的向量与模型参数的区别；下一词元的交叉熵怎样改变参数；预测与对比训练各要求表征保留什么。 | [Rumelhart 等，1986](https://doi.org/10.1038/323533a0)，pp. 533–535；[SimCLR](https://proceedings.mlr.press/v119/chen20j/chen20j.pdf)，§2、算法 1 与 §2.3。 |
| `tokenization-and-embeddings` | 输入单元从哪里来？像素、图块、子词、离散码的区别？ID 怎样选中浮点向量？直接更新向量还是学习计算向量的函数？向量是否必然靠近？ | [BPE](https://aclanthology.org/P16-1162.pdf)，§3.2/算法 1；[BERT](https://aclanthology.org/N19-1423.pdf)，§3、图 2；[ViT](https://openreview.net/pdf?id=YicbFdNTTy)，§3.1 式 (1)；[权重绑定](https://aclanthology.org/E17-2025.pdf)，§3；[VQ-VAE](https://proceedings.neurips.cc/paper/2017/hash/7a98af17e63a0ac09ce2e96d03992fbc-Abstract.html)，§§3.1–3.3、§4.2 图 2。 |
| 主文：前向、输出与验证 | 同一词元怎样随前文得到不同的隐藏状态；单个位置和整个批次的 logits 形状；生成选词、训练算损失和新任务读出的区别。 | [Transformer](https://proceedings.neurips.cc/paper/7181--attention-is-all-you-need.pdf)，§§3.1–3.5；[GPT-2](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)，§2 式 (1) 与 §2.3；[控制任务](https://aclanthology.org/D19-1275.pdf)，§3；[因果中介分析](https://proceedings.neurips.cc/paper_files/paper/2020/file/92650b2e92217715fe312e6fa7b90d82-Paper.pdf)，§§3–4。 |
| `tied-embeddings-and-gradients` | 矩阵两个使用点如何贡献梯度、未查到的行为什么仍可能更新、冻结与切断分支的区别。 | [权重绑定论文](https://aclanthology.org/E17-2025.pdf)，§3，pp. 158–159；[PyTorch 自动求导说明](https://docs.pytorch.org/docs/2.15/notes/autograd.html#setting-requires-grad)；两词元梯度为链式法则的教学推导。 |
| `probing-and-fine-tuning` | 换输出头能读到什么？可读是否意味着模型用过？冻结、线性探针、部分和全量微调以及 PEFT 怎样区分？ | [BERT](https://aclanthology.org/N19-1423.pdf)，§3、§5.3；[控制任务](https://aclanthology.org/D19-1275.pdf)，§3；[因果中介分析](https://proceedings.neurips.cc/paper_files/paper/2020/file/92650b2e92217715fe312e6fa7b90d82-Paper.pdf)，§3–4；[LoRA](https://openreview.net/pdf?id=nZeVKeeFYf9)，§4。 |
| `lora-low-rank-updates` | LoRA 加的是哪块参数、会不会多一层？4096 × 4096 对应单块还是全网？每块如何联合训练？低秩、合并与适配器如何理解？ | [LoRA](https://openreview.net/pdf?id=nZeVKeeFYf9)，§4.1、§4.2 与 §7（初始化、缩放、合并、目标投影与秩）；[GQA](https://aclanthology.org/2023.emnlp-main.298.pdf)，§2–3；[瓶颈适配器](https://proceedings.mlr.press/v97/houlsby19a/houlsby19a.pdf)，§3、图 2；[软提示](https://aclanthology.org/2021.emnlp-main.243.pdf)，§2、图 1；[PEFT 文档](https://huggingface.co/docs/peft/v0.21.0/package_reference/lora)（合并行为）。 |
| `representations-in-generative-models` | 文本续写为什么要读上下文？图像怎样编码、在潜网格去噪、再解码？生成质量能否说明下游可读性？ | [Transformer](https://proceedings.neurips.cc/paper/7181--attention-is-all-you-need.pdf)，§§3.1、3.4；[GPT-2](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)，§§2、2.3、3.1；[LDM](https://openaccess.thecvf.com/content/CVPR2022/papers/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.pdf)，§§3.1–3.3、图 3、§4.1 图 5，其压缩观察限定在原实验。 |

`bank` 的例句、词表编号和 softmax 数值是教学示例，不是实际模型输出。独立文章中的 LoRA 小矩阵、潜网格尺寸和探针对照同样用于教学，不是复现实验。LoRA 正式会议题录采用 OpenReview；公式与实验位置核对的是[作者预印本 PDF](https://arxiv.org/pdf/2106.09685v2)。

原 `what-is-a-representation` 和 `forward-pass-and-readouts` 已合入主文；旧路由由主文别名接续。主文包含每个外链所涉及的核心结论，独立文章不承担必读步骤。
