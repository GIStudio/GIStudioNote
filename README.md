# [GIStudio Notes](https://notes.gistudio.xyz/)

开源，共建的GIS/图/强化学习/深度学习知识库
> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

## 参与文档贡献:

## Thanks to Quartz

> Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.
> Quartz v4 features a from-the-ground rewrite focusing on end-user extensibility and ease-of-use.
> 🔗 Read the documentation and get started: <https://quartz.jzhao.xyz/>

---

以下是一个简明的 Markdown 格式指南，帮助你使用 Quartz 进行笔记管理和同步：

## 初始化

1. 克隆仓库到本地：

```bash

git clone git@github.com:GIStudio/GIStudioNote.git

```

1. 安装依赖：

```bash

npm i

```

1. 创建 Quartz 项目（直接使用默认配置）：

```bash

npx quartz create

```

## 编写笔记

1. 进入 `content` 文件夹：

```bash

cd content

```

1. 使用 Markdown 编写笔记：

- 创建一个新的 Markdown 文件，例如 `my-note.md`。

- 使用 Markdown 语法编写内容。

示例：

```markdown

# 我的笔记标题

  

这是一个示例笔记。

  

- 列表项 1

- 列表项 2

  

**加粗文本** 和 *斜体文本*。

```

## 本地运行

```bash
npx quartz build --serve
```
  
## 同步到 GitHub

```bash

# 同步到 GitHub，但不拉取更新，同时部署到 GitHub Pages

npx quartz sync --no-pull

```

## 更新 quartz

```bash
npx quartz update
```

## 写作
如果需要引用，用绝对路径从 content 根目录写起。
## 配置 Quartz

1. 访问 Quartz 配置指南：
   - [Quartz 配置指南](https://quartz.jzhao.xyz/setting-up-your-GitHub-repository)
2. 按照指南配置你的 GitHub 仓库，以便自动同步和部署。

## 其他资源

- [Markdown 语法指南](https://www.markdownguide.org/)

- [Quartz 官方文档](https://quartz.jzhao.xyz/)

希望这个指南对你有帮助！
