---
title: " 字体"
---
上述错误表明 `matplotlib` 无法找到你指定的中文字体（如 `WenQuanYi Micro Hei`）。这通常是由于字体未正确安装、字体名称不匹配或 `matplotlib` 的字体缓存问题导致的。以下是详细的排查和解决方法：

---

### **步骤 1：确认字体是否已正确安装**
运行以下命令，检查系统中是否安装了 `WenQuanYi Micro Hei` 字体：
```bash
fc-list :lang=zh | grep "WenQuanYi Micro Hei"
```
如果没有任何输出，说明该字体未正确安装。

#### **安装 WenQuanYi Micro Hei 字体**
如果字体未安装，可以通过以下命令安装：
```bash
sudo apt update
sudo apt install fonts-wqy-microhei
```

安装完成后，再次运行以下命令验证：
```bash
fc-list :lang=zh | grep "WenQuanYi Micro Hei"
```
你应该会看到类似以下输出：
```
/usr/share/fonts/truetype/wqy/wqy-microhei.ttc: WenQuanYi Micro Hei:style=Regular
```

---

### **步骤 2：确认字体名称是否正确**
`matplotlib` 使用的字体名称必须与 `fc-list` 输出的名称完全一致。例如，`fc-list` 显示的字体名称是 `WenQuanYi Micro Hei`，而不是 `Micro Hei` 或其他变体。

你可以通过以下代码列出 `matplotlib` 可用的字体：
```python
from matplotlib import font_manager

# 列出所有可用字体
for font in font_manager.findSystemFonts(fontpaths=None, fontext='ttf'):
    print(font_manager.FontProperties(fname=font).get_name())
```
在输出中查找 `WenQuanYi Micro Hei`，确保其名称与 `plt.rcParams['font.sans-serif']` 中的名称一致。

---

### **步骤 3：清除 matplotlib 字体缓存**
有时，`matplotlib` 的字体缓存可能导致字体未正确加载。按照以下步骤清除缓存：

1. 找到 `matplotlib` 的缓存目录：
   ```python
   import matplotlib
   print(matplotlib.get_cachedir())
   ```
   输出可能是类似 `/home/用户名/.cache/matplotlib` 的路径。

2. 删除缓存文件：
   ```bash
   rm -rf /home/用户名/.cache/matplotlib/*
   ```

---

### **步骤 4：更新代码中的字体配置**
确保代码中的字体配置正确无误。以下是更新后的完整代码示例：

```python
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.font_manager import FontProperties

# 配置中文字体
plt.rcParams['font.sans-serif'] = ['WenQuanYi Micro Hei', 'Noto Sans CJK SC', 'SimHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False  # 解决负号显示问题

# 绘制 road_with_landuse 地图
fig, ax = plt.subplots(1, figsize=(12, 10))

# 根据 Landuse_Type 字段着色
road_with_landuse.plot(column='Landuse_Type', cmap='tab20', legend=True, 
             legend_kwds={'title': '土地利用类型', 'prop': {'family': 'WenQuanYi Micro Hei'}}, ax=ax)

# 设置标题和坐标轴标签（使用中文）
ax.set_title('道路网络与土地利用属性', fontsize=16)
ax.set_xlabel('经度', fontsize=12)
ax.set_ylabel('纬度', fontsize=12)

# 显示地图
plt.tight_layout()
plt.show()
```

---

### **步骤 5：测试其他字体**
如果 `WenQuanYi Micro Hei` 仍然不可用，可以尝试其他中文字体。例如，安装并使用 `Noto Sans CJK`：
```bash
sudo apt install fonts-noto-cjk
```
然后将代码中的字体列表更新为：
```python
plt.rcParams['font.sans-serif'] = ['Noto Sans CJK SC', 'WenQuanYi Micro Hei', 'SimHei', 'Arial Unicode MS']
```

---

### **步骤 6：手动指定字体路径**
如果上述方法仍无法解决问题，可以直接指定字体文件的路径。例如：
```python
from matplotlib import font_manager

# 指定字体文件路径
font_path = "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"  # 替换为实际路径
font_prop = font_manager.FontProperties(fname=font_path)

# 配置中文字体
plt.rcParams['font.sans-serif'] = [font_prop.get_name()]
plt.rcParams['axes.unicode_minus'] = False

# 测试绘图
plt.text(0.5, 0.5, '测试中文显示', fontproperties=font_prop, fontsize=16)
plt.show()
```

---

### **总结**
1. 确保字体已正确安装，并通过 `fc-list` 验证。
2. 确保字体名称与 `matplotlib` 配置一致。
3. 清除 `matplotlib` 的字体缓存。
4. 如果问题仍未解决，可以手动指定字体路径。

完成上述步骤后，应该能够解决 `findfont` 错误并成功显示中文。如果仍有问题，请提供更多信息（如 `fc-list` 输出结果），以便进一步排查！