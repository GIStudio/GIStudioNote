# 视觉模型专题：来源与主张范围

核验开始于 2026-10-26。只使用公开原始材料；不检索或读取私人研究。参考文献维护于仓库 `bibliography.bib`，公开正文使用 citation key；预印本的可见科学链接同时附可浏览的 Trackback 记录链接，不向 arXiv 自动提交外部通知。

## 已核读的历史与基础资料

| 标识 | 公开来源 | 实际覆盖 | 可支持的事实与限制 |
| --- | --- | --- | --- |
| papertSummerVision1966 | [MIT AIM-100](https://dspace.mit.edu/handle/1721.1/6125) | MIT 档案作者、日期、摘要 | Seymour Papert、1966-07-01；图地分离、区域描述、物体识别三项目标；不复述“一暑假解决视觉”的民间故事 |
| marrVision1982 | [MIT Press 的 Vision](https://mitpress.mit.edu/9780262514620/vision/) | 出版记录与 Description | 原著 1982、所看重版 2010；计算、算法与硬件层次；本次未逐章阅读全书 |
| loweSift2004 | [作者公开 PDF](https://www.cs.ubc.ca/~lowe/papers/ijcv04.pdf) | 摘要、第 1–2 节与方法概述 | 尺度空间、关键点定位、方向、描述子、匹配与一致性验证；不从局部不变性推出任意视角或语义不变性 |
| dalalHog2005 | [作者公开 PDF](https://lear.inrialpes.fr/people/triggs/pubs/Dalal-cvpr05.pdf) | 摘要、第 1–3 节、图 1 | 密集方向直方图、重叠块归一化、线性 SVM 和行人检测；不将其数据集成绩写成通用识别能力 |
| krizhevskyAlexnet2012 | [NeurIPS 正式记录](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html) | 正式题录与摘要 | GPU 实现、ReLU、dropout、ImageNet 场景；网络层数、训练设置和实验数值须进一步核对全文，不能照抄摘要潜在差异 |

| heResnet2016 | [作者预印本 HTML](https://arxiv.org/html/1512.03385v1) | Introduction、第 3.1–3.3 节与式 1–2 | 训练误差随深度退化、恒等捷径、残差映射和维度投影；原文 2015 预印本，对应 CVPR 2016，不复述为解决所有梯度问题 |
| liuConvnext2022 | [作者预印本 HTML v2](https://arxiv.org/html/2201.03545v2) | Introduction、第 2 节路线、第 2.1–2.2 节 | 训练配方混杂、分阶段网络、patchify stem；不做跨训练条件的绝对架构排名 |
| dosovitskiyVit2021 | [作者 HTML v2](https://arxiv.org/html/2010.11929v2) | 摘要、第 1 节，后续方法另记录 | 2020 预印本、ICLR 2021；patch 序列和大规模预训练的有条件证据 |
| radfordClip2021 | [PMLR 正式论文页](https://proceedings.mlr.press/v139/radford21a.html) | 正式题录与摘要 | 图文配对监督、零样本迁移；机制细节后续读原文，不将 CLIP 当作生成式问答系统 |
| opencvSift413 | [OpenCV 4.13 SIFT](https://docs.opencv.org/4.13.0/da/df5/tutorial_py_sift_intro.html) | Theory 1–5 | 四步提取、128 维构造、ratio test；阈值属于配置，不作普适最优值 |
| opencvHomography413 | [OpenCV 4.13 匹配与单应](https://docs.opencv.org/4.13.0/d1/de0/tutorial_py_feature_homography.html) | Basics、findHomography 示例与函数签名 | 内外点、至少四个正确对应、透视变换、RANSAC；明确平面或近似平面的适用范围 |
| pytorchConv2d214 | [PyTorch 2.14 Conv2d](https://docs.pytorch.org/docs/2.14/generated/torch.nn.Conv2d.html) | Conv2d 定义、输入输出与卷积参数 | 通道、核、步幅与互相关约定；不将实现中的相关运算误写为已翻转卷积核 |

ResNet 和 ConvNeXt 的 CVF HTML 返回 403，改读作者公开预印本，未绕过访问限制。AlexNet 已进一步读正式 PDF 第 1–3 节，五个卷积层与三个全连接层以正文为准；官方摘要所述层数与正文有差异，不据摘要展开细节。所有检索失败与实际可读范围分别记录。

## 近期模型的检索线索，尚不等于机制验收

- [DINOv3 官方发布](https://ai.meta.com/blog/dinov3-self-supervised-vision-model/)，2025-08-14；待读论文中的 Gram anchoring 与训练范围。
- [SigLIP 2 论文](https://arxiv.org/abs/2502.14786)；待读 NaFlex 与多目标训练细节。
- [Qwen3-VL 技术报告](https://arxiv.org/abs/2511.21631)；待读 DeepStack、位置表示和视频时序接口。
- [OpenVision 3](https://arxiv.org/abs/2601.15369)，2026-01；待核 unified representation 与理解/生成的实验条件。
- [Qwen3.5 官方发布](https://qwen.ai/blog?id=qwen3.5)，2026-02-15；已看到原生多模态与异构训练说明，架构细节与开权重状态待进一步核对。
- [Qwen3.6-27B 官方说明](https://qwen.ai/blog?id=qwen3.6-27b)，[Qwen3.8-Max 官方说明](https://qwen.ai/blog?id=qwen3.8)，以及 [Qwen3.8-Omni-Flash](https://qwen.ai/blog?id=qwen3.8-omni-flash)；发布方基准自报不等同于独立比较；权重/代码开放与“即将开放”须分开。
- [SAM 3 官方仓库](https://github.com/facebookresearch/sam3) 与 RELEASE_SAM3p1.md；待读概念提示及 3.1 实现差异。

## 插图原则

原创机制示意，不复制论文布局或图像。图中尺寸、token 数量与流程若为教学设定，在图注说明；以实测或论文结果作图时须另列数据来源。每篇的图件、来源与数学断言随成稿追加，不用通用框图充当全部配图。

## 首批三篇的主张与图件验收

2026-10-26，前三篇初稿已经保存，仍为 draft，不算专题完成或公开发布。

- 历史篇依托 Papert 的三项具体目标、Marr 三层次、SIFT/HOG 的不同用途、AlexNet 的特征训练、ResNet 的退化、ViT 架构与 CLIP 监督的两条轴、ConvNeXt 的公平比较，形成过程性解释；不把“理论落寞”写成所有理论被证伪。
- 经典篇包含尺度选择、方向参照、4×4×8=128、0.3 与约 0.889 的比值例子、单应及内外点、HOG 的密集归一化流程。单应图的绿色点对由同一四点求解变换生成，避免仅凭肉眼画线却称其一致；红线为明确的错误候选。
- 卷积篇包含可手算互相关、通道与共享、432 个核权重、等变边界、监督目标、残差形状条件与 ConvNeXt 的训练配方混杂。手算输出三行均为 3、3、0，不是训练结果。
- 6 幅原创图的生成源为 `scripts/vision/create_figures.mjs`；实际 SVG 位于 `content/AI/Vision/assets/`。每图含 title、description、可编辑文字与原生形状，无第三方嵌图。已在 640 像素宽预览拼图中查看全部图，并单独复查修改后的匹配图；后续仍需核对公开网页中的实际显示。
- `scripts/vision/check_series.mjs --partial` 证明目前仅 3/12 篇存在，正文分别 2240、1951、1904 个中文字符，每篇两图，文献 key 与引用匹配，教学算术通过；它明确不核验史实、文章质量、渲染或部署。最终不得用 partial 模式替代完整验收。
- OpenReview 页面遇到浏览器验证后未绕过；ViT 的 ICLR 2021 发表信息由官方 PDF 的索引文本核实，正文机制读作者 arXiv HTML。ResNet 的 CVPR 2016 信息由 CV Foundation 正式记录核实；ConvNeXt 的 CVPR 2022 信息由作者摘要页 Comments 核实。

R1 定义、R2 算例、R3 来源、R4 比较与边界在首批三篇已做内容审阅；R5 完整专题及发布、R6 全部导航与公开独立阅读仍为 doing。数量门槛与来源足迹不能代替逐篇内容判断。
