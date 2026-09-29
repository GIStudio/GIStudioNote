---
title: Windows Developer Config：把开发机初始化变成可重复、可验证的流程
description: 解析 Microsoft WindowsDeveloperConfig 的三类配置入口、WinGet 与 DSC 机制、CI 验证范围，以及整机执行前必须了解的安全和回滚边界。
type: project
status: active
source_count: 12
source_paths:
  - https://github.com/microsoft/WindowsDeveloperConfig
  - https://github.com/microsoft/WindowsDeveloperConfig/tree/06200f0819136c528e09533e3c8afac7e5f46ed7
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/README.md
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/windows-dev-config/README.md
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/docs/development.md
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/manifest.yml
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/Workloads/python/configuration.winget
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/Workloads/typescript/configuration.winget
  - https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/.github/workflows/ci.yml
  - https://github.com/microsoft/WindowsDeveloperConfig/actions/runs/36391406880
  - https://learn.microsoft.com/windows/package-manager/configuration/
  - https://learn.microsoft.com/windows/package-manager/configuration/check
tags:
  - Dev
  - Windows
  - PowerShell
  - WinGet
  - DSC
  - 开源工具
source: https://github.com/microsoft/WindowsDeveloperConfig
source_commit: 06200f0819136c528e09533e3c8afac7e5f46ed7
verified_at: 2026-09-29
---

# Windows Developer Config：把开发机初始化变成可重复、可验证的流程

[Windows Developer Config](https://github.com/microsoft/WindowsDeveloperConfig) 是 Microsoft 开源的一组 Windows 开发环境配置。它把安装工具、修改系统设置、配置 WSL 和验证语言工具链这些容易散落在个人清单里的操作，变成可以重复执行、检查结果并接受版本控制的流程。项目采用 [MIT License](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/LICENSE)。

这个仓库容易被名字误导。它并不是一个包罗所有需求的“万能配置文件”，而是给三类任务准备了三条不同的入口。

| 想完成的任务 | 对应入口 | 实现方式 |
|---|---|---|
| 初始化一台完整的 Windows 11 开发机 | Windows Dev Config | 带签名校验、提权、重启续跑和逐步验证的 PowerShell 脚本 |
| 整理 Windows 与 WSL 中的命令行体验 | WSL Comfort | Windows 侧安装脚本加 Linux 侧 Shell bootstrap |
| 只安装 Python、TypeScript、Rust 等单项工具链 | Workloads | `configuration.winget` 描述目标状态，`install.ps1` 负责调用和刷新当前会话 |

真正值得借鉴的地方不只是“一条命令装完”。这个项目把开发机也当成一种需要维护的工程对象：配置应该能读、能重跑、能判断是否已经满足要求，还要有测试证明工具链确实可用。

## 单语言 Workload 如何工作

先看范围最小的 Python Workload。它的 `configuration.winget` 没有按先后顺序写“下载、点击、安装”，而是声明机器最终需要具备两个资源：Python 3.14 和 uv。WinGet 读取这份 YAML，再由 Desired State Configuration，也就是 DSC，判断当前系统是否已经达到目标状态，并安装缺失的资源。[Python 配置源码](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/Workloads/python/configuration.winget)

TypeScript 的例子更能说明这种结构。配置先声明 Node.js LTS，随后用 `RunCommandOnSet` 执行全局的 TypeScript 安装；`dependsOn` 明确规定后一项依赖 Node。配置文件负责目标状态，旁边的 `install.ps1` 则处理当前 PowerShell 会话的 PATH 刷新和错误报告。[TypeScript 配置源码](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/Workloads/typescript/configuration.winget)

```text
configuration.winget
        ↓
WinGet 读取配置并调用 DSC 资源
        ↓
检查目标状态，补齐缺失的软件或设置
        ↓
install.ps1 刷新当前会话并报告结果
        ↓
CI 编译并运行 hello world，核对标准输出
```

这里的“幂等”是指重复运行时，系统会先检查当前状态，已经满足的资源不需要再安装。它减少了“脚本跑第二次就坏掉”的问题，但不等于每次都会得到字节级相同的环境。项目明确说明，部分软件使用 WinGet 当前发布的版本，两台机器在不同日期执行仍可能得到不同的小版本。

## 整机配置为什么没有强行写成一份 YAML

完整的 Windows Dev Config 需要处理管理员权限、PowerShell 版本、系统设置、Windows Terminal、WSL 可选功能以及重启后的自动续跑。这些过程包含明显的顺序和交互，仓库因此使用 PowerShell 原生流程，而不是把它们硬塞进一个声明式文件。[整机配置说明](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/windows-dev-config/README.md)

每个步骤都按同一套逻辑运行。

1. 先检查目标状态是否已经满足。
2. 不满足时执行修改。
3. 再做一次相同检查，确认修改确实生效。

如果启用 WSL 需要重启，脚本会保存进度，注册一次登录后的计划任务，警告 10 秒后重启。用户重新登录并再次同意 UAC 后，流程从保存的位置继续。机器级锁还会阻止两个配置进程同时修改系统。

生产入口使用仓库根目录中的 Authenticode 签名副本，贡献者修改的是 `src/` 下的无签名源码。bootstrap 会把所选分支、标签或提交解析为一个固定提交，再校验 Microsoft Corporation 签名、文件哈希和安装目录权限。这个设计缩小了下载过程中脚本被替换的空间，也让一次运行中的文件来自同一提交。[源码与签名副本的关系](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/docs/development.md#repo-layout-signed-vs-source)

不过，官方 README 给出的 `irm ... | iex` Web wrapper 本身仍然依赖 HTTPS 端点；项目文档也明确说明，这种写法不会先验证 wrapper 自己的签名。若要连入口脚本一起核验，应先下载到文件，检查 Authenticode 签名和签名者，再执行。[Web wrapper 的安全边界](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/windows-dev-config/README.md#security)

## 它验证了什么，又没有验证什么

仓库用 `src/manifest.yml` 同时描述界面元数据、安装入口和测试命令。CI 从这份清单生成矩阵，在 Windows runner 上实际执行配置，再编译或运行一个受控的 hello world，并把输出与仓库中的预期结果比较。[CI 工作流](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/.github/workflows/ci.yml)

截至 2026 年 9 月 29 日，自动矩阵覆盖 TypeScript、PHP、.NET、Go、Java、Rust、Python、PowerShell 和 WinAppCLI 共 9 个 Workload。针对所核验提交的最近一次夜间运行在 2026 年 9 月 28 日成功。[CI 运行记录](https://github.com/microsoft/WindowsDeveloperConfig/actions/runs/36391406880)

SQL、WinForms、WinUI 3、WSL Comfort 和完整的 Windows Dev Config 被标为人工测试，原因包括需要图形会话、下载体积较大或涉及重启。换句话说，“CI-tested”可以支持九项自动化工具链在 GitHub runner 上完成安装和 hello world 验证，不能直接证明完整整机脚本已经在每一种 Windows 设备、组织策略和既有配置上自动回归通过。

## Standard 和 Full 会改动哪些东西

整机入口面向 Windows 11，并提供 Standard 和 Full 两档；内部动作名分别是 `Partial` 和 `Full`。两者都会安装一组固定的开发工具，包括 Git、GitHub CLI、VS Code、.NET、Python、uv、Node.js、nvm-windows、PowerShell 7、Windows Terminal 和 PowerToys，也会设置 WSL 与 Ubuntu。

Standard 主要避开一部分更强的系统偏好修改。Full 还会启用 Developer Mode、Windows Sudo 和远程桌面允许标志，关闭 Widgets，写入 Edge policy，并改变更多开始菜单、搜索、通知与系统托盘设置。远程桌面的允许标志会改变系统安全姿态；详细文档说明脚本并不会同时打开对应防火墙规则。[执行前的修改说明](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/windows-dev-config/README.md#before-you-run-this)

它还会重写 Windows Terminal 的 `settings.json`。脚本会先保存 `.bak`，但 JSON 中的注释无法保留。仓库也同时安装 Node.js LTS 与 nvm-windows；如果后续准备用 nvm 管理 Node，应先处理两个安装来源对 PATH 的竞争。项目没有 `-WhatIf` 干运行模式，Standard 和 Full 也没有运行时的逐包选择开关。

因此，Standard 不是“只装几个安全工具”的轻量模式。它仍然是一套有明确偏好的整机方案，只是少改了一部分系统设置。

## 幂等不等于无风险，也不等于可完全回滚

幂等只说明重复执行会检查状态，不说明第一次执行没有副作用。WinGet Configuration 可以调用具有管理员权限的 DSC 资源，而 DSC Script 资源能够运行任意 PowerShell 代码。Microsoft 的安全指南因此要求用户在应用前检查每个包、模块和资源，并优先在隔离环境中测试。[WinGet Configuration 安全检查](https://learn.microsoft.com/windows/package-manager/configuration/check)

这个仓库还存在一条尤其重要的回滚边界：整机配置的 `Uninstall` 是破坏性清理，不是恢复到安装前快照。它会在不二次确认的情况下注销 Ubuntu 并永久删除其中的文件，还会移除目标工具，包括执行配置前已经存在的安装；原有系统设置不会被完整还原。除非已经备份 WSL 数据并理解清理清单，否则不应把 `Uninstall` 当成普通的撤销按钮。[卸载与人工清理说明](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/windows-dev-config/README.md#uninstall-and-manual-cleanup)

## 怎样选择最小的入口

| 当前需求 | 更合适的选择 | 原因 |
|---|---|---|
| 只缺一套语言环境 | 对应 Workload | 修改范围最小，配置文件可直接审查 |
| 已有 Windows 环境，只想改善 WSL Shell | WSL Comfort | 不必把整机偏好一并接管 |
| 新的个人 Windows 11 机器，希望快速建立统一环境 | 先评估 Standard | 避开一部分更强的系统策略，但仍需接受固定工具集与重启 |
| 明确需要 Developer Mode、Sudo、Edge policy 等完整偏好 | Full | 只有这些额外修改确实符合需求时才值得采用 |
| 受组织策略管理、保存重要 WSL 数据或已有复杂配置 | 自建或裁剪配置 | 需要先处理策略、冲突、备份和回滚，而不是直接运行远程一键脚本 |

如果只是试用一个 Workload，可以先固定仓库提交，再让 WinGet 展示、校验和测试目标状态。

```powershell
git clone https://github.com/microsoft/WindowsDeveloperConfig.git
cd WindowsDeveloperConfig
git checkout 06200f0819136c528e09533e3c8afac7e5f46ed7

winget configure show -f .\Workloads\python\configuration.winget
winget configure validate -f .\Workloads\python\configuration.winget
winget configure test -f .\Workloads\python\configuration.winget
```

`show` 和 `validate` 帮助检查结构，`test` 比较机器与目标状态；它们不能代替对 DSC 资源和脚本内容的安全审查。真正应用前，单项 Workload 适合先放进 Windows Sandbox 或干净虚拟机；完整整机配置涉及重启，应使用能够保存重启状态的测试虚拟机。

正式执行前还应备份 Windows Terminal 设置，并用 `wsl --export` 备份重要发行版。若准备运行整机流程，先逐项阅读 Full 或 Standard 的修改清单，而不是只看“一条命令”和预计耗时。

## 这个项目真正提供了什么

Windows Developer Config 没有替代 WinGet、PowerShell 或 DSC。它把这些底层能力组合成一组有观点的公开方案，并增加签名分发、重启续跑、状态验证、故障日志和端到端工具链测试。没有它，用户仍可手工安装软件，或为自己的团队编写 `.winget` 配置；代价是需要自行维护包清单、依赖、系统设置、测试和升级路径。

它最适合用作两种东西：一套可以直接采用的 Windows 11 开发机起点，或者一份研究“配置即代码”应该怎样做检查、签名、验证与 CI 的公开范例。它不适合被当作任何 Windows 机器都能无条件执行的标准答案。

## 参考资料与证据边界

- [Windows Developer Config 仓库](https://github.com/microsoft/WindowsDeveloperConfig)
- [本页核验的仓库快照](https://github.com/microsoft/WindowsDeveloperConfig/tree/06200f0819136c528e09533e3c8afac7e5f46ed7)
- [Windows Dev Config 详细说明](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/windows-dev-config/README.md)
- [开发指南与 CI 设计](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/docs/development.md)
- [流程清单 `manifest.yml`](https://github.com/microsoft/WindowsDeveloperConfig/blob/06200f0819136c528e09533e3c8afac7e5f46ed7/src/manifest.yml)
- [WinGet Configuration 官方说明](https://learn.microsoft.com/windows/package-manager/configuration/)
- [WinGet Configuration 安全检查](https://learn.microsoft.com/windows/package-manager/configuration/check)

本文依据 Microsoft 官方仓库提交 `06200f0819136c528e09533e3c8afac7e5f46ed7`、该提交的 CI 记录与 Microsoft Learn 文档整理，核验日期为 2026 年 9 月 29 日。本文没有在 Windows 11 实机上执行整机配置、重启续跑或卸载，也没有独立复测每一种硬件、组织策略和既有软件组合。关于脚本行为的说明来自源码与官方文档；自动测试结论只覆盖上述 CI 矩阵。
