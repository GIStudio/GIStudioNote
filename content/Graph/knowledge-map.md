---
title: knowledge-map 知识图谱可视化
description: GIS 领域知识图谱可视化项目，支持 CSV 与 JS 数据格式互转的模块化图谱展示工具。
tags:
  - Graph
  - 知识图谱
  - 可视化
  - 项目
  - GIS
---

## 项目简介

[knowledge-map](https://github.com/GIStudio/knowledge-map) 是实验室的知识图谱可视化项目，在线部署于 <https://kg.gistudio.cn/gis/>，基于 [yeshan-geo 的可视化方案](https://yeshan-geo.github.io/kg/cv/viz.html) 改造而来，用于梳理与展示 GIS / 城市科学领域的知识结构。

## 主要改进

在原始方案之上做了两项扩展：

1. **数据读取与制作模块**：支持读取 JS 对象并保存为 CSV（便于在表格软件中批量编辑），也支持将 CSV 转回 JS 数据文件
2. **模块化改造**：将可视化代码重构为模块化引用，图表页面可直接引用 CSV 导出的 JS 数据文件，数据与展示解耦

## 与本站笔记的关系

图结构的基本概念（节点、边、邻接矩阵等）见 [[ch1-Basic|图的基本概念]]；图谱在城市计算中的应用方向见 [[outline|图学习教程与城市计算应用]]。本项目可以看作这些概念在"科研知识管理"场景下的一个落地实例。

## 相关链接

- 仓库：<https://github.com/GIStudio/knowledge-map>
- 在线部署：<https://kg.gistudio.cn/gis/>
