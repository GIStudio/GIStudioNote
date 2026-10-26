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

## 第二批三篇的原始材料

| 标识 | 原始来源与核读位置 | 支持范围与重要边界 |
| --- | --- | --- |
| renFasterRcnn2015 | arXiv:1506.01497v3 摘要与 Introduction | RPN 与检测器共享特征、两阶段流程；不复述不同硬件条件的速度数字 |
| redmonYolo2016 | arXiv:1506.02640v5 摘要与 Introduction | 原始 YOLO 把整图映射为框与类别；不替所有后续 YOLO 版本概括同一架构 |
| carionDetr2020 | arXiv:2005.12872v3 第 1、3.1 节 | 固定预测槽、无对象、二分匹配、集合损失；训练中的匈牙利匹配与推理输出分开 |
| heMaskRcnn2017 | arXiv:1703.06870v3 摘要与第 1 节 | 语义/实例分割区分、并行 mask 分支、像素对齐问题；详细 RoIAlign 插值实现未展开 |
| kirillovSam2023 | arXiv:2304.02643v1 第 2–3 节 | 提示歧义、图像编码缓存、提示编码及 mask 解码；标准公开用法不把文本探索当成成熟文本定位器 |
| raviSam22024 | arXiv:2408.00714v2 第 3–4 节 | 视频提示、记忆注意力、帧与目标记忆；不把跨帧分割称为未来物理预测 |
| metaSam3Repository | 官方 sam3 README 的介绍与 Latest updates，核验 2026-10-26 | 概念提示、检测/跟踪解耦、2026-03-27 SAM 3.1 shared-memory 更新；性能为发布方自述，不独立背书 |
| dosovitskiyVit2021 | 补读 arXiv:2010.11929v2 第 3.1 节式 1–4 | patch 投影、class token、可学习位置表、注意力与 MLP；不称为无任何图像先验 |
| touvronDeit2021 | PMLR 139 正式论文页摘要与题录 | 数据效率、蒸馏 token、卷积教师；不是只改变 patchify |
| liuSwin2021 | arXiv:2103.14030v2 第 3.1–3.2 节及式 1–2 | 4×4 入口、2×2 合并、局部窗口与位移、固定窗口下的复杂度；位移不是一次就实现全局连接 |
| dehghaniNavit2023 | arXiv:2307.06304v1 第 2.1–2.3 节 | 打包多图、样本间注意力 mask、按图池化、可变分辨率与固定形状；v2 HTML 404 后改读 v1 |
| liuLlavaNext2024 | 官方 2024-01-30 博客正文前 14 行 | AnyRes 时代高分辨率、多宽高比、重用连接器；不从发布自报推断本专题的统一排名 |
| wangQwen2Vl2024 | arXiv:2409.12191v1 第 2.1 节 | 2D-RoPE、patch_size=14、相邻 2×2 合并，224 方图 64 内容 token 加两边界 token；不推广为所有 Qwen 版本同一处理器 |
| tschannenSiglip22025 | arXiv:2502.14786v1 摘要、第 2.4.2 节、第 3.1.1 节 | NaFlex 的预算、宽高比、整除调整、padding mask、位置表插值与训练范围；不把 NaFlex 说成完全不缩放或所有变体都加全部自监督损失 |

每篇动笔前均有五项以上可展开的具体材料。第二批以可复核 token 数、IoU 与窗口关系作教学设定，不进行性能实验。

另核读三个官方实现：Google 的 `vit_jax/models_vit.py` 中 AddPositionEmbs、Encoder1DBlock 和 VisionTransformer，确认 patch 投影可实现为同核同步幅卷积、class token 与归一化/MLP；LLaVA-NeXT 的 `mm_utils.py` 中 select_best_resolution、resize_and_pad_image、process_anyres_image，确认局部裁块之前的整图处理及全局缩略图分支；PyTorch 2.14 `scaled_dot_product_attention` 的定义与等价实现，确认分数、mask、Softmax 和 Value 汇总以及内存优化不等于消除全部计算。均为 2026-10-26 读取的在线版本，不声称固定到了某个已核验提交。

## 首批三篇的主张与图件验收

2026-10-26，前三篇初稿已经保存，仍为 draft，不算专题完成或公开发布。

- 历史篇依托 Papert 的三项具体目标、Marr 三层次、SIFT/HOG 的不同用途、AlexNet 的特征训练、ResNet 的退化、ViT 架构与 CLIP 监督的两条轴、ConvNeXt 的公平比较，形成过程性解释；不把“理论落寞”写成所有理论被证伪。
- 经典篇包含尺度选择、方向参照、4×4×8=128、0.3 与约 0.889 的比值例子、单应及内外点、HOG 的密集归一化流程。单应图的绿色点对由同一四点求解变换生成，避免仅凭肉眼画线却称其一致；红线为明确的错误候选。
- 卷积篇包含可手算互相关、通道与共享、432 个核权重、等变边界、监督目标、残差形状条件与 ConvNeXt 的训练配方混杂。手算输出三行均为 3、3、0，不是训练结果。
- 6 幅原创图的生成源为 `scripts/vision/create_figures.mjs`；实际 SVG 位于 `content/AI/Vision/assets/`。每图含 title、description、可编辑文字与原生形状，无第三方嵌图。已在 640 像素宽预览拼图中查看全部图，并单独复查修改后的匹配图；后续仍需核对公开网页中的实际显示。
- `scripts/vision/check_series.mjs --partial` 证明目前仅 3/12 篇存在，正文分别 2240、1951、1904 个中文字符，每篇两图，文献 key 与引用匹配，教学算术通过；它明确不核验史实、文章质量、渲染或部署。最终不得用 partial 模式替代完整验收。
- OpenReview 页面遇到浏览器验证后未绕过；ViT 的 ICLR 2021 发表信息由官方 PDF 的索引文本核实，正文机制读作者 arXiv HTML。ResNet 的 CVPR 2016 信息由 CV Foundation 正式记录核实；ConvNeXt 的 CVPR 2022 信息由作者摘要页 Comments 核实。

R1 定义、R2 算例、R3 来源、R4 比较与边界在首批三篇已做内容审阅；R5 完整专题及发布、R6 全部导航与公开独立阅读仍为 doing。数量门槛与来源足迹不能代替逐篇内容判断。

## 第二批三篇的主张与图件验收

2026-10-26，第 4–6 篇成稿，仍保留 draft。检测篇区分输出粒度、训练匹配与推理流程、SAM 的目标选择和语义能力；ViT 篇区分块数、输入展开维数、隐藏维数、多头通道分组和 Swin 跨窗传播；patch 篇区分裁块、入口切 patch、编码后合并与 NaViT 跨样本屏蔽。

- 三篇正文分别为 1883、1728、1818 个中文字符，每篇两图；来源与脚本断言通过，中文检查无硬失败。像素“对齐”为有效技术术语，未因警告删除。
- 六幅新 SVG 的 PNG 拼图已逐一查看；双杯输出、图像缓存复用、ViT 维数、Swin 位移窗口、两种切分层级、打包及样本间 mask 各承担不同解释任务，均为教学示意而非推理结果。
- 补充断言核对面积 16 的两个框交集 8 时 IoU 为 1/3、196+1=197、四头每头 64 维、196 到 784 个位置的平方项增长 16 倍、1024 到 256 的合并，以及 288/32 个打包空位。
- 全量检查通过：190 个 Markdown、33 个资源，TypeScript、Quartz 5、3 条既有重定向；过滤 10 个文件，其中包含本专题 6 篇草稿。生成 834 个文件不等于草稿已经公开渲染或上线。

第二批的 R1–R4 已作局部内容检查；完整专题数量、全部网页与线上图件仍未验收。

## 第三批三篇的原始材料与写作依据

| 标识 | 实际核读的公开位置 | 可支持范围及限制 |
| --- | --- | --- |
| radfordClip2021 | 补读 arXiv:2103.00020v1 第 2.3、3.1.2、3.1.4、6 节 | 批内配对、双向交叉熵、线性投影、归一化、文本构造分类器、提示和计数限制；不把相似度解释成开放世界校准置信度 |
| openaiClipImplementation | 官方 CLIP README 的 Usage 与 API，2026-10-26 | 两个独立编码接口、预处理与 logits 后 Softmax；安装示例年代较早，不复制为当前环境推荐 |
| zhaiSiglip2023 | arXiv:2303.15343v2 Algorithm 1、第 3.1–3.3 节 | 采用算法中的 logits=t·cos+b 符号，逐对 sigmoid 二分类、正负失衡、分块通信；不抄正文与算法间有差异的偏置符号/初始化细节，不称为没有负样本 |
| tschannenSiglip22025 | 补读 arXiv:2502.14786v1 第 2.1–2.4.2、3.2 节 | Sigmoid 加定位/描述训练解码器，标准变体后加自蒸馏与 mask 特征预测；训练解码器不在发布模型中，NaFlex 不应用第 2.3 节两损失 |
| chenSimclr2020 | arXiv:2002.05709v3 第 2.1–2.3、3.1 节 | 同图两视图、共享编码器、MLP、批内负例、增强组合与线性评估；同类异图可能形成假负例，增强假设应与任务相容 |
| heMae2021 | arXiv:2111.06377v3 第 3 节、4.1 的 masking ratio | 编码器只看可见 patch，轻解码器补 mask token，仅 mask 位置算像素 MSE，75% 为原文研究配置；不把预训练稀疏输入误写为部署永久丢失 75% 图像 |
| caronDino2021 | arXiv:2104.14294v2 第 3.1 节、Algorithm 1、Avoiding collapse | 不同裁块的教师学生分布匹配，教师 EMA、stop-gradient、centering/sharpening；EMA 单独不等于防坍缩证明 |
| oquabDinov22023 | arXiv:2304.07193v2 第 3–4 节 | 数据去重/检索整理，DINO 图级和 iBOT patch 级目标，教师特征目标区别于 MAE 像素重建；本次不比较各论文的总榜成绩 |
| simeoniDinov32025 | arXiv:2508.10104v1 第 4.1–4.3 节、式 2 | 长训的全局/密集分化，Gram 关系矩阵，早期教师与定期刷新，高分辨率平滑教师；不称为冻结全部特征或普适保证 |
| liBlip22023 | arXiv:2301.12597v2 第 3.1–3.3 节 | 32 个可学习查询、Q-Former 的交叉/自注意力、固定输出瓶颈、两阶段预训练和送入 LLM 前的投影；查询不是用户的 32 个文字问题 |
| alayracFlamingo2022 | arXiv:2204.14198v1 第 3.1.1–3.1.3 节，279 行附近的一次补读请求失败，已读正文/图注支持本次用法 | 时空特征到固定长度的 Perceiver Resampler，新增 gated cross-attention、冻结原语言层、多图注意力 mask；不写未补读的固定 token 数或详细 resampler KV 实现 |
| liuLlava2023 | arXiv:2304.08485v2 第 4.1–4.2 节与式 1 | CLIP 网格特征接线性投影，先对齐后指令微调；原始版本线性层与后续 MLP 版本分开，不把维数相等写成语义天然兼容 |
| baiQwen3Vl2025 | arXiv:2511.21631v2 第 2–2.3 节、图 1 | SigLIP2 初始化后继续训练的动态分辨率视觉塔、2×2 merger、三个中间层经专用 merger 加入前三个 LLM 层；Qwen3-VL 对 DeepStack 的改法与原始多尺度输入方案分开 |

第三批各文至少五件具体材料分别托住训练配对、候选集变化、自监督任务设计与接入路径。Softmax 的 2/1/0 分数、16 块遮去 12 块、三向量 Gram 矩阵与 256×1024→256×4096 都是独立教学设定，不是公开模型的实测输出或性能数据。

另补读 Transformers 官方实现 `models/qwen3_vl/modeling_qwen3_vl.py` 的语言层循环和 `_deepstack_process`（读取 2026-10-26 的 main，未固定提交）：`visual_pos_masks` 选择视觉位置，相加后写回；这支持正文与图件中“对应视觉位置、不额外延长序列”的描述。源文件头注释仅是来源代码数据，不据此修改上游文件。

## 第三批三篇的主张与图件验收

2026-10-26，第 7–9 篇及六幅新 SVG 完成。CLIP 篇区分配对关系与语义真值、候选概率与现实校准、SigLIP 的独立损失与负例构造；自监督篇逐步区分增强不变性、像素重建、教师特征与 Gram 关系；视觉塔篇沿长度和通道解释三种接口，并用论文与实现核对多层注入。

- 三篇正文中文字符为 1713、1942、2062，每篇两图；引用 key、原始链接与 arXiv 双链接通过检查。字数只是辅助门槛，语义检查分别核对定义、流程、算例、比较与限制。
- 六图的 640 像素预览拼图已全部查看。连接器图的 Unicode 下标字体出现缺字后，改用 dV/dL 并单独查看 1000 像素图，缺字已消除。其余图中配对数量、概率长度、可见块、旋转与矩阵对应无可见截断或重叠。
- 数值断言核对 Softmax 两组四舍五入结果、三组配对的六负例、四图两视图的六负例、16/196 块的可见隐藏计数、EMA 的 2.2、旋转不变的 3×3 Gram，以及 4194304 个投影权重。未运行模型，图与数值不作为性能证据。
- 公开扫描覆盖全体 9 篇，零错误零警告；第三批中文检查零失败，技术“对齐”和英文原题内连接号是有意义语境提醒，保留。最终视觉塔补充实现说明后检查仍通过。
- Node 22.16.0 全量检查通过，193 个 Markdown、39 个资源、TypeScript 与 Quartz 5，生成 840 个文件和 3 条既有重定向。过滤 13 个文件，其中本专题 9 篇仍为草稿；没有据此声明这 9 篇的公开网页已经验收。

R1–R4 在本批三篇做完局部检查。R5 的 12 篇完整专题及实际发布、R6 的全部导航和网页独立阅读仍为 doing；下一步不是发布 9 篇，而是完成剩余三篇及其六图。

下一批仅初步定位了 [TimeSformer](https://arxiv.org/abs/2102.05095)、[VideoMAE](https://arxiv.org/abs/2203.12602)、V-JEPA 2（候选 arXiv:2506.09985，尚待官方核实）与已记录的 OpenVision 3。这些检索命中不等于已核读机制，不据此添加正文结论。
