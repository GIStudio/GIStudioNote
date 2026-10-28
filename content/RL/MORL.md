---
title: 多目标强化学习
description: 矢量奖励与多目标强化学习（MORL）：标量化、Pareto 优化与约束三条路线，偏好条件策略，以及非线性效用下的关键区分。
tags:
  - RL
  - 强化学习
  - MORL
  - 多目标强化学习
  - multi-objective-RL
  - Pareto
---

**多目标强化学习**（Multi-Objective Reinforcement Learning, MORL）用奖励向量表达多个目标，并研究如何在这些目标之间做决策。

[[Reinforcement Learning|强化学习]]研究序列决策问题：智能体（Agent）在环境（Environment）中观察状态（State），选择动作（Action）；环境转移到新状态并给出奖励（Reward），智能体的目标是最大化累积奖励。MORL 保留这套交互框架，只把奖励从标量扩展为向量。

## 从标量奖励到矢量奖励

传统 RL 的奖励与优化目标：

$$
r_t \in \mathbb{R}, \qquad \max_\pi \mathbb{E}_\pi \left[ \sum_{t=0}^{\infty} \gamma^t r_t \right]
$$

MORL 中，奖励变为 $k$ 维向量：

$$
\mathbf r_t =
\begin{bmatrix}
r_t^{(1)} \\
r_t^{(2)} \\
\vdots \\
r_t^{(k)}
\end{bmatrix}
\in \mathbb{R}^k
$$

累积回报也相应成为向量：

$$
\mathbf G_t = \sum_{j=0}^{\infty} \gamma^j \mathbf r_{t+j}
$$

以城市交通信号控制为例，可以定义：

$$
\mathbf r_t =
\begin{bmatrix}
-\text{平均延误} \\
-\text{碳排放} \\
-\text{交通事故风险}
\end{bmatrix}
$$

三个目标都希望最大化，但彼此可能冲突。

核心困难在于：向量之间没有天然的全序关系。如果策略 A 的延误更低但排放更高，策略 B 恰好相反，就无法直接判断哪个更好——这正是 MORL 需要额外机制的原因。

## 矢量奖励如何指导策略学习

| 方法 | 核心思想 | 结果 |
| --- | --- | --- |
| Scalarization（标量化） | 按偏好将各奖励维度组合成标量目标 | 依给定偏好寻找策略 |
| Pareto Optimization（帕累托优化） | 寻找无法在不损害其他目标的情况下继续改善的策略 | 近似一组非支配策略 |
| Constrained RL（约束强化学习） | 优化主目标，同时要求其余指标满足约束 | 寻找满足约束的策略 |

最简单的是加权标量化：

$$
r_t = w_1 r_t^{(1)} + w_2 r_t^{(2)} + w_3 r_t^{(3)}
$$

权重固定后，问题还原为普通 RL，可以直接使用 [[DRL|深度强化学习]] 中的算法。

更有意思的是 **Preference-Conditioned MORL**：让策略把偏好向量作为条件输入：

$$
\pi(a \mid s, \mathbf w)
$$

这样一个训练好的模型可以随偏好变化表现出不同的决策行为，而不必为每组权重单独训练。

## 值得注意的研究问题

- **目标冲突**：如何近似整个 Pareto Front（非支配策略构成的边界），而不遗漏有价值的折中策略？
- **偏好泛化**：训练时只见过部分权重，能否泛化到未见过的目标组合？
- **非线性效用**：当目标之间存在阈值效应或非线性关系时，如何学习策略？

第三点涉及一个重要区分：对标量化函数 $u$，"先取期望再标量化" $u(\mathbb{E}[\mathbf G])$ 与"先标量化再取期望" $\mathbb{E}[u(\mathbf G)]$ 在 $u$ 非线性时通常不相等。二者对应不同的决策含义，建模时需要明确选择哪一种。

## 回到对强化学习的定义

环境中的状态转移与奖励承担不同作用：状态转移描述动作后状态如何变化，奖励用于定义优化目标。在 [[concepts/MDP|马尔可夫决策过程]] 中，状态转移概率 $P(s' \mid s,a)$ 与奖励函数 $R$ 分别描述这两部分。

## 小结

- 矢量奖励的 RL 存在，即多目标强化学习；难点不在表示，而在向量目标之间没有全序。
- 三条主要路线：标量化、Pareto 优化、约束优化。
- 偏好条件策略可以将目标权重作为输入，以研究偏好变化时的决策。

## 来源

- Conor F. Hayes et al., [A Practical Guide to Multi-Objective Reinforcement Learning and Planning](https://link.springer.com/article/10.1007/s10458-022-09552-y), _Autonomous Agents and Multi-Agent Systems_, 2022.
- Richard S. Sutton and Andrew G. Barto, _Reinforcement Learning: An Introduction_, 2nd ed., [官方在线版](http://incompleteideas.net/book/the-book-2nd.html)。
