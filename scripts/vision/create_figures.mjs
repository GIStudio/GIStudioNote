import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

// 本专题原创教学图；参数是示意构造，不是模型实验或他人论文图的描摹。
const root = fileURLToPath(new URL("../../", import.meta.url))
const output = path.join(root, "content/AI/Vision/assets")
const preview = process.argv[2] || "/private/tmp/gistudio-vision-previews"
const C = { ink: "#20334d", muted: "#53667b", teal: "#167477", light: "#e5f2f0", blue: "#526eaa", pale: "#e9eef8", orange: "#bc632d", sand: "#fff0df", red: "#b3484b", line: "#ced9e1", white: "#ffffff" }
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
const rect = (x, y, w, h, fill = C.white, stroke = C.line, r = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`
const text = (x, y, lines, size = 25, fill = C.ink, anchor = "start", weight = 400) => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${(Array.isArray(lines) ? lines : [lines]).map((l, i) => `<tspan x="${x}" dy="${i ? Math.round(size * 1.4) : 0}">${esc(l)}</tspan>`).join("")}</text>`
const line = (x1, y1, x2, y2, color = C.muted, dashed = false, arrow = true) => `<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="${color}" stroke-width="3"${dashed ? ' stroke-dasharray="9 7"' : ""}${arrow ? ' marker-end="url(#arrow)"' : ""}/>`
const circle = (x, y, r, fill, stroke = fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`
function canvas(title, desc, body, height = 620) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img" aria-labelledby="title description"><title id="title">${esc(title)}</title><desc id="description">${esc(desc)}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="context-stroke"/></marker></defs><g font-family="'PingFang SC','Noto Sans CJK SC',Arial,sans-serif">${rect(1, 1, 998, height - 2, "#fafcfd", C.line, 18)}${text(36, 52, title, 29, C.ink, "start", 650)}${body}</g></svg>`
}
const figures = new Map()

// 用四组角点解八个自由度，让示意中的每条绿色连线确实支持同一单应。
function homography(source, target) {
  const rows = []
  source.forEach(([x, y], i) => {
    const [u, v] = target[i]
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v])
  })
  for (let c = 0; c < 8; c++) {
    let pivot = c
    for (let r = c + 1; r < 8; r++) if (Math.abs(rows[r][c]) > Math.abs(rows[pivot][c])) pivot = r
    ;[rows[c], rows[pivot]] = [rows[pivot], rows[c]]
    const divisor = rows[c][c]
    if (Math.abs(divisor) < 1e-10) throw new Error("示意角点退化")
    rows[c] = rows[c].map(v => v / divisor)
    for (let r = 0; r < 8; r++) if (r !== c) {
      const factor = rows[r][c]
      rows[r] = rows[r].map((v, i) => v - factor * rows[c][i])
    }
  }
  const h = [...rows.map(row => row[8]), 1]
  return ([x, y]) => {
    const z = h[6] * x + h[7] * y + 1
    return [(h[0] * x + h[1] * y + h[2]) / z, (h[3] * x + h[4] * y + h[5]) / z]
  }
}

{
  const items = [
    ["1966", "视觉任务的拆分", "图地分离 · 描述 · 识别"],
    ["1982", "Marr 的分析框架", "目标 · 算法 · 实现"],
    ["2004–2005", "局部描述的设计", "SIFT 匹配 · HOG 检测"],
    ["2012", "大规模学习表示", "AlexNet · GPU · 分类"],
    ["2020–2021", "架构与监督的扩展", "ViT · CLIP"],
    ["2025–2026", "表示进入组合系统", "编码器 · 语言 · 工具"],
  ]
  let body = ""
  items.forEach(([year, title, label], i) => {
    const x = 35 + (i % 3) * 320, y = 95 + Math.floor(i / 3) * 220
    body += `<g id="milestone-${i + 1}">${rect(x, y, 290, 175, i < 3 ? C.light : C.pale)}${text(x + 22, y + 40, year, 29, C.teal, "start", 650)}${text(x + 22, y + 86, title, 25, C.ink, "start", 600)}${text(x + 22, y + 132, label, 20, C.muted)}</g>`
    if (i % 3 < 2) body += line(x + 292, y + 90, x + 317, y + 90)
  })
  body += text(40, 568, "代表性节点；旧方法与新方法长期共存，不是淘汰名单。", 23, C.muted)
  figures.set("history-timeline", canvas("视觉史：任务、表示与接口一起变化", "两行时间节点，区分研究任务、分析框架、特征、架构与系统接口。", body))
}

{
  const rows = [
    ["计算目标", "为什么计算", ["估计桌面朝向", "为放置物体提供依据"], C.light],
    ["表示与算法", "怎样计算", ["选择图像证据与中间表示", "用几何或学习方法估计"], C.pale],
    ["物理实现", "在哪里实现", ["相机、处理器与内存", "传感、执行及运行约束"], C.sand],
  ]
  let body = text(38, 97, "同一任务：从照片估计桌面方向", 24, C.muted)
  rows.forEach(([name, question, examples, fill], i) => {
    const y = 130 + i * 132
    body += `<g id="level-${i + 1}">${rect(36, y, 928, 112, fill)}${text(58, y + 42, name, 27, C.ink, "start", 600)}${text(58, y + 81, question, 23, C.muted)}${text(320, y + 40, examples, 24)}</g>`
  })
  body += text(40, 573, "三个分析层次，不是依次经过的三个处理模块。", 24, C.muted)
  figures.set("history-levels", canvas("Marr 的层次：三个问题，同一个系统", "无流程箭头的三个平行分析层次，以及每个层次对应的桌面方向估计问题。", body))
}

{
  let body = text(38, 103, "SIFT：关键点附近的空间 × 方向统计", 26, C.teal, "start", 600)
  const x = 45, y = 135, s = 40
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    body += rect(x + c * s, y + r * s, s, s, (r + c) % 2 ? C.light : C.white, C.line, 0)
    body += line(x + c * s + 9, y + r * s + 28, x + c * s + 28, y + r * s + 10, C.teal, false, true)
  }
  body += circle(125, 215, 6, C.orange)
  body += line(230, 215, 290, 215)
  for (let b = 0; b < 8; b++) body += rect(310 + b * 18, 268 - [37, 57, 83, 112, 69, 43, 29, 18][b], 13, [37, 57, 83, 112, 69, 43, 29, 18][b], C.teal, C.teal, 0)
  body += text(495, 188, ["16 个空间单元", "每个单元 8 个方向桶", "展开为 128 维描述子"], 24)
  body += line(35, 318, 965, 318, C.line, false, false)
  body += text(38, 363, "HOG：规则窗口中的密集梯度汇总", 26, C.blue, "start", 600)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
    body += rect(45 + c * 33, 393 + r * 39, 33, 39, C.pale, C.line, 0)
    body += line(51 + c * 33, 421 + r * 39, 70 + c * 33, 403 + r * 39, C.blue)
  }
  body += rect(43, 391, 68, 80, "none", C.orange, 0)
  body += line(230, 450, 295, 450)
  body += rect(320, 395, 240, 118, C.pale)
  body += text(440, 435, ["重叠块归一化", "窗口描述向量"], 24, C.ink, "middle")
  body += line(575, 450, 630, 450)
  body += text(650, 435, ["线性分类器", "行人 / 非行人"], 24)
  body += text(40, 573, "柱高与网格仅示意组织方式，不是实测特征响应。", 23, C.muted)
  figures.set("classical-descriptors", canvas("梯度相同，组织方式与用途不同", "上部展示 SIFT 局部网格和方向直方图，下部展示 HOG 密集窗口及分类。", body))
}

{
  let body = text(45, 104, "图 A：平面对象", 25, C.teal, "start", 600) + text(565, 104, "图 B：同一对象的另一视图", 25, C.teal, "start", 600)
  body += `<g id="views">${rect(45, 130, 300, 340, C.white)}${rect(565, 130, 390, 340, C.white)}<path d="M90,180 L300,180 L300,410 L90,410 Z" fill="${C.light}" stroke="${C.teal}" stroke-width="3"/><path d="M630,170 L895,205 L850,430 L600,380 Z" fill="${C.pale}" stroke="${C.blue}" stroke-width="3"/></g>`
  const project = homography([[90, 180], [300, 180], [300, 410], [90, 410]], [[630, 170], [895, 205], [850, 430], [600, 380]])
  const pairs = [[110, 205], [275, 205], [110, 385], [275, 385], [190, 245], [190, 345]].map(p => [...p, ...project(p)])
  pairs.forEach(([a, b, c, d], i) => { body += `<g id="inlier-${i}">${line(a, b, c, d, C.teal, false, false)}${circle(a, b, 7, C.teal)}${circle(c, d, 7, C.teal)}</g>` })
  body += `<g id="outlier">${line(190, 300, 925, 150, C.red, true, false)}${circle(190, 300, 7, C.red)}${circle(925, 150, 7, C.red)}</g>`
  body += line(55, 515, 115, 515, C.teal, false, false) + text(135, 523, "一致对应：支持同一几何模型", 24)
  body += line(55, 560, 115, 560, C.red, true, false) + text(135, 568, "错误候选：外观筛选后仍需几何检验", 24)
  figures.set("classical-matches", canvas("匹配以后，还要问几何是否一致", "构造的平面匹配示意：六对绿色内点与一对红色错误对应；不是算法运行结果。", body))
}

function matrix(x, y, values, cell = 48, mode = "input") {
  return values.map((row, r) => row.map((v, c) => {
    const fill = mode === "output" ? (v ? C.sand : C.white) : mode === "kernel" ? C.pale : (v ? C.light : C.white)
    return rect(x + c * cell, y + r * cell, cell, cell, fill, C.line, 0) + text(x + c * cell + cell / 2, y + r * cell + cell * .67, v, 27, C.ink, "middle")
  }).join("")).join("")
}
{
  let body = text(50, 112, "输入 5 × 5", 26, C.teal, "start", 600)
  body += matrix(50, 145, Array.from({ length: 5 }, () => [0, 0, 1, 1, 1]))
  body += rect(49, 144, 146, 146, "none", C.orange, 0)
  body += text(410, 112, "核 3 × 3", 26, C.blue, "start", 600)
  body += matrix(410, 145, Array.from({ length: 3 }, () => [-1, 0, 1]), 48, "kernel")
  body += text(705, 112, "输出 3 × 3", 26, C.orange, "start", 600)
  body += matrix(705, 145, Array.from({ length: 3 }, () => [3, 3, 0]), 65, "output")
  body += line(313, 240, 375, 240) + line(570, 240, 668, 240)
  body += text(410, 355, ["同一组权重", "在所有位置复用"], 24, C.muted)
  body += text(52, 452, "最左侧响应：3 × (−1 × 0 + 0 × 0 + 1 × 1) = 3", 26)
  body += text(52, 510, "步幅 1；不补边；核不翻转，按互相关计算。", 24, C.muted)
  body += text(52, 565, "教学像素与固定滤波器，不是训练所得模型。", 24, C.muted)
  figures.set("cnn-convolution", canvas("局部加权求和，得到空间响应图", "五乘五教学输入与固定核计算得到三乘三输出，三行均为三、三、零。", body))
}

{
  let body = text(40, 106, "输入 x 与残差 F(x) 形状相同时，才能逐元素相加。", 25, C.muted)
  body += `<g id="input">${rect(42, 265, 158, 96, C.light)}${text(121, 324, "输入 x", 29, C.teal, "middle", 600)}</g>`
  body += `<g id="residual-branch">${line(205, 313, 290, 313, C.blue)}${rect(300, 252, 315, 122, C.pale)}${text(458, 302, ["可训练变换", "F(x)"], 27, C.ink, "middle")}${line(623, 313, 702, 313, C.blue)}</g>`
  body += `<g id="identity-branch"><path d="M230,313 L230,180 L730,180 L730,280" fill="none" stroke="${C.teal}" stroke-width="4" marker-end="url(#arrow)"/>${text(480, 161, "恒等路径 x", 26, C.teal, "middle")}</g>`
  body += `<g id="addition">${circle(730, 313, 31, C.white, C.ink)}${text(730, 323, "+", 35, C.ink, "middle")}${line(765, 313, 820, 313)}${rect(833, 265, 128, 96, C.sand)}${text(897, 324, "输出 y", 28, C.orange, "middle", 600)}</g>`
  body += text(45, 455, "y = x + F(x)", 34, C.ink, "start", 600)
  body += text(45, 512, ["若通道数或空间尺寸变化：先匹配两路形状。", "维度匹配可能需要投影；捷径不是任意数组的直接相加。"], 24, C.muted)
  figures.set("cnn-residual", canvas("残差块：保留一条直接传递路径", "输入分为恒等和可训练两个分支，形状兼容后在加法节点合并。", body))
}

await fs.mkdir(output, { recursive: true })
await fs.mkdir(preview, { recursive: true })
for (const [name, svg] of figures) {
  await fs.writeFile(path.join(output, `${name}.svg`), svg + "\n")
  await sharp(Buffer.from(svg)).png().toFile(path.join(preview, `${name}.png`))
}
const tiles = []
let i = 0
for (const name of figures.keys()) {
  const input = await sharp(path.join(preview, `${name}.png`)).resize(640).png().toBuffer()
  tiles.push({ input, left: (i % 2) * 640, top: Math.floor(i / 2) * 397 })
  i++
}
await sharp({ create: { width: 1280, height: Math.ceil(i / 2) * 397, channels: 4, background: "#ffffff" } }).composite(tiles).png().toFile(path.join(preview, "overview.png"))
console.log(JSON.stringify({ figures: figures.size, svgDirectory: output, previewDirectory: preview, data: "original teaching constructions" }))
