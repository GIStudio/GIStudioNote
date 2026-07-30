---
title: 从好奇到可检验问题：四阶段研究问题形成方法
description: 将 Peters 的经验工作流扩展为包含工件、阶段 Gate、问题合同和回退规则的可执行方法。
aliases:
  - 好研究问题形成方法
  - Good research question development method
  - 研究问题四阶段循环
tags:
  - Writing
  - 研究问题
  - 研究方法
  - 问题形成
  - 学术写作
  - LLM
source: https://doi.org/10.1038/s41562-025-02292-5
verified_at: 2026-07-30
---

# 从好奇到可检验问题：四阶段研究问题形成方法

## 核心判断

好研究问题不是“发现一个没人写过的题目”，而是把一个持续吸引你的现象，通过文献连接、反事实变体和现实约束，磨成一个能够区分解释、能够获取证据、又值得投入的问题。

本页改写自 Peters 的四阶段个人工作流，并增加了阶段工件、进入门、失败信号和 Research Question Contract。[@petersHowDevelopGood2025] 原文是经验型 Comment，不是效果经过实验验证的标准；本文新增内容属于研究者的方法综合，而不是 Peters 的原文主张。

## 最小循环

```text
1. 自我批判式发散
   ↓
2. 建立知识背景与连接
   ↓
3. 用反事实变体磨尖问题
   ↓
4. 用资源、方法与替代解释定型
   ↓
继续 / 回退 / 放弃
```

关键不是依次走完四步，而是允许有依据地回退：

- 文献已经回答原问题 → 回到 Phase 1；
- 找到关键连接或隐藏前提 → 回到 Phase 2；
- 方法不能区分竞争解释 → 回到 Phase 3；
- 资源无法支撑 → 缩小范围或放弃。

## Phase 1：自我批判式发散

### 目标

识别真正值得持续追问的现象，并在投入大量阅读前暴露直觉漏洞。

### 操作

1. 写下最近让你反复停下来、搜索或感到矛盾的现象。
2. 用口述或自由书写回答：
   - 我究竟对什么感到奇怪？
   - 哪个已知解释让我不满意？
   - 如果现象是真的，它会改变什么？
   - 如果它是假的，最可能错在哪里？
3. 让 AI 只做转写、聚类和反方生成，不让它替你选择问题。
4. 对每个想法写一条最强反对意见。
5. 找一位懂领域但不是本主题专家的人复述，看问题是否仍然成立。

### 工件

```markdown
## Phenomenon

## Why it bothers me

## Current intuition

## Strongest objection

## What evidence would change my mind

## Unknown terms / authors to read
```

### Gate 1

只有同时满足以下条件才进入 Phase 2：

- 关注的是现象、矛盾或解释，而不只是流行方法；
- 至少能写出一个可能推翻自己直觉的证据；
- 兴趣不是纯粹来自“模型很新”或“数据在手里”。

## Phase 2：建立背景与连接

### 目标

确定问题在知识地图中的位置：已经知道什么、哪些解释竞争、哪些假设没有被检验，以及哪些方法可能遮蔽了现象。

逐篇摘要：

```text
Paper A says ...
Paper B says ...
Paper C says ...
```

应改写成连接结构：

```text
A establishes X under assumption a.
B challenges a using method b.
C observes Y but cannot distinguish X from Z.
My candidate question lies in that unresolved distinction.
```

### 每篇文献的最小连接卡

```markdown
## Claim

## Evidence

## Assumption

## Alternative explanation

## Connection
- supports:
- conflicts with:
- method transferable to:

## Role
- primary / secondary:
- reason:
```

### 文献分层

| 层级 | 定义 | 动作 |
|---|---|---|
| Primary | 与候选问题、解释或实验设计最接近 | 必须重读并进入 Phase 3 |
| Secondary | 提供理论、方法、数据或跨领域结构类比 | 选择性阅读 |
| Background | 提供术语和历史 | 只保留入口 |

`Primary` 表示与当前问题最接近，不表示更权威。分类必须附理由。

### Gate 2

进入 Phase 3 前应能回答：

1. 最接近的三至五篇工作是什么？
2. 它们共同默认了什么？
3. 它们在哪个结论上真正冲突？
4. 现有证据不能区分哪些替代解释？
5. 跨领域连接共享底层结构，还是只有表面词汇相似？

如果只能说“很少有人研究”，还没有形成可靠 gap。

## Phase 3：用反事实变体磨尖问题

### 目标

把“文献缺口”变成能够改变解释或证据强度的设计差异。

### 反事实变体矩阵

| 维度 | 原选择 | 替代选择 | 它能区分什么 | 代价 |
|---|---|---|---|---|
| Research object |  |  |  |  |
| Population / region |  |  |  |  |
| Data |  |  |  |  |
| Control |  |  |  |  |
| Task |  |  |  |  |
| Method |  |  |  |  |
| Analysis |  |  |  |  |
| Metric |  |  |  |  |
| Time / spatial scale |  |  |  |  |
| Alternative explanation |  |  |  |  |

一个差异至少应改变以下一项：

- 理论解释；
- 可识别性；
- 外部有效性边界；
- 证据质量；
- 决策或应用含义；
- 既有方法的失败条件。

只换城市、数据集或模型名称，却不改变这些内容，通常只是增量工程。

### 候选问题模板

机制、因果或比较型问题：

```text
Under [boundary/condition],
does [mechanism/design A] explain or improve [outcome],
relative to [credible alternative B],
as measured by [evidence/metric],
and what result would reject the proposed explanation?
```

描述性问题：

```text
In [well-defined setting],
what pattern or phenomenon occurs,
how reliably can it be measured,
and which observations would distinguish artefact from phenomenon?
```

### Gate 3

- 为什么这个差异会改变理解，而不只是改变数值？
- 它能排除或削弱哪个替代解释？
- 阴性结果是否仍有解释价值？
- 结果能否用明确指标判断？

## Phase 4：把问题落到可执行研究

### 目标

把候选问句变成问题合同，而不是直接跳到实验。

### Research Question Contract

```yaml
phenomenon:
question:
question_type: descriptive | mechanistic | causal | predictive | normative
unit_of_analysis:
population_or_region:
time_and_space_scope:
competing_explanations:
evidence_needed:
method:
why_this_method:
data:
primary_metrics:
negative_result_value:
key_confounds:
resources:
skills_gap:
ethics_or_access:
stop_or_pivot_rule:
```

### 最终审查六问

1. **Important**：答案会改变哪种理解、方法或决策？
2. **Discriminating**：设计能区分哪些竞争解释？
3. **Answerable**：数据和指标能实际回答它吗？
4. **Feasible**：时间、算力、样本、伦理和技能是否匹配？
5. **Bounded**：适用范围和不能支持的结论是否清楚？
6. **Persistent**：完成第一轮困难工作后，我仍愿意追问吗？

前五项决定问题能否科学地工作，第六项决定它是否适合成为长期问题。

## 四类问题，不强制统一假设格式

| 类型 | 典型问法 | 是否必须有方向性假设 | 主要质量标准 |
|---|---|---|---|
| 描述性 | What happens / what pattern exists? | 否 | 测量可靠、范围明确、排除 artefact |
| 机制性 | How does effect X arise? | 不一定 | 能区分机制、包含关键控制 |
| 因果性 | Does intervention X change Y? | 通常需要预期 | 识别策略、混淆控制 |
| 规范性 | Why should/does a system choose X rather than Y? | 不一定 | 规范前提与解释层级清楚 |

没有方向性假设不等于没有预期、边界或失败标准。

## 四个陷阱的操作化检查

### Hypothesis requirement

当前问题确实属于探索或描述，还是研究者只是在逃避写可检验预期？

### Sunk cost attachment

提前设置 pivot rule：

- 核心命题已被可靠回答；
- 新差异不能改变解释；
- 关键数据长期不可得；
- 设计不能区分替代解释；
- 预期贡献只剩“在新数据上再跑一次”。

### Someone already did it

| 维度 | 已有工作 | 我的设计 | 差异是否改变解释 |
|---|---|---|---|
| Question |  |  |  |
| Population |  |  |  |
| Mechanism |  |  |  |
| Control |  |  |  |
| Metric |  |  |  |

如果最后一列全部为“否”，应放弃 novelty claim。

### Hammer and nail

在选择方法前列出两个备选方法，并回答：

- 如果不会当前最熟悉的方法，还会怎样回答这个问题？
- 最熟悉的方法遗漏了什么尺度、数据或解释？
- 选择它是因为 fit 最好，还是因为 setup 已经存在？

## AI 在流程中的合理位置

| 阶段 | AI 可以做 | AI 不应替代 |
|---|---|---|
| Phase 1 | 转写、聚类、生成反方问题 | 判断哪个现象真正重要 |
| Phase 2 | 检索线索、去重、整理元数据 | 建立独特的跨文献连接 |
| Phase 3 | 枚举设计变体、检查遗漏维度 | 判断差异是否具有理论意义 |
| Phase 4 | 格式化问题合同、检查缺项 | 决定研究承诺和接受何种风险 |

每次使用 AI 后至少执行两项检查：

1. 回到原文或数据核对；
2. 标出 AI 压平、误解或自行补充的连接。

## 一页工作表

```markdown
# Research Question Iteration

## 1. Phenomenon
- What keeps bothering me?
- Why might it matter?
- Strongest objection:

## 2. Context
- Primary papers:
- Shared assumption:
- Competing explanations:
- #connection:

## 3. Counterfactual variants
- Different control:
- Different population/region:
- Different data:
- Different method:
- Different metric:
- What distinction does each variant reveal?

## 4. Final contract
- Question:
- Evidence needed:
- Method and why:
- Confounds:
- Resources:
- Negative-result value:
- Stop/pivot rule:
```

## 使用边界

- 这是问题形成 heuristic，不是保证 novelty 或发表成功的算法。
- “让我兴奋”不能替代重要性、证据和伦理。
- “别人没做过”不能单独构成贡献。
- “可做”不等于“值得做”。
- 最终问题仍需领域专家、数据可得性和实验识别性的独立审查。

## 关联阅读

- [[../Reading/peters-2025-good-research-questions|Peters（2025）原文结构化精读]]
- [[findAgap|研究问题与 research gap]]

## 来源

- Peters, M. A. K. (2025). *How to develop good research questions*. *Nature Human Behaviour*, 9, 1759–1761. [DOI](https://doi.org/10.1038/s41562-025-02292-5)
- [Nature version of record](https://www.nature.com/articles/s41562-025-02292-5)

