# 降维方法地图：来源、demo 与验收

范围：把 Encord 文章列出的降维技术整理成「特征选择 / 特征投影」两类，并补上原文只提及名字的 Isomap、LLE 与 kernel LDA。解释机制、保留结构与失败模式；不比较方法排名，不重跑原文的案例，也不把教学 demo 当作基准。核验日期：2026-11-11。

原文：[Top 12 Dimensionality Reduction Techniques for Machine Learning](https://encord.com/blog/dimentionality-reduction-techniques-machine-learning/)（URL 中的 `dimentionality` 是原文拼写）。原文清单含 Manifold Learning、PCA、ICA、Sequential NMF、LDA、GDA、MVR、Low Variance Filter、High Correlation Filter、Forward Feature Construction、Backward Feature Elimination、Autoencoders；正文另提到 Isomap、LLE、kernel PCA 与 QDA。

## 主张与来源

| 正文主张 | 来源与核对位置 | 边界 |
| --- | --- | --- |
| PCA 寻找方差最大的正交方向，等价于最小化线性重构误差 | [Pearson 1901](https://doi.org/10.1080/14786440109462720)；[Hotelling 1933](https://doi.org/10.1037/h0070888) | 经典定义与几何解释；「累计解释方差 95%」是启发式，正文没有给出普适阈值。 |
| ICA 恢复相互独立、非高斯的源；顺序、符号、尺度不可识别；至多一个高斯源 | [Comon 1994](https://doi.org/10.1016/0165-1684(94)90029-9)；[Hyvärinen 1999](https://doi.org/10.1109/72.761722) | 可识别性条件来自 ICA 理论；正文不声称 ICA 能处理任意依赖结构或任意源数量。 |
| NMF 用非负基与系数做加法分解，常用于「部分组成整体」的表示 | [Lee & Seung 1999](https://doi.org/10.1038/44565)；[Lee & Seung 2001](https://papers.nips.cc/paper/1861-algorithms-for-non-negative-matrix-factorization) | 原文的 parts-based 解释是方法动机；正文明确基向量不保证对应人类语义。 |
| LDA 最大化类间/类内散度比，最多 $C-1$ 个判别方向 | [Fisher 1936](https://doi.org/10.1111/j.1469-1809.1936.tb02137.x) | 秩约束来自类散度矩阵的结构；正文区分「投影定义」与「高斯等协方差假设下的分类最优性」。 |
| GDA（Generalized Discriminant Analysis）是核化 LDA | [Baudat & Anouar 2000](https://doi.org/10.1162/089976600300014980) | 原文用 GDA 指这一方法；正文同时提示 GDA 也可指 Gaussian Discriminant Analysis，需看上下文。 |
| Isomap 用邻域图最短路径估计测地距离，再做经典 MDS | [Tenenbaum, de Silva & Langford 2000](https://doi.org/10.1126/science.290.5500.2319) | 一致性依赖采样密度与邻域图质量；正文列出断裂与短路边两种失败模式。 |
| LLE 保持局部线性重构权重，不保持全局尺度 | [Roweis & Saul 2000](https://doi.org/10.1126/science.290.5500.2323) | 正文只声称局部关系被约束，不把 LLE 坐标当作全局距离。 |
| 自编码器由编码器、瓶颈与解码器组成，以重构误差训练 | [Rumelhart, Hinton & Williams 1986](https://doi.org/10.1038/323533a0)；[Hinton & Salakhutdinov 2006](https://doi.org/10.1126/science.1127647) | 1986 年论文是反向传播与表示学习的基础；2006 年论文展示深层自编码器的降维用途。正文不声称自编码器优于线性方法。 |
| 过滤式与包裹式特征选择的区别、包裹式的组合搜索 | [Guyon & Elisseeff 2003](https://www.jmlr.org/papers/v3/guyon03a.html)；[Kohavi & John 1997](https://doi.org/10.1016/S0004-3702(97)00043-X) | 方法分类与搜索框架；具体的 30%、0.1、0.9 阈值来自本文 demo，不是论文推荐值。 |
| 缺失数据机制（MCAR / MAR / MNAR）与处理选项 | [Little & Rubin 2019](https://doi.org/10.1002/9781119482260) | 教科书框架；正文不估计任何真实数据的缺失机制。 |
| 高维空间中最近邻与最远邻距离比趋于 1 | [Beyer 等 1999](https://doi.org/10.1007/3-540-49257-7_15) | 结论依赖分布假设；正文用它解释距离方法的退化风险，不声称所有高维数据都不可用。 |
| t-SNE、UMAP 的局部/全局权衡 | 见 [[dimensionality-reduction-visualization|降维可视化笔记]]及其引用的 van der Maaten & Hinton 2008、McInnes 等 2018 | 本篇不重复展开，只链接。 |

## 对原文的修正

| 原文说法 | 本文处理 |
| --- | --- |
| 「Sequential NMF」作为独立方法列出 | 标注为非标准术语；通常指预处理或逐层流程，不是与 PCA/ICA 并列的算法。 |
| 「GDA」直接列为降维方法 | 明确其为 Generalized Discriminant Analysis（kernel LDA），并提示与 Gaussian Discriminant Analysis 的缩写冲突。 |
| 把 autoencoder 与 GAN 放在同一语境 | 正文明确区分：自编码器优化重构，GAN 优化生成与判别的对抗目标。 |
| MVR 阈值「20%–60% 常见」 | 保留为经验区间的转述，同时说明缺失机制与缺失本身的信息量会改变判断。 |
| 低方差/高相关过滤作为通用步骤 | 加入量纲、稀有事件、保留哪一列的反例；阈值写成启发式，并要求敏感性检查。 |
| LDA 的高斯假设 | 说明假设主要影响分类最优性的解释；投影本身仍可计算，但需要正则化与验证。 |
| 把降维方法列成清单 | 改为按输出（原列/新坐标）、标签、线性性组织的决策地图，并加入特征选择与投影的区别。 |

## Demo 构造与复算

脚本：`scripts/generate_dimred_method_figures.py`。样式读取 `scripts/matplotlib-style.mplstyle`，随机种子固定；输出 SVG（网页）与 PNG（回退）到 `content/DL/images/`。

| 图 | 数据与设置 | 复算数值 |
| --- | --- | --- |
| 方法地图 | 手工布局的流程图，无数据 | — |
| 过滤式 | 600 个样本、8 列合成数据；`missing_signal` 随机缺失 45%；方差与相关在中位数填补后计算 | 缺失比例 45.2%；`rare_flag` 方差 0.0212；`near_const` 方差 $9.9\times10^{-7}$；`scaled_noise` 方差 930,100；`signal_a_copy` 与 `signal_a` 相关 0.987；`missing_signal` 与 $y$ 相关 0.381 |
| 包裹式 | 240 个样本、20 列、5 个信息特征；逻辑回归 + 标准化；5 折分层 CV；留出 30% 测试 | 前向：6 列，CV 0.833，训练 0.845，测试 0.750；后向：9 列，CV 0.851，训练 0.869，测试 0.792；全特征：CV 0.762，测试 0.708 |
| ICA | 800 个时间点；正弦波与方波经固定混合矩阵叠加，噪声 0.05；FastICA | 对齐后相关 0.994 与 0.997 |
| NMF | 1797 个 8×8 手写数字，像素除以 16；9 个成分；`init="nndsvda"` | 单样本重构 MSE 0.00872；全体 MSE 0.02723 |
| LDA / kernel LDA | 600 个同心圆样本，标准化，70/30 划分；RBF 核 $\gamma=1$，正则 $10^{-2}$；1-NN 探针 | 测试 1-NN：PCA 0.722，LDA 0.744，kernel LDA 1.000 |
| 流形学习 | 2000 点瑞士卷，噪声 0.01；Isomap 与 LLE 均取 10 个邻居 | Isomap 第一轴与真实位置的相关系数 0.992 |
| 自编码器 | 1797 个手写数字，80/20 划分；64→32→2→32→64，Tanh/Sigmoid，Adam，250 epoch | 测试 MSE 0.0395；瓶颈 1-NN 0.731 |

复算方式：直接运行脚本，脚本会打印上表数值；图与数值由同一次运行产生。环境为 Python 3.9、scikit-learn 1.6.1、numpy 2.0.2、scipy 1.13.1、torch（本机版本）。当前 BLAS/sklearn 组合会在中间矩阵乘法上打印 `RuntimeWarning: ... in matmul`，但最终矩阵有限、结果可复现；脚本只屏蔽这一类已知噪声。

## 内容边界

- 所有 demo 是教学示例：单一数据划分、未做超参数搜索、未估计置信区间，不能据此给方法排名。
- 包裹式测试集只有 72 个样本；0.750 与 0.792 相差约 3 个样本，正文明确不据此判定优劣。
- kernel LDA 的 1.000 来自线性不可分、核方法占优的合成数据，不能外推到真实任务；核参数未调。
- 自编码器只训练了一个瓶颈维数和一组超参数；1-NN 只是表示质量的粗略探针。
- Isomap 的展开结果依赖噪声与邻居数；正文列出了断裂与短路边，不把单张图当作流形恢复的证明。
- NMF 的基向量图经过逐基向量归一化显示；这不改变分解结果，只影响可视化对比度。
- 过滤式图中的方差与相关在中位数填补后计算，仅用于演示阈值行为；正文明确这不是推荐流程。

## 内容验收

- `npm run audit:content`：通过（208 个 Markdown、68 个资源）。
- 公开边界脚本：0 错误、0 提醒（`redundant` 列已改名为 `signal_a_copy`，避免与 NDA 缩写误匹配）。
- `npm run check:content`：通过（audit + `tsc --noEmit` + 站点构建）。
- 渲染检查：8 张图全部加载；表格、公式、文内引用与自动参考文献正常；正文链接到降维可视化笔记与深度学习索引。
- 未发布：本次未推送，线上核验待发布后补充。
