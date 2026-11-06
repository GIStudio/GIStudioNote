# GCNII：来源、图件与验收

范围：基于用户提供的机制说明，核对并讲解 ICML 2020 GCNII 原论文中与深度、过平滑和两项设计有关的部分；不是复现实验或全领域综述。核验日期：2026-11-06。

| 正文论点 | 核对位置与边界 |
| --- | --- |
| 论文身份与原文 | [PMLR 正式记录](https://proceedings.mlr.press/v119/chen20v.html)，五位作者，卷 119，1725–1735。直接下载会议版 PDF 后以 `pdfinfo` 与首面文字核对题名、作者、11 页；未将本地 PDF 纳入公开站点。 |
| 传播极限 | [PDF 第 4 页](https://proceedings.mlr.press/v119/chen20v/chen20v.pdf#page=4)，§4.1 定理 1。对象为带相邻层残差的线性化算子，保留连通无向自环条件与度缩放。四节点环及注入递推是教学构造，已独立复算。 |
| 两项设计 | [PDF 第 3 页](https://proceedings.mlr.press/v119/chen20v/chen20v.pdf#page=3)，§3 式（5）。$H^{(0)}$ 可由输入投影得到；按同形矩阵加权相加；右乘单位矩阵用 $I_d$ 明确隐藏通道维。作者 [`model.py`](https://github.com/chennnM/GCNII/blob/master/model.py) 核对传播层从 1 起的对数调度。 |
| 谱滤波表达 | [PDF 第 5 页](https://proceedings.mlr.press/v119/chen20v/chen20v.pdf#page=5)，§4.2 定理 2及补充材料 A.1。把构造理解为表达能力，保留与训练或泛化保证的区别。 |
| 32/64 层、任务设置和消融 | [PDF 第 7 页](https://proceedings.mlr.press/v119/chen20v/chen20v.pdf#page=7) 表 3 的 GCN 与 GCNII 各 18 个点；同页 §6.2–6.3 区分全监督与 9 层 PPI 归纳任务。[PDF 第 9 页](https://proceedings.mlr.press/v119/chen20v/chen20v.pdf#page=9) 图 1 为度分组准确率，图 2 为消融；两图均非表示平滑度的直接测量。 |

## 图件

- 原文 PDF 第 9 页的图 1、图 2 分别以 Poppler 240 dpi 裁取，保留标题、坐标轴、图例和图注，已逐张目视检查。会议发布条款未确认面向公众的原图再发布许可；两个 PNG 和 PDF 只作本地阅读，正文链接原版图页。
- `content/Graph/assets/gcnii-layer.svg` 为按式（5）原创的可编辑矢量图。箭头依次表达上一层到邻居聚合、初始表示直达加法节点、混合结果到通道右乘、ReLU 与输出。蓝实线和橙虚线分别区分两路输入。沿用站点卡片底色与中文字体，采用 journal 0.3.0 颜色；以 sharp 渲染为 740 px 预览，已检查箭头、上下标和布局。
- `content/Graph/assets/gcnii-depth.svg` 为根据表 3 重新绘制的矢量图。重绘入口 `node scripts/graph/create_gcnii_depth_figure.mjs`，脚本保留 36 个原表点，使用 Node 22.16.0。沿用 journal 0.3.0 配色与冗余线型/点型，网页覆盖为 SVG 和较大字级；共享 0–100% 纵轴、倍增层数等距、下置面板名和外置图注，不添加原表没有的误差条。已检查 720 px 彩色与灰度输出。数据为作者报告，未重训。

本地验收：中文科普和公开边界扫描无提醒；两幅 SVG 的 XML 解析、四节点环递推和 36 个原表数据点检查通过。Node 22.16.0 下 `npm run check:content` 通过（205 个 Markdown、52 个资源），生成页的 2 个展示公式、2 条参考文献、两图及图学习入口均已核对。网页插图使用 SVG 原生文本和形状；未要求特定编辑器内的修改回存测试。

停止条件：正式版 PDF、本地两张裁切、含两幅自制图的公开文章齐备，且相应 Pages 工作流和实际正文验证通过。原文件及预览不进入 Git 提交。
