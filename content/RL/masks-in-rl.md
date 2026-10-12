---
title: 强化学习里的 mask 是如何实现的？
description: 从 LLM 的 padding attention mask 出发，说明 RLHF/PPO/GRPO 中 attention mask 与 completion/loss mask 的分工，以及迷宫等环境中用 logits mask 屏蔽非法动作的做法。
type: concept
status: active
updated: 2026-10-12
tags:
  - RL
  - 强化学习
  - RLHF
  - PPO
  - mask
  - 大语言模型
---

# 强化学习里的 mask 是如何实现的？

一个 batch 中的句子通常长短不一。为了组成整齐的张量，短句子末尾会补上 `<PAD>`，同时用 attention mask 标注哪些位置是真实 token、哪些是 padding：真实 token 位置的 mask 值为 1，padding 位置为 0，模型计算 Attention 时据此忽略 padding。

这是 LLM tokenizer 层面的方案。到了强化学习里，mask 不止这一个，通常是几个层次的 mask 协同工作：

- **attention mask**：给 Transformer 用，告诉 Attention 哪些位置是真实 token，哪些是 `<PAD>`。
- **completion mask / loss mask**：给 RL 的 loss、reward、KL、GAE、value loss 用，告诉优化器哪些 token 是模型生成的动作，需要计算策略梯度。
- **action mask（logits mask）**：给策略输出用，告诉采样器哪些动作在当前状态合法，比如迷宫里不能撞墙。

简单说：attention mask 管“模型能不能看见”，loss mask 管“loss 要不要算”，action mask 管“这个动作能不能选”。

## LLM 强化学习：两层 mask

### 前向仍然用 attention mask

RLHF / PPO / GRPO 里，Policy、Reference、Critic 前向时都传 tokenizer 产生的 `attention_mask`：

```python
logits = policy(input_ids, attention_mask=attention_mask).logits
```

这样 `<PAD>` 不参与 Attention，也不会污染 hidden states。如果是 left padding，还要正确构造 `position_ids`，否则 pad 会占位置、导致位置编码错乱：

```python
position_ids = attention_mask.cumsum(-1) - 1
position_ids.masked_fill_(attention_mask == 0, 0)
```

### RL 的 loss 用 completion mask

LLM 的 RL 通常只把 response token 当作动作，prompt 是条件，不算策略梯度。所以在 `attention_mask` 之外还要构造一层：

```python
input_ids       = [prompt_ids, response_ids, pad...]
attention_mask  = [1,1,1, 1,1, 0,0]   # 真实 token 为 1，pad 为 0
completion_mask = [0,0,0, 1,1, 0,0]   # prompt 为 0，response 为 1
action_mask     = completion_mask * attention_mask
```

计算 logprob 时要注意 mask 也要跟着 shift，因为位置 $t$ 的 logits 预测的是 $t+1$：

```python
shift_logits = logits[:, :-1]
shift_labels = input_ids[:, 1:]

logp = log_softmax(shift_logits, dim=-1).gather(
    -1, shift_labels.unsqueeze(-1)
).squeeze(-1)

loss_mask = action_mask[:, 1:]
```

然后 PPO / GRPO 的 policy loss、KL penalty、value loss 都用同一个 mask 做 masked mean，padding 和 prompt 都不会进入策略梯度：

```python
ratio = (new_logp - old_logp).exp()
pg_loss = -torch.min(
    ratio * advantage,
    torch.clamp(ratio, 1 - eps, 1 + eps) * advantage
)
pg_loss = (pg_loss * loss_mask).sum() / loss_mask.sum().clamp(min=1)
```

### 一个对齐的具体例子

假设 `prompt = [A, B, C]`，`response = [D, E]`，pad 为 0：

```text
input_ids       = [A, B, C, D, E, 0, 0]
attention_mask  = [1, 1, 1, 1, 1, 0, 0]
completion_mask = [0, 0, 0, 1, 1, 0, 0]
```

计算 next-token logprob 时对齐到 logits：

```text
logits[0] 预测 B
logits[1] 预测 C
logits[2] 预测 D    <- 要算
logits[3] 预测 E    <- 要算
logits[4] 预测 pad
```

对应的 `loss_mask = completion_mask[:, 1:] = [0, 0, 1, 1, 0, 0]`，只有预测 D、E 的 logprob 进入 loss。

### Reward 和 GAE 也靠 mask

序列级 reward 通常只给最后一个有效 response token：

```python
last_idx = attention_mask.sum(-1) - 1
seq_reward = reward_model(...)[torch.arange(B), last_idx]
```

KL 作为逐 token penalty 加到 reward 上，GAE 递推时用 mask 截断：mask 为 0 的位置直接重置，避免 pad 或 prompt 的 value 污染 advantage。

```python
for t in reversed(range(response_len)):
    active = loss_mask[:, t]
    delta = token_reward[:, t] + gamma * next_value * active - value[:, t]
    gae = delta + gamma * lam * gae * active
    advantage[:, t] = gae
    next_value = value[:, t]
```

多轮对话里还要区分 role，通常只对 assistant 生成的 token 算 loss：`loss_mask = (role_ids == ASSISTANT) & attention_mask`。做 sequence packing 时还需要 block-diagonal attention 或 `cu_seqlens`，防止不同样本互相注意。

不同框架命名不同：TRL 的 PPO 常用 `attention_mask` 再切出 response 部分；OpenRLHF / veRL 常叫 `action_mask` 或 `response_mask`；GRPO 和 DPO 常叫 `completion_mask`。

## 迷宫这类环境：输出端的 action mask

另一个常见问题是：迷宫里“不能撞墙”怎么实现？注意不能用 attention mask 来做这件事。attention mask 管的是输入序列里哪些位置是真实 token，控制 Transformer 内部“能不能看见某个输入位置”；而“不能撞墙”是输出动作空间上的约束，要用 logits 上的 action mask。

假设动作空间是上、下、左、右四个离散动作，环境显式给出当前合法动作：

```python
valid_actions = [True, False, True, True]  # 比如“下”会撞墙
logits = policy(state)                     # shape [B, 4]

mask = torch.tensor(valid_actions)         # 1 合法，0 非法
masked_logits = logits.masked_fill(~mask, -1e9)

dist = Categorical(logits=masked_logits)
action = dist.sample()
logp = dist.log_prob(action)
```

等价公式：

$$
\tilde z_a =
\begin{cases}
z_a, & m_a = 1 \\
-\infty, & m_a = 0
\end{cases}
\qquad
\pi(a|s) = \mathrm{softmax}(\tilde z)
$$

非法动作概率为 0，采样永远选不到，策略梯度也不会流向非法动作。

如果策略是 LLM、动作是 token，可以把动作定义成特殊 token（如 `<UP>`、`<DOWN>`），每步根据环境状态构造词表级 mask，只允许合法动作 token 通过：

```python
vocab_mask = torch.zeros(B, vocab_size, dtype=torch.bool)
for b, valid in enumerate(valid_actions_batch):
    for act in valid:
        vocab_mask[b, ACTION_IDS[act]] = True

logits = logits.masked_fill(~vocab_mask, -1e9)
```

如果动作是自然语言短语，会涉及多 token，更稳的做法是把动作压缩成单个特殊 token，或者用 `PrefixConstrainedLogitsProcessor` 一类的前缀约束解码。

### PPO 里的一个坑

PPO 的重要性比值是

$$
r_t(\theta) = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{old}}(a_t|s_t)}
$$

所以旧策略和新策略必须用同一个 action mask：

```python
old_logp = log_softmax(masked_logits_old, -1).gather(actions)
new_logp = log_softmax(masked_logits_new, -1).gather(actions)
ratio = (new_logp - old_logp).exp()
```

如果旧策略没 mask、新策略 mask 了，ratio 会错，训练会不稳定。另外 mask 由环境状态决定、每步都可能变，所以 batch 里每一步都要保存对应的 `action_mask`。

### 硬约束还是软约束

action mask 是硬约束：非法动作概率直接置 0，适合迷宫这类规则明确、要求安全探索的环境。另一种是软约束：撞墙给负 reward，让模型自己学，但探索阶段仍会撞墙。实际常用的是两者一起用：mask 保证不选非法动作，reward 让模型学会更快到终点。

## 总结

| 名称 | 作用位置 | 作用 |
|---|---|---|
| `attention_mask` | Transformer 输入 | 屏蔽 padding，控制 token 间可见性 |
| `completion_mask` / `loss_mask` | RL loss | 标记哪些 token 算策略梯度、reward、GAE |
| `action_mask` / logits mask | 策略输出 | 屏蔽非法动作，控制动作选择 |

一句话：RL 中 `attention_mask` 继续负责模型内部忽略 padding；`completion_mask` 负责告诉优化器哪些 token 是要训练的动作；而“不能撞墙”这类约束，要在每一步根据环境状态构造 `action_mask`，在输出 logits 上把非法动作置为 $-\infty$。
