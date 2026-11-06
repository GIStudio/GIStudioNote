---
title: 岭回归：监督学习中的正则化线性模型
description: 用偏差与方差算例解释岭回归的泛化取舍，给出 scikit-learn 选参流程，并区分逻辑回归、SVM 与 AdamW 的 L2 机制。
tags:
  - 机器学习
  - 监督学习
  - 岭回归
  - 正则化
verified_at: 2026-11-06
---

**岭回归是监督学习里的线性回归模型，用带标签的样本学习一个预测连续数值的函数。** 例如，用一组住宅特征预测租金，同单位的两种面积测量值可能高度正相关。普通最小二乘可能给它们分配一正一负、绝对值都很大的系数，以拟合两列之间的细微差别；其中一部分差别可能只是训练样本里的噪声。岭回归仍然学习同一类线性函数，只是在拟合时给过大的系数增加代价。

给定 $n$ 条训练样本，$x_i$ 是第 $i$ 条特征，$y_i$ 是它的目标值。预测为 $b+x_i^\top w$，岭回归最小化：

$$
\sum_{i=1}^{n}(y_i-b-x_i^\top w)^2+\lambda\lVert w\rVert_2^2.
$$

这里 $b$ 是未惩罚的截距，$w$ 是斜率，$\lambda\geq0$ 是惩罚系数。$\lambda=0$ 是普通最小二乘目标；正的 $\lambda$ 让拟合在残差和系数大小之间取舍。它在统计学中是估计量，在机器学习中也可以作为一个独立训练、调参和评估的预测模型。[`Ridge` 官方文档](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html)；[[../Math/ridge-regression|数学篇：闭式解与谱收缩]]。

## 为什么适量收缩可能改善预测

重复采集训练样本时，估计值会变化。**偏差**是估计的平均值与真值的差，**方差**描述它在重复训练中的波动。岭回归会把平均估计拉向零，可能增加偏差，同时减少系数随噪声的波动。是否值得取舍，要看预测误差而非训练残差。

考虑一个教学例子：已知截距为零，两个固定训练输入为 $-\sqrt 2,\sqrt 2$，真斜率为 1，每个响应的噪声相互独立、均值为 0、方差为 1。两点的输入平方和是 4，所以岭斜率的均值为 $4/(4+\lambda)$，方差为 $4/(4+\lambda)^2$。在新输入 $x=1$ 处，对无噪声目标 1 的期望平方预测误差等于偏差平方加方差：

$$
\operatorname{MSE}(\lambda)=\frac{\lambda^2+4}{(4+\lambda)^2}.
$$

在这个例子里，$\lambda=0$ 时误差为 $0.25$，$\lambda=1$ 时降到 $0.20$，$\lambda=12$ 时升到约 $0.578$。适量收缩减少的方差超过新增的偏差平方，过强收缩则丢失了真信号。这里取的是重复训练噪声下的期望；实际应用要用符合部署情形的验证数据选参。

## 用 scikit-learn 选 `alpha`

[`Ridge`](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html) 使用残差**平方和**，所以它的 `alpha` 对应上式的 $\lambda$。若某份教材把平方和除以 $n$ 后再加 $\lambda_{\rm mean}\lVert w\rVert_2^2$，在同样数据和预处理下应使用 `alpha` $=n\lambda_{\rm mean}$。需要未正则化的基线时，使用 `LinearRegression`。

L2 惩罚依赖特征尺度。例如，把面积单位从平方米改为平方厘米，同一个预测函数的面积系数会缩小，原始系数的惩罚也随之变化。常见做法是先标准化数值特征。下面假设已为可随机划分的独立样本留出测试集；`X_train`、`y_train` 和 `X_test`、`y_test` 分别是训练与测试数组。

```python
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import GridSearchCV, KFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipeline = Pipeline([("scale", StandardScaler()), ("ridge", Ridge())])
search = GridSearchCV(
    pipeline,
    {"ridge__alpha": [0.01, 0.1, 1, 10, 100]},
    cv=KFold(n_splits=5, shuffle=True, random_state=42),
    scoring="neg_mean_squared_error",
)
search.fit(X_train, y_train)
test_mse = mean_squared_error(y_test, search.predict(X_test))
print(search.best_params_, test_mse)
```

搜索的是整条流水线：每一折先用该折训练子集估计均值和标准差，再变换该折验证子集。选定参数后，默认在全部训练数据上重拟合，最后报告留出的测试误差。时间序列、同组重复观测或需要迁移到新区的空间数据，应按实际预测边界划分验证折；流水线只负责预处理的折内拟合。[scikit-learn 数据泄漏指南](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage) · [网格搜索文档](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html)

## 同样的 L2 惩罚可以配不同损失

| 模型 | 数据拟合项 | 权重惩罚的作用 |
| --- | --- | --- |
| 岭回归 | 连续目标的平方残差 | 收缩线性回归系数 |
| L2 逻辑回归 | 分类的对数损失（交叉熵） | 约束分类权重 |
| 经典软间隔分类 SVM | 铰链损失，惩罚落在间隔内或被错分的样本 | 与间隔违例的代价共同决定分类边界 |

三者可共享平方权重惩罚，但拟合项和输出不同。[逻辑回归目标](https://scikit-learn.org/stable/modules/linear_model.html#binary-case) · [软间隔 SVM 目标](https://scikit-learn.org/stable/modules/svm.html#mathematical-formulation)

神经网络中，**权重衰减**描述优化器怎样更新参数。在普通无动量 SGD 中，若给数据损失 $L(w)$ 加上 $\tfrac{\gamma}{2}\lVert w\rVert_2^2$，学习率为 $\eta$，更新就是 $(1-\eta\gamma)w-\eta\nabla L(w)$。对 Adam 一类自适应优化器，把 L2 惩罚并进梯度会改变矩估计；AdamW 把参数衰减与自适应梯度更新分开，通常不会得到相同的更新。[@loshchilovDecoupledWeightDecay2019]

岭回归适合作为连续值预测的线性基线，特别是在特征较多、系数对样本变化敏感时。它通常保留所有特征；如果目标是得到一组稀疏系数，可以比较使用 L1 惩罚的 [Lasso](https://scikit-learn.org/stable/modules/linear_model.html#lasso)。如果线性函数本身不足以描述关系，应考虑特征变换或其他模型。惩罚强度、模型形式和实际预测表现，最终都要在同一验证口径下判断。
