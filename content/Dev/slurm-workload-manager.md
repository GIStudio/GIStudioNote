---
title: Slurm 入门：共享集群如何分配资源、排队和运行作业
description: 从一个小作业理解 Slurm 的节点、分区、资源分配与作业步，掌握 sbatch、srun、salloc、排队排错、GPU 申请与作业数组。
tags:
  - Dev
  - Slurm
  - HPC
  - 集群计算
  - 教程
verified_at: 2026-10-23
---

**Slurm 是共享 Linux 集群的资源与作业管理系统，负责把计算资源分给用户，并安排作业何时、在哪里运行。** 它是开源软件，管理的对象既包括 CPU、内存和 GPU 等资源，也包括等待或正在执行的计算任务。[@schedmdSlurmOverview]

例如，你想运行一段 Python 分析，需要一台计算节点、一个 CPU 和少量内存。直接在当前机器上运行 `python3`，只会启动本机进程；提交给 Slurm，则是先提出资源请求，等待调度，再在获配节点上执行程序。

从这里开始，最好始终分开两件事：**申请资源，以及使用资源运行程序。** 拿到作业编号只说明提交成功，拿到资源也不会让一段串行代码自动变成并行代码。

## 一个作业会经过哪些对象

先看一条简化的执行链。

```text
提交资源请求与脚本
        ↓
slurmctld 检查条件并调度，必要时排队
        ↓
获得一组节点及相应资源，形成 job allocation
        ↓
节点上的 slurmd 配合启动工作
        ↓
脚本通过 srun 启动作业步，程序执行并写出结果
        ↓
结束、释放资源，查询日志与会计记录
```

`slurmctld` 是管理调度的中央服务，`slurmd` 是计算节点上的服务。部署还可以使用 `slurmdbd` 保存作业会计数据；它不是实际执行计算的进程。这里的“会计”包括作业状态、运行时间及资源使用记录，并不必然表示按金额收费。[@schedmdSlurmOverview]

| 对象 | 含义 | 在例子里对应什么 |
| --- | --- | --- |
| Node，节点 | 集群中受管理的计算主机 | 程序实际运行的机器 |
| Partition，分区 | 一组逻辑节点及其使用规则 | 选择允许该作业进入的资源范围 |
| Job / allocation，作业及资源分配 | 用户在一定时间内获准使用的一组资源 | 本次分析获得的节点、CPU、内存与时限 |
| Job step，作业步 | 分配内部的一次任务启动 | 脚本中的一次 `srun python3 ...` |

分区可以有不同的时间上限和访问规则，**不同分区也可以包含同一台节点**。因此，分区不能简单理解为几套互不重叠的物理机器。一个作业内还可以有多个作业步，按需顺序或并行执行。[@schedmdSlurmQuickStart]

很多集群另设登录节点，供连接、编辑和提交作业，较重的计算交给计算节点。这是常见部署方式，具体登录节点能做什么，由集群使用规则决定。

## 先读懂资源请求，再写脚本

Slurm 中的 task 通常对应一个被启动的进程。`--ntasks` 描述任务数量，`--cpus-per-task` 描述每个任务需要多少 CPU；线程则由程序或数值库在进程内部创建。

下面比较的是资源请求形状，假设都限制在一个节点上。

| 请求 | 表达的意图 | 程序需要具备什么能力 |
| --- | --- | --- |
| `--ntasks=1 --cpus-per-task=1` | 一个任务使用一个 CPU | 普通单进程程序即可 |
| `--ntasks=1 --cpus-per-task=4` | 一个任务使用四个 CPU | 程序需自行使用多线程或其他并行机制 |
| `--ntasks=4 --cpus-per-task=1` | 准备运行四个任务，每个一个 CPU | 启动四份进程后，需要分工或通信，避免重复计算 |

后两行都涉及四个 CPU，但运行方式不同。把串行脚本的 `--cpus-per-task` 从 1 改成 4，不会自动拆分循环；把 `--ntasks` 改成 4 后用 `srun` 启动，也可能只是重复运行四份相同程序。MPI 等进程间通信机制或应用自身的并行设计，仍然需要另行准备。

这里的 CPU 是 Slurm 配置的分配单位，可能涉及物理核心或硬件线程；实际分配粒度与绑定方式受集群插件和配置影响，不能直接把“四个 CPU”解释成“四个独占物理核心”。[@schedmdSlurmCpu]

内存也要注意计量范围。`--mem=1G` 请求的是**每个节点**的主机内存，不是每个 task 的内存，也不是 GPU 显存；`--mem-per-cpu` 则按可用的已分配 CPU 请求内存。这两种请求方式不能同时指定。[@schedmdSlurmBatch]

## 用一个小作业走完整个流程

以下示例假设集群已提供 Slurm，计算节点上有 `python3`，提交目录可写且能被计算节点访问。分区、账户、QOS（服务质量策略）等选项若为本站点必填项，需要使用管理员提供的有效值；示例不假定存在名为 `cpu` 或 `gpu` 的分区。

### 1. 查看资源入口

```bash
sinfo
squeue -u "$USER"
```

`sinfo` 查看分区与节点，`squeue` 查看队列；这里按当前用户过滤，避免把别人的作业与自己的混在一起。具体字段可查 [sinfo 手册](https://slurm.schedmd.com/sinfo.html) 和 [squeue 手册](https://slurm.schedmd.com/squeue.html)。

### 2. 保存批处理脚本

将下面内容保存为 `hello.sbatch`。`.sbatch` 是便于识别用途的文件后缀，关键在于交给 `sbatch` 提交。

```bash
#!/bin/bash
#SBATCH --job-name=slurm-hello
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=1G
#SBATCH --time=00:05:00
#SBATCH --output=slurm-%j.out

set -euo pipefail

# 若站点要求加载 Python 环境，在这里加入其正式初始化命令。
srun --ntasks=1 --cpus-per-task=1 python3 -u - <<'PY'
import os
import socket

print("job_id:", os.environ["SLURM_JOB_ID"])
print("host:", socket.gethostname())
print("sum:", sum(range(100000)))
PY
```

它申请一个节点、一个任务、一个 CPU、每节点 1G 内存，以及 5 分钟的运行时限。日志文件名中的 `%j` 会替换为作业编号。示例中的求和结果应为 `4999950000`，这个小计算只是用来核对执行流程。

`#SBATCH` 由 Slurm 读取，必须放在第一条实际 shell 命令之前；其中的 `$变量` 不会像 shell 代码那样展开。若把输出改成 `logs/...`，要在提交前建好目录，不能指望作业开始后才创建日志所需的父目录。Slurm 默认也不会替你传输数据和代码文件，除批处理脚本外的文件需要自行安排可见位置。[@schedmdSlurmBatch]

### 3. 提交并查询

```bash
sbatch hello.sbatch
```

命令返回作业编号后，把下文的 `JOB_ID` 换成这个真实编号，再分别查询。

```bash
squeue -u "$USER"
scontrol show job JOB_ID
sacct -j JOB_ID --format=JobID,JobName,State,ExitCode,Elapsed,AllocCPUS,MaxRSS
```

`sbatch` 提交脚本后就返回，不会一直等程序运行完。很短的作业也可能在下一次查看 `squeue` 前已经结束，这时应查看日志和历史记录，而不是认定作业丢失。

`sacct` 中可能同时出现作业本身、`.batch` 和 `.0` 等作业步记录。`MaxRSS` 表示相应作业步中某个任务被观测到的最大驻留内存，**不能当成所有任务内存之和**。字段是否可用、能捕捉到哪些峰值，取决于会计采集插件与采样配置。[@schedmdSlurmAccounting]

## sbatch、salloc、srun 到底怎么选

| 命令 | 主要作用 | 适合的场景 |
| --- | --- | --- |
| `sbatch script.sbatch` | 提交批处理脚本，返回作业编号 | 不需要持续交互的分析、模拟与训练 |
| `salloc ...` | 等待并获得资源分配，在其有效期内运行命令或 shell | 需要交互检查环境或短时调试 |
| `srun ... command` | 启动任务；在已有分配里形成作业步，必要时也可先申请分配 | 真正执行程序或启动交互 shell |

所以，“`sbatch` 用于提交、`srun` 用于执行”是实用的入门记法，但不能进一步误写成“`srun` 永远不能申请资源”。[@schedmdSlurmRun]

下面是一个需要消耗真实资源的交互式示例，只在有使用权限且确实需要调试时运行。

```bash
salloc --nodes=1 --ntasks=1 --cpus-per-task=1 --mem=1G --time=00:10:00
# 等待获得分配后，在 salloc 打开的 shell 中执行：
srun --pty bash
# 调试结束，退出计算节点上的 shell：
exit
# 再退出 salloc 的 shell，释放分配：
exit
```

`salloc` 获得分配后启动的默认 shell，不保证已经位于计算节点上；`srun --pty bash` 才是在分配中启动交互 shell 的步骤。结束 `salloc` 中的命令或 shell 后，分配会被释放。不要申请资源后让终端长期闲置。[@schedmdSlurmAlloc]

## 为什么明明有空闲机器，作业还在排队

调度器要同时考虑资源是否合适、作业优先级、时间要求及策略限制。看到空闲 CPU，不代表它属于你可用的分区，也不代表它同时具备所需 GPU、内存或其他条件。

Slurm 的**回填调度（backfill）**可以利用时间空档，启动较低优先级的作业，条件是不推迟较高优先级作业的预计开始时间。用一个教学情形说明：高优先级的大作业还要等其他节点释放，当前有一段 30 分钟空档，一个申请 10 分钟的小作业就可能利用它。实际是否回填仍取决于配置与资源匹配。[@schedmdSlurmScheduling]

这也是运行时限值得认真估计的原因。把所有任务都写成数天，可能让调度器无法把它们放进短空档；写得过短又可能导致超时终止。先用代表性小任务了解耗时，再留出合理余量，比一律申请最大值更有依据。

排队原因与作业状态是两种信息。`PENDING` 是状态，下面这些是它尚未开跑的原因。

| 原因 | 可以先怎样理解 | 排查入口 |
| --- | --- | --- |
| `Resources` | 请求的资源当前不可用 | 核对节点数、CPU、内存、GPU 和分区是否匹配 |
| `Priority` | 有更高优先级作业需要先被考虑 | 了解本站点的优先级规则，不把它理解成报错 |
| `Dependency` | 前置作业条件尚未满足 | 查看依赖作业是否结束及其退出状态 |
| `QOSGrp*`、`AssocGrp*` | 策略或关联账户达到某种总量限制 | 查集群配额说明，必要时联系管理员 |

同一个作业可能同时受多个条件限制，界面显示的通常只是本次调度遇到的一项原因。消除一项原因后，另一项仍可能出现。[@schedmdSlurmReasons]

## 从“作业结束”检查到“结果可信”

`RUNNING` 表示正在执行，`COMPLETED` 表示按 Slurm 的状态判定完成；常见异常还有 `FAILED`、`TIMEOUT`、`OUT_OF_MEMORY` 和 `CANCELLED`，分别指向执行失败、超过时限、内存不足及取消等情况。状态含义可由官方状态表核对。[@schedmdSlurmStates]

`sacct` 的 `ExitCode` 通常写作“退出码:信号号”，例如 `0:0`。批处理作业记录的是脚本退出状态，如果内部程序失败后脚本仍以 0 退出，顶层状态就可能掩盖失败。因此要连同作业步、标准错误和输出文件一起看；脚本里的 `set -euo pipefail` 有助于暴露常见错误，但不替代应用自身的错误处理。[@schedmdSlurmExit]

对前面的例子，至少核对日志中的主机与作业编号、求和是否为 `4999950000`。真实分析还应检查输出文件、样本数量、指标和完整性。`COMPLETED` 不会替你判断计算方法正确或实验结论成立。

若确实要停止自己的某个作业，先在队列中确认编号，再使用 `scancel JOB_ID`。这会取消等待中的作业或终止运行中的作业，未保存的进度可能丢失；避免用宽泛的用户级取消命令清空队列。参见 [scancel 手册](https://slurm.schedmd.com/scancel.html)。

## GPU 与大量独立任务怎样接入

### GPU 仍然要显式申请

在管理员已经配置 GPU GRES（通用资源）的集群中，可以按站点手册加入相应请求。例如，对于一个节点的作业，下面一行表达每节点申请一张 GPU。

```bash
#SBATCH --gres=gpu:1
```

这是要放进脚本顶部的资源指令，不是完整的 GPU 训练脚本。有些集群使用 `--gpus` 等接口或要求具体型号；`--gres=gpu:1` 与 `--gpus=1` 的计量范围也不能在多节点场景下直接混同，前者按节点，后者按作业。

Slurm 的 GPU 插件可为作业步设置 `CUDA_VISIBLE_DEVICES`，告诉程序哪些设备可见。不要照搬别的机器的物理卡号去覆盖它。申请多张 GPU 后，训练框架仍需配置多卡执行，Slurm 不会自动改写训练代码；主机内存与 GPU 显存不足也应分别诊断。[@schedmdSlurmGres]

### 相同流程的独立计算，用作业数组

若要对 10 个数据分片分别执行同一流程，可以使用 job array，而不是手工复制 10 份脚本。下面仍是教学脚本，保存为 `array.sbatch`；它只演示把下标传给 Python。

```bash
#!/bin/bash
#SBATCH --job-name=array-demo
#SBATCH --array=0-9%2
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=1G
#SBATCH --time=00:05:00
#SBATCH --output=array-%A_%a.out

set -euo pipefail

srun --ntasks=1 --cpus-per-task=1 python3 -u -c \
  'import sys; i = int(sys.argv[1]); print("case_id:", i, "square:", i * i)' \
  "$SLURM_ARRAY_TASK_ID"
```

提交时使用 `sbatch array.sbatch`。`0-9` 对应 10 个数组元素，`%2` 限制同时运行的元素最多为 2；不是把整个数组限制成两个任务。`%A` 表示数组主编号，`%a` 表示元素下标，方便各自写日志。资源请求按每个元素计算，此例每个元素仍申请一个 CPU、每节点 1G 内存。[@schedmdSlurmArrays]

真实使用时，用 `SLURM_ARRAY_TASK_ID` 选择输入文件、随机种子或参数组合，并让每个元素写入不同的输出位置。数组适合独立任务，不能替代一个需要进程间通信的分布式计算。

## 使用范围与继续阅读

这类工作流适合多人共享集群上的批处理、模拟、数据处理和模型训练。单机临时计算不一定需要调度器；集群已经由 Slurm 管理时，绕过它直接占用计算节点则可能违反使用规则。环境管理解决“程序依赖什么”，Slurm 解决“何时获准在哪些资源上运行”，两者应配合使用。

可以继续阅读 [[Dev/conda|Conda 环境管理]]、[[Dev/uv-setup|uv 配置]]，或回到 [开发与工程实践](https://notes.gistudio.xyz/dev/)。

本文依据截至 2026 年 10 月 23 日核对的官方在线手册。示例未在真实 Slurm 集群运行；分区、账户权限、软件环境、GPU 类型和资源限制，均需按实际安装版本与集群手册调整。本文不涉及管理员安装、服务配置或集群性能测评。

## 参考文献
