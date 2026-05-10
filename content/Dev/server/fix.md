不一定。**仅针对 Ubuntu 这篇公告里的 `kmod` 临时缓解来说，不是绝对必须重启**；但 **如果你升级的是 kernel 包，要让真正的 kernel 修复生效，通常必须重启进新内核**。

Ubuntu 这篇公告的关键句是：重启可以确保 mitigation 生效；如果不能重启，只要确认 `algif_aead` 模块没有加载，也可以不重启。公告还说，`kmod` 更新做的是禁用 `algif_aead` 模块，作为 kernel 修复发布前的 mitigation；真正的漏洞修复会通过 Linux kernel image packages 分发。([Ubuntu][1])

## 你应该按这两种情况区分

### 情况 A：你只是升级 `kmod`

这种情况下，**可以不重启**，但你必须做完下面三件事：

```bash
sudo apt update
sudo apt install --only-upgrade kmod

# 如果模块已经加载，尝试卸载
sudo rmmod algif_aead 2>/dev/null || true

# 验证模块是否仍在运行
grep -qE '^algif_aead ' /proc/modules \
  && echo "[RISK] algif_aead still loaded: reboot is needed or module is in use" \
  || echo "[OK] algif_aead is not loaded"
```

如果输出是：

```text
[OK] algif_aead is not loaded
```

那么对这次 **kmod mitigation** 来说，可以不重启。

如果输出是：

```text
[RISK] algif_aead still loaded
```

那就不能只靠升级，应该重启。Ubuntu 公告明确说，如果模块正在使用，卸载可能失败；这种情况下重启可以让应用 fallback 到非硬件加速的 crypto 路径。([Ubuntu][1])

你还可以检查 `kmod` mitigation 是否已经写入：

```bash
grep -R "algif_aead" /etc/modprobe.d/
```

正常应该能看到类似：

```text
install algif_aead /bin/false
```

或者直接测一下：

```bash
modprobe -n -v algif_aead
```

如果看到：

```text
install /bin/false
```

说明后续自动加载 `algif_aead` 会被拦住。

### 情况 B：你升级了 kernel

这种情况下，**仅仅升级但不重启，不等于已经运行修复后的内核**。`apt upgrade` 只是把新的 kernel image 安装到磁盘上，当前正在运行的 kernel 不会自动替换。

检查当前运行内核：

```bash
uname -r
```

检查已安装 kernel：

```bash
dpkg -l 'linux-image*' | grep ^ii
```

如果已安装的新 kernel 版本比 `uname -r` 显示的版本新，那说明你还没 boot 到新内核。要让 kernel-level fix 生效，需要：

```bash
sudo reboot
```

Ubuntu 的 USN 页面也写了：标准系统更新后，需要重启来完成必要更改；同时该 USN 说明 `kmod` 更新只是阻止加载 `algif_aead`，用于在 kernel updates 可用前缓解问题。([Ubuntu][2])

## 对你们组服务器的实际建议

如果是共享服务器、GPU 服务器、学生有 shell 账号、跑 Docker/Kubernetes/CI runner，我建议这样做：

```bash
sudo apt update
sudo apt upgrade -y

sudo rmmod algif_aead 2>/dev/null || true

grep -qE '^algif_aead ' /proc/modules \
  && echo "[REBOOT REQUIRED] algif_aead still loaded" \
  || echo "[TEMP OK] algif_aead not loaded"
```

然后看结果：

```text
[TEMP OK] algif_aead not loaded
```

表示 **短期可以不重启**，但最好安排维护窗口重启到修复后的 kernel。

```text
[REBOOT REQUIRED] algif_aead still loaded
```

表示 **不能只升级，应该重启**。

结论：**只升级 `kmod` + 确认 `algif_aead` 未加载，可以暂时不重启；只升级 kernel 但不重启，不算完成 kernel 修复。生产/共享服务器最稳妥还是升级后重启。**

[1]: https://ubuntu.com/blog/copy-fail-vulnerability-fixes-available "
      Fixes available for CVE-2026-31431 (Copy Fail) Linux Kernel Local Privilege Escalation Vulnerability
    \| Ubuntu"
[2]: https://ubuntu.com/security/notices/USN-8226-1?utm_source=chatgpt.com "USN-8226-1: kmod update | Ubuntu security notices"
