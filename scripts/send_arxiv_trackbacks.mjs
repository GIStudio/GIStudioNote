#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const publicRoot = path.resolve("public")
const shouldSend = process.argv.includes("--send")
const siteOrigin = new URL(process.env.SITE_URL ?? "https://notes.gistudio.xyz").origin
const requestedArxivIds = new Set()

for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index]
  if (argument === "--arxiv-id") {
    const value = process.argv[index + 1]
    if (!value || value.startsWith("--")) {
      console.error("Missing value after --arxiv-id")
      process.exit(2)
    }
    requestedArxivIds.add(value.replace(/v\d+$/i, ""))
    index += 1
  } else if (argument.startsWith("--arxiv-id=")) {
    requestedArxivIds.add(argument.slice("--arxiv-id=".length).replace(/v\d+$/i, ""))
  }
}

if (!fs.existsSync(publicRoot)) {
  console.error("Missing public/. Run npm run build:site before listing arXiv Trackbacks.")
  process.exit(1)
}

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })

const decodeHtml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")

const request = async (url, options, label) => {
  try {
    return await fetch(url, options)
  } catch (error) {
    const reason = error?.cause?.code ?? error?.message ?? "request failed"
    console.error(`ERROR ${label}: ${reason}`)
    return null
  }
}

const textFromMeta = (html, property) => {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))
  return match ? decodeHtml(match[1]) : ""
}

const normalizeArxivId = (value) => value.replace(/v\d+$/i, "")
const tasks = new Map()

for (const file of walk(publicRoot).filter((candidate) => candidate.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8")
  const pageUrl = textFromMeta(html, "og:url")
  if (!pageUrl || new URL(pageUrl).origin !== siteOrigin) continue

  const scientificIds = new Set(
    [...html.matchAll(/href="https:\/\/arxiv\.org\/abs\/([A-Za-z0-9./-]+(?:v\d+)?)"/g)].map(
      (match) => normalizeArxivId(match[1]),
    ),
  )
  const trackbackRecordIds = new Set(
    [...html.matchAll(/href="https:\/\/arxiv\.org\/tb\/([A-Za-z0-9./-]+)"/g)].map(
      (match) => match[1],
    ),
  )

  for (const arxivId of scientificIds) {
    if (!trackbackRecordIds.has(arxivId)) continue
    const key = `${pageUrl}\t${arxivId}`
    tasks.set(key, {
      arxivId,
      pageUrl,
      title: textFromMeta(html, "og:title") || "GIStudio Notes",
      excerpt: textFromMeta(html, "og:description").slice(0, 240),
    })
  }
}

const sortedTasks = [...tasks.values()]
  .filter((task) => requestedArxivIds.size === 0 || requestedArxivIds.has(task.arxivId))
  .sort(
    (left, right) =>
      left.pageUrl.localeCompare(right.pageUrl) || left.arxivId.localeCompare(right.arxivId),
  )

if (requestedArxivIds.size > 0) {
  const matchedIds = new Set(sortedTasks.map((task) => task.arxivId))
  const missingIds = [...requestedArxivIds].filter((arxivId) => !matchedIds.has(arxivId))
  if (missingIds.length > 0) {
    console.error(`No paired live-page candidate found for: ${missingIds.join(", ")}`)
    process.exit(2)
  }
}

console.log(`Found ${sortedTasks.length} paired arXiv Trackback target(s).`)
for (const task of sortedTasks) console.log(`${task.arxivId}\t${task.pageUrl}`)

if (!shouldSend) {
  console.log("Dry run only. Re-run with --send after the matching public pages are live.")
  process.exit(0)
}

let failures = 0
for (const task of sortedTasks) {
  const liveResponse = await request(
    task.pageUrl,
    { redirect: "follow" },
    `${task.arxivId} live page`,
  )
  if (!liveResponse) {
    failures += 1
    continue
  }
  const liveHtml = await liveResponse.text()
  const hasScientificLink = new RegExp(
    `href="https://arxiv\\.org/abs/${task.arxivId}(?:v\\d+)?"`,
    "i",
  ).test(liveHtml)
  const hasTrackbackRecordLink = liveHtml.includes(`href="https://arxiv.org/tb/${task.arxivId}"`)

  if (!liveResponse.ok || !hasScientificLink || !hasTrackbackRecordLink) {
    console.error(
      `SKIP ${task.arxivId}: live page is unavailable or does not contain the paired links (${task.pageUrl})`,
    )
    failures += 1
    continue
  }

  const body = new URLSearchParams({
    url: task.pageUrl,
    title: task.title,
    blog_name: "GIStudio Notes",
    excerpt: task.excerpt,
  })
  const response = await request(
    `https://arxiv.org/trackback/${task.arxivId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "user-agent": "GIStudioNotes-Trackback/1.0 (+https://notes.gistudio.xyz/)",
      },
      body,
      redirect: "follow",
    },
    `${task.arxivId} submission`,
  )
  if (!response) {
    failures += 1
    continue
  }
  const responseText = await response.text()
  const errorCode = responseText.match(/<error>(\d+)<\/error>/i)?.[1]
  const message = decodeHtml(responseText.match(/<message>([\s\S]*?)<\/message>/i)?.[1] ?? "")

  if (!response.ok || errorCode !== "0") {
    console.error(`ERROR ${task.arxivId}: ${message || `HTTP ${response.status}`}`)
    failures += 1
  } else {
    console.log(`SUBMITTED ${task.arxivId}: ${task.pageUrl}`)
  }
}

if (failures > 0) {
  console.error(`Trackback submission finished with ${failures} failure(s).`)
  process.exit(1)
}

console.log(`Submitted ${sortedTasks.length} Trackback(s) for arXiv moderation.`)
