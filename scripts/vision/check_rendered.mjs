import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { fromHtml } from "hast-util-from-html"

// 生成 HTML 或正式网站的结构验收；不能代替语义、字体与实际排版审阅。
const root = fileURLToPath(new URL("../../", import.meta.url))
const source = path.join(root, "content/AI/Vision")
const live = process.argv.includes("--live")
const site = "https://notes.gistudio.xyz"
const all = (n, p) => [...(p(n) ? [n] : []), ...(n.children || []).flatMap(c => all(c, p))]
const txt = n => n.value ?? (n.children || []).map(txt).join("")
const has = (n, c) => (n.properties?.className || []).includes(c)
const files = fs.readdirSync(source).filter(f => f.endsWith(".md"))
const bibliography = fs.readFileSync(path.join(root, "bibliography.bib"), "utf8")
const arxivByKey = new Map([...bibliography.matchAll(/@\w+\{([^,]+),([\s\S]*?)(?=\n@|$)/g)].map(m => [m[1], m[2].match(/url\s*=\s*\{https:\/\/arxiv.org\/abs\/([\d.]+)/)?.[1]]))
assert.equal(files.length, 13, "12 篇正文和 1 个首页")
const exists = pathname => {
  const p = path.join(root, "public", decodeURIComponent(pathname))
  return [p, p + ".html", path.join(p, "index.html")].some(f => fs.existsSync(f) && fs.statSync(f).isFile())
}
const read = async route => {
  if (!live) return fs.readFileSync(path.join(root, "public", route === "/ai/vision/" ? "ai/vision/index.html" : route + ".html"), "utf8")
  const response = await fetch(site + route, { signal: AbortSignal.timeout(30000) })
  assert.equal(response.status, 200, `${route} HTTP`)
  return response.text()
}
const reports = []
const imagesToCheck = new Set()
for (const file of files) {
  const slug = file.replace(/\.md$/, "")
  const route = "/ai/vision/" + (slug === "index" ? "" : slug)
  const { data, content } = matter(fs.readFileSync(path.join(source, file), "utf8"))
  const html = await read(route)
  const tree = fromHtml(html)
  const h1 = all(tree, n => n.tagName === "h1")
  assert.equal(h1.length, 1, `${slug} H1 数量`)
  assert.equal(txt(h1[0]), data.title, `${slug} H1 标题`)
  const article = slug === "index"
    ? all(tree, n => has(n, "popover-hint") && all(n, c => c.tagName === "table").length === 1).at(-1)
    : all(tree, n => n.tagName === "article" && has(n, "popover-hint"))[0]
  assert(article, `${slug} 主体`)
  const body = txt(article)
  assert(!body.includes("[[") && !body.includes("[@"), `${slug} 残留 wikilink / citation`)
  assert.equal(all(article, n => has(n, "katex-error")).length, 0, `${slug} 数学错误`)
  const keys = new Set([...content.matchAll(/\[@([^\]]+)\]/g)].flatMap(m => m[1].split(/;\s*@/).map(s => s.trim())))
  const refs = all(article, n => has(n, "csl-entry"))
  assert.equal(refs.length, keys.size, `${slug} 自动文献数量`)
  assert(!refs.some(n => /\bothers\b/i.test(txt(n))), `${slug} 作者省略占位符未正确渲染`)
  for (const key of keys) assert(refs.some(n => n.properties?.id === `bib-${key.toLowerCase()}`), `${slug} 缺少文献 ${key}`)
  const images = all(article, n => n.tagName === "img")
  assert.equal(images.length, slug === "index" ? 0 : 2, `${slug} 图片数量`)
  const base = site + route
  for (const img of images) {
    assert(String(img.properties?.alt).length >= 8)
    const url = new URL(img.properties.src, base)
    assert(exists(url.pathname), `${slug} 缺图 ${url.pathname}`)
    imagesToCheck.add(url.pathname)
  }
  const links = all(article, n => n.tagName === "a" && n.properties?.href)
  for (const key of keys) {
    const id = arxivByKey.get(key)
    if (!id) continue
    for (const kind of ["abs", "tb"]) assert(links.some(a => a.properties.href === `https://arxiv.org/${kind}/${id}`), `${slug} 缺少 ${key} 的 ${kind} 入口`)
  }
  for (const a of links) {
    const url = new URL(a.properties.href, base)
    if (url.origin !== site || a.properties.href.startsWith("#")) continue
    assert(exists(url.pathname), `${slug} 断链 ${url.pathname}`)
  }
  if (slug === "index") {
    const rows = all(article, n => n.tagName === "tr")
    assert.equal(rows.length, 13, "首页应有表头和 12 篇阅读入口")
    const children = new Set(links.map(a => new URL(a.properties.href, base).pathname).filter(p => p.startsWith("/ai/vision/") && p !== "/ai/vision/"))
    assert.equal(children.size, 12, "首页 12 个实际文章链接")
  } else {
    assert(body.includes("参考文献"))
    assert(links.some(a => new URL(a.properties.href, base).pathname === "/ai/vision/"), `${slug} 回到专题入口`)
  }
  reports.push({ slug, references: refs.length, images: images.length, tables: all(article, n => n.tagName === "table").length, math: all(article, n => has(n, "katex-display")).length })
}
for (const route of ["/ai/", "/dl/", "/ai/llm/"]) {
  const html = live ? await (async () => { const r = await fetch(site + route); assert.equal(r.status, 200); return r.text() })() : fs.readFileSync(path.join(root, "public", route, "index.html"), "utf8")
  const base = site + route
  const links = all(fromHtml(html), n => n.tagName === "a" && n.properties?.href)
  assert(links.some(a => new URL(a.properties.href, base).pathname === "/ai/vision/"), `${route} 缺少专题入口`)
}
if (live) for (const image of imagesToCheck) {
  const r = await fetch(site + image, { signal: AbortSignal.timeout(30000) })
  assert.equal(r.status, 200, `线上图片 ${image}`)
  const svg = await r.text()
  assert(svg.includes("<svg ") && svg.includes("<title "), `图片内容 ${image}`)
}
console.log(JSON.stringify({ mode: live ? "live" : "generated-html", pages: reports.length, topicIndexes: 3, images: imagesToCheck.size, reports, limitation: "结构与 HTTP 检查；不证明研究性能或视觉排版" }, null, 2))
