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
  // 部署构建在 Linux（大小写敏感 FS）上进行：Quartz 真实页面在小写路径，
  // 重定向必须写到小写路径，否则旧 URL 会 404。
  {
    from: "dev/dsh-plugin-python.html",
    to: "/dev/dsh/dsh-plugin-python",
    title: "DSH 插件能不能用 Python 写",
  },
  {
    from: "dsh/index.html",
    to: "/dev/dsh/",
    title: "DSH 专题",
  },
  {
    from: "dsh/dsh-plugin-python.html",
    to: "/dev/dsh/dsh-plugin-python",
    title: "DSH 插件能不能用 Python 写",
  },
  {
    from: "dsh/dsh-plugin-publishing-pitfalls.html",
    to: "/dev/dsh/dsh-plugin-publishing-pitfalls",
    title: "第一次发布 DSH 插件，我踩了这五个坑",
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
