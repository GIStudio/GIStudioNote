# XGBoost 与 SHAP：来源、复算与验收

范围：说明 XGBoost 为什么需要局部归因、Tree SHAP 的可加性从哪来、四类图各自回答什么问题，以及 SHAP 的正负号、绝对值与 0 分别意味着什么。核验日期：2026-11-15。

页面：`content/AI/xgboost-and-shap.md`。索引：`content/AI/index.md` 的「机器学习」小节。

叙事框架：以一次评审追问开场（整体重要性答不了“这一套为什么贵”），把文章组织成「两个问题 → 模型结构 → SHAP 的账本 → 流程 → 图 → 符号 → 复算 → 参数 → 边界」。提问者为叙事角色，非逐字记录。

## 主张与来源

| 正文主张 | 来源与核对位置 | 边界 |
| --- | --- | --- |
| XGBoost 是加法树模型，目标函数含一阶/二阶梯度与树复杂度正则 | Chen & Guestrin 2016（`chenXGBoostScalableTree2016`） | 只给出目标函数形式，不推导分裂增益公式。 |
| `gain`/`weight`/`cover` 描述分裂，不定义单条样本的归因 | [XGBoost 参数文档](https://xgboost.readthedocs.io/en/stable/parameter.html) | 文档对三者的定义；「无法回答单条」是本页的推论。 |
| SHAP 用 Shapley 值定义特征贡献，满足局部准确性、缺失性、一致性 | Lundberg & Lee 2017（`lundbergUnifiedApproach2017`） | 三条性质的原始表述；一致性依赖模型改动方向。 |
| Tree SHAP 在多项式时间内给出与定义一致的树模型解释 | Lundberg 等 2020（`lundbergFromLocalExplanations2020`） | 复杂度结论来自论文，本页未复现证明。 |
| 局部准确性可写成 `base + sum(shap) = prediction` | 同上；本页脚本实测 | 实测误差 $5.25\times10^{-6}$（加州房价，单次划分）。 |
| `feature_perturbation` 有路径依赖与干预式两种，后者需要背景数据 | [TreeExplainer 文档](https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html) | 语义按文档；「可能拼出分布外组合」是本页的风险提示。 |
| `model_output="probability"` 在路径依赖模式下不可用 | 本页脚本实测的报错原文 | 结论绑定 shap 0.49.1 + xgboost 2.1.4。 |
| 概率空间与 log-odds 空间都可加总，但对象不同 | 本页脚本实测 | 概率误差 $8.28\times10^{-8}$，raw 误差 $6.73\times10^{-5}$。 |
| 重复特征会独占贡献，相关特征份额不等 | 本页脚本实测 | $[1.583, 0.000]$ 与 $[0.925, 0.828]$；仅说明分摊机制，不外推为「相关特征一定被均分」。 |
| SHAP 不是因果效应，也不是公平性证明 | 方法定义与上一条的分摊现象 | 属于解释边界的推论，未引用具体公平性研究。 |

## 复算

脚本：`scripts/check_shap_xgboost.py`。环境：Python 3.9.6、xgboost 2.1.4、shap 0.49.1、scikit-learn 1.6.1、pandas 2.3.3、numpy 2.0.2。脚本需自行安装 `xgboost` 与 `shap`。

```
base value           2.0718
shap shape           (4128, 8)
max additivity error 5.25e-06
gain top5            ['MedInc', 'AveOccup', 'Longitude', 'Latitude', 'HouseAge']
mean|shap| top5      ['Latitude', 'MedInc', 'Longitude', 'AveOccup', 'AveRooms']
exact duplicates     [1.583 0.   ]
correlated pair      [0.925 0.828]
probability w/o data Only model_output="raw" is supported for feature_perturbation="tree_path_dependent"
prob additivity      8.28e-08
raw additivity       6.73e-05
```

设置：加州房价 8 特征、80/20 划分、`n_estimators=200`、`max_depth=5`、`learning_rate=0.1`、`random_state=42`；重复/相关特征实验用 4,000 行合成数据、深度 4；分类实验用乳腺癌数据、`max_depth=4`、背景集 100 行。

## 内容边界

- 单次划分、未调参、未做交叉验证；数值只用于演示机制，不构成模型性能结论。
- 结论绑定上述库版本；SHAP 的返回形状与参数可用性在不同版本间有变化。
- 未讨论因果识别、公平性审计、概率校准与反事实解释，正文明确把它们排除在外。
- 未复现 Tree SHAP 的多项式复杂度证明，只引用论文结论。

## 内容验收

- `npm run audit:content`：通过（211 个 Markdown、68 个资源）。
- 公开边界脚本：0 错误、0 提醒（页面与索引）。
- `npm run check:content`：通过，951 个文件；页面含 4 张表、2 段代码、公式无 KaTeX 错误。
- 渲染检查：标题、表格、代码块、3 条自动参考文献（Chen & Guestrin 2016；Lundberg & Lee 2017；Lundberg 等 2020）正常，无未解析引用。
- 发布：提交后推送至 `v5`，线上核验见 `docs/knowledge-maintenance.md`。
