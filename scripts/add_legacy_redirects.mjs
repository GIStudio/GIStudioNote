import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

const outputRoot = path.resolve("public")

const redirects = [
  {
    from: "AI/anyrecon-wechat.html",
    to: "/ai/anyrecon",
    title: "AI/AnyRecon",
  },
  {
    from: "DL/NLP-NER.html",
    to: "/dl/ner",
    title: "DL/NER",
  },
]

function redirectHtml(title, target) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <link rel="canonical" href="${target}">
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0; url=${target}">
  </head>
  <body>
    <p>This page moved to <a href="${target}">${target}</a>.</p>
  </body>
</html>
`
}

for (const redirect of redirects) {
  const destination = path.resolve(outputRoot, redirect.from)
  const relative = path.relative(outputRoot, destination)

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Legacy redirect escapes public/: ${redirect.from}`)
  }

  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, redirectHtml(redirect.title, redirect.to), "utf8")
}

console.log(`Added ${redirects.length} legacy redirects.`)
