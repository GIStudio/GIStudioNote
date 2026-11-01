// 根据公开的八类教学模型生成官方 Playground 嵌入页与 RDF 文件。
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { deflateSync } from "node:zlib"
import { transform } from "esbuild"

export const SOURCE_COMMIT = "7bf7acb427424ce68f917fa26f484fb06ca42051"
export const WIDGET_URL = "https://microsoft.github.io/Ontology-Playground/embed/ontology-embed.js"
export const WIDGET_SRI = "sha384-jxOdic4BZcUrSImy1SxNeYRHvn7WPt51bq+6IQRa0xjhwJRBtcpzvtm7Aw4pQi5N"
const root = fileURLToPath(new URL("../", import.meta.url))
const output = path.join(root, "content/assets/urban-ontology")
const pinnedFiles = {
  "src/lib/ontologySchema.ts": "177579ef45edeff2d6338b1b98279751dccbae87c8d114adbb5c590c0957e31c",
  "src/lib/ontologyValidation.ts": "eda52cc2a2aa43e38a2068e9f66e7d7e75b2051f92c05d1acc27ffba8e9b69d0",
  "src/lib/rdf/serializer.ts": "b3f0ab80af75600e6ef0b852161d2919149999c96d3535e60be97c405963b22a",
  "src/lib/shareCodec.ts": "996e5d811519bf12e6bfa6388da48e864366950a08f5aff394f299c829da5a0a",
}

export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])
export const inlineModel = (model) => Buffer.from(JSON.stringify(model).replace(/[^\x00-\x7f]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")), "ascii").toString("base64")
export const shareUrl = (model) => "https://microsoft.github.io/Ontology-Playground/#/share/" + deflateSync(Buffer.from(JSON.stringify({ ontology: model, bindings: [] }), "utf8")).toString("base64url")

async function loadPinnedModule(upstream, relative) {
  const source = await fs.readFile(path.join(upstream, relative), "utf8")
  assert.equal(createHash("sha256").update(source).digest("hex"), pinnedFiles[relative], `上游文件版本不匹配：${relative}`)
  const { code, warnings } = await transform(source, { loader: "ts", format: "esm", target: "es2022" })
  assert.equal(warnings.length, 0)
  return import("data:text/javascript;base64," + Buffer.from(code).toString("base64"))
}

export function renderViewer(model, link) {
  const entityText = model.entityTypes.map((e) => `<section><h3>${escapeHtml(e.name)}</h3><p>${escapeHtml(e.description)}</p><dl>${e.properties.map((p) => `<dt>${escapeHtml(p.name)} <small>${escapeHtml(p.type)}</small></dt><dd>${escapeHtml(p.description ?? "")}${p.values ? ` 可选值：${p.values.map(escapeHtml).join("、")}` : ""}</dd>`).join("")}</dl></section>`).join("")
  const relationText = model.relationships.map((r) => `<li><strong>${escapeHtml(r.name)}</strong>：${escapeHtml(r.from)} → ${escapeHtml(r.to)}；${escapeHtml(r.cardinality)}。${escapeHtml(r.description ?? "")}${r.attributes ? ` 关系属性：${r.attributes.map((a) => `${escapeHtml(a.name)} (${escapeHtml(a.type)})`).join("、")}` : ""}</li>`).join("")
  const bootstrap = `const host = document.querySelector('.ontology-embed');
const loader = document.createElement('script');
loader.src = ${JSON.stringify(WIDGET_URL)};
loader.integrity = ${JSON.stringify(WIDGET_SRI)};
loader.crossOrigin = 'anonymous';
loader.referrerPolicy = 'no-referrer';
loader.onerror = () => { host.textContent = '图谱部件未能加载。请使用下方文本模型或下载文件；网络、校验或浏览器限制均可能导致此情况。'; host.setAttribute('role', 'alert'); };
document.head.append(loader);`
  const scriptHash = createHash("sha256").update(bootstrap).digest("base64")
  return `<!doctype html>
<!-- 由 scripts/build_urban_ontology_embed.mjs 生成；模型源为同目录 model.json。.htm 保留静态文件后缀。 -->
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${scriptHash}' ${WIDGET_URL}; style-src 'unsafe-inline'; img-src data: blob:; worker-src blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer"><title>城市科学本体交互图谱</title>
<style>
:root{color-scheme:light;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#172332;background:#fff}
*{box-sizing:border-box}body{margin:0;padding:14px 16px;line-height:1.6}header{display:flex;align-items:start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:10px}h1{font-size:19px;margin:0}p{margin:4px 0 8px;font-size:14px;color:#425269}nav{display:flex;gap:8px;flex-wrap:wrap}a{color:#155782;text-underline-offset:3px}nav a{border:1px solid #b7c9d5;border-radius:6px;padding:5px 10px;font-size:14px;text-decoration:none;background:#fff}a:focus-visible,summary:focus-visible{outline:3px solid #d28a15;outline-offset:3px}.ontology-embed{min-height:480px;border:1px solid #c6d2dc;border-radius:8px;overflow:hidden}details{margin-top:12px}summary{cursor:pointer;font-size:15px;font-weight:600}h2{font-size:18px}h3{font-size:16px;margin:12px 0 4px}section{padding:8px 0;border-top:1px solid #dbe2e8}dl{display:grid;grid-template-columns:180px 1fr;gap:5px 12px;font-size:14px}dt{font-weight:600;overflow-wrap:anywhere}dd{margin:0}small{font-weight:400;color:#52637a}li{margin-bottom:7px;font-size:14px}footer{margin-top:9px;font-size:13px;color:#52637a}.fallback{padding:22px}
</style></head><body>
<header><div><h1>城市科学本体 · 教学类型模型</h1><p>${model.entityTypes.length} 类 · ${model.relationships.length} 条关系；仅有类型与属性定义，没有真实城市实例。</p></div>
<nav aria-label="模型文件与编辑入口"><a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">在 Playground 中编辑 ↗</a><a href="model.rdf" target="_blank" rel="noopener">RDF/XML</a><a href="model-standards.rdf" target="_blank" rel="noopener">OWL + SHACL</a><a href="model.json" target="_blank" rel="noopener">JSON</a></nav></header>
<p>拖动背景平移视图，滚轮缩放；点击节点／连线查看中文解释。字段的完整说明也可在下方文本模型中阅读。</p>
<div class="ontology-embed" data-ontology-inline="${inlineModel(model)}" data-theme="light" data-height="calc(100vh - 170px)"><p class="fallback">正在载入官方图谱部件。若未能显示，可继续使用文本模型与文件入口。</p></div>
<details><summary>展开文本模型与字段说明（键盘可读）</summary><h2>类型与属性</h2>${entityText}<h2>关系与时间条件</h2><ul>${relationText}</ul></details>
<footer>图谱使用 <a href="https://github.com/microsoft/Ontology-Playground" target="_blank" rel="noopener noreferrer">Microsoft Ontology Playground</a> 官方嵌入部件（MIT）。浏览器需加载微软官方脚本；模型内联于此页，未配置数据源或生成接口。关系必填性、OWL 推理及 SHACL 实例校验需另行处理。</footer>
<noscript><p>当前浏览器未启用 JavaScript，可展开文本模型或打开模型文件。</p></noscript>
<script>${bootstrap}</script></body></html>
`
}

export async function build(upstream) {
  const model = JSON.parse(await fs.readFile(path.join(output, "model.json"), "utf8"))
  const schema = await loadPinnedModule(upstream, "src/lib/ontologySchema.ts")
  const validation = await loadPinnedModule(upstream, "src/lib/ontologyValidation.ts")
  const serializer = await loadPinnedModule(upstream, "src/lib/rdf/serializer.ts")
  const codec = await loadPinnedModule(upstream, "src/lib/shareCodec.ts")
  assert.deepEqual(schema.parseOntologyValue(model).issues, [])
  assert.deepEqual(validation.validateGeneratedOntology(model), [])
  const link = shareUrl(model)
  const encoded = link.split("/#/share/")[1]
  assert.ok(encoded.length <= codec.MAX_SHARE_URL_LENGTH)
  assert.deepEqual(await codec.decodeSharePayload(encoded), { ontology: model, bindings: [] })
  assert.deepEqual(JSON.parse(Buffer.from(inlineModel(model), "base64").toString("latin1")), model)
  await fs.writeFile(path.join(output, "model.rdf"), serializer.serializeToRDF(model, [], { profile: "playground" }))
  await fs.writeFile(path.join(output, "model-standards.rdf"), serializer.serializeToRDF(model, [], { profile: "standards" }))
  await fs.writeFile(path.join(output, "viewer.htm"), renderViewer(model, link))
  const manifest = { sourceCommit: SOURCE_COMMIT, widgetUrl: WIDGET_URL, widgetIntegrity: WIDGET_SRI, entities: model.entityTypes.length, properties: model.entityTypes.reduce((n, e) => n + e.properties.length, 0), relationships: model.relationships.length, shareUrl: link, checks: ["official schema", "official Designer validation", "official share decoder", "ASCII inline Unicode round-trip"], browserChecked: false }
  await fs.writeFile(path.join(output, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
  console.log(JSON.stringify({ entities: manifest.entities, properties: manifest.properties, relationships: manifest.relationships, shareCharacters: encoded.length, checks: manifest.checks }))
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const index = process.argv.indexOf("--upstream")
  if (index < 0 || !process.argv[index + 1]) throw new Error(`需要 --upstream 指向公开源码 ${SOURCE_COMMIT} 的解压目录或检出目录`)
  await build(path.resolve(process.argv[index + 1]))
}
