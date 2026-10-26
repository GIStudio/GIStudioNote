import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"

// 只检查数量、链接、图件与教学算术；不是史实或文章质量的自动判定器。
const root = fileURLToPath(new URL("../../", import.meta.url))
const directory = path.join(root, "content/AI/Vision")
const expected = [
  "history-and-theories", "classical-features-and-geometry", "convolutional-networks",
  "detection-segmentation-and-prompts", "vision-transformers", "patches-resolution-and-tokens",
  "clip-siglip-and-alignment", "self-supervised-visual-learning", "vision-towers-and-connectors",
  "video-memory-and-world-models", "visual-systems-and-evaluation", "frontier-models-and-open-problems",
]
const partial = process.argv.includes("--partial")
const bibliography = fs.readFileSync(path.join(root, "bibliography.bib"), "utf8")
const keys = new Set([...bibliography.matchAll(/@\w+\{([^,]+),/g)].map(m => m[1]))
const reports = []
for (const slug of expected) {
  const file = path.join(directory, `${slug}.md`)
  if (!fs.existsSync(file)) { assert(partial, `缺少正文：${slug}`); continue }
  const markdown = fs.readFileSync(file, "utf8")
  assert(markdown.startsWith("---\n"), `${slug} 缺少元数据`)
  const body = markdown.replace(/^---[\s\S]*?---\n/, "").replace(/```[\s\S]*?```/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[@[^\]]*\]/g, "")
  const han = (body.match(/\p{Script=Han}/gu) || []).length
  assert(han >= 1600, `${slug} 只有 ${han} 个中文正文字符`)
  const images = [...markdown.matchAll(/!\[([^\]]+)\]\(([^)]+)\)/g)]
  assert(images.length >= 2, `${slug} 少于两幅内容图`)
  for (const [, alt, src] of images) {
    assert(alt.length >= 8, `${slug} 缺少有意义的替代文字`)
    const imageFile = path.resolve(directory, src)
    assert(imageFile.startsWith(directory + path.sep), "图件必须为本专题原创本地资源")
    assert(fs.existsSync(imageFile), `缺少图件：${src}`)
    const svg = fs.readFileSync(imageFile, "utf8")
    assert(svg.includes("<svg ") && svg.includes("<title ") && svg.includes("<desc ") && svg.includes("<text "), src)
    assert(!/<(?:script|image|foreignObject)\b/.test(svg), `${src} 存在外部或不可编辑内容`)
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])
    assert.equal(new Set(ids).size, ids.length, `${src} 存在重复 ID`)
  }
  const citations = [...markdown.matchAll(/\[@([^\]]+)\]/g)].flatMap(m => m[1].split(/;\s*@/).map(x => x.trim()))
  assert(citations.length >= 3, `${slug} 需要就近来源`)
  for (const key of citations) assert(keys.has(key), `${slug} 缺少文献：${key}`)
  const arxiv = [...markdown.matchAll(/https:\/\/arxiv\.org\/abs\/([\d.]+)/g)].map(m => m[1])
  for (const id of arxiv) assert(markdown.includes(`https://arxiv.org/tb/${id}`), `${slug} 缺少 arXiv 双链接：${id}`)
  if (!partial) assert(!/^draft:\s*true$/m.test(markdown), `${slug} 尚未转为公开正文`)
  reports.push({ slug, han, images: images.length, citations: citations.length, draft: /^draft:\s*true$/m.test(markdown) })
}

// 原创教学数值，与图文保持一致，不调用任何模型或私人数据。
assert.equal(4 * 4 * 8, 128)
assert.equal(30 / 100, .3)
assert(80 / 90 > .8)
const input = Array.from({ length: 5 }, () => [0, 0, 1, 1, 1])
const kernel = Array.from({ length: 3 }, () => [-1, 0, 1])
const response = Array.from({ length: 3 }, (_, y) => Array.from({ length: 3 }, (_, x) => kernel.reduce((s, row, r) => s + row.reduce((v, k, c) => v + k * input[y + r][x + c], 0), 0)))
assert.deepEqual(response, [[3, 3, 0], [3, 3, 0], [3, 3, 0]])
assert.equal(3 * 3 * 3 * 16, 432)
assert.equal(8 / (16 + 16 - 8), 1 / 3) // 两个面积为 16、交集为 8 的框。
assert.equal((224 / 16) ** 2, 196)
assert.equal(196 + 1, 197)
assert.equal(16 ** 2 * 3, 768)
assert.equal(256 / 4, 64) // 多头改变通道分组，不把序列长度乘以头数。
assert.equal(784 ** 2 / 196 ** 2, 16)
assert.equal((448 / 14) ** 2, 1024)
assert.equal(1024 / 4, 256)
assert.equal((224 / 14) ** 2 / 4 + 2, 66)
assert.equal(576 * 5, 2880)
assert.equal(3 * 256 - (80 + 160 + 240), 288)
assert.equal(2 * 256 - (80 + 160 + 240), 32)
const softmax = a => a.map(x => Math.exp(x) / a.reduce((s, y) => s + Math.exp(y), 0))
assert.deepEqual(softmax([2, 1, 0]).map(x => x.toFixed(3)), ["0.665", "0.245", "0.090"])
assert.deepEqual(softmax([2, 1, 0, 3]).map(x => x.toFixed(3)), ["0.237", "0.087", "0.032", "0.644"])
assert.equal(3 * (3 - 1), 6)
assert.equal(2 * (4 - 1), 6)
assert.equal(16 * .25, 4)
assert.equal(196 * .25, 49)
assert.equal(196 * .75, 147)
assert(Math.abs(.9 * 2 + .1 * 4 - 2.2) < 1e-12)
const gram = X => X.map(a => X.map(b => a.reduce((sum, x, i) => sum + x * b[i], 0)))
assert.deepEqual(gram([[1, 0], [1, 0], [0, 1]]), [[1, 1, 0], [1, 1, 0], [0, 0, 1]])
assert.deepEqual(gram([[1, 0], [1, 0], [0, 1]]), gram([[0, 1], [0, 1], [-1, 0]]))
assert.equal(1024 * 4096, 4194304)
assert.equal((4 * 4) ** 2, 256)
assert.equal(4 * 4 ** 2 + 4 * 4 ** 2, 128)
assert.equal((16 / 2) * (224 / 16) ** 2, 1568)
assert.deepEqual([400 + (300 - 0) / .5, 100 + (150 - 100) / .5], [1000, 200])
assert.equal(60 / 100, .6)
assert.equal(60 / 80, .75)
assert.equal(256 / 8, 32)
assert.equal((32 / 2) ** 2, 256)
console.log(JSON.stringify({ mode: partial ? "partial-checkpoint" : "complete-series", present: reports.length, required: expected.length, reports, teachingArithmetic: "pass", limitation: "不验证史实、证据充分性、渲染排版或线上部署" }, null, 2))
