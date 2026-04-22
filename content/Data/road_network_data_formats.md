---
title: "路网数据格式：FGDB与GML"
tags:
  - 数据格式
  - GIS
  - 路网数据
  - FGDB
  - GML
  - FileGDB
  - 地理空间数据
---

# 路网数据格式：FGDB与GML

## 一、概述

路网数据是城市规划、交通分析、导航系统等领域的基础空间数据。常用的路网数据格式包括 **FGDB (File Geodatabase)** 和 **GML (Geography Markup Language)**。本文介绍这两种格式的特点、结构和使用场景。

## 二、FGDB (File Geodatabase)

### 2.1 格式定义

FGDB 是 **ESRI File Geodatabase** 的简称，是一种由 Esri 公司开发的专有二进制空间数据格式，以 `.gdb` 为文件扩展名。一个 FGDB 实际上是一个文件夹，内部包含多个系统文件和数据表。

### 2.2 技术特性

| 特性 | 说明 |
|------|------|
| **存储结构** | 文件夹形式，包含多个二进制文件 |
| **容量限制** | 单个文件数据库最大 1 TB |
| **坐标系统** | 支持所有 ArcGIS 支持的坐标系统 |
| **几何类型** | 点、线、面、多点、多面体、表面 |
| **拓扑关系** | 支持复杂拓扑规则和拓扑检查 |
| **网络数据集** | 原生支持网络数据集（用于路网分析） |
| **压缩格式** | 可启用空间索引压缩 |

### 2.3 路网数据中的典型数据结构

FGDB 中的路网数据通常包含以下要素类（Feature Class）：

```
RoadNetwork.gdb/
├── RoadLink/              # 道路路段（线要素）
│   ├── RoadID
│   ├── RoadName
│   ├── RoadClass
│   ├── Length
│   ├── SpeedLimit
│   └── Geometry (Polyline)
├── RoadNode/              # 道路节点（点要素）
│   ├── NodeID
│   ├── NodeType
│   ├── Connectivity
│   └── Geometry (Point)
├── RoadAttribute/         # 道路属性表
│   ├── RoadID
│   ├── SurfaceType
│   ├── LaneCount
│   └── OneWay
└── Address/               # 地址参考表
```

### 2.4 优缺点

**优点：**
- 高效的读写性能，适合大数据量
- 原生支持网络数据集和拓扑关系
- 支持复杂属性和关系类
- ArcGIS 生态系统的首选格式

**缺点：**
- 专有格式，跨平台支持有限
- 需要专门的库才能读取（如 GDAL 的 OpenFileGDB 驱动）
- 非纯文本格式，不便于人工检查

### 2.5 软件支持

- **原生支持**：ArcGIS Desktop, ArcGIS Pro, ArcGIS Enterprise
- **开源支持**：GDAL (OpenFileGDB 驱动), Python (fiona, geopandas)
- **其他**：AutoCAD Map 3D, QGIS (通过 GDAL)

## 三、GML (Geography Markup Language)

### 3.1 格式定义

GML 是 **Geography Markup Language** 的简称，是由 **Open Geospatial Consortium (OGC)** 制定的 XML 编码标准，用于表示地理空间数据。文件扩展名通常为 `.gml`。

### 3.2 技术特性

| 特性 | 说明 |
|------|------|
| **编码格式** | XML 纯文本 |
| **标准规范** | OGC GML 3.x / 2.x |
| **几何类型** | Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, Curve, Surface |
| **坐标系统** | 通过 srsName 属性指定 EPSG 代码 |
| **自描述性** | XML Schema 定义数据结构 |
| **可扩展性** | 支持自定义应用模式 |

### 3.3 GML 文件结构示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gml:FeatureCollection
  xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xsi:schemaLocation="http://www.opengis.net/gml/3.2 http://schemas.opengis.net/gml/3.2.1/gml.xsd">

  <gml:featureMember>
    <RoadLink gml:id="RL_001">
      <RoadID>RL_001</RoadID>
      <RoadName>香港仔大道</RoadName>
      <RoadClass>Primary</RoadClass>
      <SpeedLimit>50</SpeedLimit>
      <gml:LineString srsName="EPSG:2326">
        <gml:posList>
          829500.5 815200.3 829650.8 815350.1
        </gml:posList>
      </gml:LineString>
    </RoadLink>
  </gml:featureMember>

  <gml:featureMember>
    <RoadNode gml:id="RN_001">
      <NodeID>RN_001</NodeID>
      <NodeType>Junction</NodeType>
      <gml:Point srsName="EPSG:2326">
        <gml:pos>829500.5 815200.3</gml:pos>
      </gml:Point>
    </RoadNode>
  </gml:featureMember>

</gml:FeatureCollection>
```

### 3.4 路网数据中的典型应用

GML 常用于以下路网场景：

| 应用场景 | GML 特点 |
|----------|----------|
| **城市路网发布** | INSPIRE 规范的路网数据交换格式 |
| **政府开放数据** | 香港路网数据通过 GML 格式提供 |
| **跨系统数据交换** | XML 格式便于不同系统间解析 |
| **Web 服务** | WFS 规范基于 GML 传输空间数据 |

### 3.5 优缺点

**优点：**
- 纯文本格式，人类可读
- 基于 XML，便于解析和验证
- 开放标准，跨平台跨系统兼容
- 支持 Schema 验证数据质量
- Web 友好的格式（WFS、WCS）

**缺点：**
- 文件体积大（XML 语法开销）
- 解析效率不如二进制格式
- 不原生支持拓扑和网络数据集
- 复杂几何数据冗长

## 四、FGDB 与 GML 对比

| 对比维度 | FGDB | GML |
|----------|------|-----|
| **格式类型** | 二进制 | XML 文本 |
| **标准** | Esri 专有 | OGC 开放标准 |
| **文件大小** | 较小（压缩存储） | 较大（文本开销） |
| **读写性能** | 高效 | 相对较慢 |
| **人类可读** | 否 | 是 |
| **跨平台兼容** | 依赖 GDAL | 良好 |
| **拓扑支持** | 原生支持 | 需额外处理 |
| **网络数据集** | 原生支持 | 不支持 |
| **Web 服务** | 需转换 | 原生支持 WFS |
| **适用场景** | GIS 分析、编辑 | 数据交换、发布 |

## 五、实际应用示例

### 5.1 香港路网数据

香港政府开放数据平台提供路网数据（Road Network V2），支持以下格式：

- **FGDB**：适合 ArcGIS 用户进行网络分析
- **GML**：适合 Web 应用和跨系统集成
- **SHP (Shapefile)**：通用格式，兼容性最好

### 5.2 数据获取示例

```bash
# 使用 GDAL 查看 FGDB 内容
ogrinfo road_network.gdb

# 使用 GDAL 转换 GML 为 GeoJSON
ogr2ogr -f GeoJSON output.geojson input.gml

# 使用 GDAL 查看 GML 结构
ogrinfo -al -geom=no input.gml
```

### 5.3 Python 读取示例

```python
import geopandas as gpd

# 读取 FGDB 中的道路图层
gdf = gpd.read_file("road_network.gdb", layer="RoadLink")

# 读取 GML 文件
gdf = gpd.read_file("road_network.gml")

# 查看数据
print(gdf.columns)
print(gdf.head())
```

## 六、选择建议

| 场景 | 推荐格式 |
|------|----------|
| ArcGIS 环境下的路网分析 | FGDB |
| 需要网络数据集和拓扑 | FGDB |
| 政府开放数据下载 | GML |
| Web 应用开发 | GML |
| 跨平台数据交换 | GML |
| 数据备份和存档 | FGDB（压缩） |
| 快速原型开发 | SHP |

## 七、总结

- **FGDB** 是 Esri 生态的核心格式，适合专业的 GIS 分析和网络建模，性能优异但跨平台支持有限
- **GML** 是 OGC 开放标准，以 XML 格式提供，优势在于跨系统兼容性和 Web 友好性
- 路网数据的选择应根据具体使用场景、技术栈和协作需求综合考虑

## 八、参考资料

- [OGC GML Standard](https://www.ogc.org/standards/gml)
- [GDAL OpenFileGDB Driver](https://gdal.org/drivers/vector/openfilegdb.html)
- [ESRI File Geodatabase](https://www.esri.com/en-us/arcgis/products/file-geodatabases)
