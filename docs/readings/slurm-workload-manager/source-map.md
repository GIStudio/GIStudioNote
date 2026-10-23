# Slurm：来源、范围与验收

核验日期：2026-10-23。交付为 `content/Dev/slurm-workload-manager.md`，接入开发索引的服务器与集群入口。采用渐进学习笔记，以一个单进程 CPU 作业贯穿资源申请、排队、运行和结果检查；附交互式作业、GPU 与数组用法。不安装或管理 Slurm，不读取私人集群配置，不连接集群，不提交、修改或取消真实作业。

## 来源与实际核读范围

以下均为 SchedMD 官方在线文档；核读相关章节而非完整阅读全部命令手册。在线文档可能滚动更新，未据此声明某个版本是最新稳定版。实际环境须以集群安装版本及本站点用户手册为准。

| 来源 | 实际核读位置 | 允许支持的主张 |
| --- | --- | --- |
| [Overview](https://slurm.schedmd.com/overview.html) | Overview、Architecture、Commands、Slurm entities | 三项职责、slurmctld/slurmd/slurmdbd、节点、可重叠分区、作业和作业步 |
| [Quick Start User Guide](https://slurm.schedmd.com/quickstart.html) | Overview、Architecture、Commands | 用户命令的分工、资源分配与执行的区别 |
| [sbatch](https://slurm.schedmd.com/sbatch.html) | DESCRIPTION；cpus-per-task、ntasks、mem 选项 | 脚本提交不等于开跑、SBATCH 解析位置与变量、日志命名、只传输脚本、逐节点内存请求 |
| [srun](https://slurm.schedmd.com/srun.html) | DESCRIPTION、RETURN VALUE | 在分配中启动工作，必要时也可自行申请分配；同步调用的退出状态 |
| [salloc](https://slurm.schedmd.com/salloc.html) | NAME、DESCRIPTION | 获得分配、启动命令或默认 shell、结束后释放；不把获得 shell 当作已经登录计算节点 |
| [CPU Management](https://slurm.schedmd.com/cpu_management.html) | Overview、CPU Management Steps、第 1–2 步选项表 | 节点、CPU 分配、task 分布与绑定分开；CPU 计量受核心、线程及选择插件配置影响 |
| [Scheduling Configuration Guide](https://slurm.schedmd.com/sched_config.html) | Overview、Backfill Scheduling | 优先级与回填条件、准确 walltime 的作用；不承诺排队时长 |
| [Job Array Support](https://slurm.schedmd.com/job_array.html) | Overview、Job ID and Environment Variables、File Names | 数组下标、并发上限、SLURM_ARRAY_TASK_ID 与 %A/%a；资源请求按元素计算 |
| [GRES Scheduling](https://slurm.schedmd.com/gres.html) | Overview、Configuration、Running Jobs、GPU Management | GPU 需管理员配置并显式申请，gres 按节点、gpus 按作业的区别；作业步的 CUDA_VISIBLE_DEVICES |
| [Job State Codes](https://slurm.schedmd.com/job_state_codes.html) | Job states、Job flags | PENDING、RUNNING、COMPLETED、FAILED、TIMEOUT、OUT_OF_MEMORY 等状态 |
| [Job Reason Codes](https://slurm.schedmd.com/job_reason_codes.html) | 开头说明与 Common Reasons | Resources、Priority、Dependency、QOS/Assoc 限额；可能存在多个原因但只展示本次遇到的一项 |
| [sacct](https://slurm.schedmd.com/sacct.html) | DESCRIPTION、format 字段列表、Job Accounting Fields 开头及 MaxRSS 说明 | 作业和作业步记录、ExitCode、AllocCPUS、MaxRSS 为步内任务的最大观测值；会计插件与采样的限制 |
| [Job Exit Codes](https://slurm.schedmd.com/job_exit_code.html) | Job/Step Exit Codes、Displaying Exit Codes and Signals、Derived Exit Code | 批处理脚本退出码可能掩盖内部失败，0:0 的两部分；应用产物仍需核对 |
| [sinfo](https://slurm.schedmd.com/sinfo.html)、[squeue](https://slurm.schedmd.com/squeue.html)、[scancel](https://slurm.schedmd.com/scancel.html) | NAME、SYNOPSIS、DESCRIPTION | 查询节点与分区、队列、取消单个明确作业的命令语义；正文链接原手册，不演示管理员修改 |

## 教学设定与推断

- 单进程例子自行编写，仅用 Python 标准库，1 节点、1 task、1 CPU、每节点 1G 内存、5 分钟。总和 4999950000 是 `sum(range(100000))` 的确定性结果，不是 Slurm 性能测试。
- 1 task × 4 CPUs 与 4 tasks × 1 CPU 用于区分资源形状；不保证获得独占物理核心，也不暗示串行代码自动并行。
- 回填的 30 分钟空档与 10 分钟作业均为教学设定，仅说明配置允许时的条件，不预测实际启动时间。
- 数组示例为 0–9 共 10 个元素、最多 2 个同时运行；每元素仍用 1 CPU、1G，输出 case_id 与平方只是下标传参演示，不是研究结果。
- 登录节点是常见部署习惯而非所有 Slurm 环境都强制具有的拓扑；计算位置由实际 srun 作业步判断。
- 只比较直接启动进程与经调度器分配资源的工作流，不扩展为 Slurm/Kubernetes 性能或产品排名。

## 要求台账

| 要求 | 状态 | 验收依据 |
| --- | --- | --- |
| R1 定义和读者任务 | done | 首段定义，面向首次使用共享集群的读者，解释资源与作业的关系 |
| R2 连贯算例及机制 | done | 小作业、CPU 形状对比、交互分配与数组；7 个 Bash 区块语法检查、求和及 10 个数组下标验证通过 |
| R3 事实可追溯 | done | 上述官方文档，正文 15 处引用，自动生成 13 条官方手册参考文献，另有三个命令手册直链 |
| R4 边界与替代流程 | done | 直接运行、sbatch/salloc/srun、串行与并行、状态与产物分开；明确站点配置与未实机运行边界 |
| R5 调研并发布 | doing | 本地成稿、构建、限定提交、v5 推送、匹配 Pages 与线上检查 |
| R6 自包含与后续使用 | done | 命令表、术语解释、排错入口及开发导航；三个继续阅读链接与开发索引入口已检查实际路由 |

初始工作树有 `.gitignore`、`content/index.md` 和 `.zcodeignore` 三项无关改动，均保持原状、不纳入提交。

## 验证与发布

2026-10-23，本地验收完成，部署待核验。

- Node 22.16.0 下 `npm run check:content` 通过，覆盖 184 个 Markdown、21 个资源、TypeScript 与 Quartz 5 构建，生成 822 个文件和 3 个既有重定向。使用临时 npm 缓存，不改用户缓存权限或仓库依赖。
- 两个候选页公开扫描零错误，Conda 名称中的 NDA 子串触发两条私密研究提醒，逐项确认只是公开软件名称；中文教学行文检查零失败、零警告。未从私人材料取材。
- 7 个 Bash 区块通过 `bash -n`。2 个完整脚本用本地 shell 函数替代 `srun`，仅执行 Python 标准库算例；求和为 4999950000，数组下标 0–9 对应平方输出全部正确。没有运行真实 Slurm 命令或验证调度、资源隔离、GPU、MPI、站点环境。
- 生成 HTML 含单一 H1、4 张表、8 个代码区块（含执行链）、13 条文献与 15 处引用；无残留 wikilink 或 citation key，参考文献标题可见。各文献包含官方网址，现有引用渲染器将 @online 的 URL 输出为书目文本，不误报为 13 个可点击链接。
- 开发索引入口、Conda 与 uv 链接和返回开发页链接的实际路径均已核对。既有 `tools/Dev` 别名会干扰该页的某些 index 简写解析，最终用正式开发页 URL 回链，未扩大修改为站点内核或历史别名清理。
- 本机回环预览完成正文、CPU 资源比较表、完整批处理脚本与文献列表抽检，无可见截断或重叠；静态预览在重新构建清理输出时的一次 404，重载生成页后恢复，不作为正式路由测试。临时服务与新建标签页均已关闭。

部署验收另补内容提交、匹配工作流和线上实际结果；不以本地存在或推送成功代替发布完成。
