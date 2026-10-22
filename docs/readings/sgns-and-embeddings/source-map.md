# SGNS 与词向量专题：来源、要求与验收

核验日期：2026-10-22。交付为 `content/DL/Embeddings/` 下 7 个公开页面；当前执行状态统一维护于 `docs/knowledge-maintenance.md`。

## 接受范围与组织

保留用户提供的 SGNS 定义、正负样本、目标函数、优化、矩阵分解、效率和局限；校正有条件或过强的表述。另建相关概念与相似方法页，形成导航、主文、负采样与 NCE、PMI 与矩阵分解、GloVe、fastText、图随机游走嵌入共 7 页。已有交叉熵、降维、图基础和轨迹数据页面只作知识连接，不复制成新笔记。

每页按读者问题安排结构：主文用渐进学习模式，导航用专题入口，其他页用概念解释或机制比较。仅使用用户当前提供内容与公开原始论文，不读取私人研究、训练真实模型或声称复现论文结果。

## 公开来源地图

| 来源 | 实际核读范围 | 支持的内容与边界 |
| --- | --- | --- |
| Mikolov 等，2013，[Efficient Estimation](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/)，arXiv 1301.3781v3 | 原始论文第 3 节，CBOW 与 Skip-Gram；Google 官方记录 | 架构方向区别；不把整套 word2vec 等同于 SGNS |
| Mikolov 等，2013，[Distributed Representations](https://papers.neurips.cc/paper_files/paper/2013/hash/9aa42b31882ec039965f3c4923ce901b-Abstract.html) | 原始全文 PDF 第 2、2.1、2.2、2.3 节；官方元数据 | 双向量表、负采样、噪声分布、原文按数据规模给出的 k 范围、下采样；NEG 是替代目标，不声称与原 Softmax 目标完全相同 |
| Levy 与 Goldberg，2014，[Implicit Matrix Factorization](https://papers.neurips.cc/paper_files/paper/2014/hash/b78666971ceae55a8e87efb7cbfd9ad4-Abstract.html) | 原始 PDF 第 2 节脚注 1，第 3.1、3.2 节及结论 | 理想独立点积、噪声边际分布、PMI 平移与低秩加权拟合的边界；一般 Q 分布公式为沿同一目标展开的代数推导 |
| Gutmann 与 Hyvärinen，2010，[NCE](https://proceedings.mlr.press/v9/gutmann10a.html) | 原始 PDF 第 2.1、2.2 节与正式书目 | 数据与噪声判别、噪声概率校正、未归一化密度估计；条件形式和 k 个噪声样本的写法为 Bayes 公式扩展，不是原文等先验公式的逐字复制 |
| van den Oord 等，2018，[CPC](https://arxiv.org/abs/1807.03748)，实际读取 v2，2019-01-22 | 原始论文 HTML 第 2.2、2.3 节 | InfoNCE 候选集合中的多分类交叉熵；不把一切对比学习都称为 SGNS，也不报告互信息估计效果 |
| Pennington、Socher 与 Manning，2014，[GloVe](https://aclanthology.org/D14-1162/) | 原始 PDF 第 3 节，式 7–9，3.2 节；ACL 书目 | 非零全局共现、对数计数、双偏置和加权平方误差；不称其为原始计数矩阵的直接 SVD |
| Bojanowski 等，2017，[Subword Information](https://aclanthology.org/Q17-1010/) | 原始 PDF 第 3.1、3.2、5.5、6.3 节；ACL 书目 | 字符 n-gram、词边界、完整词特征、共享参数与未登录词；区分训练评分的加和表示与具体工具导出约定，不保证未见词的语义正确 |
| Perozzi、Al-Rfou 与 Skiena，2014，[DeepWalk](https://research.google/pubs/deepwalk-online-learning-of-social-representations/) | 原始 PDF 第 4.2、4.2.2、4.4.2 节；Google 正式记录 | 随机游走生成节点上下文；原文采用层次 Softmax，不能统一标为 SGNS |
| Grover 与 Leskovec，2016，[node2vec](https://doi.org/10.1145/2939672.2939754) | 作者版 PDF 第 3 节，第二阶游走与 p、q；负采样说明 | 按上一节点的图距离偏置转移、负采样；p=q=1 只说明采样回到无偏游走，不保证全部训练配置相同 |
| Devlin 等，2019，[BERT](https://aclanthology.org/N19-1423/) | ACL 正式记录及摘要 | 上下文表示与静态词表的区别；不以摘要支持具体实现或跨模型性能排名 |

10 条文献均使用公开正式记录或作者原始论文；正文数学和代码排版不复制出版社图片。远程 PDF 的相关公式依据解析文字及关键页定位核对，不声称本轮完整精读全部实验。

## 教学设定与关键校正

- 主文的已分词短句、正负词对及分数 2、−1、−2 是教学设定。损失以自然对数计算，模型的二分类输出解释为训练样本来源，不是上下文条件概率或语义真值。
- PMI 算例使用 1000 个有效训练词对、中心边际 100、上下文边际 200、联合计数 40；k=5 且 Q=P(c) 时最优自由点积为 ln(0.4)，不是正的 PMI 值。实际低维训练不保证逐项达到此值。
- 一般噪声分布下，最优自由点积为 ln[P(w,c)/(kP(w)Q(c))]；只有 Q=P(c) 才简化成 PMI−ln(k)。Q 的 3/4 次幂平滑通常带来上下文相关修正。
- GloVe 的计数与偏置例子、fastText 的 cat/cats 片段、图的 t→v 及三个候选节点均为生成的教学案例，不当作语料发现或模型实测。
- 对相似方法的比较按数据表示、训练目标、参数共享和适用条件展开，不提供未经同一数据与预算检验的总体性能排名。
- 本次不提交 arXiv Trackback；公开涉及 arXiv 的页面同时保留 /abs/ 科学链接与 /tb/ 记录链接。

## 要求台账

| 要求 | 状态 | 验收位置 |
| --- | --- | --- |
| R1 对象、读者和页面分工明确 | done | 导航按读者问题分流；主文从词对与双向量表讲到预训练使用，其余页分别解释目标、统计、组合与图上下文 |
| R2 例子、符号和计算可核对 | done | 数值断言核对损失 0.567、零分数损失 2.079、PMI 0.693、自由点积 −0.916、对数计数、cat/cats 三元组及图转移概率 1/7、2/7、4/7 |
| R3 重要主张及条件可追溯 | done | 上表记录 10 篇论文及实际核读覆盖；生成 HTML 含 13 条文献条目（去重 10 篇）、22 处引用和 CPC 的 arXiv 双链接，无残余 citation key |
| R4 相似方法与边界有实际解释作用 | done | 分开架构与目标、NEG 与 NCE/InfoNCE、理想自由点积与低秩训练；GloVe、fastText 与图页分别解释改变的机制及适用边界 |
| R5 用户输入与扩展要求完整保留 | done | SGNS 定义、采样、目标、SGD、矩阵视角、效率、超参数与局限均保留；另外交付导航及 5 个独立关联方法页 |
| R6 不重开论文也能沿知识路径学习 | done | 每页有定义、例子、符号及结果解释；主文到拓展页、拓展页回专题均有有效路径，且关联既有 NLL、降维、图基础与轨迹质量页 |
| 7 页内容与相关导航 | done | 验证全部新页正文链接均落在实际生成路由；专题表中 6 个入口、6 个返回链接及 DL、Graph、LLM 三处新增导航目标正确 |
| 公开检查、数学、行文与排版 | done | 10 个候选页面严格扫描零错误零警告；7 页 zh-popular 行文检查通过；182 个 Markdown、21 个资源全量检查通过；生成 9 张表、19 个展示公式，无 KaTeX 错误或未解析 wikilink；详见下方排版检查 |
| 限定提交、推送、部署及正式页面 | 待验 | 匹配内容提交、Pages 工作流与线上正文 |

初始 `.gitignore`、`content/index.md`、`.zcodeignore` 三项无关改动不进入本次提交。

## 排版与检查记录

2026-10-22，使用仓库固定 Node 22.16.0 完成 `npm run check:content`，182 个 Markdown 和 21 个资源通过审计、TypeScript 检查与 Quartz 5 全量构建；构建输出 813 个文件，另加 3 个既有重定向。7 个新页在提交前出现未跟踪文件日期提示，这是 Git 日期尚未形成的本地提示，不是内容构建错误。

桌面浏览器实际抽检专题首页、SGNS 的损失表及目标公式、PMI 推导，视口为工具提供的 1280×720。检查后删除新页正文与 Quartz 自动标题重复的 H1，补齐可从目录跳转的“参考文献”标题；列表仍由 citation key 与 BibTeX 自动生成。修复专题表中未转义 wikilink 管道导致的单元格截断，并将存在歧义的 index 链接改为明确的专题路径。正文公式与表格在上述桌面视口可读；没有据此声称完成多设备测试。

全量构建后的 HTML 断言逐页确认单一 H1、参考文献标题、各页预期文献数量、零数学渲染错误、零未解析引用／wikilink，以及每条正文内部链接的实际目标。7 页中文检查只有词对连接号和数值范围的标点提醒，人工确认均有含义，未为消除提醒改变技术表达。
