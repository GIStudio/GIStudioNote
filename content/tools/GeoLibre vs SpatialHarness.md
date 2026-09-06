---
title: GeoLibre vs SpatialHarness 对比
description: opengeos/GeoLibre 与 GIStudio SpatialHarness（Web 工作台 + Python 内核）的架构对比、差异标注与 AI 辅助编辑路线思考。
tags:
  - 工具
  - GIS
  - WebGIS
  - 插件架构
  - MCP
  - AI
aliases:
  - GeoLibre 对比
source: https://github.com/opengeos/GeoLibre
---

## TL;DR

**GeoLibre 是"浏览器里的 ArcGIS"，SpatialHarness 是"城市科学家的双端工作台"。** 架构理念高度趋同（引擎可插拔、插件化、本地优先、MCP、PyPI+npm 双端发行），但生态位错开：我们的护城河是 Python 科学计算生态的接入深度，他们的是通用 GIS 的功能广度。正面竞争既不现实也不必要。

## 一、GeoLibre 概况

opengeos（吴秋生，geemap/leafmap 作者）的 cloud-native GIS 平台：

- **规模**：1437 个源码文件、1369 次提交（1202 次来自作者本人），产品级成熟度（MIT、DOI、conda-forge、桌面/移动/网页/Chrome 扩展全渠道分发）
- **技术栈**：Tauri v2 + React + TypeScript + MapLibre GL JS + deck.gl + DuckDB-WASM Spatial
- **能力**：1000+ WASM 地理处理工具（Whitebox：地形/水文/LiDAR/遥感）、3D Tiles、行星制图、时间滑块、share/collab 云端

## 二、架构趋同点（相互独立演化出的相同选择）

| 维度 | GeoLibre | SpatialHarness 双端 |
|---|---|---|
| 本地优先 | "data local and private" | "纯本地，不经任何服务器" |
| MapEngine 抽象 | 后补：从 MapLibre 专用类抽出引擎中立接口（issue #2260，改造 681 个调用点），随后交付 Cesium 引擎 | 先验：设计之初即 MapEngine 接口 + 注册表（OpenLayers v1，规划 MapLibre/Cesium） |
| 插件管理器 | register/activate/deactivate + 外部插件 manifest + 信任分级 | Python 端 register/enable/disable + entry points/本地目录 |
| PyPI + npm 双端 | `geolibre`（Python widget）+ npm monorepo | `spatialharness`（Python 计算）+ `spatial-harness`（Web） |
| MCP 集成 | `geolibre-mcp`：headless 写 `.geolibre.json` 工程文件 | `spatialharness mcp`：暴露计算插件为 AI 工具 |
| GeoJSON 原生 | ✓ | ✓ |

> 教训与验证：他们是"先痛后医"（写死 MapLibre 后返工 681 处），我们是天生如此——当初的引擎抽象决策被验证正确。

## 三、关键差异标注

🔴 = 本质不同　🟡 = 深度/成熟度差距　🟢 = 我们独有　⚪ = 大体等价

| 维度 | GeoLibre | SpatialHarness | 标注 |
|---|---|---|---|
| 定位 | 通用 GIS 平台（可视化/探索/处理） | 城市科学研究工作流 | 🔴 |
| Python 包角色 | anywidget：把整个 App 嵌进 Jupyter（UI 的另一种宿主） | 计算内核：插件管理器跑可达性/街景/GeoAI | 🔴 |
| 插件轴 | UI/地图能力（面板、控件、URL 参数、项目状态持久化） | 计算能力（数据契约 + 算法） | 🔴 |
| Python 计算 ↔ Web 互操作 | 无此路线 | HTTP 桥 + wire 层（GeoJSON ⇄ DataFrame），Web 面板直调 Python 插件 | 🟢 |
| 渲染维度 | 3D/球体/Cesium/行星 | 2D，QGIS 交互范式 | 🟡（我们暂无 3D） |
| 编辑工作流 | 以可视化/探索为主 | 绘制/顶点编辑/撤销重做/属性表联动，贴近桌面 GIS | 🟢 |
| 地理处理 | 1000+ WASM 工具（Whitebox） | turf 轻量分析 + Python 生态（重计算在桥上） | 🟡 |
| 服务端 | 有（geolibre_server、share/collab） | 坚持无服务器 | 🔴 |
| 体量/成熟度 | 产品级（全渠道、DOI、conda） | v0.1–0.2 起步 | 🟡 |
| 分析深度 | 通用空间分析 | 可达性模型、街景感知、GeoAI pipeline | 🟢 |
| 外部插件信任模型 | 有（内置 drop-in 可默认激活；运行时 zip 装的第三方禁止自激活） | 无（本地目录即插即用，无信任分级） | 🟡（值得借鉴） |

## 四、AI 能力对比

GeoLibre 已形成**四层 AI 体系**：

| 层 | 形态 | 作用对象 | 输出 |
|---|---|---|---|
| 应用内 AI Assistant | App 内对话 | 运行中的活地图（走 app store） | 可 Ctrl+Z 撤销的编辑 |
| Agent Skill | `SKILL.md` 教外部编码 agent | 磁盘上的 `.geolibre.json` | 工程文件 / 独立 HTML |
| MCP server | headless 工具 | 工程文件 | `.geolibre.json` |
| Python 包 | notebook/脚本 | 工程文件 | 工程文件 |

SpatialHarness 现状：Web 端 MCP（turf 分析）+ Python 端 MCP（计算插件）+ HTTP 桥——**有"算"，尚无"编辑"**。

## 五、AI 辅助编辑：SpatialHarness 路线设计

### 现状盘点（已有的地基）

- `history` store 采用**命令模式**（撤销/重做）——天然适合承接 AI 编辑：AI 的每次编辑若走同一 command 层，就自动获得可撤销性与自动保存
- 工程文件 `project.webgis.json`（图层树/样式/视图/数据全量 JSON）——headless 生成的目标格式
- 数据契约 + wire 层（GeoJSON ⇄ DataFrame）——AI 输入输出的校验基础
- 双 MCP（Web turf 分析 / Python 计算插件）+ 本地桥（127.0.0.1，天然信任边界）

### 三层方案（借鉴 GeoLibre 分层，落到我们的编辑优势上）

**L1 · 编辑 MCP 工具（在活地图上编辑，核心层）**
给 Web 端 MCP 增加 `get_project / add_features / update_features / delete_features / set_style / classify` 等工具。三条铁律：
1. **所有编辑必须经过与 UI 相同的 command 层**（进 history store）→ AI 编辑可撤销、可自动保存，与用户手动编辑同轨混排
2. **输入走 GeoJSON schema 校验**（复用 wire 层契约思想）→ 模型幻觉的畸形数据在入口被拦
3. **提案-确认模式**：AI 产出 diff 预览（"将修改 12 个要素的 style"），用户确认后应用——AI 只提案，提交权在人

**L2 · headless 工程文件生成（无浏览器时编辑）**
`spatialharness mcp` 增加 authoring 工具集，直接写 `project.webgis.json`（geolibre-mcp 模式）。与 L1 互补：有活地图用 L1 即时所见即所得，纯终端/notebook 环境用 L2 产出文件、Web 端打开即用。同一套工程 JSON schema 两层共用。

**L3 · Agent Skill（教外部 agent 选对入口）**
仓库放一份 `SKILL.md`：何时用编辑 MCP、何时用 authoring、何时用 Python 桥跑计算、易错规则（坐标系统一 EPSG:4326、classify 需要内联 GeoJSON 等）。

### 差异化：编辑 × 分析闭环

这是 GeoLibre 没有的组合拳——AI 在**同一个会话**里完成"算 + 编"：

> AI 调 Python 插件算可达性（spatialharness mcp）→ 结果 GeoJSON 经编辑 MCP 直接落为图层并自动分级设色（L1）→ 用户在地图上微调 → AI 继续按用户口述调整标注/样式

对他们的 in-app Assistant 是"对话改图"；对我们是"**分析结果即时编辑成图**"——研究工作流的最后一公里。

## 六、结论

1. 差异是结构性的：通用 GIS 平台 vs 城市科学双端工作台，各自护城河清晰
2. 可直接借鉴：外部插件信任分级、headless MCP 写工程文件、SKILL.md 模式
3. AI 辅助编辑按 L1→L2→L3 落地，L1（编辑命令走 history store）是关键投资，一次做好三层受益

## 相关

- [[Quick Start|工具快速开始]]
- SpatialHarness Web：<https://github.com/GIStudio/SpatialHarness>（npm `spatial-harness`）
- SpatialHarness Python：<https://github.com/GIStudio/SpatialUtils>（PyPI `spatialharness`）
