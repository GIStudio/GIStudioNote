import assert from "node:assert/strict"
import fs from "node:fs/promises"

// Chen et al. (2020), Table 3, PDF p.7. Reported test accuracy (%).
// https://proceedings.mlr.press/v119/chen20v/chen20v.pdf#page=7
const layers = [2, 4, 8, 16, 32, 64]
const data = [
  { name: "Cora", GCN: [81.1, 80.4, 69.5, 64.9, 60.3, 28.7], GCNII: [82.2, 82.6, 84.2, 84.6, 85.4, 85.5] },
  { name: "Citeseer", GCN: [70.8, 67.6, 30.2, 18.3, 25.0, 20.0], GCNII: [68.2, 68.9, 70.6, 72.9, 73.4, 73.4] },
  { name: "Pubmed", GCN: [79.0, 76.5, 61.2, 40.9, 22.4, 35.3], GCNII: [78.2, 78.8, 79.3, 80.2, 79.8, 79.7] },
]

// Metis journal 0.3.0 palette and redundant encodings, with webpage SVG
// sizing. Panel labels below axes; overall caption is in the article.
const styles = [
  { name: "GCN", color: "#D55E00", dash: ' stroke-dasharray="11 8"', mark: "square" },
  { name: "GCNII", color: "#0072B2", dash: "", mark: "circle" },
]
const ink = "#1A1A1A"
const panelWidth = 260
const plotTop = 32
const plotBottom = 292
const y = value => plotBottom - value * (plotBottom - plotTop) / 100
const x = (depth, origin) => origin + Math.log2(depth / layers[0]) * panelWidth / 5
const label = (x, y, value, size = 23, anchor = "middle", weight = 400) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}">${value}</text>`
const mark = (x, y, style, inside = "") => style.mark === "circle"
  ? `<circle cx="${x}" cy="${y}" r="5.7" fill="${style.color}">${inside}</circle>`
  : `<rect x="${x - 5.3}" y="${y - 5.3}" width="10.6" height="10.6" fill="#FFFFFF" stroke="${style.color}" stroke-width="2.8">${inside}</rect>`

function panel(dataset, index) {
  const origin = 98 + index * 310
  let svg = `<g id="panel-${dataset.name.toLowerCase()}">`
  for (const tick of [0, 25, 50, 75, 100]) {
    svg += `<line x1="${origin}" x2="${origin + panelWidth}" y1="${y(tick)}" y2="${y(tick)}" stroke="#D9DEE4" stroke-width="1.4"/>`
    if (index === 0) svg += label(origin - 13, y(tick) + 7, tick, 22, "end")
  }
  svg += `<path d="M${origin} ${plotTop}V${plotBottom}H${origin + panelWidth}" fill="none" stroke="${ink}" stroke-width="1.8"/>`
  for (const depth of layers) {
    const xpos = x(depth, origin)
    svg += `<line x1="${xpos}" x2="${xpos}" y1="${plotBottom}" y2="${plotBottom + 6}" stroke="${ink}" stroke-width="1.8"/>`
    svg += label(xpos, 323, depth, 22)
  }
  for (const style of styles) {
    const values = dataset[style.name]
    assert.equal(values.length, layers.length)
    assert.ok(values.every(value => Number.isFinite(value) && value >= 0 && value <= 100))
    const positions = values.map((value, i) => [x(layers[i], origin), y(value)])
    svg += `<g id="${dataset.name.toLowerCase()}-${style.name.toLowerCase()}"><polyline points="${positions.map(p => p.join(",")).join(" ")}" fill="none" stroke="${style.color}" stroke-width="3.7" stroke-linejoin="round"${style.dash}/>`
    svg += positions.map(([x, y], i) => mark(x, y, style, `<title>${dataset.name}, ${style.name}, ${layers[i]} layers: ${values[i].toFixed(1)}%</title>`)).join("")
    svg += "</g>"
  }
  return svg + label(origin + panelWidth / 2, 355, dataset.name, 25, "middle", 650) + "</g>"
}

const legend = styles.map((style, i) => {
  const x = 342 + i * 169
  return `<line x1="${x}" x2="${x + 57}" y1="419" y2="419" stroke="${style.color}" stroke-width="3.7"${style.dash}/>`
    + mark(x + 28.5, 419, style) + label(x + 69, 427, style.name, 24, "start")
}).join("")
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1010" height="449" viewBox="0 0 1010 449" role="img" aria-labelledby="title description">
<title id="title">GCN 与 GCNII：网络深度和测试准确率</title>
<desc id="description">来自 Chen 等人 2020 年论文表 3 的重绘。Cora、Citeseer 和 Pubmed 三个半监督节点分类数据集使用相同的 0–100% 纵轴；比较 2、4、8、16、32、64 层。蓝色实线圆点是 GCNII，橙色虚线方点是 GCN。</desc>
<rect width="1010" height="449" fill="#FFFFFF"/>
<g font-family="Helvetica, Arial, 'PingFang SC', 'Noto Sans CJK SC', sans-serif" fill="${ink}">
<g transform="translate(27 162) rotate(-90)">${label(0, 0, "测试准确率（%）", 23)}</g>
${data.map(panel).join("\n")}
${label(538, 387, "网络层数（每格翻倍）", 23)}
<g id="legend">${legend}</g>
</g>
</svg>
`

const output = new URL("../../content/Graph/assets/gcnii-depth.svg", import.meta.url)
await fs.mkdir(new URL(".", output), { recursive: true })
await fs.writeFile(output, svg)
