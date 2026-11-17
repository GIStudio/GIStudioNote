---
title: "表征学习：从输入向量到生成与微调"
description: "沿着输入、逐层变换、读出与任务适配，理解表征怎样形成、如何检验，以及生成模型怎样使用潜空间。"
tags:
  - 表征学习
  - 深度学习
  - 生成式AI
  - 索引
---

模型读到 `by the river bank` 和 `approved by the bank`，可以先为两处 `bank` 查到同一行向量。读到这一行还分不出河岸和银行；沿着模型走几层，左侧上下文就能参与计算。接下来可以做三件不同的事：预测下一词、从向量读出词义，或者调整部分参数让模型更擅长一项新任务。**表征学习关心的是：什么计算把输入变成了可用的表征，训练目标又让这种表征便于做什么？**

## 从模型输入读到输出

1. [[AI/GenAI/Representation-Learning/what-is-a-representation|什么是表征，模型又学到了什么？]] 两盏灯的例子区分了「保留哪些信息」「后续能读出什么」和「编码方式怎么学」。
2. [[AI/GenAI/Representation-Learning/tokenization-and-embeddings|从切词、编号到嵌入向量]] 对照文字、图像 patch 和学到的离散码，算一遍查表，看看哪些是规则、哪些从数据学来。
3. [[AI/GenAI/Representation-Learning/forward-pass-and-readouts|一次前向计算中，表征怎样变成预测？]] 跟着词元走过注意力、隐藏状态和输出头，区分概率、激活与反向梯度。

## 换一个任务，需要改什么？

4. [[AI/GenAI/Representation-Learning/probing-and-fine-tuning|换输出头、线性探针与微调]] 先冻结主干，测量现有表征的可读性，再看训练哪些参数会改变主干的计算。
5. [[AI/GenAI/Representation-Learning/lora-low-rank-updates|LoRA：给哪一块矩阵加多少参数？]] 从一块矩阵算起，推到多个 Transformer 块，比较低秩更新、适配器和软提示的改动位置。

## 看表征怎样参与生成

6. [[AI/GenAI/Representation-Learning/representations-in-generative-models|生成模型怎样使用表征？]] 文本模型反复读取隐藏状态来续写，潜空间扩散模型则在编码后的图像张量上去噪。两种计算用到的「表征」各指什么，可以分别检验。

如果只想理解「词向量为什么看起来有语义」，读前两篇后可以转到[[DL/Embeddings/index|词向量专题]]看 SGNS 的目标和负采样；如果想了解图像表示，则可以从第六篇接到[[AI/GenAI/latent-space-dimensions|潜空间的维度、范围和精度]]，或去[[AI/Vision/self-supervised-visual-learning|视觉自监督学习]]比较训练目标怎样塑造特征。
