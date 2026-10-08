# /// script
# requires-python = ">=3.10"
# dependencies = ["scikit-learn>=1.3", "matplotlib>=3.8", "numpy>=1.24"]
# ///
"""为「降维可视化（PCA / t-SNE / UMAP / PaCMAP）」公开笔记生成 3 张 demo 图。

运行方式：
    uv run python scripts/generate_dimred_demo_figures.py

输出（content/DL/images/，SVG 为主、PNG 为网页回退）：
1. dimred-demo-swiss-roll.svg / .png
   瑞士卷数据（make_swiss_roll）：PCA 二维投影 vs t-SNE 二维投影。
   要点：PCA 把不同卷层压扁重叠，t-SNE 展开流形——
   支持正文论点「线性投影的弯曲结构重叠是预期边界」。
2. dimred-demo-supervised-vs-unsupervised.svg / .png
   load_digits（1797 个 8x8 数字，10 类）：
   (a) 无监督 t-SNE，颜色在投影完成后才按真实标签叠加（探索性证据）；
   (b) 监督 LDA 投影（标签参与优化，分离是算法被要求做到的）。
   两张图类别都分开，但解释含义不同，各子图下方的一句话说明明确区分。
3. dimred-demo-tsne-stability.svg / .png
   同一 digits 数据，t-SNE 用两个不同 random_state 得到的布局。
   要点：单次 t-SNE 布局不能证明结构稳定。
   （选择 random_state 而非 perplexity，因为要点是「单次布局的偶然性」，
   perplexity 变化属于超参数敏感性，是另一个论点。）

样式：字体基线走 scripts/matplotlib-style.mplstyle（Libertinus Sans + Noto Sans CJK SC），
配色按 vault palette 语义角色分配；子图说明放在各面板下方（不做 suptitle/axes title），
整图论点由页面 Markdown 图注承担。

所有随机步骤固定 random_state，可重复执行。
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap, to_rgb
from sklearn.datasets import load_digits, make_swiss_roll
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.manifold import TSNE

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


def tint(hex_color: str, frac: float = 0.45) -> str:
    """把 palette 色向白色混合，得到同族浅色，用于扩展类别色。"""
    r, g, b = to_rgb(hex_color)
    return "#{:02X}{:02X}{:02X}".format(
        *(round(255 + (c - 1) * 255 * frac) for c in (r, g, b))
    )


# digits 的 10 个无序类别：5 个基色 + 各自同族浅色（0–4 与 5–9 色相一一对应），
# 全部取自 vault palette 族，fig2 与 fig3 共用同一映射。
DIGITS10 = [
    SHIQI_PALETTE["primary_blue"],
    SHIQI_PALETTE["secondary_teal"],
    SHIQI_PALETTE["validation_violet"],
    SHIQI_PALETTE["accent_orange"],
    SHIQI_PALETTE["success"],
    tint(SHIQI_PALETTE["primary_blue"]),
    tint(SHIQI_PALETTE["secondary_teal"]),
    tint(SHIQI_PALETTE["validation_violet"]),
    tint(SHIQI_PALETTE["accent_orange"]),
    tint(SHIQI_PALETTE["success"]),
]
CMAP_DIGITS = LinearSegmentedColormap.from_list("shiqi_digits10", DIGITS10, N=10)

# 瑞士卷的颜色编码样本沿流形的真实位置（context/原始数据），
# 用语义上中性的 line -> primary_blue 顺序渐变，不用彩虹色。
CMAP_ROLL = LinearSegmentedColormap.from_list(
    "shiqi_roll", [SHIQI_PALETTE["line"], SHIQI_PALETTE["primary_blue"]]
)


def add_panel_caption(fig, ax, label: str, body: str, fontsize=10.5):
    """把「(a) 一句话说明」放到面板正下方。

    布局定型（constrained_layout）之后调用；位置由轴自身 tight bbox
    （含 xlabel 等标签）换算而来，不与刻度/xlabel 碰撞。
    label 以粗体呈现，body 常规体，整体按一块文本居中。
    """
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    bb = ax.get_tightbbox(renderer)
    w_px, h_px = fig.get_size_inches() * fig.dpi
    cx = (bb.x0 + bb.x1) / 2 / w_px
    y = bb.y0 / h_px - 0.015

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


def fig_swiss_roll():
    """图 1：瑞士卷上 PCA 压扁重叠 vs t-SNE 展开流形。"""
    X, color = make_swiss_roll(n_samples=1500, noise=0.1, random_state=42)

    # PCA：线性投影到前两主成分
    X_pca = PCA(n_components=2, random_state=42).fit_transform(X)

    # t-SNE：非线性展开（先 PCA 到 50 维加速，标准做法）
    X_tsne = TSNE(
        n_components=2, perplexity=30, random_state=42, init="pca"
    ).fit_transform(X)

    fig, axes = plt.subplots(1, 2, figsize=(12, 5.5), constrained_layout=True)
    for ax, (X2d, xlabel) in zip(
        axes, [(X_pca, "成分 1"), (X_tsne, "t-SNE 维度 1")]
    ):
        sc = ax.scatter(X2d[:, 0], X2d[:, 1], c=color, cmap=CMAP_ROLL, s=8, alpha=0.8)
        ax.set_xlabel(xlabel)
        ax.set_ylabel("成分 2" if xlabel == "成分 1" else "t-SNE 维度 2")
        ax.set_xticks([]), ax.set_yticks([])
    fig.colorbar(sc, ax=axes, shrink=0.8, label="沿卷轴的位置（真实流形坐标）")
    add_panel_caption(fig, axes[0], "(a)", "PCA 线性投影：不同卷层被压扁、重叠")
    add_panel_caption(fig, axes[1], "(b)", "t-SNE 非线性投影：流形被展开")
    return save(fig, "dimred-demo-swiss-roll")


def fig_supervised_vs_unsupervised():
    """图 2：digits 上无监督 t-SNE（事后着色）vs 监督 LDA（标签参与优化）。"""
    digits = load_digits()
    X, y = digits.data, digits.target

    # (a) 无监督 t-SNE：投影完全不用标签，颜色在投影完成后按真实标签叠加
    X_tsne = TSNE(n_components=2, perplexity=30, random_state=42, init="pca").fit_transform(X)

    # (b) 监督 LDA：标签参与优化目标本身
    X_lda = LinearDiscriminantAnalysis(n_components=2).fit_transform(X, y)

    fig, axes = plt.subplots(1, 2, figsize=(12, 5.5), constrained_layout=True)
    for ax, X2d in zip(axes, (X_tsne, X_lda)):
        sc = ax.scatter(
            X2d[:, 0], X2d[:, 1], c=y, cmap=CMAP_DIGITS, s=8, alpha=0.85, vmin=0, vmax=9
        )
        ax.set_xlabel("维度 1")
        ax.set_ylabel("维度 2")
        ax.set_xticks([]), ax.set_yticks([])
    fig.colorbar(sc, ax=axes, shrink=0.8, label="数字类别 0–9", ticks=range(10))
    add_panel_caption(
        fig, axes[0], "(a)", "无监督 t-SNE（探索性证据）：投影不使用标签，颜色是事后叠加的真实类别"
    )
    add_panel_caption(
        fig, axes[1], "(b)", "监督 LDA（标签参与优化）：分离是算法被要求做到的，不能当作独立发现"
    )
    return save(fig, "dimred-demo-supervised-vs-unsupervised")


def fig_tsne_stability():
    """图 3：同一数据、同一超参数，仅 random_state 不同，t-SNE 布局明显不同。"""
    digits = load_digits()
    X, y = digits.data, digits.target

    # 仅改变随机种子；perplexity 等超参数保持一致。
    # init 用默认的 "random" 而非 "pca"：pca 初始化会把全局排列钉死
    # （实测不同种子下类簇质心距离排列的 Spearman 相关为 1.0，只有微抖动），
    # 会低估单次布局的偶然性；random 初始化下种子 42 与 123 的排列相关仅 ~0.45。
    X_a = TSNE(n_components=2, perplexity=30, random_state=42, init="random").fit_transform(X)
    X_b = TSNE(n_components=2, perplexity=30, random_state=123, init="random").fit_transform(X)

    fig, axes = plt.subplots(1, 2, figsize=(12, 5.5), constrained_layout=True)
    for ax, (X2d, seed) in zip(axes, [(X_a, 42), (X_b, 123)]):
        sc = ax.scatter(X2d[:, 0], X2d[:, 1], c=y, cmap=CMAP_DIGITS, s=8, alpha=0.85, vmin=0, vmax=9)
        ax.set_xlabel("维度 1")
        ax.set_ylabel("维度 2")
        ax.set_xticks([]), ax.set_yticks([])
    fig.colorbar(sc, ax=axes, shrink=0.8, label="数字类别 0–9", ticks=range(10))
    add_panel_caption(fig, axes[0], "(a)", "t-SNE，random_state=42（perplexity=30 相同）")
    add_panel_caption(fig, axes[1], "(b)", "t-SNE，random_state=123（perplexity=30 相同）")
    return save(fig, "dimred-demo-tsne-stability")


def main():
    for fn in (fig_swiss_roll, fig_supervised_vs_unsupervised, fig_tsne_stability):
        path = fn()
        print(f"已生成 {path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
