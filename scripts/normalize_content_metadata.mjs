#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import yaml from "js-yaml"

const write = process.argv.includes("--write")
const contentRoot = path.resolve("content")

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "private") return []
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })

const markdownFiles = walk(contentRoot)
  .filter((file) => file.endsWith(".md"))
  .sort()

const missingMetadata = {
  "AI/anyrecon-wechat.md": {
    title: "AnyRecon：任意视角三维重建",
    tags: ["AI", "三维重建", "视频扩散模型", "计算机视觉", "项目笔记"],
  },
  "Data/spatial_units_report.md": {
    title: "四种空间单元划分策略对比",
    tags: ["GIS", "空间单元", "MAUP", "城市分析", "研究报告"],
  },
  "Dev/frontend-dev-setup.md": {
    title: "现代化前端项目配置指南",
    tags: ["Dev", "前端开发", "Node.js", "NVM", "教程"],
  },
  "Dev/git-github-setup.md": {
    title: "Git 与 GitHub 配置指南",
    tags: ["Dev", "Git", "GitHub", "版本控制", "教程"],
  },
  "Dev/python-backend-dev.md": {
    title: "Python 后端开发指南",
    tags: ["Dev", "Python", "后端开发", "API", "教程"],
  },
  "Dev/server/fix.md": {
    title: "Ubuntu kmod 漏洞缓解与重启判断",
    tags: ["Dev", "Ubuntu", "Linux", "安全", "运维"],
  },
  "Dev/skills/context.md": {
    title: "个人品牌管理 Skill 设计",
    tags: ["Dev", "Skill", "个人品牌", "提示词", "设计文档"],
  },
  "Dev/uv-setup.md": {
    title: "uv 配置指南",
    tags: ["Dev", "Python", "uv", "环境管理", "教程"],
  },
}

const tagAliases = new Map([
  ["AI/RL", "RL"],
  ["DL", "深度学习"],
  ["deep-learning", "深度学习"],
  ["DRL", "深度强化学习"],
  ["deep-reinforcement-learning", "深度强化学习"],
  ["ML", "机器学习"],
  ["Prompts", "提示词工程"],
  ["Prompt", "提示词工程"],
  ["Prompt Engineering", "提示词工程"],
  ["Prompt工程", "提示词工程"],
  ["tutorial", "教程"],
  ["template", "模板"],
  ["index", "索引"],
])

const descriptionOverrides = {
  "AI/ABM.md": "记录基于大语言模型的智能体社会模拟项目及其复杂度判断。",
  "AI/AnyRecon.md": "分析 AnyRecon 如何利用视频扩散先验支持任意视角的大场景三维重建。",
  "AI/LLM/index.md": "汇集大语言模型相关笔记，并记录研究团队投入模型开发时的边界判断。",
  "Data/spatial_units_report.md":
    "比较规则网格、H3、地块街区和对象优先缓冲区的空间语义、MAUP 与数据挂接成本。",
  "RL/Reinforcement Learning.md": "强化学习的核心概念、算法谱系、数学基础与学习资源总纲。",
  "Writing/Guide.md": "记录学术写作中定义概念、比较结果和组织论证的可复用表达套路。",
  "index.md": "GIStudio Notes 首页与主要知识专题导航。",
}

const generatedDescription = (relative, title) => {
  if (descriptionOverrides[relative]) return descriptionOverrides[relative]
  if (relative.startsWith("Writing/experts/sdg/")) {
    return `介绍${title}的核心议题、目标内涵与可持续发展相关资料。`
  }
  if (relative.startsWith("Dev/")) return `${title}的环境配置、操作步骤与常见问题指南。`
  if (relative.startsWith("Writing/")) return `${title}的写作方法、实践建议与相关资源。`
  if (relative.startsWith("tools/")) return `${title}的使用说明、资源链接与实践记录。`
  if (relative.startsWith("Data/")) return `${title}的数据来源、分析方法与应用记录。`
  if (relative.startsWith("Anywriting/")) return `${title}的个人阅读、思考与自由写作记录。`
  if (/^(AI|DL|RL|Graph)\//.test(relative)) {
    return `${title}的核心概念、方法、项目与相关研究笔记。`
  }
  if (relative.startsWith("Reading/") || relative === "Reading Suggestions.md") {
    return `${title}的阅读笔记、基础概念与延伸资料。`
  }
  if (relative.startsWith("cloud/")) return `${title}的云开发环境使用与配置笔记。`
  return `${title}的 GIStudio 知识笔记与相关资源。`
}

const preferredOrder = [
  "title",
  "description",
  "tags",
  "aliases",
  "draft",
  "source",
  "source_commit",
  "verified_at",
  "order",
]

let changed = 0

for (const file of markdownFiles) {
  const relative = path.relative(contentRoot, file).replaceAll(path.sep, "/")
  const raw = fs.readFileSync(file, "utf8")
  const parsed = matter(raw)
  const data = { ...parsed.data, ...(missingMetadata[relative] ?? {}) }
  const title = String(data.title ?? data.name ?? path.basename(relative, ".md")).trim()

  data.title = title
  data.description = String(data.description ?? generatedDescription(relative, title)).trim()

  const rawTags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : []
  const normalizedTags = rawTags
    .map((tag) => tagAliases.get(String(tag).trim()) ?? String(tag).trim())
    .filter(Boolean)
  data.tags = [...new Set(normalizedTags)].slice(0, 8)
  if (data.tags.length < 2) data.tags.push("GIStudio")

  if (data.draft === false) delete data.draft
  if (
    data.aliases === undefined ||
    data.aliases === null ||
    (Array.isArray(data.aliases) && data.aliases.length === 0)
  ) {
    delete data.aliases
  }

  const ordered = {}
  for (const key of preferredOrder) {
    if (data[key] !== undefined) ordered[key] = data[key]
  }
  for (const [key, value] of Object.entries(data)) {
    if (!(key in ordered)) ordered[key] = value
  }

  const frontmatter = yaml.dump(ordered, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  })
  const output = `---\n${frontmatter}---\n${parsed.content.replace(/^\n+/, "\n")}`

  if (output !== raw) {
    changed += 1
    if (write) fs.writeFileSync(file, output)
  }
}

console.log(`${write ? "Updated" : "Would update"} ${changed} Markdown file(s).`)
