---
title: 岭回归的数学：闭式解、谱收缩与高斯先验
description: 从两个高度相关的特征出发，推导岭回归的正规方程，解释条件数、奇异方向收缩和最大后验估计。
tags:
  - 线性代数
  - 统计学
  - 岭回归
  - 正则化
verified_at: 2026-11-06
---

**岭回归是带平方 L2 惩罚的线性最小二乘。** 当两列特征高度正相关且尺度相近时，模型可以同时增大一个系数、减小另一个系数，训练预测却几乎不变。这时数据很难确定两列应怎样分担预测。岭回归为大系数加上代价，优先收缩数据难以辨认的方向。[@hoerlRidgeRegressionBiased1970]

## 从目标到唯一解

设 $X\in\mathbb R^{n\times p}$ 是设计矩阵，每行对应一个样本；$y\in\mathbb R^n$ 是目标，$w\in\mathbb R^p$ 是斜率。先令各特征列和目标中心化，从而把截距单独处理。若原模型写作 $b+x^\top w$，未惩罚的截距可由训练均值恢复为 $b=\bar y-\bar x^\top w$。

岭回归最小化残差平方和与系数平方和的加权和，$\lambda\geq 0$ 控制惩罚强度：

$$
J_\lambda(w)=\lVert y-Xw\rVert_2^2+\lambda\lVert w\rVert_2^2.
$$

令梯度 $2X^\top(Xw-y)+2\lambda w$ 为零，得到正规方程及其闭式解，其中 $I$ 是 $p\times p$ 单位矩阵：

$$
(X^\top X+\lambda I)\hat w_\lambda=X^\top y,
\qquad
\hat w_\lambda=(X^\top X+\lambda I)^{-1}X^\top y\quad (\lambda>0).
$$

对任意非零向量 $a$，矩阵的二次型为 $\lVert Xa\rVert_2^2+\lambda\lVert a\rVert_2^2>0$，所以正惩罚使正规矩阵正定，斜率解唯一。$\lambda=0$ 时目标回到普通最小二乘（OLS）。如果 $X$ 列秩不足，最小二乘系数可以有多个，训练集上的拟合值仍然唯一。此时不能把 $\lambda=0$ 直接代入逆矩阵；当 $\lambda$ 从正侧趋于零，岭估计趋向最小二乘解中欧氏范数最小的一个。

## 为什么弱方向收缩得更多

对每个非零奇异值 $s_i$，令 $u_i$ 和 $v_i$ 分别为 $X$ 的左、右奇异向量。$v_i$ 表示系数空间中的一个方向，$s_i$ 表示沿该方向改变系数能让拟合值变化多少。把正规方程投影到 $v_i$，可得：

$$
v_i^\top\hat w_\lambda
=\frac{s_i}{s_i^2+\lambda}u_i^\top y
=\underbrace{\frac{s_i^2}{s_i^2+\lambda}}_{\text{收缩因子}}\frac{u_i^\top y}{s_i}.
$$

末项 $u_i^\top y/s_i$ 是该方向上的最小二乘系数。$s_i$ 小时，最小二乘会放大目标在这个方向上的扰动，岭回归的收缩因子则更小；对 $X$ 的零空间方向，岭系数直接取零。这里说的是奇异方向的收缩。转回原始特征坐标后，单个系数的绝对值未必随 $\lambda$ 单调下降。

### 算例：两列一起变，与一增一减

取一组中心化的教学数据。两列平方和都是 10，相关系数为 0.9，给定内积矩阵和目标内积：

$$
X^\top X=\begin{pmatrix}10&9\\9&10\end{pmatrix},
\qquad X^\top y=\begin{pmatrix}12\\8\end{pmatrix}
=10\begin{pmatrix}1\\1\end{pmatrix}+2\begin{pmatrix}1\\-1\end{pmatrix}.
$$

同向和反向两个方向的特征值分别为 19 和 1。OLS 把右端在两个方向上的分量分别除以 19 和 1，得到约 $(2.526,-1.474)$。取 $\lambda=1$ 后，分母变为 20 和 2，得到 $(1.5,-0.5)$。同向分量只略微缩小，反向分量则减半。

一般地，设 $s_{\max}^2$ 和 $s_{\min}^2$ 是 $X^\top X$ 的最大和最小特征值，列秩不足时后者为零。对 $\lambda>0$，正规矩阵的 2-范数条件数为：

$$
\kappa_2(X^\top X+\lambda I)=\frac{s_{\max}^2+\lambda}{s_{\min}^2+\lambda}.
$$

在算例中，条件数从 $19/1=19$ 降为 $20/2=10$。这解释了为何对角增量能改善线性系统的条件。实现时可直接解线性方程组，或用奇异值分解（SVD）求解，没必要显式计算逆矩阵。数值条件变好与测试误差变小是两件需要分别判断的事。[scikit-learn 的求解器说明](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)

## 高斯先验怎样给出同一个目标

给定 $X$ 和截距 $b$，假设 $y=b\mathbf 1+Xw+\varepsilon$，其中 $\mathbf 1$ 是全 1 向量，噪声 $\varepsilon\sim\mathcal N(0,\sigma^2 I_n)$。给斜率设独立同方差的零均值高斯先验 $w\sim\mathcal N(0,\tau^2 I_p)$，截距不加惩罚。去掉与 $b,w$ 无关的常数，负对数后验为：

$$
\frac{\lVert y-b\mathbf 1-Xw\rVert_2^2}{2\sigma^2}+\frac{\lVert w\rVert_2^2}{2\tau^2}.
$$

乘以 $2\sigma^2$，再消去截距，就得到前面的岭目标，其中 $\lambda=\sigma^2/\tau^2$。因此在这些假设下，岭估计是最大后验估计（MAP）；先验方差越小，越偏好接近零的系数。换用按样本数平均的平方损失时，惩罚系数的数值也要随目标一起换算。

怎么用验证集选择惩罚强度、怎样理解测试误差，见[[../AI/ridge-regression-machine-learning|机器学习篇]]。
