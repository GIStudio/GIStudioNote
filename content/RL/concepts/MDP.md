---
title: Markov Decision Process
description: Markov Decision Process的核心概念、方法、项目与相关研究笔记。
tags:
  - RL
  - MDP
  - Markov-Decision-Process
  - Bellman-equation
  - dynamic-programming
---

马尔可夫决策过程（Markov Decision Process, MDP）是描述序贯决策问题的数学
框架。它通常写成五元组：

$$
\mathcal{M}=(\mathcal{S},\mathcal{A},P,R,\gamma)
$$

- $\mathcal{S}$：状态空间；
- $\mathcal{A}$：动作空间；
- $P(s' \mid s,a)$：执行动作后转移到下一状态的概率；
- $R(s,a,s')$：转移产生的即时奖励；
- $\gamma \in [0,1)$：未来奖励的折扣因子。

## 马尔可夫性质

MDP 假设：给定当前状态和动作后，下一状态的分布不再依赖更早的完整历史。
这不是说历史没有作用，而是要求当前状态已经包含决策所需的信息。如果状态
不能表达这些信息，就需要考虑状态重构或 POMDP。

## 与强化学习的关系

MDP 定义问题；强化学习研究在未知或难以直接使用转移模型时，如何通过交互
数据学习策略。价值函数和贝尔曼方程建立了即时奖励与长期回报之间的递归关系。

返回 [[../Reinforcement Learning|强化学习总纲]]。

## 来源

- Richard S. Sutton and Andrew G. Barto, _Reinforcement Learning: An
  Introduction_, 2nd ed., [官方在线版](http://incompleteideas.net/book/the-book-2nd.html)。
