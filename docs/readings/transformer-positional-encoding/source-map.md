# Transformer 位置编码：来源与验收

核验日期：2026-10-22。当前执行状态维护于 `docs/knowledge-maintenance.md`；公开交付为 `content/AI/LLM/transformer-positional-encoding.md`，关联 LLM 索引与词向量专题。

## 范围与读者

面向了解词嵌入、刚开始学习注意力的读者，采用渐进学习笔记。保留用户提供的动机、绝对编码两种形式、注入流程、Shaw、分数偏置、ALiBi、RoPE 推导与方法比较；校正置换不变／等变、Query 相关的相对 Key、Value 扩展、RoPE 内容依赖与长序列泛化边界。不给当前模型的总体性能排名，不训练真实模型，不访问私人研究，不下载或转载论文图片。

## 来源与实际核读范围

| 来源 | 实际读取 | 支持范围 |
| --- | --- | --- |
| Vaswani 等，2017，[Attention Is All You Need](https://papers.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html) | 原始 PDF 第 3.2、3.4、3.5 节及正式元数据 | 缩放注意力、输入相加、正余弦公式、固定偏移的线性关系；不把公式可计算误写成实测外推保证 |
| Shaw 等，2018，[Self-Attention with Relative Position Representations](https://aclanthology.org/N18-2074/) | 原始 PDF 第 3.1、3.2 节、式 3–4 及第 4.3 节 | 词对相关的相对向量、Key 与 Value 扩展、j−i 符号与距离裁剪；不称为单纯的距离标量偏置 |
| Su 等，2021，[RoFormer](https://arxiv.org/abs/2104.09864)，实际核读 v5，2023-11-08 | 原始 HTML 第 3.1–3.2 节及摘要页版本历史 | 二维旋转、分块与频率、位置部分的相对位移；采用所读预印本的作者顺序及年份，不把未成功读取的期刊页当作证据 |
| Press 等，2022，[ALiBi 作者版](https://ofir.io/train_short_test_long.pdf) | 作者公开的 ICLR 2022 PDF 第 3 节，因果注意力公式及图 3 | 线性偏置、每个头预先固定的斜率、近期偏好；OpenReview 全文触发浏览器验证后改读作者版，未绕过验证 |
| Raffel 等，2020，[T5](https://jmlr.org/papers/v21/20-074.html) | 原始 PDF 第 2.1 节位置表示段落及正式元数据 | 每个头的可学习标量相对偏置、距离分桶；不导出跨模型性能排名 |
| Devlin 等，2019，[BERT](https://aclanthology.org/N19-1423/) | 原始 PDF 第 3 节与图 2；[官方 modeling.py](https://github.com/google-research/bert/blob/master/modeling.py) 的 embedding_postprocessor | Token、segment、position 输入相加；位置表为训练变量的事实由官方实现核实，不靠论文图示猜测 |
| Touvron 等，2023，[LLaMA](https://arxiv.org/abs/2302.13971) | 原始 PDF 第 2.2 节 Rotary Embeddings 段落及题录 | 原始 LLaMA 在各层采用 RoPE；不推广到所有后续同名模型 |
| Chowdhery 等，2023，[PaLM](https://jmlr.org/papers/v24/22-1144.html) | 原始 PDF 第 2 节 RoPE Embeddings 段落（印刷页 8）及正式元数据 | 原始 PaLM 采用 RoPE；采用正式 JMLR 年份，不复述其性能主张 |

共 8 篇论文及 1 项官方实现。仅核读上述相关部分，不声称完整精读所有实验。RoFormer 出版方页面返回 403；不依赖该页面的正文或二手元数据补造正式记录。

## 推导与教学设定

- 置换关系由标准无位置、无固定顺序掩码的注意力公式代数展开；均值汇聚的不变性与逐 token 输出的等变性分别表述。固定因果掩码不满足任意置换对称，因此不把所有无显式位置编码的模型说成词袋。
- 绝对正余弦表使用 d_model=4、位置 0、1、2，按原始基数 10000 计算；加法演示使用独立设定的 token 向量。
- 全文相对位移统一用 Δ=j−i，表示 Key 位置减 Query 位置。Shaw 的裁剪半径使用 K，避免与 Key 向量 k 混淆。
- ALiBi 例子设斜率 m=0.5、相同缩放后内容分数 2、向后距离 1 与 4，偏置后分数为 1.5 与 0；不是训练所得结果。
- RoPE 例子只取一个二维块，教学角速度 π/2，不是标准模型频率。用位置平移但位移不变、位移变化、内容变化三类比较，避免“点积只依赖距离”的错误解读。
- 本次不提交通知到 arXiv。公开引用预印本时同时给出 /abs/ 科学链接和 /tb/ 记录链接。

## 要求台账

| 要求 | 状态 | 验收依据 |
| --- | --- | --- |
| R1 定义与读者任务明确 | done | 从三个 token 的语序进入，随后沿输入、投影、点积、Softmax、Value 汇总解释注入位置 |
| R2 例子、数学与符号可复核 | done | 数值断言核对三组正余弦、ALiBi 的 1.5 与 0、旋转的 0/0/−1 与内容变化后的 −1；无位置注意力重排误差为 0，固定因果掩码反例差异为 0.5 |
| R3 主张及边界有来源 | done | 8 篇论文及官方 BERT 实现按上表定位；生成 8 条参考文献、10 处引用、两组 arXiv 双链接 |
| R4 相似方法及条件有区分 | done | 对比编码量与注入对象两条轴，分开 Shaw 向量、T5/ALiBi 标量和 RoPE 旋转；说明裁剪、表范围、内容依赖与外推条件 |
| R5 用户要求完整保留 | done | 保留绝对两类公式、相对注入、Shaw、ALiBi、RoPE、Q/K 流程、模型采用实例及比较；补充 Value 扩展和数学边界 |
| R6 可独立阅读与继续学习 | done | 就近解释 Q/K/V、分数与权重、相对位移符号、旋转块与频率，另有等变性附录、LLM 与词向量互链 |
| 公开、行文、构建与生成页面 | done | 三页严格扫描零错误零警告，新页 zh-popular 检查通过；183 个 Markdown 与 21 个资源全量检查通过，HTML 验收和桌面抽检见下方 |
| 提交、推送、部署与线上核验 | done | 内容提交 c2b1d60 已推送至 origin/v5；匹配 Pages 工作流 39740661751 成功；正式正文、LLM 索引及词向量专题均返回 HTTP 200，标题、正文、公式、文献与互链已核对 |

起始分支 v5，本地 HEAD 为 5e1bd40（上一任务的验收记录提交，尚未推送）；origin/v5 为 e478b03。原有 `.gitignore`、`content/index.md`、`.zcodeignore` 三项无关改动保持原状，不加入本次提交。

## 本地验收

2026-10-22，Node 22.16.0 下运行完整 `npm run check:content` 通过，覆盖 183 个 Markdown、21 个资源、TypeScript 和 Quartz 5 构建，输出 818 个文件与 3 个既有重定向。首次默认 npm 缓存写入受当前权限限制，改用 `/private/tmp/gistudio-npm-cache` 后完成原检查，没有修改用户缓存的所有权或仓库依赖。

HTML 断言核对新页单一 H1、3 张表、11 个展示公式、8 条自动参考文献、10 处引用、零 KaTeX 错误、零残留 citation key/wikilink、两组 arXiv 双链接及全部正文内部链接的实际目标；LLM 索引和词向量专题均生成指向新页的正确链接。

使用仅绑定 127.0.0.1 的临时静态预览，在桌面浏览器抽检首屏、正余弦数值表、RoPE 推导和五类机制比较表，公式与表格无可见截断或重叠。静态预览没有承担正式路由的端到端验收；该项留给发布后的规范网址检查。未改站点样式，也未声称完成多设备测试。

等变性数值检查使用三行输入 (1,0)、(0,1)、(1,1)，三个投影均为恒等映射，按行序 (2,0,1) 重排。无掩码的两种计算结果最大差为 0；固定因果掩码下差为 0.5。该算例只核对本文的代数说明，不是训练模型的性能结果。

## 发布证据

- 内容提交：[`c2b1d60`](https://github.com/GIStudio/GIStudioNote/commit/c2b1d60de20bdf7c785fc777138d2468072e26e1)，限定本任务 6 个文件；已登记既有每日队列，并按本次发表请求实际推送至 origin/v5。此前待推送的 SGNS 验收记录 5e1bd40 一并同步，没有带入其他未提交文件。
- 匹配部署：[Pages 工作流 39740661751](https://github.com/GIStudio/GIStudioNote/actions/runs/39740661751)，构建与部署均成功。
- 2026-10-22 在线核验：[位置编码正文](https://notes.gistudio.xyz/ai/llm/transformer-positional-encoding)、[LLM 索引](https://notes.gistudio.xyz/ai/llm/)、[词向量专题](https://notes.gistudio.xyz/dl/embeddings/) 三个规范 URL 均返回 HTTP 200，标题及独有正文匹配；正文含 8 条参考文献、10 处引用、3 张表和 11 个展示公式，零 KaTeX 错误，两组 arXiv 双链接与专题互链有效。
- 临时预览服务与代理新建的预览标签页均已关闭。未提交 arXiv Trackback，未改站点依赖或样式，原有三项无关工作树改动保持原状。
- GitHub 仍报告既有 5 项依赖安全告警（3 high、2 moderate）；CI 的 Node 运行器迁移提示不影响此次内容构建与部署。依赖维护不在本任务范围。
