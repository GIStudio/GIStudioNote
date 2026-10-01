---
title: 第一次发布 DSH 插件，我踩了这五个坑
description: seminar-copilot-dsh-plugin 从 v0.3.0 到 v0.3.1 的发布实录：inject 漏声明、npm registry 时序、profile 副本不同步、激活验证时机和 npm 账号层，附一份发布检查清单。
tags:
  - DSH
  - 插件开发
  - npm
  - 发布经验
  - 踩坑记录
---

# 第一次发布 DSH 插件，我踩了这五个坑

刚把 [seminar-copilot-dsh-plugin](https://www.npmjs.com/package/seminar-copilot-dsh-plugin) 第一次发上 npm，版本号从 0.3.0 滚到 0.3.1 才算把坑填平。插件本身不复杂，真正花时间的是发布过程——五个坑，没有一个是写代码时想到的，全都藏在我自以为"已经懂了"的地方。按踩中的顺序记下来，给后面要发 [DSH](https://github.com/deepseek-ai/deepseek-harness) 插件的人对照。

## 坑一：服务要用，先声明 inject

插件装上去，客户端激活失败，报错是 `cannot get property "locale" without inject`，web boot 日志里只有一句"1 entry did not activate"。

原因很朴素：我的客户端模块工厂返回了 `{ apply }`，但漏了 `inject: ["locale", "slots", "sidebarRightTabs"]`。在 DSH 底层的 Cordis 框架里，访问任何服务都必须先声明注入，没有隐式可用这回事。规则记下来是三条：必需的服务写进 `inject` 数组、用 `ctx.<name>` 访问；可选的服务用 `ctx.get(name)`，不进 inject；唯一的例外是宿主侧的 `ctx.logger`，内置服务不用声明。

还有一个容易混的点：`ctx.slots.inject("slot.name", fn)` 是**槽位注入**，跟依赖声明的 `inject` 是两个概念，名字撞了，别当成一回事。v0.3.1 补上 inject 数组，这关就过去了。

## 坑二：npm registry 的时序会咬人

这个坑最阴。GUI 安装时报 "declares no dsh.bundle"，可我的 `package.json` 里明明写了 `dsh.bundle.patch`。

根因是一条链：我先发了一个 `0.0.0-stage` 占位包——不带 `dsh` 字段——`latest` 标签一度指向它；npmjs 和 npmmirror 之间同步有延迟，发布瞬间两个 registry 看到的状态不一致。真正要命的是 DSH 安装器的行为：`registryPlan` 只在网络错误、超时、404 时才 fallback 到下一个 registry；查到了包、但包"不是 bundle"时**直接拒绝，不换源重试**。也就是说，只要某个 registry 上还缓存着那个占位版本，安装就死给你看。

教训也是三条：不要先发无 `dsh` 字段的占位包，第一个版本就应是完整插件；发布后用 `pnpm view <pkg> --json` 在 npmjs 和 npmmirror **两个 registry** 都确认 `dsh.bundle` 可见，再去 GUI 安装；发布后等几分钟，让 `latest` 指针稳定下来。

## 坑三：改完代码，profile 里的副本没动

DSH 桌面应用（Electron 版）用 `~/.dsh/profiles/desktop/`，从 npm registry 安装；开发版 web GUI 用 `~/.dsh/profiles/web/`，可以走 `file:` 本地链接。听起来后者改源码就能生效——不行，pnpm 的 `file:` 依赖是**拷贝**不是 symlink，仓库源码改了，profile 里的副本纹丝不动，得手动 `cp` 同步。

诊断崩溃时还有一个线索：看日志里的应用来源。路径里出现 `app.asar` 说明崩的是桌面版，别只同步了错误的那个 profile 然后在原地打转。改完插件后，所有装过它的 profile 都要同步，并逐一重启验证。

## 坑四：刷新页面救不了客户端插件

客户端插件只在**应用启动（web boot）时激活**。改完代码刷新页面，什么都不会发生，必须完全重启应用。而且崩溃报告的 renderer console 里只有泛化错误（"1 entry did not activate"），真正的报错有时只出现在 GUI 的提示文案里——两个地方都得看。

这是本次最大的流程教训：v0.3.0 我只验证了包结构完整，没做端到端的激活测试就发了。之后的验收标准定为四步：`npm pack` 检查产物内容；双 registry `pnpm view` 确认 `dsh.bundle` / `dsh.client` 字段；**在干净 profile 中安装、重启应用、确认 web boot 激活成功、入口可见**；最后验证核心功能路径（宿主端点、客户端入口）可用。

## 坑五：npm 账号层没法全自动

`npm publish` 会触发浏览器交互认证，发布这一步无法完全脚本化。`npm unpublish` 需要 2FA OTP，且只在发布后 72 小时内可用。误发的占位版本删不掉也不用硬删——只要 `latest` 指向正确版本，它就伤害不到谁。

## 发布检查清单

把这次的教训固化成一张清单，下次发布照着打勾：

- [ ] `package.json` 含 `dsh.bundle.patch` 与 `dsh.client.platform`，版本号已递增
- [ ] 客户端模块工厂返回 `{ inject: [...], apply }`，inject 覆盖所有 `ctx.<service>` 使用
- [ ] 项目自带的检查脚本全绿
- [ ] `npm publish` 成功后，双 registry `pnpm view` 验证字段
- [ ] 干净 profile 安装 + 重启应用 + 确认激活与入口
- [ ] 所有已安装 profile 的本地副本同步更新

回头看，写这个插件的代码大概只占一半工作量，另一半是在和 registry 时序、profile 副本、加载时机这些"平台脾气"打交道。这些坑每一个单看都不难，难的是第一次遇到时根本不知道往哪个方向查。希望这份记录能把后来者的排查时间压缩到一杯咖啡以内。
