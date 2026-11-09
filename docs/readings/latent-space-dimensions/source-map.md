# 潜空间的维度、范围与精度：来源与验收

范围：解释 VAE、GAN 与潜空间扩散模型的潜空间尺寸、数值范围和存储精度；不比较生成质量，不重训模型，也不把某一模型的配置推广为所有模型的统一标准。核验日期：2026-11-09。

| 正文主张 | 来源与核对位置 | 边界 |
| --- | --- | --- |
| VAE 用均值与方差向量表示潜变量，KL 正则使后验靠近标准正态先验 | [Kingma 与 Welling（ICLR 2014）](https://arxiv.org/abs/1312.6114) §2–3；[Trackback 记录](https://arxiv.org/tb/1312.6114) | 论文的变分目标；正文不声称每个维度在全体数据上严格服从 $\mathcal N(0,1)$。 |
| VAE 可能出现后验坍塌，部分维度不再携带有效信息 | [Lucas 等（2019）](https://arxiv.org/abs/1901.05534) | 该文讨论 ELBO 与后验坍塌的关系；正文只把它作为维度设计的风险，不量化发生率。 |
| GAN 的潜向量维度由模型设计预设 | [Goodfellow 等（NeurIPS 2014）](https://arxiv.org/abs/1406.2661) §3；[DCGAN（ICLR 2016）](https://arxiv.org/abs/1511.06434) §3.2 与图 1；[BigGAN（ICLR 2019）](https://arxiv.org/abs/1809.11096) 附录；[StyleGAN（CVPR 2019）](https://arxiv.org/abs/1812.04948) §2 | DCGAN 为 100 维均匀分布；BigGAN 为 128 维；StyleGAN 的 $w$ 与 $z$ 为 512 维。采样分布与维度是设计选择，不是数据固有属性。 |
| 潜空间扩散模型使用 $H\times W\times C$ 张量，经典配置为 64×64×4 | [Rombach 等（CVPR 2022）](https://arxiv.org/abs/2112.10752) §3；[Stable Diffusion 官方推理配置](https://github.com/CompVis/stable-diffusion/blob/main/configs/stable-diffusion/v1-inference.yaml) 的 `channels: 4` 与 `scale_factor: 0.18215` | 512×512 输入、8 倍下采样、4 通道来自该配置；不是所有潜空间扩散模型的统一规格。 |
| SDXL 在 1024×1024 输入上得到 128×128 潜变量，沿用 4 通道 VAE 架构 | [SDXL（ICLR 2024）](https://arxiv.org/abs/2307.01952) §2 与图 1、§3.2 | 论文说明其 VAE 沿用原 Stable Diffusion 架构并重新训练；128×128 是 8 倍下采样的结果。 |
| SD3 使用 16 通道、8 倍下采样的 VAE | [Esser 等（ICML 2024）](https://arxiv.org/abs/2403.03206) 附录 B.2 与图 10 | 论文比较 4、8、16 通道；正文只陈述其最终选择，不把 16 通道写成普遍更优。 |
| 扩散过程在不同时间步的潜变量分布不同 | [Ho 等（NeurIPS 2020）](https://arxiv.org/abs/2006.11239) §2–3 | 前向加噪接近标准正态、反向去噪回到数据分布；正文不给出某一模型的具体时间步曲线。 |
| float32、float16、bfloat16 的有效位与十进制位数 | [Kalamkar 等（2019）](https://arxiv.org/abs/1905.12322) §2；IEEE 754 格式定义 | 表中「有效二进制位」含规格化数的隐含前导 1；十进制位数按 $\log_{10}(2^n)$ 估算，是量级而非保证。 |
| 混合精度：低精度运算配合 float32 敏感操作 | [Micikevicius 等（ICLR 2018）](https://arxiv.org/abs/1710.03740) §3–4 | 正文说明常见做法，不声称所有框架或模型的默认策略相同。 |
| SDXL 原始 VAE 在 float16 下产生 NaN，修复版通过缩小内部权重和偏置工作 | [`madebyollin/sdxl-vae-fp16-fix` 模型卡](https://huggingface.co/madebyollin/sdxl-vae-fp16-fix) 的说明与对照表 | 模型卡自述；正文不把它推广为所有 VAE 的 float16 行为。 |
| ImageNet 的内在维度估计为 26–43 | [Pope 等（ICLR 2021）](https://arxiv.org/abs/2104.08894) 摘要与图 1 | 这是数据集层面的估计，依赖估计方法；不能直接当作生成器潜空间的有效维度或语义方向数。 |

## 数值复算

- 像素数：$512\times512\times3=786{,}432$；潜变量数：$64\times64\times4=16{,}384$；比例 $16{,}384/786{,}432=1/48$。
- 潜张量内存：$16{,}384\times4=65{,}536$ 字节（64 KiB）；$16{,}384\times2=32{,}768$ 字节（32 KiB）；batch 8 分别为 524,288 与 262,144 字节（512 KiB 与 256 KiB）。
- 有效十进制位：$24\log_{10}2\approx7.22$，$11\log_{10}2\approx3.31$，$8\log_{10}2\approx2.41$。

## 内容边界

- 未训练、微调或运行任何 VAE、GAN、扩散模型；内存数字是张量算术，不是实测显存占用。
- 「范围」用分布描述，不把某个模型的观测区间写成通用常数；VAE 的 ±3 只在标准正态假设下成立。
- SDXL 的 NaN 案例来自公开模型卡；没有在本机复现 float16 解码。
- 内在维度是数据集估计，正文明确区分它和模型潜空间维度。
- 发布结果以对应 Pages 工作流及正式页面核验为准。

## 内容验收

- 公开边界与中文行文检查：待执行。
- 数值复算：上述三组算术已用 Python 复算。
- 构建与线上核验：待执行。
