---
title: AnyRecon：视频生成与几何记忆结合的三维重建
description: 介绍 AnyRecon 如何结合稀疏视角、视频扩散和三维几何记忆重建大场景。
tags:
  - 3D Reconstruction
  - Video Diffusion Model
  - Wan2.1
  - LoRA
  - Multi-view
  - Large-scale Scene
aliases:
  - AI/anyrecon-wechat
source: https://arxiv.org/abs/2604.19747
verified_at: 2026-10-28
---

# AnyRecon：用稀疏视角重建三维场景

AnyRecon 研究如何从数量可变、顺序不固定的稀疏拍摄视角出发，合成新视角并逐步重建场景。它把视频扩散模型和三维几何记忆连接起来：已有画面提供真实观测，点云提供几何约束，模型再生成目标视角的图像。论文于 2026 年发布预印本，项目页标注 SIGGRAPH Asia 2026。[论文](https://arxiv.org/abs/2604.19747) · [Trackback 接口](https://arxiv.org/tb/2604.19747)；[项目页](https://yutian10.github.io/AnyRecon/)

## 生成与重建如何配合？

少量照片无法直接确定所有遮挡部分。AnyRecon 首先根据已有拍摄视角建立初始三维几何记忆，再按几何贡献选择参考视角。参考帧与点云渲染结果共同约束视频扩散模型，生成的视角随后用于更新几何记忆。这个循环可沿相机轨迹逐段进行。

1. **参考画面记忆**：保留拍摄视角的特征，帮助生成画面延续真实图像的纹理。
2. **几何记忆与视角选择**：利用点云和目标视角挑选有几何贡献的参考信息，指导后续生成与重建。
3. **推理效率**：论文使用四步扩散蒸馏和上下文窗口稀疏注意力，降低长轨迹处理成本。

论文报告了插值、视角外推和大场景实验；效果应在其数据集、评价指标和比较条件下理解。作者也指出，极少重叠的输入可能使初始几何重建失败，进而影响生成结果。[论文 v1](https://arxiv.org/abs/2604.19747v1) · [Trackback 接口](https://arxiv.org/tb/2604.19747)

生成的未观测区域是模型根据已有信息作出的推断，适合探索和视觉表达；需要真实尺度或测绘精度的任务仍须使用独立观测和误差验证。

## 代码与运行条件

[官方仓库](https://github.com/OpenImagingLab/AnyRecon)提供的推理流程使用 Wan2.1 I2V 14B 基础模型、AnyRecon LoRA 权重及用于点云渲染的 π³ 权重。仓库说明，处理 40 帧、869 × 512 的示例视频约需 45 GB 显存；实际需求随分辨率与配置变化。

仓库包含 π³ 子模块，克隆时要遵照其递归克隆、依赖安装和权重放置说明。对于自己的数据，官方辅助流程先用 π³ 生成点云渲染条件视频，再运行 AnyRecon。论文使用的稀疏注意力权重在本次核验时仍列在仓库待发布事项中；运行状态以仓库为准。

本页依据论文和项目文档整理，尚未实际运行代码。航拍、文化遗产数字化和机器人场景可作为后续探索方向，具体适用性需要针对数据采集条件与精度要求验证。

## 参考资料

- Chen et al. (2026), [AnyRecon: Arbitrary-View 3D Reconstruction with Video Diffusion Model](https://arxiv.org/abs/2604.19747) · [Trackback 接口](https://arxiv.org/tb/2604.19747)。
- [项目主页](https://yutian10.github.io/AnyRecon/)与[官方代码及环境说明](https://github.com/OpenImagingLab/AnyRecon)。
