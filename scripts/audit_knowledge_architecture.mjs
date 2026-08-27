#!/usr/bin/env node

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const contentRoot = path.resolve("content")
const outputRoot = path.resolve("docs/knowledge-architecture")
const shouldWrite = process.argv.includes("--write")

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "private") return []
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })

const markdownFiles = walk(contentRoot)
  .filter((file) => file.endsWith(".md"))
  .sort()

const relativePath = (file) => path.relative(contentRoot, file).replaceAll(path.sep, "/")
const stripExtension = (value) => value.replace(/\.md$/i, "")
const stripIndex = (value) => value.replace(/\/index$/i, "")
const normalizeReference = (value) => {
  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    // Keep the raw target so malformed encodings remain visible to audit:content.
  }
  return stripExtension(decoded.replace(/^\/+/, ""))
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .toLowerCase()
}
const normalizeTarget = (value) => stripIndex(normalizeReference(value))
const slugFor = (file) => normalizeTarget(relativePath(file))
const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, "")

const targetMap = new Map()
const draftTargetMap = new Map()
const registerKey = (map, normalized, file) => {
  if (!normalized) return
  const values = map.get(normalized) ?? []
  values.push(file)
  map.set(normalized, values)
}
const registerReference = (map, key, file) => registerKey(map, normalizeReference(key), file)
const registerTarget = (map, key, file) => registerKey(map, normalizeTarget(key), file)

const rawPages = markdownFiles.map((file) => {
  const relative = relativePath(file)
  const raw = fs.readFileSync(file, "utf8")
  const parsed = matter(raw)
  const aliases = Array.isArray(parsed.data.aliases)
    ? parsed.data.aliases.map(String)
    : parsed.data.aliases
      ? [String(parsed.data.aliases)]
      : []
  const tags = Array.isArray(parsed.data.tags)
    ? parsed.data.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : []

  return {
    file,
    relative,
    slug: slugFor(file),
    directory: path.posix.dirname(relative),
    topLevel: relative.includes("/") ? relative.split("/")[0] : "root",
    isIndex: path.posix.basename(relative).toLowerCase() === "index.md",
    title: String(parsed.data.title ?? "").trim(),
    description: String(parsed.data.description ?? "").trim(),
    tags,
    aliases,
    draft: parsed.data.draft === true,
    verifiedAt: String(parsed.data.verified_at ?? "").trim(),
    content: parsed.content,
  }
})

for (const page of rawPages.filter((candidate) => !candidate.draft)) {
  registerReference(targetMap, page.relative, page.file)
  registerTarget(targetMap, page.slug, page.file)
  registerTarget(targetMap, path.posix.basename(page.slug), page.file)
  registerTarget(targetMap, page.title, page.file)
  for (const alias of page.aliases) registerTarget(targetMap, alias, page.file)
}
for (const page of rawPages.filter((candidate) => candidate.draft)) {
  registerReference(draftTargetMap, page.relative, page.file)
  registerTarget(draftTargetMap, page.slug, page.file)
  registerTarget(draftTargetMap, path.posix.basename(page.slug), page.file)
  registerTarget(draftTargetMap, page.title, page.file)
  for (const alias of page.aliases) registerTarget(draftTargetMap, alias, page.file)
}

const resolveLinkFromMap = (target, source, map) => {
  const rawTarget = target.split("#")[0].trim()
  const reference = normalizeReference(rawTarget)
  const normalized = normalizeTarget(rawTarget)
  if (!reference) return undefined
  const sourceDirectory = path.posix.dirname(source.relative)
  const candidates = [
    reference,
    normalizeReference(path.posix.normalize(path.posix.join(sourceDirectory, reference))),
    normalized,
    normalizeTarget(path.posix.normalize(path.posix.join(sourceDirectory, normalized))),
  ]
  for (const candidate of candidates) {
    const files = [...new Set(map.get(candidate) ?? [])]
    if (files.length === 1) return files[0]
  }
  return undefined
}
const resolveLink = (target, source) => resolveLinkFromMap(target, source, targetMap)
const draftLinkFindings = []

const extractLocalLinks = (page) => {
  const targets = []
  for (const match of page.content.matchAll(/!?\[\[([^\]]+)\]\]/g)) {
    const target = match[1].split("|")[0].trim()
    const resolved = resolveLink(target, page)
    if (resolved) targets.push(resolved)
    else if (!page.draft) {
      const draftTarget = resolveLinkFromMap(target, page, draftTargetMap)
      if (draftTarget) draftLinkFindings.push({ source: page.file, target: draftTarget })
    }
  }
  for (const match of page.content.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "")
    if (/^(https?:|mailto:|tel:|ftp:|data:|#)/i.test(rawTarget)) continue
    const resolved = resolveLink(rawTarget, page)
    if (resolved) targets.push(resolved)
    else if (!page.draft) {
      const draftTarget = resolveLinkFromMap(rawTarget, page, draftTargetMap)
      if (draftTarget) draftLinkFindings.push({ source: page.file, target: draftTarget })
    }
  }
  return [...new Set(targets)].filter((target) => target !== page.file)
}

const stripMarkup = (content) =>
  content
    .replace(/^---[\s\S]*?---/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/!?\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/!?\[([^\]]*)]\([^)]+\)/g, "$1")
    .replace(/[#$>*_~|]/g, " ")

const tokenSet = (value) => {
  const text = stripMarkup(String(value ?? "")).normalize("NFKC").toLowerCase()
  const tokens = new Set(text.match(/[a-z][a-z0-9.+-]{2,}/g) ?? [])
  for (const sequence of text.match(/[\p{Script=Han}]{2,}/gu) ?? []) {
    for (let index = 0; index < sequence.length - 1; index += 1) {
      tokens.add(sequence.slice(index, index + 2))
    }
  }
  return tokens
}

const titleTokenSet = (value) => {
  const normalized = normalizeText(value)
  const tokens = new Set(normalized.match(/[a-z][a-z0-9.+-]{1,}/g) ?? [])
  const han = [...normalized].filter((character) => /\p{Script=Han}/u.test(character)).join("")
  for (let index = 0; index < han.length - 1; index += 1) {
    tokens.add(han.slice(index, index + 2))
  }
  return tokens
}

const jaccard = (left, right) => {
  if (left.size === 0 || right.size === 0) return 0
  let intersection = 0
  for (const value of left) if (right.has(value)) intersection += 1
  return intersection / (left.size + right.size - intersection)
}

const contentType = (page) => {
  const signal = `${page.title} ${page.description} ${page.tags.join(" ")}`.toLowerCase()
  if (page.isIndex) return "project-resource-hub"
  if (page.topLevel === "Philosophy") return "concept-explainer"
  if (page.topLevel === "Reading" || /精读|文献|paper|reading/.test(signal)) {
    return "evidence-reading-note"
  }
  if (/对比|比较|选择|选型|versus|\bvs\b/.test(signal)) return "comparison-decision-note"
  if (["Dev", "tools", "cloud"].includes(page.topLevel) || /指南|教程|配置|安装/.test(signal)) {
    return "practical-guide"
  }
  if (["AI", "Graph", "RL"].includes(page.topLevel) || /架构|机制|模型|embedding/.test(signal)) {
    return "technical-mechanism-note"
  }
  if (page.topLevel === "DL" || /基础|入门|学习/.test(signal)) return "progressive-learning-note"
  return "concept-explainer"
}

const allPages = rawPages.map((page) => ({
  ...page,
  outgoingFiles: extractLocalLinks(page),
  bodyTokens: tokenSet(page.content),
  titleTokens: titleTokenSet(page.title),
  normalizedTitle: normalizeText(page.title),
  normalizedBody: normalizeText(stripMarkup(page.content)),
  contentType: contentType(page),
}))
const pages = allPages.filter((page) => !page.draft)
const draftPages = allPages.filter((page) => page.draft)

const inbound = new Map(pages.map((page) => [page.file, new Set()]))
for (const page of pages) {
  for (const target of page.outgoingFiles) inbound.get(target)?.add(page.file)
}

const navigationInbound = new Map(pages.map((page) => [page.file, new Set()]))
for (const page of pages.filter((candidate) => candidate.isIndex)) {
  for (const target of page.outgoingFiles) navigationInbound.get(target)?.add(page.file)
}

const nonIndexPages = pages.filter((page) => !page.isIndex)
const graphOrphans = pages.filter(
  (page) => page.relative !== "index.md" && (inbound.get(page.file)?.size ?? 0) === 0,
)
const orphanIndexes = graphOrphans.filter((page) => page.isIndex)
const orphanNonIndexes = graphOrphans.filter((page) => !page.isIndex)
const navigationOrphans = nonIndexPages.filter(
  (page) => (navigationInbound.get(page.file)?.size ?? 0) === 0,
)

const duplicateCandidates = []
const relatedCandidates = []
const genericTags = new Set([
  "gistudio",
  "笔记",
  "教程",
  "索引",
  "项目笔记",
  "研究笔记",
  "知识库",
  "awesome-list",
  "研究方法",
  "城市研究",
  "数据分析",
  "写作参考",
  "城市规划",
  "科学哲学",
  "论文写作",
])
const tagAliases = new Map([
  ["artificial intelligence", "ai"],
  ["人工智能", "ai"],
  ["deep learning", "深度学习"],
  ["deep-learning", "深度学习"],
  ["dl", "深度学习"],
  ["machine learning", "机器学习"],
  ["ml", "机器学习"],
  ["large language model", "llm"],
  ["大语言模型", "llm"],
  ["reinforcement learning", "rl"],
  ["强化学习", "rl"],
  ["geospatial ai", "geoai"],
  ["prompt engineering", "提示词工程"],
  ["prompt", "提示词工程"],
  ["prompts", "提示词工程"],
])
const normalizeTag = (tag) => {
  const normalized = String(tag).normalize("NFKC").trim().toLowerCase()
  return tagAliases.get(normalized) ?? normalized
}

const sharesIndexHub = (left, right) =>
  pages
    .filter((page) => page.isIndex)
    .some(
      (indexPage) =>
        indexPage.outgoingFiles.includes(left.file) && indexPage.outgoingFiles.includes(right.file),
    )

for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
  const left = pages[leftIndex]
  for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
    const right = pages[rightIndex]
    if (left.isIndex || right.isIndex) continue
    const titleSimilarity = jaccard(left.titleTokens, right.titleTokens)
    const bodySimilarity = jaccard(left.bodyTokens, right.bodyTokens)
    const exactBody =
      left.normalizedBody.length > 200 &&
      crypto.createHash("sha256").update(left.normalizedBody).digest("hex") ===
        crypto.createHash("sha256").update(right.normalizedBody).digest("hex")
    const exactTitle = left.normalizedTitle && left.normalizedTitle === right.normalizedTitle

    if (exactTitle || exactBody || bodySimilarity >= 0.55 || (titleSimilarity >= 0.75 && bodySimilarity >= 0.2)) {
      duplicateCandidates.push({
        left,
        right,
        reason: exactBody ? "exact body" : exactTitle ? "same title" : "near duplicate",
        titleSimilarity,
        bodySimilarity,
      })
      continue
    }

    const directlyLinked =
      left.outgoingFiles.includes(right.file) || right.outgoingFiles.includes(left.file)
    if (directlyLinked || sharesIndexHub(left, right)) continue
    const leftTags = new Set(left.tags.map(normalizeTag).filter((tag) => !genericTags.has(tag)))
    const rightTags = new Set(
      right.tags.map(normalizeTag).filter((tag) => !genericTags.has(tag)),
    )
    const sharedTags = [...leftTags].filter((tag) => rightTags.has(tag))
    const tagSimilarity = jaccard(leftTags, rightTags)
    const sameTopLevel = left.topLevel === right.topLevel
    const score = tagSimilarity * 0.55 + bodySimilarity * 0.35 + (sameTopLevel ? 0.1 : 0)
    const crossFieldSignal =
      !sameTopLevel &&
      sharedTags.length >= 1 &&
      (bodySimilarity >= 0.1 || (titleSimilarity >= 0.25 && bodySimilarity >= 0.05))
    if (
      (sharedTags.length >= 2 && score >= 0.32) ||
      (sharedTags.length >= 1 && bodySimilarity >= 0.16) ||
      crossFieldSignal
    ) {
      relatedCandidates.push({ left, right, sharedTags, bodySimilarity, score })
    }
  }
}

duplicateCandidates.sort(
  (left, right) =>
    Number(right.reason === "exact body") - Number(left.reason === "exact body") ||
    right.bodySimilarity - left.bodySimilarity ||
    right.titleSimilarity - left.titleSimilarity,
)
relatedCandidates.sort((left, right) => right.score - left.score)

const tagsByPage = new Map()
for (const page of pages) {
  for (const tag of page.tags) {
    const key = tag.toLowerCase()
    const values = tagsByPage.get(key) ?? { label: tag, pages: new Set() }
    values.pages.add(page.file)
    tagsByPage.set(key, values)
  }
}

const canonicalTerms = []
for (const page of pages) {
  canonicalTerms.push(page.title, ...page.aliases)
  if (page.topLevel === "Glossary") {
    for (const match of page.content.matchAll(/^#{2,4}\s+(.+)$/gm)) {
      canonicalTerms.push(match[1].replace(/[*_`]/g, "").trim())
    }
  }
}

const hasCanonicalTerm = (label) => {
  const term = String(label).normalize("NFKC").trim()
  if (!term) return false
  const compactTerm = normalizeText(term)
  if (
    compactTerm.length >= 4 &&
    canonicalTerms.some((candidate) => normalizeText(candidate).includes(compactTerm))
  ) {
    return true
  }
  if (/^[a-z0-9.+-]+$/i.test(term)) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const expression = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i")
    return canonicalTerms.some((candidate) => expression.test(String(candidate).normalize("NFKC")))
  }
  return canonicalTerms.some((candidate) =>
    String(candidate).normalize("NFKC").toLowerCase().includes(term.toLowerCase()),
  )
}

const glossaryCandidates = [...tagsByPage.values()]
  .filter(({ label, pages: tagPages }) => {
    if (tagPages.size < 3 || genericTags.has(label.toLowerCase())) return false
    return !hasCanonicalTerm(label)
  })
  .sort((left, right) => right.pages.size - left.pages.size || left.label.localeCompare(right.label))

const acronymPages = new Map()
for (const page of pages) {
  const acronyms = new Set(
    page.content.match(/\b[A-Z][A-Z0-9.]+(?:-[A-Z0-9]+)*\b/g) ?? [],
  )
  for (const acronym of acronyms) {
    const values = acronymPages.get(acronym) ?? new Set()
    values.add(page.file)
    acronymPages.set(acronym, values)
  }
}
const acronymCandidates = [...acronymPages.entries()]
  .filter(([term, termPages]) => {
    const reviewedInlineTerms = new Set([
      "AAAI",
      "ACL",
      "ACM",
      "CASA",
      "CEO",
      "CI",
      "CS",
      "CVPR",
      "DHS",
      "ECCV",
      "FAO",
      "ICCV",
      "ICLR",
      "ICML",
      "IEEE",
      "IP",
      "MIT",
      "MM",
      "NASA",
      "SIGGRAPH",
      "SIGSPATIAL",
      "UCL",
      "UN",
      "URL",
    ])
    return termPages.size >= 3 && !reviewedInlineTerms.has(term) && !hasCanonicalTerm(term)
  })
  .sort((left, right) => right[1].size - left[1].size || left[0].localeCompare(right[0]))

const byTopLevel = new Map()
for (const page of pages) byTopLevel.set(page.topLevel, (byTopLevel.get(page.topLevel) ?? 0) + 1)

const csvEscape = (value) => {
  const stringValue = String(value ?? "")
  return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue
}
const inventoryRows = [
  [
    "path",
    "slug",
    "title",
    "top_level",
    "suggested_pattern",
    "draft",
    "tags",
    "inbound_links",
    "outbound_links",
    "index_links",
    "verified_at",
  ],
  ...allPages.map((page) => [
    page.relative,
    page.slug,
    page.title,
    page.topLevel,
    page.contentType,
    page.draft,
    page.tags.join("|"),
    inbound.get(page.file)?.size ?? 0,
    page.outgoingFiles.length,
    navigationInbound.get(page.file)?.size ?? 0,
    page.verifiedAt,
  ]),
]
const inventoryCsv = `${inventoryRows.map((row) => row.map(csvEscape).join(",")).join("\n")}\n`

const listPaths = (items, limit = 60) =>
  items.length === 0
    ? "- None detected."
    : items
        .slice(0, limit)
        .map((page) => `- \`${page.relative}\` — ${page.title}`)
        .join("\n")

const generatedDate = new Date().toISOString().slice(0, 10)
const report = `# GIStudio Notes knowledge architecture audit

Generated: ${generatedDate}

This report is a deterministic triage aid. It identifies candidates for human review; it does not authorize automatic moves, merges, deletions, or new glossary pages.

## Inventory

- Public Markdown pages: ${pages.length}
- Draft Markdown pages excluded from public graph checks: ${draftPages.length}
- Non-index pages: ${nonIndexPages.length}
- Index pages: ${pages.length - nonIndexPages.length}
- Published pages with no inbound content link: ${graphOrphans.length}
- Unreachable published index pages: ${orphanIndexes.length}
- Unreachable published non-index pages: ${orphanNonIndexes.length}
- Pages absent from all index-page links: ${navigationOrphans.length}
- Duplicate or near-duplicate candidates: ${duplicateCandidates.length}
- Unlinked related-page candidates: ${relatedCandidates.length}
- Public links pointing to draft pages: ${draftLinkFindings.length}
- Repeated tag glossary candidates: ${glossaryCandidates.length}
- Repeated acronym glossary candidates: ${acronymCandidates.length}

### Pages by current top-level location

${[...byTopLevel.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .map(([name, count]) => `- ${name}: ${count}`)
  .join("\n")}

## Navigation gaps

### Published pages with no inbound content link

${listPaths(graphOrphans)}

### Draft pages excluded from public navigation checks

${listPaths(draftPages)}

### Public pages linking to draft pages

${
  draftLinkFindings.length === 0
    ? "- None detected."
    : draftLinkFindings
        .map(
          ({ source, target }) =>
            `- \`${relativePath(source)}\` → \`${relativePath(target)}\``,
        )
        .join("\n")
}

### Not linked by any index page

${listPaths(navigationOrphans)}

## Duplicate candidates

${
  duplicateCandidates.length === 0
    ? "- None detected."
    : duplicateCandidates
        .slice(0, 40)
        .map(
          ({ left, right, reason, titleSimilarity, bodySimilarity }) =>
            `- \`${left.relative}\` ↔ \`${right.relative}\` — ${reason}; title=${titleSimilarity.toFixed(2)}, body=${bodySimilarity.toFixed(2)}`,
        )
        .join("\n")
}

## Related but not directly linked

${
  relatedCandidates.length === 0
    ? "- None detected."
    : relatedCandidates
        .slice(0, 60)
        .map(
          ({ left, right, sharedTags, bodySimilarity, score }) =>
            `- \`${left.relative}\` ↔ \`${right.relative}\` — shared tags: ${sharedTags.join(", ")}; body=${bodySimilarity.toFixed(2)}, score=${score.toFixed(2)}`,
        )
        .join("\n")
}

## Glossary candidates from repeated tags

${
  glossaryCandidates.length === 0
    ? "- None detected."
    : glossaryCandidates
        .slice(0, 60)
        .map(({ label, pages: tagPages }) => `- ${label}: ${tagPages.size} pages`)
        .join("\n")
}

## Glossary candidates from repeated acronyms

${
  acronymCandidates.length === 0
    ? "- None detected."
    : acronymCandidates
        .slice(0, 60)
        .map(([term, termPages]) => `- ${term}: ${termPages.size} pages`)
        .join("\n")
}

## Human-review rules

- Confirm semantic overlap before merging; shared words or tags are only a lead.
- Confirm the primary reader and page purpose before moving a page to another field.
- Prefer a direct contextual link when two pages explain different layers of one idea.
- Create a glossary entry only when the term recurs, blocks understanding, and can be defined independently.
- Preserve published routes with aliases or redirects when a confirmed move changes a URL.
`

console.log(
  `Audited ${pages.length} pages: ${graphOrphans.length} graph orphans, ${navigationOrphans.length} navigation gaps, ${duplicateCandidates.length} duplicate candidates, ${relatedCandidates.length} unlinked relation candidates.`,
)

if (shouldWrite) {
  fs.mkdirSync(outputRoot, { recursive: true })
  fs.writeFileSync(path.join(outputRoot, "inventory.csv"), inventoryCsv, "utf8")
  fs.writeFileSync(path.join(outputRoot, "audit.md"), report, "utf8")
  console.log(`Wrote ${path.relative(process.cwd(), outputRoot)}/inventory.csv and audit.md.`)
} else {
  console.log("Run with --write to refresh docs/knowledge-architecture/inventory.csv and audit.md.")
}
