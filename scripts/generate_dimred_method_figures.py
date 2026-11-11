# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "scikit-learn>=1.3",
#   "matplotlib>=3.8",
#   "numpy>=1.24",
#   "scipy>=1.10",
#   "torch>=2.0",
# ]
# ///
"""为「降维方法地图」公开笔记生成 7 张教学 demo 图。

运行方式：
    uv run python scripts/generate_dimred_method_figures.py
    # 或当前环境已装好依赖时：python3 scripts/generate_dimred_method_figures.py

输出（content/DL/images/，SVG 为主、PNG 为网页回退）：
1. dimred-methods-map.svg / .png
   方法地图：特征选择 vs 特征投影，再分监督/无监督、线性/非线性。
2. dimred-feature-filters.svg / .png
   合成表格数据上的缺失比例、低方差、高相关三种过滤规则。
   图要说明：阈值是启发式，且可能删掉仍有信号的列。
3. dimred-wrapper-search.svg / .png
   前向构造与后向消除的交叉验证曲线，以及训练集分数继续上升的过拟合迹象。
4. dimred-ica-cocktail.svg / .png
   两个非高斯源信号的鸡尾酒会混合与 FastICA 恢复。
5. dimred-nmf-parts.svg / .png
   手写数字上的 NMF 非负基向量与单样本重构。
6. dimred-lda-kernel.svg / .png
   同心圆数据上的 PCA、LDA 与 GDA（kernel LDA）一维投影。
7. dimred-autoencoder.svg / .png
   手写数字上的 2 维瓶颈自编码器：损失、瓶颈散点与重构样本。
8. dimred-manifold-isomap-lle.svg / .png
   瑞士卷上的 PCA、Isomap 与 LLE 对比。

样式：字体基线走 scripts/matplotlib-style.mplstyle（Libertinus Sans + Noto Sans CJK SC），
配色按 vault palette 语义角色分配；子图说明放在各面板下方（不做 suptitle/axes title），
整图论点由页面 Markdown 图注承担。

所有随机步骤固定 random_state，可重复执行。图示是教学用合成数据或手写数字，
不是方法排名，也不构成统一基准。
"""

from pathlib import Path
import warnings

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap, to_rgb
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Rectangle
from scipy.linalg import eigh
from sklearn.datasets import load_digits, make_circles, make_classification, make_swiss_roll
from sklearn.decomposition import NMF, PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.linear_model import LogisticRegression
from sklearn.manifold import Isomap, LocallyLinearEmbedding
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore", category=FutureWarning)
# 当前环境的部分 BLAS/sklearn 组合会在中间矩阵乘法上抛出
# "divide by zero encountered in matmul"，但最终结果有限且可复现。
# 这里只压掉这类已知噪声，避免把真正的数值问题一起藏起来。
warnings.filterwarnings("ignore", message=".*matmul.*")

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "content" / "DL" / "images"
OUT_DIR.mkdir(parents=True, exist_ok=True)

plt.style.use(Path(__file__).resolve().parent / "matplotlib-style.mplstyle")

SHIQI_PALETTE = {
    "primary_blue": "#234E70",
    "secondary_teal": "#288084",
    "accent_orange": "#C2672D",
    "surface_light": "#F1F5F7",
    "ink": "#263238",
    "muted": "#6B7780",
    "line": "#B8C2CC",
    "success": "#2F7D4E",
    "danger": "#B84A45",
    "validation_violet": "#6F5F90",
}
INK = SHIQI_PALETTE["ink"]
MUTED = SHIQI_PALETTE["muted"]
LINE = SHIQI_PALETTE["line"]
BLUE = SHIQI_PALETTE["primary_blue"]
TEAL = SHIQI_PALETTE["secondary_teal"]
ORANGE = SHIQI_PALETTE["accent_orange"]
DANGER = SHIQI_PALETTE["danger"]
VIOLET = SHIQI_PALETTE["validation_violet"]
SUCCESS = SHIQI_PALETTE["success"]

plt.rcParams.update(
    {
        # mplstyle 用 font.family=sans-serif + font.sans-serif 列表的写法在 matplotlib
        # 里只会解析到列表第一项，CJK 缺字不会逐字符回退；把具体字体名直接放进
        # font.family 列表才能启用 Libertinus Sans → Noto Sans CJK SC 的回退。
        "font.family": ["Libertinus Sans", "Noto Sans CJK SC", "DejaVu Sans", "sans-serif"],
        "svg.fonttype": "none",  # SVG 内文字保持可编辑文本
        "text.color": INK,
        "axes.labelcolor": INK,
        "axes.edgecolor": INK,
        "axes.spines.right": False,
        "axes.spines.top": False,
        "axes.grid": False,  # 嵌入散点图不带网格
        "xtick.color": INK,
        "ytick.color": INK,
        "figure.facecolor": "white",
        "axes.facecolor": "white",
    }
)

DPI = 150


def tint(hex_color: str, frac: float = 0.55) -> str:
    """把 palette 色向白色混合，得到同族浅色。"""
    r, g, b = to_rgb(hex_color)
    return "#{:02X}{:02X}{:02X}".format(
        *(round(255 + (c - 1) * 255 * frac) for c in (r, g, b))
    )


DIGITS10 = [
    BLUE,
    TEAL,
    VIOLET,
    ORANGE,
    SUCCESS,
    tint(BLUE),
    tint(TEAL),
    tint(VIOLET),
    tint(ORANGE),
    tint(SUCCESS),
]
CMAP_DIGITS = LinearSegmentedColormap.from_list("shiqi_digits10", DIGITS10, N=10)
CMAP_ROLL = LinearSegmentedColormap.from_list("shiqi_roll", [ORANGE, BLUE])
CMAP_CORR = LinearSegmentedColormap.from_list(
    "shiqi_corr", [DANGER, "#F7F7F7", BLUE]
)


def add_panel_caption(fig, ax, label: str, body: str, fontsize=10.0):
    """把「(a) 一句话说明」放到面板正下方。"""
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    bb = ax.get_tightbbox(renderer)
    w_px, h_px = fig.get_size_inches() * fig.dpi
    cx = (bb.x0 + bb.x1) / 2 / w_px
    y = bb.y0 / h_px - 0.018

    probe_pre = fig.text(0, 0, label + " ", fontsize=fontsize, fontweight="bold")
    probe_body = fig.text(0, 0, body, fontsize=fontsize)
    fig.canvas.draw()
    pre_w = probe_pre.get_window_extent(renderer).width / w_px
    body_w = probe_body.get_window_extent(renderer).width / w_px
    probe_pre.remove()
    probe_body.remove()

    start = cx - (pre_w + body_w) / 2
    fig.text(
        start + pre_w, y, label + " ", ha="right", va="top",
        fontsize=fontsize, fontweight="bold", color=INK,
    )
    fig.text(
        start + pre_w, y, body, ha="left", va="top",
        fontsize=fontsize, color=INK,
    )


def save(fig, stem: str):
    for ext in (".svg", ".png"):
        fig.savefig(OUT_DIR / f"{stem}{ext}", dpi=DPI, bbox_inches="tight")
    plt.close(fig)
    return OUT_DIR / f"{stem}.svg"


def _box(ax, x, y, w, h, title, body=None, fc=None, ec=None,
         title_size=11.0, body_size=9.5):
    fc = fc or SHIQI_PALETTE["surface_light"]
    ec = ec or LINE
    patch = FancyBboxPatch(
        (x - w / 2, y - h / 2), w, h,
        boxstyle="round,pad=0.008,rounding_size=0.018",
        linewidth=1.1, edgecolor=ec, facecolor=fc, zorder=2,
    )
    ax.add_patch(patch)
    if body:
        ax.text(
            x, y + 0.014, title, ha="center", va="center",
            fontsize=title_size, fontweight="bold", color=INK, zorder=3,
        )
        ax.text(
            x, y - 0.020, body, ha="center", va="center",
            fontsize=body_size, color=INK, linespacing=1.35, zorder=3,
        )
    else:
        ax.text(
            x, y, title, ha="center", va="center",
            fontsize=body_size, color=INK, linespacing=1.4, zorder=3,
        )


def _arrow(ax, start, end, color=MUTED, rad=0.0):
    ax.add_patch(
        FancyArrowPatch(
            start, end, arrowstyle="-|>", mutation_scale=12,
            linewidth=1.1, color=color,
            connectionstyle=f"arc3,rad={rad}",
            shrinkA=2, shrinkB=2, zorder=1,
        )
    )


def fig_method_map():
    """图 1：降维方法地图（方法选择流程图）。"""
    fig, ax = plt.subplots(figsize=(14.5, 9.0))
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    _box(ax, 0.50, 0.955, 0.24, 0.055, "高维数据 X", "n 个样本，d 个特征",
         fc=BLUE, ec=BLUE, title_size=12, body_size=9.2)
    # 深色底上的文字改为白色
    ax.texts[-2].set_color("white")
    ax.texts[-1].set_color("white")

    _box(ax, 0.50, 0.845, 0.46, 0.060, "先问：要保留原来的列，还是生成新的坐标？",
         fc="white", ec=INK, title_size=11.5)

    _box(ax, 0.245, 0.715, 0.31, 0.070, "特征选择",
         "保留原始列，删掉其余列", fc=tint(TEAL, 0.78), ec=TEAL, title_size=12)
    _box(ax, 0.755, 0.715, 0.31, 0.070, "特征投影",
         "把原列组合成新坐标", fc=tint(BLUE, 0.78), ec=BLUE, title_size=12)

    _box(ax, 0.125, 0.575, 0.205, 0.062, "过滤式 filter", "不看模型，只看统计量",
         fc="white", ec=TEAL)
    _box(ax, 0.365, 0.575, 0.205, 0.062, "包裹式 wrapper", "用模型评分挑子集",
         fc="white", ec=TEAL)

    _box(ax, 0.125, 0.405, 0.205, 0.145, "",
         "缺失值比例 MVR\n低方差过滤\n高相关过滤",
         fc=SHIQI_PALETTE["surface_light"], ec=LINE, body_size=10)
    _box(ax, 0.365, 0.405, 0.205, 0.145, "",
         "前向构造\n后向消除\n\n（两者都返回原列子集）",
         fc=SHIQI_PALETTE["surface_light"], ec=LINE, body_size=9.6)

    _box(ax, 0.625, 0.575, 0.205, 0.062, "无监督", "不看标签",
         fc="white", ec=BLUE)
    _box(ax, 0.875, 0.575, 0.205, 0.062, "有监督", "标签进入优化目标",
         fc="white", ec=ORANGE)

    _box(ax, 0.625, 0.405, 0.205, 0.145, "",
         "线性  PCA · ICA · NMF\n\n非线性\nIsomap · LLE · t-SNE\nUMAP · 自编码器",
         fc=SHIQI_PALETTE["surface_light"], ec=LINE, body_size=9.2)
    _box(ax, 0.875, 0.405, 0.205, 0.145, "",
         "线性  LDA\n\n非线性\nGDA（kernel LDA）",
         fc=SHIQI_PALETTE["surface_light"], ec=LINE, body_size=9.6)

    _arrow(ax, (0.50, 0.927), (0.50, 0.875))
    _arrow(ax, (0.43, 0.815), (0.245, 0.750))
    _arrow(ax, (0.57, 0.815), (0.755, 0.750))
    _arrow(ax, (0.205, 0.680), (0.125, 0.606))
    _arrow(ax, (0.285, 0.680), (0.365, 0.606))
    _arrow(ax, (0.125, 0.544), (0.125, 0.477))
    _arrow(ax, (0.365, 0.544), (0.365, 0.477))
    _arrow(ax, (0.680, 0.680), (0.625, 0.606))
    _arrow(ax, (0.820, 0.680), (0.875, 0.606))
    _arrow(ax, (0.625, 0.544), (0.625, 0.477))
    _arrow(ax, (0.875, 0.544), (0.875, 0.477))

    ax.text(0.245, 0.285, "输出：原列子集；每列含义不变",
            ha="center", va="center", fontsize=10.2, color=MUTED)
    ax.text(0.755, 0.285, "输出：新的低维坐标；每轴通常是原列的混合",
            ha="center", va="center", fontsize=10.2, color=MUTED)

    ax.text(
        0.50, 0.105,
        "选择前先回答：要保留原变量，还是重组坐标？标签可用吗？结构是线性的吗？\n"
        "方法清单不是排行榜；它只说明每种方法在保护什么、又必然丢掉什么。",
        ha="center", va="center", fontsize=10.8, color=INK, linespacing=1.6,
    )
    return save(fig, "dimred-methods-map")


def _filter_data(seed=7, n=600):
    rng = np.random.default_rng(seed)
    signal_a = rng.normal(0, 1, n)
    signal_b = rng.normal(0, 1, n)
    rare = rng.binomial(1, 0.02, n).astype(float)
    near_const = 1.0 + rng.normal(0, 0.001, n)
    redundant = signal_a + rng.normal(0, 0.15, n)
    scaled_noise = 1e3 * rng.normal(0, 1, n)
    missing_signal = signal_b + rng.normal(0, 0.30, n)
    noise = rng.normal(0, 1, n)
    y = 1.5 * signal_a + 1.0 * signal_b + 4.0 * rare + rng.normal(0, 0.5, n)

    X = np.column_stack(
        [signal_a, signal_b, rare, near_const, redundant, scaled_noise, missing_signal, noise]
    )
    names = [
        "signal_a", "signal_b", "rare_flag", "near_const",
        "signal_a_copy", "scaled_noise", "missing_signal", "noise",
    ]
    missing_mask = rng.random(n) < 0.45
    missing_idx = names.index("missing_signal")
    X_missing = X.copy()
    X_missing[missing_mask, missing_idx] = np.nan
    return X, X_missing, y, names, missing_mask


def fig_feature_filters():
    """图 2：三种 filter 的阈值行为，以及它们可能删掉有用列。"""
    X, X_missing, y, names, missing_mask = _filter_data()
    missing_ratio = np.isnan(X_missing).mean(axis=0)

    # 用中位数填补后计算方差和相关；填补只是为了让图能画出来，
    # 正文明确说明这不是推荐流程。
    X_imp = X_missing.copy()
    for j in range(X_imp.shape[1]):
        med = np.nanmedian(X_imp[:, j])
        if np.isnan(med):
            med = 0.0
        X_imp[np.isnan(X_imp[:, j]), j] = med

    var = X_imp.var(axis=0, ddof=0)
    corr = np.corrcoef(X_imp, rowvar=False)

    miss_thr = 0.30
    var_thr = 0.10
    corr_thr = 0.90

    fig, axes = plt.subplots(1, 3, figsize=(16.5, 5.8), constrained_layout=True)

    # (a) 缺失比例
    ax = axes[0]
    order = np.argsort(missing_ratio)
    colors = [DANGER if missing_ratio[j] > miss_thr else BLUE for j in order]
    ax.barh(np.arange(len(names)), missing_ratio[order], color=colors, height=0.62)
    ax.set_yticks(np.arange(len(names)))
    ax.set_yticklabels([names[j] for j in order], fontsize=9)
    ax.axvline(miss_thr, color=ORANGE, linestyle="--", linewidth=1.2)
    ax.text(miss_thr + 0.008, len(names) - 0.55, "阈值 30%",
            color=ORANGE, fontsize=8.8, va="top")
    ax.set_xlim(0, 0.55)
    ax.set_xlabel("缺失比例")
    ax.set_title("缺失值比例 MVR", fontsize=11.5, loc="left", pad=8)
    for j, val in zip(order, missing_ratio[order]):
        if val > 0.01:
            ax.text(val + 0.008, list(order).index(j), f"{val:.0%}",
                    va="center", fontsize=8.4, color=MUTED)

    # (b) 方差（对数刻度）
    ax = axes[1]
    order = np.argsort(var)
    colors = [DANGER if var[j] < var_thr else BLUE for j in order]
    ax.scatter(var[order], np.arange(len(names)), c=colors, s=48, zorder=3)
    ax.set_xscale("log")
    ax.set_yticks(np.arange(len(names)))
    ax.set_yticklabels([names[j] for j in order], fontsize=9)
    ax.axvline(var_thr, color=ORANGE, linestyle="--", linewidth=1.2)
    ax.text(var_thr * 1.15, len(names) - 0.55, "阈值 0.1",
            color=ORANGE, fontsize=8.8, va="top")
    ax.set_xlabel("方差（对数刻度）")
    ax.set_title("低方差过滤", fontsize=11.5, loc="left", pad=8)
    ax.annotate(
        "稀有但有用", xy=(var[names.index("rare_flag")], names.index("rare_flag")),
        xytext=(var[names.index("rare_flag")] * 0.05, names.index("rare_flag") - 0.75),
        fontsize=8.2, color=DANGER,
        arrowprops=dict(arrowstyle="-", color=DANGER, lw=0.8),
    )
    ax.annotate(
        "量纲放大", xy=(var[names.index("scaled_noise")], names.index("scaled_noise")),
        xytext=(var[names.index("scaled_noise")] * 0.12, names.index("scaled_noise") + 0.65),
        fontsize=8.2, color=BLUE, ha="right",
        arrowprops=dict(arrowstyle="-", color=BLUE, lw=0.8),
    )

    # (c) 相关矩阵
    ax = axes[2]
    im = ax.imshow(corr, cmap=CMAP_CORR, vmin=-1, vmax=1)
    ax.set_xticks(np.arange(len(names)))
    ax.set_yticks(np.arange(len(names)))
    ax.set_xticklabels(names, rotation=45, ha="right", fontsize=8.2)
    ax.set_yticklabels(names, fontsize=8.2)
    for i in range(len(names)):
        for j in range(len(names)):
            ax.text(j, i, f"{corr[i, j]:.2f}", ha="center", va="center",
                    fontsize=7.0, color="white" if abs(corr[i, j]) > 0.62 else INK)
    i = names.index("signal_a")
    j = names.index("signal_a_copy")
    ax.add_patch(Rectangle((j - 0.5, i - 0.5), 1, 1, fill=False,
                           edgecolor=ORANGE, linewidth=2.0))
    ax.add_patch(Rectangle((i - 0.5, j - 0.5), 1, 1, fill=False,
                           edgecolor=ORANGE, linewidth=2.0))
    ax.set_title("高相关过滤", fontsize=11.5, loc="left", pad=8)
    cbar = fig.colorbar(im, ax=ax, shrink=0.82, pad=0.02)
    cbar.set_label("Pearson r", fontsize=8.8)
    cbar.ax.tick_params(labelsize=8)

    add_panel_caption(fig, axes[0], "(a)", "阈值 30% 会删掉 45% 缺失的列")
    add_panel_caption(fig, axes[1], "(b)", "阈值 0.1 会删掉稀有列和近常数列")
    add_panel_caption(fig, axes[2], "(c)", "|r| ≥ 0.9 时只保留一个冗余列")

    print("[filters] missing ratio:", {k: round(float(v), 3) for k, v in zip(names, missing_ratio)})
    print("[filters] variance:", {k: float(f"{v:.4g}") for k, v in zip(names, var)})
    print("[filters] corr signal_a_copy/signal_a:", round(float(corr[names.index("signal_a_copy"), names.index("signal_a")]), 3))
    print("[filters] corr missing_signal/y:", round(float(np.corrcoef(X_imp[:, names.index("missing_signal")], y)[0, 1]), 3))

    return save(fig, "dimred-feature-filters")


def _wrapper_data(seed=2, n=240, n_features=20):
    X, y = make_classification(
        n_samples=n, n_features=n_features, n_informative=5, n_redundant=0,
        n_repeated=0, class_sep=0.8, flip_y=0.05, random_state=seed,
    )
    return train_test_split(X, y, test_size=0.30, random_state=42, stratify=y)


def fig_wrapper_search():
    """图 3：前向/后向包裹式选择的 CV 曲线与训练集分数。"""
    Xtr, Xte, ytr, yte = _wrapper_data()
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    def model():
        return make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))

    def cv_stats(cols):
        scores = cross_val_score(model(), Xtr[:, cols], ytr, cv=cv, scoring="accuracy")
        return float(scores.mean()), float(scores.std())

    def train_score(cols):
        return float(model().fit(Xtr[:, cols], ytr).score(Xtr[:, cols], ytr))

    def test_score(cols):
        return float(model().fit(Xtr[:, cols], ytr).score(Xte[:, cols], yte))

    # 前向
    remaining = list(range(Xtr.shape[1]))
    chosen = []
    forward = []
    while remaining:
        best = max(remaining, key=lambda j: cv_stats(chosen + [j])[0])
        chosen.append(best)
        remaining.remove(best)
        m, s = cv_stats(chosen)
        forward.append((len(chosen), m, s, train_score(chosen), chosen.copy()))

    # 后向
    chosen = list(range(Xtr.shape[1]))
    backward = []
    m, s = cv_stats(chosen)
    backward.append((len(chosen), m, s, train_score(chosen), chosen.copy()))
    while len(chosen) > 1:
        best_score, drop = max(
            [(cv_stats([j for j in chosen if j != k])[0], k) for k in chosen],
            key=lambda t: t[0],
        )
        chosen.remove(drop)
        m, s = cv_stats(chosen)
        backward.append((len(chosen), m, s, train_score(chosen), chosen.copy()))

    fw_best = max(forward, key=lambda t: t[1])
    bw_best = max(backward, key=lambda t: t[1])
    all_cols = list(range(Xtr.shape[1]))
    all_cv, _ = cv_stats(all_cols)
    all_test = test_score(all_cols)

    fig, axes = plt.subplots(1, 2, figsize=(13.5, 5.4), constrained_layout=True)

    for ax, data, best, label, reverse in [
        (axes[0], forward, fw_best, "前向构造", False),
        (axes[1], backward, bw_best, "后向消除", True),
    ]:
        n = np.array([d[0] for d in data])
        mean = np.array([d[1] for d in data])
        std = np.array([d[2] for d in data])
        train = np.array([d[3] for d in data])
        ax.plot(n, mean, color=BLUE, marker="o", ms=4, lw=1.8, label="5 折 CV 准确率")
        ax.fill_between(n, mean - std, mean + std, color=BLUE, alpha=0.14, lw=0)
        ax.plot(n, train, color=ORANGE, linestyle="--", lw=1.4, label="训练集准确率")
        ax.axhline(all_cv, color=LINE, linestyle=":", lw=1.2, label="全特征 CV")
        ax.scatter([best[0]], [best[1]], marker="*", s=180, color=ORANGE,
                   edgecolor="white", linewidth=0.8, zorder=5)
        ax.annotate(
            f"最佳 {best[0]} 列\nCV={best[1]:.3f}",
            xy=(best[0], best[1]),
            xytext=(best[0] + (2.0 if not reverse else -2.0), best[1] - 0.075),
            fontsize=8.8, color=ORANGE,
            arrowprops=dict(arrowstyle="-", color=ORANGE, lw=0.8),
            ha="left" if not reverse else "right",
        )
        ax.set_xlabel("保留特征数")
        ax.set_ylabel("准确率")
        ax.set_title(label, fontsize=12, loc="left", pad=8)
        ax.set_ylim(0.62, 0.95)
        ax.set_xlim(0.5, 20.5)
        ax.set_xticks(range(2, 21, 2))
        ax.legend(fontsize=8.4, loc="lower left" if not reverse else "lower right")
        if reverse:
            ax.invert_xaxis()

    add_panel_caption(fig, axes[0], "(a)", f"CV 在 {fw_best[0]} 列达到峰值；训练集分数仍随列数上升")
    add_panel_caption(fig, axes[1], "(b)", f"CV 在 {bw_best[0]} 列达到峰值；训练集分数随删除下降")

    print("[wrapper] forward best:", fw_best[0], "CV", round(fw_best[1], 3),
          "train", round(fw_best[3], 3), "test", round(test_score(fw_best[4]), 3))
    print("[wrapper] backward best:", bw_best[0], "CV", round(bw_best[1], 3),
          "train", round(bw_best[3], 3), "test", round(test_score(bw_best[4]), 3))
    print("[wrapper] all features CV", round(all_cv, 3), "test", round(all_test, 3))

    return save(fig, "dimred-wrapper-search")


def _zscore(v):
    return (v - v.mean()) / (v.std() + 1e-12)


def fig_ica_cocktail():
    """图 4：两个非高斯源的线性混合与 FastICA 恢复。"""
    from sklearn.decomposition import FastICA

    rng = np.random.default_rng(3)
    n = 800
    t = np.linspace(0, 1, n, endpoint=False)
    s1 = np.sin(2 * np.pi * 3 * t)
    s2 = np.sign(np.sin(2 * np.pi * 2 * t))  # 方波，非高斯
    S = np.column_stack([s1, s2])

    A = np.array([[1.0, 0.6], [0.5, 1.0]])
    X = S @ A.T + 0.05 * rng.normal(size=(n, 2))
    ica = FastICA(n_components=2, whiten="unit-variance", random_state=42, max_iter=1000)
    S_hat = ica.fit_transform(X)

    # ICA 的顺序、符号、尺度不可识别；按绝对相关对齐，便于并排展示。
    C = np.corrcoef(S.T, S_hat.T)[:2, 2:]
    order = np.argmax(np.abs(C), axis=1)
    signs = np.sign(C[np.arange(2), order])
    S_aligned = S_hat[:, order] * signs

    fig, axes = plt.subplots(2, 3, figsize=(13.5, 6.2), constrained_layout=True, sharex=True)
    titles = ["(a) 真实源信号", "(b) 麦克风混合", "(c) FastICA 恢复"]
    for ax, title in zip(axes[0], titles):
        ax.set_title(title, fontsize=11.5, loc="left", pad=8)

    row_labels = ["源 1 / 混合 1", "源 2 / 混合 2"]
    colors_true = [BLUE, ORANGE]
    colors_mix = [MUTED, VIOLET]

    for i in range(2):
        axes[i, 0].plot(t, _zscore(S[:, i]), color=colors_true[i], lw=1.2)
        axes[i, 1].plot(t, _zscore(X[:, i]), color=colors_mix[i], lw=1.2)
        axes[i, 2].plot(t, _zscore(S_aligned[:, i]), color=colors_true[i], lw=1.2)
        for j in range(3):
            axes[i, j].set_ylim(-3.2, 3.2)
            axes[i, j].set_yticks([-2, 0, 2])
            axes[i, j].set_xticks([])
            axes[i, j].grid(False)
        axes[i, 0].set_ylabel(row_labels[i], fontsize=9)

    for ax in axes[1]:
        ax.set_xlabel("时间 →", fontsize=9)

    fig.text(
        0.5, -0.02,
        "FastICA 假设源信号相互独立且至多一个高斯；恢复的顺序、符号和尺度不可识别，图中按相关性对齐。",
        ha="center", va="top", fontsize=9.2, color=INK,
    )

    print("[ica] aligned correlations:", [round(float(C[i, order[i]] * signs[i]), 3) for i in range(2)])
    return save(fig, "dimred-ica-cocktail")


def fig_nmf_parts():
    """图 5：手写数字上的 NMF 非负基向量与单样本重构。"""
    digits = load_digits()
    X = digits.data / 16.0
    n_components = 9
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        nmf = NMF(
            n_components=n_components, init="nndsvda", random_state=42, max_iter=1200
        )
        W = nmf.fit_transform(X)
    H = nmf.components_

    sample = 0
    rec = W[sample] @ H
    mse = float(np.mean((rec - X[sample]) ** 2))

    fig = plt.figure(figsize=(13.5, 6.2))
    gs = fig.add_gridspec(3, 4, width_ratios=[1, 1, 1, 1.45],
                          wspace=0.10, hspace=0.18)

    for k in range(n_components):
        r, c = divmod(k, 3)
        ax = fig.add_subplot(gs[r, c])
        basis = H[k].reshape(8, 8)
        # 每个基向量单独归一化，避免弱基向量在共享色标下看起来是一片空白。
        ax.imshow(basis, cmap="gray_r", vmin=0, vmax=max(basis.max(), 1e-12))
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_visible(False)
        ax.set_title(str(k + 1), fontsize=8, color=MUTED, pad=2)

    ax_orig = fig.add_subplot(gs[0, 3])
    ax_rec = fig.add_subplot(gs[1, 3])
    ax_coef = fig.add_subplot(gs[2, 3])

    ax_orig.imshow(X[sample].reshape(8, 8), cmap="gray_r", vmin=0, vmax=1)
    ax_orig.set_title("原图", fontsize=9.5, loc="left")
    ax_rec.imshow(rec.reshape(8, 8), cmap="gray_r", vmin=0, vmax=1)
    ax_rec.set_title(f"重构（MSE={mse:.3f}）", fontsize=9.5, loc="left")
    for ax in (ax_orig, ax_rec):
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_visible(False)

    ax_coef.barh(np.arange(n_components), W[sample], color=BLUE, height=0.62)
    ax_coef.set_yticks(np.arange(n_components))
    ax_coef.set_yticklabels([str(i + 1) for i in range(n_components)], fontsize=7.5)
    ax_coef.invert_yaxis()
    ax_coef.set_xlabel("系数", fontsize=8.5)
    ax_coef.tick_params(axis="x", labelsize=7.5)

    fig.text(
        0.5, -0.02,
        f"NMF 把 64 维像素拆成 {n_components} 个非负基向量的加权和；"
        "每个基向量单独归一化显示。基向量可加，但不保证对应人类命名的语义部件。",
        ha="center", va="top", fontsize=9.2, color=INK,
    )

    print("[nmf] sample MSE:", round(mse, 5),
          "overall MSE:", round(float(np.mean((W @ H - X) ** 2)), 5))
    return save(fig, "dimred-nmf-parts")


class KernelLDA:
    """Baudat–Anouar 的 kernel LDA（GDA）的最小实现。

    目标是在核空间最大化类间散度 / 类内散度。对中心化核矩阵 Kc，
    解 Kc P Kc α = λ Kc (I-P) Kc α，其中 P 是类均值投影矩阵。
    """

    def __init__(self, gamma=1.0, reg=1e-2, n_components=1):
        self.gamma = gamma
        self.reg = reg
        self.n_components = n_components

    def _kernel(self, A, B):
        d2 = ((A[:, None, :] - B[None, :, :]) ** 2).sum(-1)
        return np.exp(-self.gamma * d2)

    def fit(self, X, y):
        self.X_fit = X.copy()
        self.classes_ = np.unique(y)
        n = len(X)
        K = self._kernel(X, X)
        self.K_mean_rows = K.mean(axis=0)
        self.K_mean_all = K.mean()
        Kc = K - self.K_mean_rows[None, :] - self.K_mean_rows[:, None] + self.K_mean_all

        Y = np.zeros((n, len(self.classes_)))
        for j, c in enumerate(self.classes_):
            Y[y == c, j] = 1.0
        P = Y @ np.linalg.pinv(Y.T @ Y) @ Y.T

        A = Kc @ P @ Kc
        B = Kc @ (np.eye(n) - P) @ Kc
        B = B + self.reg * np.trace(B) / n * np.eye(n)
        vals, vecs = eigh(A, B)
        idx = np.argsort(vals)[::-1]
        self.alphas_ = vecs[:, idx[: self.n_components]]
        self.evals_ = vals[idx[: self.n_components]]
        return self

    def transform(self, X):
        K = self._kernel(X, self.X_fit)
        Kc = K - K.mean(axis=1, keepdims=True) - self.K_mean_rows[None, :] + self.K_mean_all
        return Kc @ self.alphas_


def fig_lda_kernel():
    """图 6：PCA / LDA / GDA（kernel LDA）在同心圆数据上的一维投影。"""
    X, y = make_circles(n_samples=600, noise=0.08, factor=0.35, random_state=42)
    X = StandardScaler().fit_transform(X)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.30, random_state=42, stratify=y)

    pca = PCA(n_components=1, random_state=42).fit(Xtr)
    lda = LinearDiscriminantAnalysis(n_components=1).fit(Xtr, ytr)
    klda = KernelLDA(gamma=1.0, reg=1e-2, n_components=1).fit(Xtr, ytr)

    projections = {
        "PCA": (pca.transform(Xtr).ravel(), pca.transform(Xte).ravel()),
        "LDA": (lda.transform(Xtr).ravel(), lda.transform(Xte).ravel()),
        "Kernel LDA": (klda.transform(Xtr).ravel(), klda.transform(Xte).ravel()),
    }
    accs = {}
    for name, (ztr, zte) in projections.items():
        # 1-NN 只在训练投影上拟合，再在测试投影上评分；避免把测试集自身当邻居。
        accs[name] = float(KNeighborsClassifier(n_neighbors=1).fit(
            ztr.reshape(-1, 1), ytr
        ).score(zte.reshape(-1, 1), yte))

    fig, axes = plt.subplots(2, 2, figsize=(12.5, 9.2))
    fig.subplots_adjust(left=0.08, right=0.98, top=0.96, bottom=0.08,
                        hspace=0.52, wspace=0.24)
    ax = axes[0, 0]
    for c, color, label in [(0, BLUE, "类 0"), (1, ORANGE, "类 1")]:
        ax.scatter(Xte[yte == c, 0], Xte[yte == c, 1], s=16, alpha=0.7,
                   color=color, label=label)
    ax.set_xlabel("特征 1")
    ax.set_ylabel("特征 2")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.legend(fontsize=8.5, loc="upper right")
    ax.text(0.5, -0.20, "(a) 原始数据：两类同心圆，线性边界无法分开",
            transform=ax.transAxes, ha="center", va="top", fontsize=9.8, color=INK)

    panel_info = [
        (axes[0, 1], "PCA", "第一主成分", "(b)"),
        (axes[1, 0], "LDA", "第一判别方向", "(c)"),
        (axes[1, 1], "Kernel LDA", "第一核判别方向", "(d)"),
    ]
    for ax, name, xlabel, label in panel_info:
        _, zte = projections[name]
        for c, color in [(0, BLUE), (1, ORANGE)]:
            ax.hist(zte[yte == c], bins=28, density=True, alpha=0.52,
                    color=color, label=f"类 {c}")
        ax.set_xlabel(xlabel)
        ax.set_yticks([])
        ax.set_ylabel("密度")
        ax.legend(fontsize=8.3, loc="upper right")
        ax.text(0.02, 0.96, f"测试 1-NN: {accs[name]:.2f}",
                transform=ax.transAxes, ha="left", va="top",
                fontsize=9.0, color=INK)
        caption = {
            "PCA": "PCA：无监督，只找方差最大的方向",
            "LDA": "LDA：监督线性投影，最大化类间/类内比",
            "Kernel LDA": "GDA / kernel LDA：RBF 核的非线性投影",
        }[name]
        ax.text(0.5, -0.20, f"{label} {caption}", transform=ax.transAxes,
                ha="center", va="top", fontsize=9.8, color=INK)

    print("[lda] test 1-NN:", {k: round(v, 3) for k, v in accs.items()})
    return save(fig, "dimred-lda-kernel")


def fig_manifold_isomap_lle():
    """图 7：瑞士卷上的 PCA、Isomap 与 LLE。"""
    # 2000 个点、极低噪声：邻域图更接近真实流形，展开结果才稳定。
    # 噪声较大时邻居可能跨层连接，Isomap 会得到破碎的布局（正文有说明）。
    X, color = make_swiss_roll(n_samples=2000, noise=0.01, random_state=42)
    X_pca = PCA(n_components=2, random_state=42).fit_transform(X)
    X_iso = Isomap(n_neighbors=10, n_components=2).fit_transform(X)
    X_lle = LocallyLinearEmbedding(
        n_neighbors=10, n_components=2, random_state=42
    ).fit_transform(X)

    fig, axes = plt.subplots(1, 3, figsize=(15.5, 5.2), constrained_layout=True)
    data = [
        (X_pca, "成分 1", "成分 2", "PCA"),
        (X_iso, "Isomap 1", "Isomap 2", "Isomap"),
        (X_lle, "LLE 1", "LLE 2", "LLE"),
    ]
    for ax, (Z, xlabel, ylabel, title) in zip(axes, data):
        sc = ax.scatter(Z[:, 0], Z[:, 1], c=color, cmap=CMAP_ROLL, s=5, alpha=0.88)
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_title(title, fontsize=11.5, loc="left", pad=8)

    fig.colorbar(sc, ax=axes, shrink=0.78, label="沿瑞士卷的位置（真实流形坐标）")

    iso_corr = float(np.corrcoef(X_iso[:, 0], color)[0, 1])
    print("[manifold] Isomap axis-1 / position corr:", round(abs(iso_corr), 3))

    add_panel_caption(fig, axes[0], "(a)", "PCA 线性投影：卷层被压扁，长程结构没有展开")
    add_panel_caption(fig, axes[1], "(b)", "Isomap：测地距离 + MDS，展开成一条带")
    add_panel_caption(fig, axes[2], "(c)", "LLE：局部邻域保持，整体尺度会被拉伸")

    return save(fig, "dimred-manifold-isomap-lle")


def fig_autoencoder():
    """图 8：手写数字上的 2 维瓶颈自编码器。"""
    import torch
    import torch.nn as nn

    torch.manual_seed(42)
    np.random.seed(42)

    digits = load_digits()
    X = digits.data / 16.0
    y = digits.target
    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    Xtr_t = torch.tensor(Xtr, dtype=torch.float32)
    Xte_t = torch.tensor(Xte, dtype=torch.float32)

    class Autoencoder(nn.Module):
        def __init__(self):
            super().__init__()
            self.encoder = nn.Sequential(
                nn.Linear(64, 32), nn.Tanh(), nn.Linear(32, 2)
            )
            self.decoder = nn.Sequential(
                nn.Linear(2, 32), nn.Tanh(), nn.Linear(32, 64), nn.Sigmoid()
            )

        def forward(self, x):
            z = self.encoder(x)
            return z, self.decoder(z)

    model = Autoencoder()
    opt = torch.optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.MSELoss()
    losses = []

    for _ in range(250):
        model.train()
        perm = torch.randperm(len(Xtr_t))
        epoch_loss = 0.0
        for start in range(0, len(Xtr_t), 128):
            idx = perm[start:start + 128]
            xb = Xtr_t[idx]
            _, rec = model(xb)
            loss = loss_fn(rec, xb)
            opt.zero_grad()
            loss.backward()
            opt.step()
            epoch_loss += loss.item() * len(xb)
        losses.append(epoch_loss / len(Xtr_t))

    model.eval()
    with torch.no_grad():
        ztr, _ = model(Xtr_t)
        zte, rec_te = model(Xte_t)
        test_mse = float(loss_fn(rec_te, Xte_t).item())
    zte_np = zte.numpy()

    fig = plt.figure(figsize=(14.5, 7.4))
    gs = fig.add_gridspec(2, 2, height_ratios=[1.0, 0.75], hspace=0.26, wspace=0.20)

    ax_loss = fig.add_subplot(gs[0, 0])
    ax_loss.plot(np.arange(1, len(losses) + 1), losses, color=BLUE, lw=1.8)
    ax_loss.set_yscale("log")
    ax_loss.set_xlabel("epoch")
    ax_loss.set_ylabel("训练 MSE（对数）")
    ax_loss.set_title(f"训练损失（测试 MSE={test_mse:.4f}）",
                      fontsize=11.5, loc="left", pad=8)

    ax_lat = fig.add_subplot(gs[0, 1])
    sc = ax_lat.scatter(zte_np[:, 0], zte_np[:, 1], c=yte, cmap=CMAP_DIGITS,
                        s=12, alpha=0.85, vmin=0, vmax=9)
    ax_lat.set_xlabel("瓶颈维度 1")
    ax_lat.set_ylabel("瓶颈维度 2")
    ax_lat.set_title("二维瓶颈（测试集）", fontsize=11.5, loc="left", pad=8)
    cbar = fig.colorbar(sc, ax=ax_lat, shrink=0.82, pad=0.02, ticks=range(10))
    cbar.set_label("数字类别（颜色事后叠加）", fontsize=8.8)
    cbar.ax.tick_params(labelsize=7.5)

    gs_img = gs[1, :].subgridspec(2, 6, hspace=0.08, wspace=0.06)
    n_show = 6
    for i in range(n_show):
        ax_o = fig.add_subplot(gs_img[0, i])
        ax_r = fig.add_subplot(gs_img[1, i])
        ax_o.imshow(Xte[i].reshape(8, 8), cmap="gray_r", vmin=0, vmax=1)
        ax_r.imshow(rec_te[i].numpy().reshape(8, 8), cmap="gray_r", vmin=0, vmax=1)
        for ax in (ax_o, ax_r):
            ax.set_xticks([])
            ax.set_yticks([])
            for spine in ax.spines.values():
                spine.set_visible(False)
        if i == 0:
            ax_o.set_ylabel("原图", fontsize=8.5, rotation=90, labelpad=6)
            ax_r.set_ylabel("重构", fontsize=8.5, rotation=90, labelpad=6)

    fig.text(
        0.5, -0.02,
        "瓶颈只有 2 维，训练目标是最小化重构误差，不是类别分离；颜色未参与训练。",
        ha="center", va="top", fontsize=9.2, color=INK,
    )

    latent_acc = float(
        KNeighborsClassifier(n_neighbors=1).fit(ztr.numpy(), ytr).score(zte_np, yte)
    )
    print("[ae] test MSE:", round(test_mse, 5), "latent 1-NN:", round(latent_acc, 3))
    return save(fig, "dimred-autoencoder")


def main():
    funcs = [
        fig_method_map,
        fig_feature_filters,
        fig_wrapper_search,
        fig_ica_cocktail,
        fig_nmf_parts,
        fig_lda_kernel,
        fig_manifold_isomap_lle,
        fig_autoencoder,
    ]
    for fn in funcs:
        path = fn()
        print(f"已生成 {path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
