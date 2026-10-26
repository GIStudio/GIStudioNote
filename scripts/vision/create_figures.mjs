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
    ["1960s", "早期场景分析", "三维实体 · 区域与对象"],
    ["1970–1980s", "表示方案与计算约束", "Marr · 光流估计"],
    ["1980s", "神经层级模型", "Neocognitron"],
    ["1988", "主动视觉", "控制观察，获取信息"],
    ["1990–2000s", "学习与特征设计", "LeNet · 检测与局部特征"],
    ["2005–2010", "数据与共同评价", "VOC · ImageNet"],
    ["2012–2016", "深度学习扩展", "分类 · 检测 · 分割"],
    ["2020–2022", "预训练与神经表示", "自监督 · 图文 · 三维"],
    ["2023–", "提示与交互", "分割 · 视觉语言系统"],
  ]
  let body = ""
  items.forEach(([year, title, label], i) => {
    const x = 35 + (i % 3) * 320, y = 95 + Math.floor(i / 3) * 220
    body += `<g id="milestone-${i + 1}">${rect(x, y, 290, 175, i < 3 ? C.light : C.pale)}${text(x + 22, y + 40, year, 29, C.teal, "start", 650)}${text(x + 22, y + 86, title, 25, C.ink, "start", 600)}${text(x + 22, y + 132, label, 20, C.muted)}</g>`
  })
  body += text(40, 788, "时间段存在重叠；各方向交错发展，不表示前一方向结束。", 23, C.muted)
  figures.set("history-timeline", canvas("计算机视觉：问题与研究条件的演变", "三行九个代表性历史节点，从场景分析、表示理论、神经模型与主动视觉，到统计识别、数据评测、深度学习及预训练系统。", body, 830))
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

{
  let body = text(42, 105, "3 组原始配对 → 9 个图文组合", 26, C.muted)
  ;["文本 T₁", "文本 T₂", "文本 T₃"].forEach((s, i) => { body += text(330 + i * 150, 151, s, 25, C.ink, "middle") })
  for (let r = 0; r < 3; r++) {
    body += text(160, 219 + r * 90, `图像 I${r + 1}`, 25, C.ink, "middle")
    for (let c = 0; c < 3; c++) body += rect(260 + c * 150, 170 + r * 90, 140, 78, r === c ? C.light : C.pale, r === c ? C.teal : C.line, 4) + text(330 + c * 150, 219 + r * 90, r === c ? "原配对 +" : "负例 −", 25, r === c ? C.teal : C.muted, "middle")
  }
  body += text(770, 237, ["3 个正例", "6 个负例", "标签由配对生成"], 22, C.muted)
  body += rect(40, 475, 440, 90, C.pale) + text(65, 510, ["CLIP：分别沿行、列做竞争", "匹配分数进入双向 Softmax"], 23)
  body += rect(520, 475, 440, 90, C.light) + text(545, 510, ["SigLIP：各组合做二分类", "仍保留非配对的负例"], 23)
  body += text(42, 601, "配对标签不等于完整语义真值；非对角组合也可能语义相容。", 22, C.muted)
  figures.set("clip-pairs", canvas("训练时：图与文字怎样相互比较", "三乘三配对矩阵，三个对角正例、六个非对角负例，比较 Softmax 与 Sigmoid 的归一化。", body))
}

{
  let body = text(42, 105, "同一图像；A 的分数始终为 2", 26, C.muted)
  body += rect(40, 135, 440, 330) + rect(520, 135, 440, 330)
  body += text(65, 176, "三个候选：分数 2、1、0", 25, C.blue, "start", 600) + text(545, 176, "加入 D：其分数为 3", 25, C.teal, "start", 600)
  const softmax = a => a.map(x => Math.exp(x) / a.reduce((s, y) => s + Math.exp(y), 0))
  const labels = ["A", "B", "C", "D"]
  ;[[65, [2, 1, 0]], [545, [2, 1, 0, 3]]].forEach(([x, scores]) => {
    softmax(scores).forEach((p, i) => {
      const y = 210 + i * 55, fill = i === 0 ? C.orange : i === 3 ? C.teal : C.blue
      body += text(x, y + 23, labels[i], 24) + rect(x + 40, y, 255, 30, "#e9edef", "none", 0) + rect(x + 40, y, 255 * p, 30, fill, "none", 0) + text(x + 312, y + 23, p.toFixed(3), 23, fill)
    })
  })
  body += text(42, 517, ["A：0.665 → 0.237；变化来自候选集的 Softmax 分母。", "候选内的概率，不是对全部现实类别的正确率保证。"], 25)
  body += text(42, 598, "教学 logits 与精确计算后四舍五入的概率，不是 CLIP 实测。", 23, C.muted)
  figures.set("clip-candidates", canvas("候选改变，归一化概率就会改变", "三个候选与四个候选的两组概率条形图，强调同一候选的分数未变而归一化值改变。", body))
}

{
  let body = text(42, 105, "教学例子：16 块中仅 4 块可见", 26, C.muted)
  const visible = new Set([1, 6, 10, 13])
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const k = r * 4 + c
    body += rect(45 + c * 43, 145 + r * 43, 43, 43, visible.has(k) ? C.teal : "#e1e6eb", C.white, 0)
  }
  body += text(45, 350, "12 块被移除", 23, C.muted)
  body += line(235, 230, 315, 230) + rect(335, 160, 255, 140, C.pale) + text(462, 204, ["较重的编码器", "只处理 4 个可见块", "不加入 mask token"], 24, C.ink, "middle")
  body += line(607, 230, 678, 230) + text(705, 203, ["4 份编码结果", "+ 12 个 mask token", "+ 完整位置次序"], 25, C.teal)
  body += `<path d="M820,303 L820,370 L600,370 L600,415" fill="none" stroke="${C.teal}" stroke-width="3" marker-end="url(#arrow)"/>`
  body += rect(400, 430, 310, 100, C.light) + text(555, 470, ["较轻的解码器", "恢复全部 16 个位置"], 25, C.ink, "middle")
  body += line(385, 480, 275, 480) + text(45, 465, ["预测隐藏像素", "只在隐藏位置算损失"], 23, C.orange)
  body += text(42, 594, "预训练的遮挡策略；部署编码器时可使用完整图像。", 24, C.muted)
  figures.set("ssl-masked-encoding", canvas("MAE 的非对称计算：先少量编码，再完整解码", "四乘四网格显示可见和移除块，重编码器只接收可见块，轻解码器恢复次序并预测隐藏像素。", body))
}

{
  let body = text(42, 105, "三个归一化二维特征；只比较它们的点积关系", 25, C.muted)
  const axis = (x, y, rotated = false) => {
    let b = line(x - 10, y, x + 170, y, C.line) + line(x, y + 10, x, y - 145, C.line)
    const pts = rotated ? [[0, -105], [0, -105], [-105, 0]] : [[105, 0], [105, 0], [0, -105]]
    pts.forEach(([dx, dy], i) => { b += line(x, y, x + dx, y + dy, i < 2 ? C.teal : C.orange, false, false) + circle(x + dx, y + dy, i === 0 ? 10 : 6, i < 2 ? C.teal : C.orange) })
    return b
  }
  body += axis(165, 320) + text(55, 385, ["x₁ = x₂ = (1, 0)", "x₃ = (0, 1)"], 24)
  body += axis(510, 320, true) + text(385, 385, ["一起旋转 90°", "坐标变了，点积不变"], 24)
  body += line(330, 220, 385, 220) + text(353, 181, "旋转", 23, C.muted, "middle")
  body += text(755, 164, "相同的 Gram 矩阵", 24, C.ink, "middle", 600)
  body += matrix(676, 196, [[1, 1, 0], [1, 1, 0], [0, 0, 1]], 67, "output")
  body += rect(40, 474, 920, 100, C.light) + text(62, 513, ["Gram anchoring 对齐关系表，不要求特征逐坐标复制。", "G = X Xᵀ；每行一个 patch，每项是一对特征的相似度。"], 24)
  body += text(42, 603, "原创教学向量；不是 DINOv3 推理特征或论文实验图。", 22, C.muted)
  figures.set("ssl-gram-relations", canvas("保留关系，可以不固定特征坐标", "三个二维向量在一起旋转前后具有同一个三乘三 Gram 矩阵，说明关系约束的自由度。", body))
}

{
  const rows = [
    ["逐位置投影", "N × dV", "共享线性层 / MLP", "N × dL", "拼入语言序列", C.pale],
    ["查询瓶颈", "N × dV", "K 个查询读取特征", "K × dL", "K 可固定，小于 N", C.light],
    ["交叉注意力", "视觉特征", "单独保留视觉条件", "文本层读取", "不全变成输入前缀", C.sand],
  ]
  let body = text(42, 103, "比较的是数据流；三行不代表互斥的完整模型名单。", 24, C.muted)
  rows.forEach(([name, input, operation, output, meaning, fill], i) => {
    const y = 136 + i * 140
    body += `<g id="interface-${i}">${rect(40, y, 920, 120, fill)}${text(60, y + 36, name, 25, C.ink, "start", 600)}${text(60, y + 82, input, 25, C.muted)}${line(220, y + 68, 288, y + 68)}${text(310, y + 69, operation, 24)}${line(568, y + 68, 625, y + 68)}${text(650, y + 45, output, 25, C.ink, "start", 600)}${text(650, y + 87, meaning, 22, C.muted)}</g>`
  })
  body += text(42, 603, "N：入口位置数；K：查询输出数；dV / dL：视觉 / 语言通道数。", 22, C.muted)
  figures.set("tower-interface-paths", canvas("连接器要回答：长度怎样变，信息怎样读", "三行数据流对比逐位置投影、固定查询瓶颈和外置视觉交叉注意力，不构造性能排名。", body))
}

{
  let body = text(42, 104, "Qwen3-VL：三个视觉深度 → 前三个语言层", 25, C.muted)
  body += text(145, 151, "视觉编码器", 26, C.teal, "middle", 600) + text(815, 151, "语言模型", 26, C.blue, "middle", 600)
  for (let i = 0; i < 3; i++) {
    const y = 185 + i * 108
    body += rect(50, y, 190, 65, C.light) + text(145, y + 41, `视觉深度 ${i + 1}`, 25, C.teal, "middle")
    body += line(255, y + 33, 360, y + 33, C.teal) + rect(380, y, 240, 65, C.sand) + text(500, y + 41, "专用 merger", 25, C.orange, "middle")
    body += line(635, y + 33, 715, y + 33, C.orange) + rect(735, y, 210, 65, C.pale) + text(840, y + 41, `语言层 ${i + 1}  +`, 25, C.blue, "middle")
    if (i < 2) body += line(145, y + 69, 145, y + 101, C.teal) + line(840, y + 69, 840, y + 101, C.blue)
  }
  body += rect(40, 525, 920, 67, C.white) + text(60, 553, ["在对应视觉位置相加；不靠额外拼入三组前缀来延长序列。", "主输出的 merger 与更深层未画出；深度间距不按真实层号缩放。"], 21, C.muted)
  figures.set("tower-deepstack", canvas("多层视觉信息，在语言层继续进入", "简化的三层注入示意，三个视觉深度经专用连接器后加入前三个语言层，主干和最终分支仅作省略示意。", body))
}

{
  let body = text(42, 102, "教学网格：4 帧 × 4 个空间位置；忽略 class token", 25, C.muted)
  const grids = [[110, "先沿时间方向", C.orange], [610, "再沿帧内空间", C.teal]]
  grids.forEach(([x, label, color], panel) => {
    body += text(x + 100, 151, label, 26, color, "middle", 600)
    for (let t = 0; t < 4; t++) body += text(x + 25 + t * 55, 193, `t${t + 1}`, 22, C.muted, "middle")
    for (let p = 0; p < 4; p++) {
      body += text(x - 25, 239 + p * 55, `p${p + 1}`, 22, C.muted, "middle")
      for (let t = 0; t < 4; t++) body += rect(x + t * 55, 210 + p * 55, 50, 50, (panel === 0 ? p === 1 : t === 2) ? color : C.pale, C.white, 2)
    }
    body += text(x - 30, 478, panel === 0 ? "同一位置跨帧通信" : "同一帧内跨位置通信", 24, color)
  })
  body += line(405, 320, 530, 320)
  body += text(42, 548, ["联合：16² = 256 对；拆分：4 × 4² + 4 × 4² = 128 对", "仅计注意力位置对，不是完整计算量或实测加速比。"], 24)
  figures.set("video-factorized-attention", canvas("时空拆分：让不同方向分步通信", "两个四乘四时间空间网格分别突出同位跨帧和同帧跨位置的注意力，附简化的比较计数。", body))
}

{
  let body = text(42, 104, "当前观察与状态 → 比较预测 → 只执行第一步", 25, C.muted)
  body += rect(40, 155, 220, 150, C.light) + text(150, 201, ["当前图像 x(t)", "状态与历史 h(t)", "编码为视觉特征"], 25, C.ink, "middle")
  body += line(275, 230, 345, 230)
  const choices = [["A", "1.2", C.blue], ["B", "0.4", C.teal], ["C", "0.8", C.orange]]
  choices.forEach(([name, distance, color], i) => {
    const y = 142 + i * 94
    body += rect(365, y, 305, 77, name === "B" ? C.light : C.white, name === "B" ? C.teal : C.line) + text(387, y + 32, `候选动作序列 ${name}`, 24, color, "start", 600) + text(387, y + 62, `预测终点到目标距离 ${distance}`, 21, C.muted)
  })
  body += line(685, 275, 740, 275, C.teal) + rect(760, 208, 200, 135, C.sand) + text(860, 252, ["选择 B", "执行第一步", "重新拍摄观察"], 24, C.ink, "middle")
  body += `<path d="M860,355 L860,455 L150,455 L150,319" fill="none" stroke="${C.teal}" stroke-width="3" marker-end="url(#arrow)"/>`
  body += text(500, 493, "环境的新状态，成为下一轮规划的输入", 25, C.teal, "middle")
  body += text(42, 563, ["距离为任意单位的教学设定；预测不是实际执行结果。", "可执行动作范围与安全条件，还需独立约束。"], 23, C.muted)
  figures.set("video-receding-horizon", canvas("滚动规划：预测以后，仍需重新观察", "三条候选动作的教学距离分别为一点二、零点四、零点八，选择最小者但仅执行第一步，再循环观察。", body))
}

{
  let body = text(42, 103, "从模型画布回到原图，要逐步撤销入口变换。", 24, C.muted)
  body += rect(45, 160, 400, 225, C.pale, C.blue, 0) + text(45, 145, "原图 1600 × 900", 25, C.blue, "start", 600)
  body += rect(145, 185, 200, 100, C.light, C.teal, 0) + circle(295, 210, 7, C.orange)
  body += text(148, 318, ["裁块偏移 (400, 100)", "裁块大小 800 × 400"], 22, C.teal)
  body += line(465, 263, 545, 263)
  body += rect(580, 160, 240, 240, "#e1e6eb", C.blue, 0) + rect(580, 220, 240, 120, C.light, C.teal, 0) + circle(760, 250, 7, C.orange)
  body += text(570, 145, "模型画布 400 × 400", 25, C.blue, "start", 600) + text(838, 215, ["上补边", "100"], 22, C.muted)
  body += text(580, 433, "预测点 (300, 150)", 24, C.orange)
  body += rect(40, 480, 920, 110, C.white) + text(62, 516, ["先减补边：(300, 50) → 除缩放 0.5：(600, 100)", "再加裁块偏移：(400, 100) → 原图点：(1000, 200)"], 25)
  figures.set("system-coordinate-transform", canvas("模型认对目标，也可能因坐标变换点错", "按比例绘制原图、裁块及等比缩放和补边画布，同一橙点通过逆变换回到原图的一千、二百位置。", body))
}

{
  let body = text(42, 103, "执行循环与结果验收，承担不同的证明责任。", 25, C.muted)
  const blocks = [[45, "观察", ["当前截图", "或结构信息"], C.light], [365, "决策", ["模型结合任务", "提出受限动作"], C.pale], [685, "执行", ["工具改变环境", "返回调用结果"], C.sand]]
  blocks.forEach(([x, title, lines, fill], i) => { body += rect(x, 158, 270, 145, fill) + text(x + 135, 201, title, 28, C.ink, "middle", 600) + text(x + 135, 245, lines, 24, C.ink, "middle"); if (i < 2) body += line(x + 277, 230, x + 310, 230) })
  body += `<path d="M820,312 L820,375 L180,375 L180,315" fill="none" stroke="${C.teal}" stroke-width="3" marker-end="url(#arrow)"/>` + text(500, 412, "重新观察实际变化，继续或停止", 25, C.teal, "middle")
  body += rect(45, 452, 910, 125, C.white) + text(70, 489, "独立验收", 27, C.orange, "start", 600) + text(275, 489, ["文件是否存在；公式和数值是否正确；目标状态是否成立", "模型声称完成、工具返回成功，都不能单独代替任务检查。"], 23)
  figures.set("system-observation-and-verification", canvas("从截图到动作，再到可检查的结果", "观察决策执行形成反馈环，底部独立验收框列出实际文件与状态检查，区分调用成功和任务成功。", body))
}

{
  let body = text(42, 104, "OpenVision 3：共享编码表示，保留不同训练分支", 25, C.muted)
  const stages = [[40, "图像", "256 × 256", C.light], [360, "冻结 VAE", "32 × 32 latent", C.pale], [680, "ViT（patch = 2）", "16 × 16 个位置", C.sand]]
  stages.forEach(([x, name, dim, fill], i) => { body += rect(x, 145, 280, 115, fill) + text(x + 140, 187, [name, dim], 25, C.ink, "middle"); if (i < 2) body += line(x + 290, 203, x + 310, 203) })
  body += `<path d="M820,275 L820,310 L270,310 L270,355" fill="none" stroke="${C.teal}" stroke-width="3" marker-end="url(#arrow)"/>` + line(820, 275, 820, 355, C.orange)
  body += rect(45, 370, 450, 140, C.light) + text(270, 409, ["理解分支", "图文对比 + 描述生成", "保留可迁移语义"], 25, C.ink, "middle")
  body += rect(535, 370, 425, 140, C.sand) + text(747, 409, ["重建分支", "ViT 解码 + VAE 解码", "恢复 latent 与图像细节"], 25, C.ink, "middle")
  body += text(42, 563, ["每轴 8 × 2 = 16 倍压缩；256 个位置是教学输入计数。", "同一中间表示，不等于两条训练分支具有同一个解码器。"], 23, C.muted)
  figures.set("frontier-unified-representation", canvas("统一表示，同时接受两类学习要求", "二百五十六方形图像经过八倍 VAE 和二倍 latent patch 处理形成共享网格，分向理解与重建两个训练分支。", body))
}

{
  let body = text(42, 103, "8 个教学目标；示意容量每组 4 个（非实际模型配置）", 24, C.muted)
  body += text(55, 151, "按目标独立处理", 26, C.blue, "start", 600) + text(565, 151, "分组联合处理", 26, C.teal, "start", 600)
  for (let i = 0; i < 8; i++) {
    const x = 55 + (i % 2) * 190, y = 180 + Math.floor(i / 2) * 70
    body += circle(x + 23, y + 24, 20, i < 4 ? C.teal : C.orange) + text(x + 23, y + 32, i + 1, 23, C.white, "middle") + line(x + 49, y + 24, x + 85, y + 24, C.muted) + rect(x + 100, y + 3, 65, 43, C.pale, C.line, 3)
  }
  for (let g = 0; g < 2; g++) {
    const y = 195 + g * 143
    body += rect(560, y, 400, 112, g ? C.sand : C.light)
    for (let i = 0; i < 4; i++) body += circle(602 + i * 82, y + 35, 21, g ? C.orange : C.teal) + text(602 + i * 82, y + 43, g * 4 + i + 1, 23, C.white, "middle")
    body += text(760, y + 88, "共享记忆与组内处理", 24, C.ink, "middle")
  }
  body += line(435, 310, 520, 310)
  body += text(42, 548, ["减少重复处理路径；仍有图像编码、组内计算与后处理。", "8 条路径变 2 组，不能直接推导 4 倍实际加速。"], 24)
  figures.set("frontier-object-multiplex", canvas("SAM 3.1 的效率线索：怎样共同处理对象", "八个目标从逐目标独立路径变为两个共享处理组，以教学容量说明多路复用而非真实吞吐测量。", body))
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
