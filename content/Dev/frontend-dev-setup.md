# 现代化前端项目配置指南

本文档介绍如何从零配置前端开发环境，包括 Node.js 版本管理、npm 使用，以及常见前端测试方法。

## Node.js 版本管理 - nvm

### 什么是 nvm

nvm（Node Version Manager）用于在同一系统中管理多个 Node.js 版本，解决不同项目需要不同 Node 版本的问题。

### 安装 nvm

#### macOS / Linux

```bash
# 使用 curl 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 或使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

安装完成后，重新加载 shell 配置：
```bash
source ~/.bashrc  # Bash
source ~/.zshrc    # Zsh
```

#### Windows

Windows 推荐使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)：

1. 下载最新安装包：[nvm-setup.exe](https://github.com/coreybutler/nvm-windows/releases)
2. 运行安装程序
3. 打开新的终端验证

### nvm 常用命令

```bash
# 查看已安装的 Node 版本
nvm ls

# 查看可安装的 Node 版本
nvm ls-remote

# 安装特定版本
nvm install 22

# 安装 LTS 版本
nvm install --lts

# 使用特定版本
nvm use 22

# 设置默认版本
nvm alias default 22

# 卸载版本
nvm uninstall 20
```

### Node.js 版本选择建议

| 用途 | 推荐版本 |
|------|----------|
| 新项目 | Node 22 (最新偶数版本) |
| 生产项目 | Node 20 LTS |
| 旧项目维护 | 根据项目要求 |

## npm 使用指南

### npm 基础

npm（Node Package Manager）是 Node.js 的默认包管理器。

```bash
# 查看 npm 版本
npm --version

# 查看 Node 版本
node --version

# 升级 npm
npm install -g npm@latest
```

### 初始化项目

```bash
# 在当前目录创建 package.json
npm init

# 快速创建（使用默认配置）
npm init -y

# 创建 scoped 包
npm init --scope=@myorg
```

### 安装依赖

```bash
# 安装项目依赖
npm install

# 安装特定包
npm install <package-name>

# 安装开发依赖
npm install --save-dev <package-name>

# 安装全局包
npm install -g <package-name>

# 安装特定版本
npm install <package-name>@1.2.3

# 使用别名安装
npm install <package-name>@latest
```

### package.json 字段说明

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "项目描述",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### scripts 约定

| 脚本名 | 约定用途 |
|--------|----------|
| `start` / `dev` | 开发服务器 |
| `build` | 生产构建 |
| `test` | 运行测试 |
| `lint` | 代码检查 |
| `format` | 代码格式化 |
| `prepare` | git hook 安装 |

### 管理依赖版本

```bash
# 更新依赖到最新兼容版本
npm update

# 查看过时依赖
npm outdated

# 详细查看依赖树
npm ls

# 清理缓存
npm cache clean --force
```

### package-lock.json

- 自动生成，记录精确版本
- **必须提交到仓库**
- 确保团队成员安装相同版本

## 现代化前端项目结构

### 推荐的目录结构

```
my-project/
├── .git/
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.ts          # Vite 配置
├── tsconfig.json          # TypeScript 配置
├── .eslintrc.cjs          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   ├── pages/            # 页面
│   ├── hooks/            # 自定义 Hooks
│   ├── utils/            # 工具函数
│   ├── services/         # API 服务
│   ├── stores/           # 状态管理
│   ├── types/            # TypeScript 类型
│   ├── App.tsx
│   └── main.tsx
├── public/               # 公共静态资源
├── tests/                # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── README.md
```

### 常用构建工具

| 工具 | 特点 |
|------|------|
| Vite | 快、现代、适合 React/Vue |
| Webpack | 功能全面、配置灵活 |
| esbuild | 极速打包 |
| Rollup | 库打包 |

### 常用框架

| 框架 | 适用场景 |
|------|----------|
| React | 灵活组件化 |
| Vue | 上手简单、中文友好 |
| Svelte | 编译时优化、轻量 |
| Solid | 响应式、轻量 |

## 前端测试体系

### 测试金字塔

```
        /\
       /  \
      / E2E \        <- 少量、慢、贵
     /--------\
    / 集成测试  \     <- 中等
   /------------\
  /   单元测试    \   <- 大量、快速、便宜
 /----------------\
```

### 单元测试

测试独立的函数、组件、模块。

#### 常用框架

| 框架 | 特点 |
|------|------|
| Vitest | 快、兼容 Jest API、支持 Vite |
| Jest | 生态完善、社区广泛 |
| Mocha + Chai | 灵活、传统 |
| Testing Library | 以用户视角测试 |

#### Vitest 示例

安装：
```bash
npm install -D vitest @testing-library/react jsdom
```

配置 `vite.config.ts`：
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  }
})
```

编写测试 `src/utils/format.test.ts`：
```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '../utils/format'

describe('formatDate', () => {
  it('格式化为 YYYY-MM-DD', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('2024-01-15')
  })

  it('处理个位数月份和日期', () => {
    const date = new Date('2024-03-05')
    expect(formatDate(date)).toBe('2024-03-05')
  })
})
```

组件测试 `src/components/Button.test.tsx`：
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('渲染文本内容', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByText('点击我')).toBeDefined()
  })

  it('点击时调用回调', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>点击</Button>)
    fireEvent.click(screen.getByText('点击'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

运行测试：
```bash
npm test           # 监视模式
npm test -- --run  # 单次运行
npm test -- --coverage  # 覆盖率
```

### 冒烟测试

快速验证核心功能是否正常，通常在 CI/CD 流程的早期执行。

#### 特点
- 测试数量少
- 执行速度快（秒级）
- 验证核心路径

#### 示例

```typescript
// tests/smoke/homepage.test.ts
import { describe, it, expect } from 'vitest'

describe('Homepage 冒烟测试', () => {
  it('页面能正常加载', async () => {
    const response = await fetch('/')
    expect(response.ok).toBe(true)
  })

  it('主要 API 返回数据', async () => {
    const response = await fetch('/api/users')
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('关键组件能渲染', () => {
    // 使用 Playwright 或 Puppeteer
  })
})
```

#### 在 CI 中配置

```yaml
# .github/workflows/smoke.yml
name: Smoke Tests
on: [push, pull_request]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:smoke
```

### 集成测试

测试多个模块协同工作的场景。

```typescript
// tests/integration/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/api/user', () => {
    return HttpResponse.json({ id: 1, name: 'Test User' })
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('用户认证流程', () => {
  it('登录后获取用户信息', async () => {
    await login('test@example.com', 'password')
    const user = await getCurrentUser()
    expect(user.name).toBe('Test User')
  })
})
```

### E2E 测试（端到端测试）

模拟真实用户操作，测试整个应用流程。

#### 常用工具

| 工具 | 特点 |
|------|------|
| Playwright | 微软出品、支持多浏览器、功能强 |
| Cypress | API 友好、调试方便 |
| Puppeteer | Google 出品、只支持 Chrome |
| Nightwatch | 配置简单 |

#### Playwright 示例

安装：
```bash
npm install -D @playwright/test
npx playwright install chromium
```

配置 `playwright.config.ts`：
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

编写测试 `tests/e2e/login.spec.ts`：
```typescript
import { test, expect } from '@playwright/test'

test.describe('登录功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('使用正确凭据登录成功', async ({ page }) => {
    await page.getByLabel('邮箱').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByRole('button', { name: '登录' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('欢迎回来')).toBeVisible()
  })

  test('使用错误凭据显示错误', async ({ page }) => {
    await page.getByLabel('邮箱').fill('wrong@example.com')
    await page.getByLabel('密码').fill('wrongpass')
    await page.getByRole('button', { name: '登录' }).click()

    await expect(page.getByText('邮箱或密码错误')).toBeVisible()
  })

  test('登出功能正常', async ({ page }) => {
    // 先登录
    await page.getByLabel('邮箱').fill('test@example.com')
    await page.getByLabel('密码').fill('password123')
    await page.getByRole('button', { name: '登录' }).click()

    // 登出
    await page.getByRole('button', { name: '登出' }).click()
    await expect(page).toHaveURL('/login')
  })
})
```

运行 E2E 测试：
```bash
npx playwright test                    # 运行所有测试
npx playwright test --project=chromium  # 指定项目
npx playwright test login.spec.ts      # 运行特定文件
npx playwright show-report            # 查看报告
```

## 测试命令速查

```bash
# Vitest (单元测试)
npm test              # 监视模式
npm run test:unit     # 单元测试
npm run test:smoke    # 冒烟测试
npm run test:coverage # 覆盖率报告

# Playwright (E2E)
npx playwright test              # 运行 E2E
npx playwright test --ui         # UI 模式
npx playwright show-report       # 查看报告
```

## CI/CD 集成

### GitHub Actions 示例

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run E2E tests
        run: npx playwright test
```

## 最佳实践

1. **测试文件位置**
   - 单元测试：与源码同目录，如 `utils.test.ts`
   - E2E 测试：单独目录 `tests/e2e/`

2. **测试命名**
   - 使用描述性名称：`it('当输入为空时显示错误提示')`
   - 测试文件以 `.test.ts` 或 `.spec.ts` 结尾

3. **测试原则**
   - 每个测试只验证一个行为
   - 测试之间相互独立
   - 避免测试实现细节
   - 优先测试关键路径

4. **Mock 和 Stub**
   ```typescript
   import { vi } from 'vitest'

   // Mock 函数
   const fetchUser = vi.fn().mockResolvedValue({ id: 1, name: 'Test' })

   // Mock 模块
   vi.mock('./api', () => ({
     getUser: vi.fn()
   }))
   ```

## 参考资源

- [Vitest 文档](https://vitest.dev/)
- [Playwright 文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [nvm 文档](https://github.com/nvm-sh/nvm)
