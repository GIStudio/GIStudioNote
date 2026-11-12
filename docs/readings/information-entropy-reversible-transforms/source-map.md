# 信息熵、可逆变换与 Base64：来源与验收

范围：把「无损变换是否等于信息等价」「Base64 是否注入信息」「模型学 Base64 潜空间是否构成模糊层」三个问题拆成信息量、表征、可用性三层来回答。核验日期：2026-11-12。

页面：`content/Math/information-entropy-and-reversible-transforms.md`。索引：`content/Math/index.md` 新增「信息与编码」一节。

## 主张与来源

| 正文主张 | 来源与核对位置 | 边界 |
| --- | --- | --- |
| 熵是不确定性的度量，与符号或文件大小无关 | Shannon 1948（`shannonMathematicalTheory1948`） | 经典定义；正文只用离散情形。 |
| 双射变换保持熵：$H(f(X))=H(X)$ | Cover & Thomas 2006（`coverElementsInformation2006`），第 2 章 | 对离散变量严格成立；连续变量换成微分熵后不保持，正文已注明不展开。 |
| 已知密文与密钥时，明文条件熵为零：$H(a\mid b,k)=0$ | Shannon 1949（`shannonCommunicationTheorySecrecy1949`） | 这是可逆性的直接后果，不涉及语义安全或攻击模型。 |
| 完美保密：$H(a\mid b)=H(a)$ | 同上 | 只在特定加密体制下成立；正文用它说明「无损」与「看不懂」可以并存。 |
| $H(a,b)=H(a)+H(k)$ | Cover & Thomas 2006，联合熵与条件熵的链式法则 | 需要密钥与明文独立；正文写明了这个条件。 |
| Base64：3 字节 → 4 字符，每字符 6 比特，体积 ×4/3 | [RFC 4648 §4](https://www.rfc-editor.org/rfc/rfc4648#section-4) | 标准定义；padding 与规范化编码未展开。 |
| base 编码「不向明文增加熵」，只增加明文长度并给出特征概率分布 | [RFC 4648 §12](https://www.rfc-editor.org/rfc/rfc4648#section-12) | 原文表述，正文直引其结论，不引申为安全性结论。 |
| 零阶经验熵在两种表示下不同（4.170 vs 5.371 比特/符号） | `scripts/check_entropy_invariance.py` | 见下方复算；只用于说明符号边界的影响。 |
| 均匀字节样本下总量守恒（均为 6144 比特） | 同一脚本 | 理想对照：8 比特/字节 × 768 与 6 比特/字符 × 1024。 |
| 模型是否学会 Base64 解码尚无定论 | — | 正文给的是可检验的预测与实验设计，未引用任何内部探测结果。 |

## 复算

脚本：`scripts/check_entropy_invariance.py`（仅用标准库，无随机性）。

```
raw text     n=483   H/byte=4.170  total=2014 bits
base64       n=644   H/char=5.371  total=3459 bits
raw unif.    n=768   H/byte=8.000  total=6144 bits
b64 unif.    n=1024  H/char=6.000  total=6144 bits
```

解释：文本样本的零阶熵在 Base64 侧更高，是因为按 6 比特重切后，字节层的重复模式被打散，符号频率被抹平；这不表示信息增加。均匀样本展示了理想情形：每符号熵从 8 降到 6，符号数从 768 增到 1024，总量不变。

## 内容边界

- 不讨论连续变量的微分熵、率失真理论或信道容量。
- 不评估任何具体加密算法的安全性，也不讨论选择明文攻击等密码学定义。
- 「模型学到句法解码层」是待检验的推断，正文明确标注为假设并给出检验思路。
- 经验熵是零阶估计，未做块熵或压缩器估计；数值只服务于「符号边界会改变表面熵」这一论点。

## 内容验收

- `npm run audit:content`：通过（210 个 Markdown、68 个资源）。
- 公开边界脚本：0 错误、0 提醒（页面与索引）。
- `npm run check:content`：通过，946 个文件；页面含 3 张表、73 处公式渲染，无 KaTeX 错误。
- 渲染检查：标题、三张表、自动参考文献（Shannon 1948、Shannon 1949、Cover & Thomas 2006）正常，无未解析引用。
- 发布：提交后推送至 `v5`，线上核验见 `docs/knowledge-maintenance.md`。
