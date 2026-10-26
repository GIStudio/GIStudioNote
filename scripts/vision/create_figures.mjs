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

function cup(x, y, fill = C.light, stroke = C.teal) {
  return `<g transform="translate(${x},${y})"><path d="M0,0 L58,0 L53,55 Q29,70 5,55 Z" fill="${fill}" stroke="${stroke}" stroke-width="3"/><path d="M58,9 C88,4 88,47 55,45" fill="none" stroke="${stroke}" stroke-width="5"/></g>`
}

{
  let body = ""
  const panels = [["分类", "是否存在杯子", 35, 100], ["检测", "每个对象一个位置框", 520, 100], ["语义分割", "杯子像素共用类别", 35, 350], ["实例分割", "区分杯子 A 与杯子 B", 520, 350]]
  panels.forEach(([title, label, x, y], i) => {
    body += `<g id="task-${i}">${rect(x, y, 445, 210)}${text(x + 18, y + 35, title, 27, C.ink, "start", 600)}${text(x + 18, y + 183, label, 22, C.muted)}`
    const fill1 = i === 2 ? C.blue : i === 3 ? C.teal : C.light
    const fill2 = i === 2 ? C.blue : i === 3 ? C.orange : C.light
    body += cup(x + 80, y + 72, fill1) + cup(x + 263, y + 72, fill2)
    if (i === 1) body += rect(x + 71, y + 62, 99, 83, "none", C.teal, 0) + rect(x + 254, y + 62, 99, 83, "none", C.teal, 0)
    if (i === 3) body += text(x + 70, y + 143, "A", 24, C.teal) + text(x + 253, y + 143, "B", 24, C.orange)
    body += "</g>"
  })
  body += text(38, 597, "同一场景，不同输出目标；颜色示意，不是模型推理结果。", 23, C.muted)
  figures.set("dense-outputs", canvas("输出问题变了，模型的责任也变了", "同一双杯场景在分类、框检测、语义与实例分割中的四种输出。", body))
}

{
  let body = cup(75, 140) + text(75, 250, "图像", 25, C.teal)
  body += line(190, 175, 290, 175) + rect(310, 115, 265, 125, C.pale) + text(443, 160, ["较重的图像编码", "每张图计算一次"], 26, C.ink, "middle")
  body += line(590, 175, 670, 175) + rect(690, 115, 270, 125, C.light) + text(825, 160, ["缓存图像特征", "供多轮提示读取"], 26, C.ink, "middle")
  body += rect(40, 365, 235, 120, C.sand) + text(158, 410, ["目标提示", "点 / 框 / mask"], 25, C.ink, "middle")
  body += line(282, 425, 385, 425) + rect(400, 365, 245, 120, C.pale) + text(523, 412, ["轻量掩码解码", "图像 + 本轮提示"], 25, C.ink, "middle")
  body += `<path d="M825,246 L825,305 L523,305 L523,359" fill="none" stroke="${C.teal}" stroke-width="3" marker-end="url(#arrow)"/>`
  body += line(655, 425, 745, 425) + cup(785, 387, C.teal) + text(782, 483, "候选掩码", 24, C.teal)
  body += text(40, 553, ["提示改变：重新解码；图像改变：不能沿用旧图的特征。", "这里的复用关系不等同于已经确认了目标的语义身份。"], 23, C.muted)
  figures.set("dense-prompting", canvas("提示分割：复用图像编码，更新目标选择", "图像编码被缓存，与每次更新的点框提示共同进入掩码解码器。", body))
}

{
  let body = text(42, 105, "切块是空间采样，不是物体识别。", 25, C.muted)
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) body += rect(45 + c * 45, 150 + r * 45, 45, 45, [C.light, C.pale, C.sand, "#f3e9ec"][r], C.line, 0)
  body += text(45, 372, "小例子：4 × 4 个 patch", 23, C.muted)
  body += line(240, 242, 300, 242)
  body += rect(320, 157, 155, 170, C.sand) + text(397, 205, ["每块展平", "P² × C", "个像素数值"], 24, C.ink, "middle")
  body += line(490, 242, 550, 242) + rect(570, 157, 140, 170, C.pale) + text(640, 205, ["共享投影", "D 维", "向量"], 24, C.ink, "middle")
  body += line(725, 242, 770, 242)
  for (let r = 0; r < 16; r++) body += rect(798, 135 + r * 14, 140, 12, r % 2 ? C.light : C.pale, "none", 0)
  body += text(785, 395, "16 × D 序列", 24)
  body += rect(40, 435, 920, 145, C.white) + text(65, 473, ["224 × 224 RGB；P = 16；教学 D = 256", "196 个 patch → 每块 768 维 → 196 × 256 表示", "再加入 class token：197 × 256；位置表示另行加入。"], 25)
  figures.set("vit-patches", canvas("ViT 的三个数量：块数、原始维数、隐藏维数", "四乘四教学网格通过展平和共享投影进入序列，附常见图像尺寸的独立算例。", body))
}

{
  let body = text(65, 110, "规则窗口", 27, C.teal, "start", 600) + text(575, 110, "强调一个移位窗口", 27, C.orange, "start", 600)
  const s = 34
  for (const x of [70, 585]) for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    body += rect(x + c * s, 155 + r * s, s, s, [C.light, C.pale, C.sand, "#f3e9ec"][Math.floor(r / 4) * 2 + Math.floor(c / 4)], C.line, 0)
  }
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) body += rect(70 + c * s * 4, 155 + r * s * 4, 136, 136, "none", C.teal, 0)
  body += rect(585 + 2 * s, 155 + 2 * s, 136, 136, "none", C.orange, 0)
  body += line(385, 285, 530, 285) + text(450, 250, "下一块", 23, C.muted, "middle")
  body += text(65, 475, "窗口内通信", 25, C.teal) + text(575, 475, "跨越原先四个窗口的边界", 24, C.orange)
  body += text(40, 548, ["8 × 8 教学网格；只画中央移位窗口，其余移位窗口省略。", "实际边缘还需 mask；跨窗信息逐层传播，不是一步全局化。"], 23, C.muted)
  figures.set("vit-windows", canvas("Swin：改变窗口边界，让局部之间交换信息", "两个相同网格，右侧中央窗口跨越左侧的四个规则窗口，边缘实现未显示。", body))
}

{
  let body = text(42, 105, "上部：裁块与 patch 处于不同层级", 26, C.teal, "start", 600)
  body += rect(42, 153, 230, 65, C.light, C.teal, 0)
  for (let i = 0; i < 6; i++) body += line(55, 164 + i * 8, 260 - i * 7, 164 + i * 8, C.teal, false, false)
  body += text(42, 273, "一张原始长图", 24)
  body += line(285, 190, 340, 190)
  for (let i = 0; i < 2; i++) body += rect(360 + i * 130, 142, 112, 100, i ? C.sand : C.pale)
  body += text(360, 273, "产生多幅局部视图", 24)
  body += line(620, 190, 675, 190)
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) body += rect(703 + c * 43, 126 + r * 32, 43, 32, (r + c) % 2 ? C.light : C.white, C.line, 0)
  body += text(703, 293, ["每幅图内部", "再做 patch embedding"], 23)
  body += line(35, 347, 965, 347, C.line, false, false)
  body += text(42, 389, "下部：独立的单视图计数例子", 26, C.blue, "start", 600)
  const labels = [["448 × 448", "14 × 14 patch"], ["编码器处理", "1024 个位置"], ["2 × 2 合并后", "256 个内容 token"]]
  labels.forEach((l, i) => { body += rect(40 + i * 325, 423, 270, 110, [C.light, C.pale, C.sand][i]) + text(175 + i * 325, 465, l, 25, C.ink, "middle"); if (i < 2) body += line(320 + i * 325, 478, 354 + i * 325, 478) })
  body += text(40, 582, "编码后压缩不会撤销编码器已经付出的计算。", 24, C.muted)
  figures.set("patch-operations", canvas("先确定操作位置，再计算视觉 token", "上部区分原图裁块和视图内部切 patch，下部计算单视图在编码与合并前后的不同长度。", body))
}

{
  let body = text(42, 108, "逐图填充：3 × 256 = 768", 25, C.blue, "start", 600) + text(550, 108, "打包：2 × 256 = 512", 25, C.teal, "start", 600)
  const colors = [C.teal, C.blue, C.orange], unit = 1.25
  ;[80, 160, 240].forEach((n, i) => {
    body += rect(42, 140 + i * 57, 256 * unit, 38, "#e5e9ed", "none", 0) + rect(42, 140 + i * 57, n * unit, 38, colors[i], "none", 0) + text(380, 168 + i * 57, `${n}`, 24, colors[i])
  })
  body += rect(550, 140, 256 * unit, 38, "#e5e9ed", "none", 0) + rect(550, 140, 80 * unit, 38, C.teal, "none", 0) + rect(650, 140, 160 * unit, 38, C.blue, "none", 0)
  body += rect(550, 205, 256 * unit, 38, "#e5e9ed", "none", 0) + rect(550, 205, 240 * unit, 38, C.orange, "none", 0)
  body += text(42, 360, ["有效 token：80 + 160 + 240 = 480", "逐图 padding：768 − 480 = 288", "打包 padding：512 − 480 = 32"], 25)
  body += text(610, 325, "样本级注意力示意", 24, C.ink, "start", 600)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) body += rect(625 + c * 65, 345 + r * 65, 65, 65, r === c ? colors[r] : "#e5e9ed", C.white, 0)
  body += text(842, 385, ["同色内部", "允许通信", "跨样本屏蔽"], 20, C.muted)
  body += text(40, 583, "灰色为填充或被屏蔽关系；节省 padding 不直接等于延迟提升。", 23, C.muted)
  figures.set("patch-packing", canvas("NaViT 的打包：复用容器，不混合样本", "三组教学序列由三个容器压至两个，配套块对角的样本注意力示意。", body))
}

await fs.mkdir(output, { recursive: true })
await fs.mkdir(preview, { recursive: true })
for (const [name, svg] of figures) {
  await fs.writeFile(path.join(output, `${name}.svg`), svg + "\n")
  await sharp(Buffer.from(svg)).png().toFile(path.join(preview, `${name}.png`))
}
const tiles = []
let i = 0
for (const name of [...figures.keys()].slice(-6)) {
  const input = await sharp(path.join(preview, `${name}.png`)).resize(640).png().toBuffer()
  tiles.push({ input, left: (i % 2) * 640, top: Math.floor(i / 2) * 397 })
  i++
}
await sharp({ create: { width: 1280, height: Math.ceil(i / 2) * 397, channels: 4, background: "#ffffff" } }).composite(tiles).png().toFile(path.join(preview, "overview.png"))
console.log(JSON.stringify({ figures: figures.size, svgDirectory: output, previewDirectory: preview, data: "original teaching constructions" }))
