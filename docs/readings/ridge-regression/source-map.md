# 岭回归双篇来源与验收

范围：数学篇解释估计量和稳定性，机器学习篇解释泛化与选参；共用残差平方和加惩罚的记号。`concept-note` 负责概念与算例，GIStudio Notes 发布流程负责导航和上线。核验日期：2026-11-06。

| 主张 | 来源及位置 |
| --- | --- |
| 岭回归、正规矩阵对角增量、非正交特征与估计偏差 | [Hoerl 与 Kennard（1970）出版记录](https://doi.org/10.1080/00401706.1970.10488634)，卷 12(1)，55–67；[原文](https://www.stat.cmu.edu/technometrics/70-79/VOL-12-01/v1201055.pdf)导言及岭估计性质。特征方向、条件数、MAP 与教学数据用正文所列假设推导。 |
| `Ridge` 的目标、截距、`alpha=0` 与 SVD 求解 | [scikit-learn 1.9.1 `Ridge` API](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html) 的目标、`alpha`、`fit_intercept`、`solver` 段。与平均平方误差记号的参数换算按同一目标推导。 |
| 划分、折内预处理与网格选参 | [scikit-learn 数据泄漏指南](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage) 与 [`GridSearchCV` API](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html)；随机折示例只用于可交换样本。 |
| L2 逻辑回归、软间隔分类 SVM、Lasso | [线性模型指南](https://scikit-learn.org/stable/modules/linear_model.html)中 Logistic regression 与 Lasso；[SVM 数学形式](https://scikit-learn.org/stable/modules/svm.html#mathematical-formulation)中的 C-SVC。比较损失与惩罚，不泛化到所有变体。 |
| 普通 SGD 的等价条件与 AdamW | [Loshchilov 与 Hutter（ICLR 2019）](https://openreview.net/forum?id=Bkg6RiCqY7)；正式入口触发浏览器校验，论证核对作者[公开稿 §2 与附录 A](https://arxiv.org/html/1711.05101v3#S2)。 |

算例为教学构造，不引用实验性能。上线证据以本次提交对应的 Pages 工作流及实际正文为准。

## 内容验收

- R1、R5（完成）：数学篇覆盖目标、闭式解、条件数和 MAP；机器学习篇覆盖泛化、L2 对照与工具使用。两篇分别进入数学基础、AI 索引的机器学习小节。
- R2（完成）：精确分数复算两例，系数与条件数、三组偏差—方差误差均相符。机器学习篇的原样代码在临时 scikit-learn 1.9.1 环境中使用合成数据运行，选出候选集内的 `alpha` 并计算有限的测试误差。
- R3、R4（完成）：按上表核对来源；秩亏下的零惩罚、平方和与平均平方损失的系数换算、折内标准化、普通 SGD 与 AdamW 的适用条件分别说明。
- R6（完成）：两篇有独立定义、可复算算例和互链；本地生成页含 8 个展示公式和 2 条参考文献，两个索引均指向相应文章。Node 22.16.0 下 `npm run check:content` 通过（204 个 Markdown、50 个资源）。公开审计的两处提醒是 `StandardScaler` 中的 `nda` 子串，已核对为公开 API 名称。
