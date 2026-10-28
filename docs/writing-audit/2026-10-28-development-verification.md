# 开发教程集成核验

核验日期：2026-10-28。SSH、后端与其他工具的来源及测试见[安全核验记录](2026-10-28-tools-security-verification.md)。本页补充前端、uv、终端和提示词设计的检查。

## 前端完整示例

源码：`examples/frontend-testing/`。Node 22.16.0、npm 10.9.2、Vite 8.3.5、Vitest 5.0.5；保留独立锁文件。

- 实际执行 `npm ci`、`npm test`、`npm run build`，均通过；1 项单元测试、1 项 HTTP 冒烟测试。
- 冒烟测试自行启动 Vite，绑定 `127.0.0.1` 并使用系统分配的端口，检查 HTTP 200 和独有标题，最后关闭服务；没有依赖预先运行的开发服务器。
- 本次依赖安装报告 0 项已知漏洞，只是当时所用审计库的结果，不等于安全保证。
- CI YAML 是与子目录对应的可复制示例，未安装为本站的新工作流。浏览器渲染、真实登录、后端业务与生产部署未测试。

依据：[Vite JavaScript API](https://vite.dev/guide/api-javascript)、[Vitest](https://vitest.dev/guide/)、[Node test](https://nodejs.org/api/test.html)、[npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci)、[Playwright webServer](https://playwright.dev/docs/test-webserver)。

## uv

- 修正项目锁文件更新与 pip 接口的区别；项目使用 `uv lock --upgrade`、`uv sync --locked`，requirements 输出另用 `uv pip compile ... -o requirements.txt`。
- uv 0.10.2、CPython 3.13.12，在临时空项目中实际执行 `uv init --bare --no-workspace --no-readme --no-pin-python`、离线更新锁文件、锁定同步和 requirements 编译，均通过。这个无外部依赖的有限案例不证明所有真实项目升级均兼容。
- Git 示例按路径提交，说明 `--only` 使用指定文件的工作区完整内容，保护其他路径的既有暂存内容；同一文件混合修改仍需拆分。
- 平台包管理器可用性按发行版核对；不再提供无来源的统一包名安装保证。

依据：[uv 项目同步](https://docs.astral.sh/uv/concepts/projects/sync/)、[pip 编译接口](https://docs.astral.sh/uv/pip/compile/)、[安装](https://docs.astral.sh/uv/getting-started/installation/)、[Git commit](https://git-scm.com/docs/git-commit)。

## 终端与提示词权限

- 终端教程撤回未验证的通用提速比例和自定义 nvm 缓存代码，解释启动文件、`precmd`、计时范围与标题来源。5 个终端教程 shell 区块、20 个 uv shell 区块通过 `zsh -dfn` 语法检查；未执行用户初始化配置或修改其 shell。
- 个人品牌提示词明确为设计草案：仅处理获准材料与所选平台，默认返回草稿，文件保存、平台操作和自动化以当前授权及工具能力为准。删除预填的虚构成果数和一致性勾选，不宣称已有跨平台连接器。
- 交叉冷读发现并修复 CI 路径说明、Git 暂存范围、CV 文件写入与平台选择冲突。安全边界与正常步骤分开解释，删去仅回应原错误的突兀反驳。

依据：[zsh 启动文件](https://zsh.sourceforge.io/Doc/Release/Files.html)、[钩子](https://zsh.sourceforge.io/Doc/Release/Functions.html#Hook-Functions)、[zprof](https://zsh.sourceforge.io/Doc/Release/Zsh-Modules.html#The-zsh_002fzprof-Module)、[nvm 集成](https://github.com/nvm-sh/nvm#deeper-shell-integration)。
