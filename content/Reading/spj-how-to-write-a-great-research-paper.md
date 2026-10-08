---
title: Simon Peyton Jones《How to write a great research paper》讲座笔记
description: 整理 Simon Peyton Jones 关于写好研究论文的七条建议、会议论文结构模板与审稿沟通策略，并标注其经验性证据边界。
aliases:
  - SPJ 如何写好研究论文
  - How to write a great research paper 笔记
  - 写好研究论文的七条建议
tags:
  - Reading
  - 学术写作
  - 研究方法
  - 文献精读
source: https://www.microsoft.com/en-us/research/academic-program/write-great-research-paper/
verified_at: 2026-10-08
---

# Simon Peyton Jones《How to write a great research paper》讲座笔记

## 文献元数据

| 字段 | 内容 |
|---|---|
| Title | *How to write a great research paper* |
| Author | Simon Peyton Jones（Microsoft Research） |
| Type | 学术讲座（talk）及配套幻灯片 |
| Version of record | [Microsoft Research 讲座页面](https://www.microsoft.com/en-us/research/academic-program/write-great-research-paper/) |
| Full-text basis | [讲者公开发布的幻灯片 PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/07/How-to-write-a-great-research-paper.pdf) |
| Evidence level | `slides_full_text`；经验性建议清单，不是实证研究 |

> 本页保存结构化笔记与证据边界，不复制幻灯片原文图片，引用控制在合理范围。

Microsoft Research 页面确认该讲座由 Simon Peyton Jones 提供，配套幻灯片可免费获取，并允许在注明出处后 repurposing。[@peytonJonesHowWriteGreatResearchPaper]

## 一句话贡献

Simon Peyton Jones 把写研究论文从“研究完成后的报告工序”重新定位为“研究本身的主要机制”，并给出七条简单、具体、可立即执行的建议，覆盖写作时机、核心想法识别、叙事结构、贡献陈述、相关工作位置、读者优先和审稿回应。

## 写作模型：先写论文，再做研究

讲座开篇用两个模型对比贯穿全场：

```text
模型 1：想法 → 做研究 → 写论文
模型 2：想法 → 写论文 → 做研究
```

模型 2 的理由：

- 写作迫使作者清晰、聚焦，结晶出自己尚未理解的部分；
- 论文是与他人对话的机制：现实检验、批评和合作；
- 写作论文是做研究的主要机制，不只是汇报研究的手段。

对应的反直觉主张是：**不要等到有了不起的想法才写**。写论文本身就是发展想法的方式，而且初看微小、不足道的想法，写出来之后往往比预想的更有趣、更有挑战。讲座的原话是：再好的想法，若只留在自己脑子里，也（字面上地）一文不值。

## 七条建议

### 1. Don't wait: write（不要等待，先写）

- 写作驱动研究，而非反之；第一篇草稿可以而且应该早于大部分实验。
- 任何想法，无论看起来多么微不足道，都值得写成论文和讲出来。
- 推论：如果你有多个想法，就写多篇论文，而不是把它们塞进一篇。

### 2. Identify your key idea（识别核心想法）

- 一篇论文只应有一个 "ping"：一个清晰、锐利的单一想法。
- 开始写作时可以还不完全确定 ping 是什么，但**写完时必须知道**。
- 很多论文有好想法却没有蒸馏出来；要让读者毫不怀疑你的想法是什么，必须 100% 显式。
- 想法的定义：对读者有用、可复用的洞见（a re-usable insight）。

### 3. Tell a story（讲故事）

叙事流应当像在白板前向人讲解：

```text
这里有一个问题
→ 它是个有趣的问题
→ 它是个未解决的问题
→ 这是我的想法
→ 我的想法是有效的（细节、数据）
→ 我的想法与其他人的方法相比如何
```

配套的结构建议：用一个具体例子引入问题（"molehills not mountains"）。反面示例是“程序常有 bug，消除 bug 很重要 [1,2]，很多研究者尝试过 [3,4,5,6]”这类空泛的开场令读者打哈欠；正面示例是“考虑这个程序，它有一个有趣的 bug……我们将展示一种自动识别并消除此类 bug 的技术”。

### 4. Nail your contributions（钉死你的贡献）

- 引言只做两件事：描述问题、陈述贡献——并且只占一页。
- **先写贡献列表**；贡献列表驱动整篇论文：论文正文就是对你所声称贡献的举证。
- 贡献必须是**可反驳的**（refutable）。对比幻灯片中的正反例：
  - 差：“我们描述了 WizWoz 系统，它很酷。” / “我们研究了它的性质。”
  - 好：“我们给出了一种支持并发进程的语言的语法与语义（第 3 节），其创新特性是……” / “我们证明了类型系统可靠且类型检查可判定（第 4 节）。”
- 引言中的每个 claim 都要在正文有对应证据（分析比较、定理、测量、案例研究），并从 claim 处前向引用。
- 不要用 “The rest of this paper is structured as follows” 式目录结尾；引言（含贡献）应当巡视整篇论文，用叙事中的前向引用指向每个重要部分。

会议论文的目标结构（括号内为预期的读者流失漏斗）：

| 部分 | 篇幅 | 读者数（讲座估计） |
|---|---|---|
| 标题 | — | 1000 |
| 摘要 | 4 句话 | 100 |
| 引言（问题 + 贡献） | 1 页 | 100 |
| 问题 | 1 页 | 10 |
| 我的想法 | 2 页 | 10 |
| 细节 | 5 页 | 3 |
| 相关工作 | 1–2 页 | 10 |
| 结论与后续工作 | 0.5 页 | — |

### 5. Related work: later（相关工作放后面）

- 相关工作放在论文末尾，而不是第二位。原因有二：读者此时还不了解问题，压缩的技术对比不可理解；对替代方案的描述会横在读者与你的想法之间。
- **credit 不像钱**：慷慨承认帮助过你的人，对竞争者也要大方（“In his inspiring paper [Foo98] Foogle shows... We develop his foundation in the following ways...”），并主动承认自身方法的弱点。赞美他人不会减少你论文应得的 credit。
- 常见谬误：“要让我的工作显得好，就必须让别人的工作显得差。”

### 6. Put your readers first（读者优先）

- 讲解想法时假设自己在白板前对人讲：传达直觉是第一位的，不是第二位的。读者有了直觉才能跟住细节，反之不然；即使跳过细节，读者也应带走有价值的东西。
- 用**例子**引入问题和想法，先例子后一般情形；例子要尽早出现。
- 不要复述你个人的发现之旅——那条路可能浸满你的血汗，但读者不感兴趣。选择通往想法最直接的路线。
- 语言层面：用主动语态（“We ran 34 tests” 而非 “34 tests were run”），用简单直接的语言（“The ball moved sideways” 而非 “The object under study was displaced horizontally”）。

### 7. Listen to your readers（倾听读者）

- 让尽可能多友好的“guinea pigs”读你的稿子；专家和**非专家**都很有用。
- 每个读者都只能第一次读你的论文，所以要珍惜：清楚地告诉他们你需要什么——“我读到这里迷路了”远比“Jarva 拼错了”重要。
- 一个具体策略：当你觉得写完时，把草稿发给领域内的竞争者，请对方帮忙确认“我是否公正地描述了你的工作”。他们通常会回应有用的批评，而且反正他们很可能是你的审稿人，提前拿到意见是好事。
- 对待审稿意见：把每条批评都当作“哪里可以讲得更清楚”的正面建议。不要想“你这个笨蛋，我明明指的是 X”，而是修改论文，让即使最笨的读者也能看出 X。真诚地感谢批评和赞美——这非常难，但非常重要。

## 证据强度与限制

### 讲座可以直接支持

- 七条建议本身及其具体做法（贡献列表、前向引用、例子优先、相关工作置后、主动语态等）；
- 会议论文各部分的目标篇幅与读者流失估计；
- “写作驱动研究”这一写作观作为讲者（同时也是长期高产的研究者和 Haskell 编译器 GHC 的主要作者）的个人方法论。

### 讲座不能支持

- 七条做法被对照实验证明优于其他写作流程；
- 按此结构写作的论文被接收率更高、引用更多的因果结论；
- 篇幅与读者数表格是经验估计，不是测量数据；
- 对非计算机科学、非会议论文体裁（如期刊长文、学位论文）的普遍适用性——讲座语境明显偏向 CS 会议论文。

因此这份材料应被视为高密度、可立即执行的 **heuristic checklist**，其价值在于把模糊的“好好写”拆成可检查的动作，而不是写作质量的实证理论。

## 与站内笔记的关系

- 本讲座回答“如何写出论文”，[[peters-2025-good-research-questions|Peters（2025）好研究问题精读]]回答“写什么（研究问题从哪里来）”，两者衔接：先用 Peters 的四阶段流程形成问题，再用 SPJ 的七条建议把想法写成论文。
- 写作实操层面可对照 [[../Writing/paper-knitting-guide|从选题到投稿的学术写作方法]] 与 [[../Writing/good-research-question-development|从好奇到可检验问题：四阶段研究问题形成方法]]。

## 来源

- [Microsoft Research 讲座页面](https://www.microsoft.com/en-us/research/academic-program/write-great-research-paper/)（含视频与其他语版幻灯片链接）
- [讲者发布的幻灯片 PDF（全文依据）](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/07/How-to-write-a-great-research-paper.pdf)
- 同一作者的姊妹讲座：[How to write a great research proposal](https://www.microsoft.com/en-us/research/academic-program/write-great-research-proposal/)、[How to give a great research talk](https://www.microsoft.com/en-us/research/academic-program/how-to-give-great-research-talk/)
