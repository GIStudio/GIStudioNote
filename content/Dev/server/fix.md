---
title: Ubuntu Copy Fail：修复内核与重启判断
description: 依据 Ubuntu 官方公告区分 Copy Fail 漏洞的临时缓解、内核修复和共享服务器重启条件。
tags:
  - Dev
  - Ubuntu
  - Linux
  - 安全
  - 运维
verified_at: 2026-10-28
---

Ubuntu 曾针对 Linux 内核漏洞 CVE-2026-31431（Copy Fail）发布临时缓解措施：通过更新 `kmod` 禁用 `algif_aead` 模块。官方现已发布包含修复的内核包，并说明临时禁用措施将撤回；应按所用 Ubuntu 版本和内核类型核对公告，安装适用的修复内核并重启进入新内核。[Ubuntu 官方说明](https://ubuntu.com/blog/copy-fail-vulnerability-fixes-available)

此页是公告解读，核验日期为 2026 年 10 月 28 日；它不能代替对具体服务器的评估。共享服务器的升级和重启应由管理员根据维护窗口、运行任务及业务影响安排。

## 临时缓解与内核修复

[USN-8226-1](https://ubuntu.com/security/notices/USN-8226-1) 记录了修复内核包发布前的临时措施：`kmod` 更新用于阻止加载相关模块。它针对的是缓解漏洞，并不等同于安装修复后的内核。官方指出，禁用模块可能影响依赖它的应用或硬件加速密码功能。

现在应以 [Ubuntu 的 CVE 状态页](https://ubuntu.com/security/CVE-2026-31431)和相应版本的安全公告为准，核对 Ubuntu 发行版、内核包及其修复版本。其他发行版、定制内核或已停止维护的版本，需要参照相应供应商的公告。

## 先收集状态

以下命令只读取系统状态；执行前仍应确认自己有权查看该服务器：

```bash
cat /etc/os-release
uname -r
dpkg-query -W -f='${binary:Package}\t${Version}\n' kmod 'linux-image-*'
grep -E '^algif_aead ' /proc/modules
```

`uname -r` 表示正在运行的内核，而软件包列表反映已安装的包；安装新内核后，通常要重启才会运行它。`grep` 未匹配时退出码为 1，读取失败则应单独排查；模块是否已加载本身不能证明内核已修复。Ubuntu 可能回移安全修复，不能只凭上游版本号判断安全状态。

如需临时缓解，先核查官方公告和业务依赖，由有权限的管理员确定方案并检查每一步是否成功。不要把模块卸载失败当成成功，也不要在共享机器上未经协调执行全量升级或重启。

## 参考资料

- [Ubuntu：Copy Fail 漏洞及修复说明](https://ubuntu.com/blog/copy-fail-vulnerability-fixes-available)
- [Ubuntu 安全公告 USN-8226-1：kmod 临时缓解](https://ubuntu.com/security/notices/USN-8226-1)
- [Ubuntu：CVE-2026-31431 按版本修复状态](https://ubuntu.com/security/CVE-2026-31431)
