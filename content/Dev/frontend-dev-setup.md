---
title: 前端项目配置与测试：从可运行示例到 CI
description: 用完整的 Vite 示例串起版本锁定、单元测试、HTTP 冒烟、服务清理、构建和 CI，区分浏览器与业务验证范围。
tags:
  - Dev
  - 前端开发
  - Node.js
  - NVM
  - 教程
verified_at: 2026-10-28
---
# 前端项目配置与测试：从可运行示例到 CI

一个可维护的前端项目需要把运行时、依赖、启动命令和测试接在一起。本页先提供一个完整的 Vite 小项目，再说明单元、集成和端到端测试各自验证什么。

示例源码位于 [GIStudioNote 的 examples/frontend-testing](https://github.com/GIStudio/GIStudioNote/tree/v5/examples/frontend-testing)。它使用静态 HTML 和一个 JavaScript 函数，便于核对测试链路；React、Vue 等应用可在此基础上增加组件和业务测试。

## 固定运行环境与依赖

本例核验使用 Node 22.16.0、npm 10.9.2、Vite 8.3.5 和 Vitest 5.0.5。所选工具要求 Node 至少达到各自的 `engines` 条件；本例限定 Node 22.12 及以上的 22.x。本地与 CI 使用相同版本，并保留 `package-lock.json`。[Vite 入门](https://vite.dev/guide/) · [Vitest 入门](https://vitest.dev/guide/)

在已经取得仓库代码的机器上：

```bash
cd examples/frontend-testing
npm ci
npm test
npm run build
```

首次为自己的项目新增依赖时用 `npm install --save-dev --save-exact 包名@版本`，审查生成的锁文件；已有锁文件的安装和 CI 使用 `npm ci`。安装可能执行依赖提供的脚本，应审查来源，并在可信或隔离的开发环境中操作。不要把全局升级 npm 当成项目初始化的必要步骤。[npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)

Node 版本管理见 [[../tools/NVM|NVM 教程]]。版本升级另开明确变更，核对工具兼容和安全公告后重跑测试。

## 项目结构与脚本

```text
examples/frontend-testing/
├── package.json
├── package-lock.json
├── index.html
├── src/sum.js
└── tests/
    ├── unit/sum.test.js
    └── smoke.test.js
```

`package.json` 中的脚本都对应实际文件或已声明依赖：

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "test:unit": "vitest run tests/unit",
    "test:smoke": "node --test tests/smoke.test.js",
    "test": "npm run test:unit && npm run test:smoke"
  }
}
```

`npm run dev` 只绑定本机回环地址；需要局域网访问时再评估鉴权、防火墙和绑定范围。开发服务器不应直接作为公网生产服务。

`src/` 按实际职责继续拆分即可；测试目录、框架和状态管理不必在项目一开始全部搭齐。源码、配置和锁文件纳入版本控制，`node_modules/` 与构建输出不提交。

## 单元测试验证函数行为

示例函数：

```javascript
// src/sum.js
export function sum(a, b) {
  return a + b
}
```

对应测试：

```javascript
// tests/unit/sum.test.js
import { expect, test } from "vitest"
import { sum } from "../../src/sum.js"

test("adds two numbers", () => {
  expect(sum(2, 3)).toBe(5)
})
```

使用 `npm run test:unit` 单次执行。真实项目还需按业务测试边界输入、错误处理和必要的组合；这一例只验证所写的加法行为。[Vitest 测试接口](https://vitest.dev/api/)

## HTTP 冒烟测试管理自己的服务

Node 中的 `fetch` 需要明确的 URL。测试必须先启动目标服务，使用实际监听地址，并在成功或失败后清理服务。示例采用 Vite 的 JavaScript API：

```javascript
// tests/smoke.test.js
import assert from "node:assert/strict"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"

test("serves the example homepage", async () => {
  const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { host: "127.0.0.1", port: 0, strictPort: true },
  })
  try {
    await server.listen()
    const address = server.httpServer.address()
    assert.ok(address && typeof address === "object")
    const response = await fetch(`http://127.0.0.1:${address.port}/`, {
      signal: AbortSignal.timeout(5000),
    })
    assert.equal(response.status, 200)
    assert.match(await response.text(), /<h1>GIStudio 测试示例<\/h1>/)
  } finally {
    await server.close()
  }
})
```

端口 0 让操作系统分配空闲端口。它检查首页 HTTP 响应和独有内容，验证范围止于服务器返回的 HTML；浏览器渲染、登录和后端 API 需要各自的实现与测试。接口测试应使用测试账号与隔离数据。[Vite JavaScript API](https://vite.dev/guide/api-javascript) · [Node 测试运行器](https://nodejs.org/api/test.html)

## 集成测试与端到端测试怎样扩展

| 测试层次 | 适合验证 | 环境要求 |
| --- | --- | --- |
| 单元 | 独立函数、模块或组件行为 | 提供明确输入，隔离不相关依赖 |
| 集成 | 组件、接口客户端与服务之间的交互 | 提供实现、依赖和受控服务；模拟结果与真实服务结果分别标注 |
| 端到端 | 用户操作到可观察结果的流程 | 启动真实测试应用，准备测试数据与浏览器，执行清理 |

React 应用可使用 Testing Library 检查组件可观察行为，并提供匹配的 DOM 环境；测试引用的组件、初始化文件和辅助函数必须存在。[Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

浏览器流程可使用 Playwright。其 `webServer` 配置能在测试前启动应用，`baseURL` 用于解析测试中的相对路径；端口、命令和预期页面应与应用一致。需要多个服务时分别声明前端、后端及准备数据的方式。[Playwright 服务启动](https://playwright.dev/docs/test-webserver)

## 把本地检查接入 CI

下面的工作流针对本仓库的 `examples/frontend-testing` 子目录，安装依赖、运行上述两类测试，再构建。若将示例迁入其他仓库，应同时调整 `working-directory` 和 `cache-dependency-path`；项目位于仓库根目录时，分别使用 `.` 和 `package-lock.json`。

```yaml
name: Frontend example
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: examples/frontend-testing
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22.16.0"
          cache: npm
          cache-dependency-path: examples/frontend-testing/package-lock.json
      - run: npm ci
      - run: npm test
      - run: npm run build
```

为业务项目加入 linter、覆盖率或浏览器测试时，同时安装所需依赖、声明脚本和准备环境，再让 CI 调用。

## 核验范围

2026 年 10 月 28 日，在上述版本下执行 `npm ci`、`npm test` 和 `npm run build`：1 项单元测试、1 项 HTTP 冒烟测试及构建通过。测试服务绑定本机回环地址，并在测试结束后关闭。浏览器渲染、组件、业务功能和生产部署仍需按真实应用另行验证；上面的 CI 配置是可复制示例，本次验证在本地完成。
