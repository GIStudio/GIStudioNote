---
title: 图学习
description: 图学习的核心概念、方法、项目与相关研究笔记。
tags:
  - graph-learning
  - GNN
  - urban-computing
  - GIS
  - 教程
  - 图神经网络
  - 节点嵌入
  - 时空图神经网络
---
## 图学习与城市数据

图学习研究如何利用节点、边及其属性完成预测或表示学习。在城市计算中，节点可以表示路口或社区，边可以表示道路连接或地理邻近。本页按图表示、节点嵌入、图神经网络和城市应用组织学习路线。

## 教程大纲

以下是教程的详细大纲，包括每个部分的关键知识点、预习资料、主要内容、检验题目以及城市感知计算的应用。

### 第一部分：图学习简介

- 关键知识点：
    
    - 图在数据科学中的定义：节点代表实体，边代表关系。
        
    - 图学习的重要性：能够利用数据间的关系结构，适用于社会网络、生物网络和城市系统。
        
    - 建模重点：图学习将节点之间的关系显式纳入表示或预测；具体方法能否利用这些关系，取决于任务与模型设计。
        
    - 在GIS和城市计算中的例子：如道路网络（节点为交叉口，边为道路）或社区分析。
        
- 预习资料：
    
    - 图论基础：学习节点、边、邻接矩阵等概念，可参考[GeeksforGeeks Graph Theory](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/).
        
    - 机器学习基础：了解监督学习、非监督学习和半监督学习，可参考[Scikit-learn Documentation](https://scikit-learn.org/stable/).
        
- 主要内容：
    
    - 图的表示：介绍邻接矩阵（方阵表示节点间连接）和邻接列表（列表表示每个节点的邻居）。
        
    - 图的类型：区分有向图（边有方向）和无向图（边双向），以及加权图（边有权重）和非加权图。
        
    - 常见图学习任务：包括节点分类（预测节点类别）、链接预测（预测节点间是否存在边）和图分类（预测整个图的类别）。
        
- 检验题目：
    
    - 什么是图中的节点和边的区别？
	    - 节点是实体，边是实体之间的关系。
        
    - 举一个可以用图学习建模的现实问题例子。
	    - 交通可以通过图建模
        

### 第二部分：图表示和特征工程

- 关键知识点：
    
    - 如何为机器学习算法表示图：包括节点特征、边特征和图特征。
        
    - 节点嵌入技术：如Node2Vec和DeepWalk，用于将节点映射到低维向量空间。
        
    - 图嵌入技术：如Graph2Vec，用于表示整个图的向量。
        
- 预习资料：
    
    - 传统机器学习中的特征工程：了解如何选择和转换特征，可参考[Feature Engineering for Machine Learning](https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/).
        
    - 神经网络基础：学习前向传播和反向传播，可参考[Deep Learning Book](https://www.deeplearningbook.org/).
        
- 主要内容：
    
    - 节点特征和边特征：例如，在交通网络中，节点特征可能是交通流量，边特征可能是道路长度。
        
    - 图嵌入方法：
        
        - DeepWalk：通过随机游走生成节点序列，类似文本处理中的Word2Vec，学习节点嵌入。
            
        - Node2Vec：扩展DeepWalk，允许偏向随机游走，捕捉图的结构特性。
            
    - 选择适当特征：根据任务选择节点特征（如节点分类需要邻居信息）或边特征（如链接预测需要共同邻居）。
        
- 检验题目：
    
    - 解释节点嵌入是什么，为什么它有用？
        
    - 比较Node2Vec和DeepWalk的异同。
        

### 第三部分：图神经网络（GNN）

- 关键知识点：
    
    - GNN简介：通过消息传递从邻居节点聚合信息更新节点状态。
        
    - GNN模型类型：如图卷积网络（GCN）和图注意力网络（GAT）。
        
    - GNN模型训练：使用损失函数（如交叉熵）和优化技术（如梯度下降）。
        
- 预习资料：
    
    - 卷积神经网络（CNN）和循环神经网络（RNN）的理解，可参考[Stanford CS231n](http://cs231n.stanford.edu/).
        
    - 反向传播和梯度下降基础，可参考[Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/).
        
- 主要内容：
    
    - GNN层如何处理图数据：每个GNN层通过聚合邻居信息更新节点特征向量，常用聚合函数包括均值、求和或注意力加权。
        
    - GNN应用案例：
        
        - 引文网络中的节点分类：基于论文引文关系和摘要预测论文类别。
            
        - 药物-疾病关联预测：建模药物和疾病节点，预测基于已知交互的关联。
            
    - 模型训练：对于节点分类，使用交叉熵损失；对于链接预测，使用二元交叉熵损失。
        
- 检验题目：
    
    - GNN中的消息传递是什么？
        
    - 图卷积层与CNN中的标准卷积层有何不同？
        

### 第四部分：城市感知计算中的应用

- 关键知识点：
    
    - 城市感知计算的定义：使用计算技术分析人们对城市环境的感知和交互。
        
    - 如何将城市数据建模为图：节点可为位置、道路，边可为连接或邻近关系。
        
    - 具体应用：如交通流量预测、犯罪率预测和城市规划。
        
- 预习资料：
    
    - 城市数据类型：了解道路网络、公共交通网络和城市社会网络，可参考[Urban Computing Survey](https://www.researchgate.net/publication/277679296_Urban_Computing).
        
    - GIS概念：学习空间数据、图层和坐标系，可参考[ESRI GIS Basics](https://www.esri.com/en-us/what-is-gis/overview).
        
- 主要内容：
    
    - 城市数据建模：
        
        - 交通流量预测：节点为路口，边为连接道路，使用STGNN捕捉空间和时间依赖。
            
        - 犯罪率预测：节点为社区，边为邻近关系，预测连续的犯罪率可作为节点回归任务。
            
        - 城市规划：节点为发展地点，边为基础设施连接，使用图聚类选择最佳位置。
            
    - 案例研究：
        
        - 交通流量预测：使用历史数据训练STGNN模型，预测未来流量。
            
        - 犯罪率预测：基于人口密度和历史数据，使用GNN预测社区犯罪率。
            
    - 建模指导：
        
        1. 定义问题（如预测交通流量）。
            
        2. 确定节点和边（如路口和道路）。
            
        3. 收集数据（如流量历史）。
            
        4. 构建图结构。
            
        5. 预处理数据（如归一化）。
            
        6. 选择GNN模型（如STGNN）。
            
        7. 训练模型并评估。
            
        8. 解释结果。
            
- 检验题目：
    
    - 描述一个可以用图学习解决的城市问题，并解释如何建模。
        
    - 讨论将图学习应用于大规模城市数据时的挑战和潜在解决方案。
        

### 结论与未来方向

本教程涵盖了图学习的基础知识和城市感知计算的应用，为GIS硕士学生提供了系统学习框架。未来方向可能包括结合大型语言模型提升图学习性能，或开发更高效的GNN架构处理大规模城市数据。

表格：图学习任务与城市应用对应

|图学习任务|城市应用示例|建模方式|
|---|---|---|
|节点回归|犯罪率预测|节点为社区，边为邻近关系|
|链接预测|交通网络扩展|预测新道路连接的可能性|
|时空预测（STGNN）|交通流量预测|节点为路口，边为道路，包含时间序列|

### 关键引用

- [GeeksforGeeks Graph Theory](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/)
    
- [Scikit-learn Documentation](https://scikit-learn.org/stable/)
    
- [Feature Engineering for Machine Learning](https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/)
    
- [Deep Learning Book](https://www.deeplearningbook.org/)
    
- [Stanford CS231n](http://cs231n.stanford.edu/)
    
- [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com/)
    
- [Urban Computing Survey](https://www.researchgate.net/publication/277679296_Urban_Computing)
    
- [ESRI GIS Basics](https://www.esri.com/en-us/what-is-gis/overview)
