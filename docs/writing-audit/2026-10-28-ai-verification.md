# AI 页面核验记录

核验日期：2026-10-28。范围为 AnyRecon、AI 分类、OpenManus 和生成式 AI 四页；修改均基于公开资料，没有运行第三方项目。

| 页面 | 核验和修订 | 依据 |
| --- | --- | --- |
| AnyRecon | 根据原论文和仓库更正为参考帧、几何记忆与生成—重建循环；区分论文稀疏注意力与仓库待发布权重；补 π³、示例显存与极低重叠时的限制。删除未经证实的全注意力消除误差等断言。 | [论文 v1](https://arxiv.org/html/2604.19747v1)、[项目主页](https://yutian10.github.io/AnyRecon/)、[官方仓库](https://github.com/OpenImagingLab/AnyRecon) |
| AI 分类 | 区分 AGI、ASI 的能力范围与水平；说明强 AI 在通俗和哲学语境的不同含义；联邦学习是协作训练方法，并非部署地点或自动隐私保证。 | [AGI 定义研究](https://reference-global.com/download/article/10.2478/jagi-2019-0002.pdf)、[斯坦福哲学百科](https://plato.stanford.edu/entries/artificial-intelligence/) |
| OpenManus | 旧仓库已迁址，按现有官方说明更新安装入口；删除个人推广码和第三方接口推广；加入配置文件 Git 忽略核对、密钥安全、浏览器及各工具独立权限的提示。首次示例关闭默认浏览器服务，不宣称沙箱保护所有工具。 | [迁址声明](https://github.com/mannaandpoem/OpenManus)、[新仓库说明](https://github.com/FoundationAgents/OpenManus)、[配置模板](https://github.com/FoundationAgents/OpenManus/blob/main/config/config.example.toml)、[配置目录忽略规则](https://github.com/FoundationAgents/OpenManus/blob/main/config/.gitignore) |
| 生成式 AI | 以可追溯的 VAE、GAN、扩散与 Sora、Genie 2 项目资料重写无引用、互相混淆的历史和应用断言；保留图像、视频、声音和交互场景的学习入口；对真实性和安全边界给出条件性说明。 | [VAE](https://arxiv.org/abs/1312.6114)、[GAN](https://arxiv.org/abs/1406.2661)、[DDPM](https://arxiv.org/abs/2006.11239)、[潜空间扩散](https://arxiv.org/abs/2112.10752)、[Sora](https://openai.com/index/video-generation-models-as-world-simulators/)、[Genie 2](https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/)、[NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) |

## 检查与边界

- 四页公开内容扫描为 0 错误、6 警告；人工核对均为公共项目名或公开演示被误识别为私人语境，不含个人信息。
- 中文科普表达检查：两页无命中，AI 分类的“心智”为哲学术语，生成式 AI 的连接号为时间范围，均保留。
- 四页 `git diff --check` 通过；不代表依赖安装或 Agent 沙箱行为已实际测试。
- 官方代码、权重、接口和默认设置会变化，使用前须按相应版本再次核对；是否能运行及沙箱保护范围需在目标环境验证。
