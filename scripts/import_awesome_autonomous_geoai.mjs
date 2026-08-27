#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { execFileSync } from "node:child_process"

const sourceRoot = process.argv[2]
if (!sourceRoot) {
  console.error("Usage: node scripts/import_awesome_autonomous_geoai.mjs <upstream-repo>")
  process.exit(1)
}

const outputRoot = path.resolve("content/awesome-autonomous-geoai")
const read = (name) => fs.readFileSync(path.join(sourceRoot, name), "utf8")
const readme = read("README.md")
  .replace(/\r\n/g, "\n")
  .replace(/\?utm_source=chatgpt\.com/g, "")
const commit = process.env.UPSTREAM_COMMIT ?? "unknown"
const commitDate = process.env.UPSTREAM_COMMIT_DATE ?? "unknown"
const dateParts = Object.fromEntries(
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(new Date())
    .filter((part) => part.type !== "literal")
    .map((part) => [part.type, part.value]),
)
const importDate =
  process.env.IMPORT_DATE ?? `${dateParts.year}-${dateParts.month}-${dateParts.day}`

const h2Pattern = /^## ([^\n]+)$/gm
const sections = new Map()
const matches = [...readme.matchAll(h2Pattern)]

for (let index = 0; index < matches.length; index += 1) {
  const current = matches[index]
  const next = matches[index + 1]
  const title = current[1].trim()
  const body = readme.slice(current.index, next?.index ?? readme.length).trim()
  sections.set(title, body)
}

const groups = [
  {
    file: "learning-resources.md",
    title: "学习资源：书籍与课程",
    description: "GeoAI、GIS 编程、AI4Science 的书籍、课程、视频与大学项目。",
    sections: ["Books", "Education"],
  },
  {
    file: "research-community.md",
    title: "学术共同体：会议、团队与期刊",
    description: "相关会议、Workshop、研究团队、GIScience 奠基学者与期刊入口。",
    sections: ["Conferences", "Research Groups", "Journals"],
  },
  {
    file: "papers-and-software.md",
    title: "研究资源：论文与软件",
    description: "Autonomous GeoAI 相关代表性论文，以及 Python、R 和 GIS 集成工具。",
    sections: ["Selected Papers", "Software"],
  },
  {
    file: "careers-and-industry.md",
    title: "职业发展与产业地图",
    description: "博士与学术职业资源、博士后机会、实习机会、GeoAI 与 Physical AI 公司。",
    sections: ["Internship and Company", "Postdoc Opportunities"],
  },
  {
    file: "ecosystem-and-contributing.md",
    title: "生态、资助与参与方式",
    description: "其他资源、相关 Awesome Lists、科研资助以及上游贡献指南。",
    sections: ["Miscellaneous", "Relevant Awesome Lists", "Funding and Grants", "Contributing"],
  },
]

const expectedSections = groups.flatMap((group) => group.sections)
for (const section of expectedSections) {
  if (!sections.has(section)) {
    throw new Error(`Missing expected README section: ${section}`)
  }
}

const ignoredSections = new Set(["Contents"])
const unexpectedSections = [...sections.keys()].filter(
  (section) => !ignoredSections.has(section) && !expectedSections.includes(section),
)
if (unexpectedSections.length > 0) {
  throw new Error(`Unmapped README sections: ${unexpectedSections.join(", ")}`)
}

const normalizeImportedSection = (section, body) => {
  if (section === "Postdoc Opportunities") {
    return body.replace(/ {2,}$/gm, "<br>")
  }
  if (section === "Conferences") {
    return body.replace(
      /^(- \*\*(?:CIKM|ICDM|ICML|PAKDD|SIGIR|TheWebConf \(WWW\)|WSDM)\*\*[^\n]*?) {2}$/gm,
      "$1<br>",
    )
  }
  return body
}

const provenance = [
  "> [!info] 来源与版本",
  `> 本页整理自 [AutoGeoAI4Sci/awesome-autonomous-geoai](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai)，上游 commit [\`${commit.slice(0, 7)}\`](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai/commit/${commit})（${commitDate}）。`,
  "> GIStudioNote 只调整文档结构与导航；资源描述和外部链接来自上游，时效性与准确性请以原项目及链接目标为准。",
].join("\n")

const frontmatter = (title, description, order) => `---
title: "${title}"
description: "${description}"
tags:
  - GeoAI
  - Autonomous-GeoAI
  - AI4Science
  - awesome-list
source: https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai
source_commit: ${commit}
order: ${order}
---
`

fs.mkdirSync(outputRoot, { recursive: true })

for (const [index, group] of groups.entries()) {
  const body = group.sections
    .map((section) => normalizeImportedSection(section, sections.get(section)))
    .join("\n\n---\n\n")
  const output = `${frontmatter(group.title, group.description, index + 10)}
# ${group.title}

${group.description}

${provenance}

${body}
`
  fs.writeFileSync(path.join(outputRoot, group.file), output)
}

const prepareCoreDocument = (filename, title, description, order, introduction = "") => {
  const body = read(filename)
    .replace(/\r\n/g, "\n")
    .replace(/^# [^\n]+\n+/, "")
    .replace(/\(RESEARCH_PHILOSOPHY\.md\)/g, "(research-philosophy.md)")
  return `${frontmatter(title, description, order)}
# ${title}

${provenance}

${introduction ? `${introduction}\n\n` : ""}${body.trim()}
`
}

fs.writeFileSync(
  path.join(outputRoot, "research-philosophy.md"),
  prepareCoreDocument(
    "RESEARCH_PHILOSOPHY.md",
    "Research Philosophy：Autonomous GeoAI 科研哲学",
    "上游项目的研究愿景、博士定位、GeoAI 框架与科研写作原则原文。",
    20,
  ),
)

fs.writeFileSync(
  path.join(outputRoot, "research-philosophy-summary-zh.md"),
  prepareCoreDocument(
    "RESEARCH_PHILOSOPHY_SUMMARY_ZH.md",
    "Research Philosophy 中文综合与延伸解读",
    "对研究哲学原文的中文结构化综合，并整理与其科研观、GeoAI 框架和长期研究选择相关的延伸材料。",
    21,
    "这份页面以 [RESEARCH_PHILOSOPHY.md](research-philosophy.md) 为主线。前半部分综合原文中的研究宣言、博士定位和 GeoAI 框架，后半部分整理后来加入原文的阅读材料与研究选择思考。需要逐段核对上游内容时，应返回原文页和对应来源。",
  ),
)

const index = `${frontmatter(
  "Awesome Autonomous GeoAI 导航",
  "面向阅读与检索重新组织的 Autonomous GeoAI 与 AI4Science 资源导航。",
  1,
)}
# Awesome Autonomous GeoAI

[Awesome Autonomous GeoAI](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai) 是一个持续维护的 Autonomous GeoAI 与 AI4Science 资源列表，覆盖理论、模型、数据、软件、学术共同体和产业应用。

原项目采用单页长列表，适合集中维护，但不利于在知识站点中阅读和建立链接。这里完整保留上游栏目，并按使用场景拆成多个页面。

${provenance}

## 从哪里开始

| 你的目的 | 文档入口 |
|---|---|
| 系统学习 GeoAI、GIS 编程或寻找课程 | [学习资源与课程](learning-resources) |
| 找会议、Workshop、研究团队、学者或期刊 | [学术共同体、会议与期刊](research-community) |
| 找代表性论文、Python/R 包或 GIS 工具 | [论文与软件资源](papers-and-software) |
| 了解博士资源、博士后机会、实习和 GeoAI/Physical AI 公司 | [职业发展与产业地图](careers-and-industry) |
| 找相关列表、资助信息或参与上游维护 | [生态、资助与参与方式](ecosystem-and-contributing) |

## 核心研究文档

- [[research-philosophy|Autonomous GeoAI 科研哲学]]
- [[research-philosophy-summary-zh|Research Philosophy 中文综合与延伸解读]]

## GIStudio 知识综合

- [[../AI/GeoAI/index|GeoAI 与自主地理智能知识地图]]
- [[../AI/GeoAI/autonomous-geoai|Autonomous GeoAI 概念与边界]]
- [[../AI/GeoAI/geoai-agent-architecture|GeoAI Agent 架构]]
- [[../AI/GeoAI/geospatial-agent-evaluation|地理空间智能体评测]]

## 阅读边界

- 这是资源导航，不是系统综述，也不代表 GIStudio 对每一条资源的学术背书。
- 带年份的会议、Workshop、实习和资助信息最容易过期，使用前应进入原链接核验。
- 若要引用论文，应回到论文原文与正式出版记录，不要把本列表当作书目信息来源。
- 内容增删应优先提交给上游；本地目录主要负责可读性与知识站点导航。

## 维护

同步方式、版本信息与授权说明见 [[source-and-maintenance|来源、授权与更新方法]]。
`
fs.writeFileSync(path.join(outputRoot, "index.md"), index)

const license = read("LICENSE").trim()
const maintenance = `${frontmatter(
  "Awesome Autonomous GeoAI：来源、授权与更新方法",
  "记录 GIStudioNote 整理版的上游来源、快照版本、目录映射、同步方法与 MIT 授权。",
  90,
)}
# 来源、授权与更新方法

## 上游来源

- 仓库：[AutoGeoAI4Sci/awesome-autonomous-geoai](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai)
- 默认分支：\`main\`
- 本次快照：[\`${commit}\`](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai/commit/${commit})
- 上游提交时间：\`${commitDate}\`
- 整理日期：\`${importDate}\`

## 本地整理原则

1. 上游仍是资源条目的来源与贡献入口。
2. GIStudioNote 对 README 的二级栏目做完整映射，不遗漏资源栏目。
3. 本地只增加中文导航、阅读边界、来源提示和页面拆分。
4. 会议、职位、资助等时效性信息不在导入时自动判定有效。
5. 更新时如出现新的二级栏目，导入脚本会停止并要求人工决定归类，避免静默漏项。

## 页面映射

| 上游栏目 | 本地页面 |
|---|---|
| Books；Education | [[learning-resources]] |
| Conferences；Research Groups；Journals | [[research-community]] |
| Selected Papers；Software | [[papers-and-software]] |
| Internship and Company；Postdoc Opportunities | [[careers-and-industry]] |
| Miscellaneous；Relevant Awesome Lists；Funding and Grants；Contributing | [[ecosystem-and-contributing]] |
| RESEARCH_PHILOSOPHY.md | [[research-philosophy]] |
| RESEARCH_PHILOSOPHY_SUMMARY_ZH.md | [[research-philosophy-summary-zh]] |

## 更新步骤

\`\`\`bash
git clone --depth 1 https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai.git /tmp/awesome-autonomous-geoai
UPSTREAM_COMMIT="$(git -C /tmp/awesome-autonomous-geoai rev-parse HEAD)" \\
UPSTREAM_COMMIT_DATE="$(git -C /tmp/awesome-autonomous-geoai log -1 --format=%cs)" \\
node scripts/import_awesome_autonomous_geoai.mjs /tmp/awesome-autonomous-geoai
npm run check:content
\`\`\`

运行后应审阅差异，特别检查带日期的活动、职位、资助信息，以及上游内部链接。

## MIT License

以下授权文本来自上游仓库：

\`\`\`text
${license}
\`\`\`
`
fs.writeFileSync(path.join(outputRoot, "source-and-maintenance.md"), maintenance)

execFileSync(
  path.resolve("node_modules/.bin/prettier"),
  [outputRoot, "--write", "--log-level", "silent"],
  { stdio: "inherit" },
)

console.log(
  `Imported ${expectedSections.length} README sections into ${groups.length} resource pages.`,
)
console.log(`Wrote core documents and provenance metadata at ${outputRoot}.`)
