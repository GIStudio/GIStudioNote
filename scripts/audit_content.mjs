#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const contentRoot = path.resolve("content")
const errors = []
const warnings = []

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "private") return []
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })

const markdownFiles = walk(contentRoot)
  .filter((file) => file.endsWith(".md"))
  .sort()
const assetFiles = walk(contentRoot).filter((file) => !file.endsWith(".md"))

const relativePath = (file) => path.relative(contentRoot, file).replaceAll(path.sep, "/")
const stripExtension = (value) => value.replace(/\.md$/i, "")
const stripIndex = (value) => value.replace(/\/index$/i, "")
const normalizeTarget = (value) =>
  stripIndex(stripExtension(decodeURIComponent(value).replace(/^\/+/, "")))
const normalizeArxivId = (value) => value.replace(/v\d+$/i, "")

const noteTargets = new Map()
const assetTargets = new Map()

const register = (map, key, file) => {
  if (!key) return
  const values = map.get(key) ?? []
  values.push(file)
  map.set(key, values)
}

for (const file of markdownFiles) {
  const relative = relativePath(file)
  const slug = stripIndex(stripExtension(relative))
  register(noteTargets, slug, file)
  register(noteTargets, path.posix.basename(slug), file)

  const parsed = matter(fs.readFileSync(file, "utf8"))
  const aliases = Array.isArray(parsed.data.aliases)
    ? parsed.data.aliases
    : parsed.data.aliases
      ? [parsed.data.aliases]
      : []
  for (const alias of aliases) register(noteTargets, normalizeTarget(String(alias)), file)
}

for (const file of assetFiles) {
  const relative = relativePath(file)
  register(assetTargets, relative, file)
  register(assetTargets, path.posix.basename(relative), file)
}

const resolvesNote = (target, sourceFile) => {
  const normalized = normalizeTarget(target)
  const sourceDirectory = path.posix.dirname(relativePath(sourceFile))
  const relative = normalizeTarget(path.posix.join(sourceDirectory, normalized))
  return noteTargets.has(normalized) || noteTargets.has(relative)
}

const resolvesAsset = (target, sourceFile) => {
  const normalized = decodeURIComponent(target).replace(/^\/+/, "")
  const sourceDirectory = path.posix.dirname(relativePath(sourceFile))
  const relative = path.posix.normalize(path.posix.join(sourceDirectory, normalized))
  return assetTargets.has(normalized) || assetTargets.has(relative)
}

for (const [target, files] of noteTargets) {
  const unique = [...new Set(files)]
  if (target.includes("/") && unique.length > 1) {
    errors.push(`duplicate note target "${target}": ${unique.map(relativePath).join(", ")}`)
  }
}

for (const file of markdownFiles) {
  const relative = relativePath(file)
  const raw = fs.readFileSync(file, "utf8")
  const parsed = matter(raw)
  const { title, description, tags } = parsed.data

  if (!String(title ?? "").trim()) errors.push(`${relative}: missing title`)
  if (!String(description ?? "").trim()) errors.push(`${relative}: missing description`)

  if (!Array.isArray(tags) || tags.length < 2) {
    errors.push(`${relative}: tags must contain at least 2 entries`)
  } else {
    const normalizedTags = tags.map((tag) => String(tag).trim()).filter(Boolean)
    if (normalizedTags.length > 8) {
      errors.push(`${relative}: tags must contain no more than 8 entries`)
    }
    if (new Set(normalizedTags).size !== normalizedTags.length) {
      errors.push(`${relative}: duplicate tags`)
    }
    if (normalizedTags.some((tag) => tag.includes("/"))) {
      errors.push(`${relative}: slash-separated tags are not allowed`)
    }
  }

  if (!parsed.content.trim() && parsed.data.draft !== true) {
    errors.push(`${relative}: published page has an empty body`)
  }

  for (const match of parsed.content.matchAll(/!?\[\[([^\]]+)\]\]/g)) {
    const rawTarget = match[1]
    const target = rawTarget.split("|")[0].split("#")[0].trim()
    if (!target) continue
    const isEmbed = match[0].startsWith("!")
    const resolved = isEmbed
      ? resolvesAsset(target, file) || resolvesNote(target, file)
      : resolvesNote(target, file) || resolvesAsset(target, file)
    if (!resolved) errors.push(`${relative}: unresolved wikilink [[${rawTarget}]]`)
  }

  for (const match of parsed.content.matchAll(/(!?)\[[^\]]*]\(([^)]+)\)/g)) {
    const isImage = match[1] === "!"
    const rawTarget = match[2].trim().replace(/^<|>$/g, "")
    const target = rawTarget.split("#")[0]
    if (!target || /^(https?:|mailto:|tel:|ftp:|data:)/i.test(target)) continue
    const resolved = isImage ? resolvesAsset(target, file) : resolvesNote(target, file)
    if (!resolved) errors.push(`${relative}: unresolved Markdown link (${rawTarget})`)
  }

  const lines = parsed.content.split("\n")
  for (const [index, line] of lines.entries()) {
    const arxivLinks = [
      ...line.matchAll(
        /\[[^\]]+]\(https:\/\/arxiv\.org\/(abs|pdf|html)\/([A-Za-z0-9./-]+(?:v\d+)?)\)/g,
      ),
    ]
    for (const match of arxivLinks) {
      const [, surface, versionedId] = match
      const arxivId = normalizeArxivId(versionedId)
      if (surface !== "abs") {
        errors.push(
          `${relative}:${index + 1}: arXiv scientific link must use /abs/${versionedId}, not /${surface}/`,
        )
      }

      const followingText = line.slice((match.index ?? 0) + match[0].length)
      const trackbackRecordUrl = `https://arxiv.org/tb/${arxivId}`
      if (!followingText.includes(`](${trackbackRecordUrl})`)) {
        errors.push(
          `${relative}:${index + 1}: arXiv ${versionedId} must keep its scientific link and add a following Trackback record link (${trackbackRecordUrl})`,
        )
      }
    }

    for (const match of line.matchAll(
      /\[[^\]]+]\(https:\/\/arxiv\.org\/trackback\/([A-Za-z0-9./-]+)\)/gi,
    )) {
      errors.push(
        `${relative}:${index + 1}: arXiv Trackback submission endpoint /trackback/${match[1]} cannot be a reader-facing Markdown link; use /tb/${match[1]}`,
      )
    }

    for (const match of line.matchAll(
      /\[[^\]]+]\(https:\/\/arxiv\.org\/tb\/([A-Za-z0-9./-]+)\)/gi,
    )) {
      const beforeTrackback = line.slice(0, match.index ?? 0)
      const arxivId = match[1]
      const escapedId = arxivId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const hasScientificLink = new RegExp(
        `https://arxiv\\.org/abs/${escapedId}(?:v\\d+)?\\)`,
        "i",
      ).test(beforeTrackback)
      if (!hasScientificLink) {
        errors.push(
          `${relative}:${index + 1}: Trackback record ${arxivId} cannot replace the preceding arXiv scientific link`,
        )
      }
    }
  }
}

console.log(`Audited ${markdownFiles.length} Markdown files and ${assetFiles.length} assets.`)
for (const warning of warnings) console.warn(`WARN ${warning}`)
for (const error of errors) console.error(`ERROR ${error}`)

if (errors.length > 0) {
  console.error(`Content audit failed with ${errors.length} error(s).`)
  process.exit(1)
}

console.log("Content audit passed.")
