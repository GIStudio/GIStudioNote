import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import { test } from "node:test"
import { inflateSync } from "node:zlib"
import { inlineModel, shareUrl, renderViewer, WIDGET_URL, WIDGET_SRI } from "../build_urban_ontology_embed.mjs"

const asset = new URL("../../content/assets/urban-ontology/", import.meta.url)
const model = JSON.parse(await fs.readFile(new URL("model.json", asset), "utf8"))

test("keeps the eight teaching types and resolves every edge", () => {
  assert.deepEqual(model.entityTypes.map((e) => e.name), ["Building", "Organisation", "Service", "UseAssignment", "Event", "UrbanArea", "Observation", "EvidenceRecord"])
  const entityIds = new Set(model.entityTypes.map((e) => e.id))
  const ids = new Set(entityIds)
  assert.equal(entityIds.size, 8)
  assert.equal(model.relationships.length, 10)
  for (const r of model.relationships) { assert.ok(entityIds.has(r.from)); assert.ok(entityIds.has(r.to)); assert.ok(!ids.has(r.id)); ids.add(r.id) }
  assert.equal(ids.size, 18)
  assert.ok(model.entityTypes.every((e) => e.properties.some((p) => p.isIdentifier)))
  assert.ok(!("instances" in model) && !("bindings" in model))
})

test("preserves Chinese and emoji with the actual widget atob convention", () => {
  assert.deepEqual(JSON.parse(Buffer.from(inlineModel(model), "base64").toString("latin1")), model)
  assert.match(model.entityTypes[0].description, /建筑/)
  assert.equal(model.entityTypes[0].icon, "🏛️")
})

test("share URL contains only the teaching model and empty bindings", () => {
  const url = shareUrl(model)
  const encoded = url.split("/#/share/")[1]
  assert.ok(encoded.length < 32000)
  assert.deepEqual(JSON.parse(inflateSync(Buffer.from(encoded, "base64url")).toString("utf8")), { ontology: model, bindings: [] })
})

test("time, evidence and multiple spatial definitions remain explicit", () => {
  const relation = (id) => model.relationships.find((r) => r.id === id)
  assert.deepEqual(relation("organisation_operates_service").attributes.map((a) => a.name), ["validFrom", "validTo", "endStatus"])
  assert.equal(relation("building_located_in_area").cardinality, "many-to-many")
  assert.notEqual(relation("use_supported_by_record").id, relation("event_supported_by_record").id)
  assert.ok(model.entityTypes.find((e) => e.name === "Observation").properties.some((p) => p.name === "phenomenonTime"))
})

test("wrapper confines the official widget and keeps a readable fallback", () => {
  const html = renderViewer(model, shareUrl(model))
  assert.ok(html.includes(WIDGET_URL) && html.includes(WIDGET_SRI))
  assert.match(html, /connect-src 'none'/)
  assert.match(html, /referrerPolicy = 'no-referrer'/)
  assert.match(html, /<details><summary>展开文本模型/)
  assert.match(html, /loader.onerror/)
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
  const hash = createHash("sha256").update(script).digest("base64")
  assert.ok(html.includes(`'sha256-${hash}'`))
})

test("generated assets match the source and retain distinct RDF properties", async () => {
  assert.equal(await fs.readFile(new URL("viewer.htm", asset), "utf8"), renderViewer(model, shareUrl(model)))
  const rdf = await fs.readFile(new URL("model.rdf", asset), "utf8")
  assert.equal((rdf.match(/<owl:Class rdf:about=/g) ?? []).length, 8)
  assert.equal((rdf.match(/<owl:ObjectProperty rdf:about=/g) ?? []).length, 10)
  assert.match(rdf, /use_supported_by_record/)
  assert.match(rdf, /event_supported_by_record/)
  const standards = await fs.readFile(new URL("model-standards.rdf", asset), "utf8")
  assert.ok(standards.includes("<sh:PropertyShape"), "标准导出应包含 SHACL 属性形状")
  assert.match(standards, /organisation_operates_service/)
})

test("article embeds the isolated viewer and exposes all three model files", async () => {
  const article = await fs.readFile(new URL("../../content/Philosophy/urban-science-ontology.md", import.meta.url), "utf8")
  const iframe = article.match(/<iframe\b[^>]*>/)?.[0]
  assert.ok(iframe?.includes('src="https://notes.gistudio.xyz/assets/urban-ontology/viewer.htm"'))
  assert.ok(iframe.includes('title="城市科学本体交互图谱：八类教学模型"'))
  assert.ok(iframe.includes('sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads"'))
  assert.ok(!iframe.includes("allow-same-origin"))
  for (const name of ["model.json", "model.rdf", "model-standards.rdf"]) {
    assert.ok(article.includes(`href="/assets/urban-ontology/${name}" download data-router-ignore`))
  }
})
