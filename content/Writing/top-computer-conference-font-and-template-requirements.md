---
title: 计算机顶会的字体与模板要求
description: 从官方模板理解字体、字号、图中文字和 PDF 嵌入要求，并给出投稿前的最小检查流程。
tags:
  - Writing
  - 学术写作
  - 投稿
  - 字体
  - LaTeX
verified_at: 2026-07-30
---

# 计算机顶会的字体与模板要求

## 直接结论

计算机会议通常有严格的字体要求，但规则常以“必须使用官方模板”出现，而
不是给作者一份可自由选择的字体列表。模板同时控制字体、字号、行距、栏宽、
页边距、标题层级、caption、脚注和参考文献。

因此，替换正文或图中文字，即使看起来更美观，也可能改变版式并造成格式违规。

## 代表性规律

| 会议 / 体系 | 典型正文设置 | 关键边界 |
|---|---|---|
| NeurIPS 2026 | Times New Roman，10 pt / 11 pt | 使用当年官方 style；PDF 只含 Type 1 或嵌入 TrueType |
| ICML 2026 | Times，10 pt / 11 pt | 遵循官方格式；图中文字保持可读 |
| ICLR 2026 | Times New Roman，10 pt / 11 pt | 使用 `iclr2026` 模板，不修改字体尺寸 |
| CVPR 2026 | Times，10 pt | caption 和参考文献通常为 9 pt；图中文字应与正文协调 |
| *ACL | Times Roman，11 pt | caption、摘要与参考文献通常为 10 pt；非拉丁文字有例外 |
| AAAI 2026 | Times 或 Nimbus，10 pt / 12 pt | 禁止 Type 3；代码可使用模板允许的等宽字体 |
| ACM / CHI | `acmart` / TAPS 控制 | 初审与出版阶段可能采用不同栏数和格式 |

这张表只用于理解常见模式，不能替代目标年份、track 和投稿阶段的官方说明。

## 为什么不能随意换字体

固定字体不仅是视觉偏好，也是出版工程的一部分：

1. 固定字体度量后，页数限制才具有可比性。
2. 模板可在不同机器和出版流水线上稳定复现。
3. 窄栏排版需要可预测的字符宽度、行距和数学公式兼容性。
4. 审稿与归档系统可以检查缩字、扩栏、Type 3 和未嵌入字体。

字体采用开放许可证，也不代表它符合会议格式。许可回答“能否使用、嵌入和
分发”，模板回答“是否满足本次投稿的版式约束”。

## 图中文字同样属于版式

常见风险包括：

- 绘图软件导出了未嵌入字体；
- 图例或坐标轴使用与正文差异过大的字体；
- 图在双栏页面缩放后文字过小；
- 数学符号回退到 Type 3；
- CJK fallback 没有正确嵌入。

生成图时应按最终栏宽检查，而不是只在全屏预览中判断。

## 投稿前的最小流程

```text
目标会议 + 年份 + track + submission stage
-> 从官方页面下载模板
-> 不修改 .sty / .cls 中的字体和版式
-> 按最终栏宽制作并检查图表
-> 编译最终 PDF
-> pdffonts 检查嵌入和 Type 3
-> 运行会议提供的 format checker
```

Poppler 的 `pdffonts` 可以做基础检查：

```bash
pdffonts paper.pdf
```

重点看：

- `emb` 是否全部为 `yes`；
- 是否出现 `Type 3`；
- 图表中的字体是否嵌入；
- 是否混入意外的系统字体或 fallback；
- PDF 的纸张、页数、栏宽和匿名状态是否仍符合模板。

## 不同阶段可能使用不同规则

main paper、rebuttal、supplement、camera-ready、poster 和 workshop 可能采用
不同模板。不要默认去年的模板、主文模板或录用后格式可以直接用于当前阶段。

## 官方入口

- [NeurIPS 2026 Call for Papers](https://neurips.cc/Conferences/2026/CallForPapers)
- [ICML 2026 Call for Papers](https://icml.cc/Conferences/2026/CallForPapers)
- [ICLR 2026 Author Guide](https://iclr.cc/Conferences/2026/AuthorGuide)
- [CVPR 2026 Author Guidelines](https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines)
- [ACL Style Files](https://github.com/acl-org/acl-style-files)
- [AAAI-26 Submission Instructions](https://aaai.org/conference/aaai/aaai-26/submission-instructions/)
- [CHI 2026 Publication Formats](https://chi2026.acm.org/chi-publication-formats/)
- [ACM `acmart` Guide](https://portalparts.acm.org/hippo/latex_templates/acmart.pdf)
