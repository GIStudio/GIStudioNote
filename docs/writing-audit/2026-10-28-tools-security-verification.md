# 开发教程与工具页面安全核验

核验日期：2026-10-28。检查基于公开官方材料；没有连接用户服务器、执行系统升级或读取私人项目。页面由主代理统一构建及发布。

## SSH 隧道与 Python 后端

| 页面 | 修订与依据 | 本次验证及边界 |
| --- | --- | --- |
| `content/Dev/SSH_Tunnel_Technical_Guide.md` | 使用 OpenSSH 的严格主机密钥校验、本地监听和启动失败检测；说明监听已建立不保证远端服务可用。Paramiko 示例只验证连接，不再演示不完整的转发逻辑。[OpenSSH](https://man.openbsd.org/ssh)、[ssh_config](https://man.openbsd.org/ssh_config)、[Paramiko](https://docs.paramiko.org/en/stable/api/client.html) | 所有示例 shell 和 Python 语法检查通过；`ssh -G -F /dev/null` 检查配置；隔离的 SSH 替身以状态 9 退出时，Python 示例同样返回 9。未连接真实 SSH 服务，未覆盖实际远端转发。 |
| `content/Dev/python-backend-dev.md` | 用户示例改为 FastAPI、SQLAlchemy、Pydantic 和 Argon2 密码哈希，区分数据库字段与响应字段，处理重复账户；JWT 只指向官方教程，不提供虚假的登录功能。[FastAPI 安全教程](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)、[SQLAlchemy Session](https://docs.sqlalchemy.org/en/20/orm/session_basics.html)、[Pydantic EmailStr](https://docs.pydantic.dev/latest/api/networks/#pydantic.networks.EmailStr) | 临时隔离环境运行测试，覆盖创建 201、查询 200/404、重复 409、响应不含密码或哈希、持久化哈希及校验；15 个 Python 代码块经 AST 解析，shell 代码块语法检查通过。测试版本 FastAPI 0.162.0、SQLAlchemy 2.1.6、Pydantic 2.14.1、pwdlib 0.3.1。未测试生产数据库、真实认证或部署；测试时出现 Starlette 对未来 httpx 弃用的警告。 |

两页的公开内容扫描无错误；命中的示例地址为回环地址和示例邮箱，不含真实凭据。SSH 的本地静态配置验证和替身测试不代表真实端到端连接成功。

## Ubuntu、NVM、Solara 与 WebGIS

| 页面 | 核验与修订 |
| --- | --- |
| `content/Dev/server/fix.md` | [Ubuntu Copy Fail 官方说明](https://ubuntu.com/blog/copy-fail-vulnerability-fixes-available)确认修复内核已发布、临时 kmod 缓解将撤回；改为先核对发行版、运行内核和已安装包，并由管理员安排修复与重启。没有执行升级、模块卸载或重启。 |
| `content/tools/NVM.md` | 去掉卸载系统 Node.js 的笼统建议，改为核查命令路径与 shell 配置；[GHSA-8grh-q73j-ffrc](https://github.com/nvm-sh/nvm/security/advisories/GHSA-8grh-q73j-ffrc) 的修复版本为 0.40.8，[GHSA-3c52-35h2-gfmm](https://github.com/nvm-sh/nvm/security/advisories/GHSA-3c52-35h2-gfmm) 的修复版本为 0.40.5。版本和影响以各公告为准。 |
| `content/tools/Solara.md` | 根据 [Solara 教程](https://solara.dev/documentation/getting_started/tutorials/web-app)、[Dash 回调](https://dash.plotly.com/basic-callbacks)、[Dash 的 Jupyter 支持](https://dash.plotly.com/dash-in-jupyter) 和 [Streamlit fragment](https://docs.streamlit.io/develop/api-reference/execution-flow/st.fragment) 更正比较、组件入口和状态隔离表述。示例未安装 Solara 或在浏览器端运行，行为依据官方文档，不能视作端到端测试。 |
| `content/tools/GeoLibre vs SpatialHarness.md` | 仅依据 [GeoLibre](https://github.com/opengeos/GeoLibre) 与 [SpatialHarness](https://github.com/GIStudio/SpatialHarness) 的公开仓库介绍项目；删除内部路线和未经实测的竞争、性能判断，说明在线资源的网络依赖。未实测两项目。 |

四页公共内容扫描为 0 错误、1 警告；警告指向 NVM 通用 shell 配置路径，人工核对后为通用示例。Solara 的 Python 示例经 AST 语法解析，`git diff --check` 通过。网站构建及线上检查由主代理执行。
