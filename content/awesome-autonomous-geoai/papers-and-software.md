---
title: "研究资源：论文与软件"
description: "Autonomous GeoAI 相关代表性论文，以及 Python、R 和 GIS 集成工具。"
tags:
  - GeoAI
  - Autonomous-GeoAI
  - AI4Science
  - awesome-list
source: https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai
source_commit: 37f10a9ffb4abb44710086a806899e1d7e397873
order: 12
---

# 研究资源：论文与软件

Autonomous GeoAI 相关代表性论文，以及 Python、R 和 GIS 集成工具。

> [!info] 来源与版本
> 本页整理自 [AutoGeoAI4Sci/awesome-autonomous-geoai](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai)，上游 commit [`37f10a9`](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai/commit/37f10a9ffb4abb44710086a806899e1d7e397873)（2026-08-24）。
> GIStudioNote 只调整文档结构与导航；资源描述和外部链接来自上游，时效性与准确性请以原项目及链接目标为准。

## Selected Papers

A curated list of representative papers related to computer vision, GeoAI, and remote sensing,
with an emphasis on **CVPR and top-tier computer vision workshops**.

---

- **EarthVision @ CVPR** — _Large Scale Computer Vision for Remote Sensing Imagery_  
  A long-running CVPR workshop focusing on computer vision and machine learning methods for Earth observation and remote sensing.  
  📄 Proceedings: https://openaccess.thecvf.com/CVPR2025_workshops/EarthVision

- **MORSE @ CVPR** — _Foundation and Large Vision Models in Remote Sensing_  
  Workshop dedicated to foundation models, large vision models, and multimodal learning for remote sensing and geospatial analysis.  
  📄 Proceedings: https://openaccess.thecvf.com/CVPR2025_workshops/MORSE

- **CV4EO @ WACV** — _Computer Vision for Earth Observation Applications_  
  Focuses on practical and methodological advances in applying computer vision to Earth observation data.  
  🔗 Workshop hub: https://wacv.thecvf.com/Conferences/2026/Workshops

---

> 📌 _This list will be continuously updated with papers from CVPR, ICCV, ECCV, ICLR, AAAI, and KDD workshops and tracks related to GeoAI, remote sensing, and AI4Science._

---

## Software

> Focus on **accessible introductions to computational tools** for GeoAI and AI4Science,  
> with an emphasis on **open-source**, **reproducible**, and **research-oriented** software ecosystems.

---

### Python

- **Awesome Python** — A curated list of Python frameworks, libraries, and software  
  https://github.com/vinta/awesome-python

- **PyTorch** — Deep learning framework widely used in GeoAI and AI4Science  
  https://pytorch.org/

- **Hugging Face Transformers** — Foundation models and multimodal learning toolkit  
  https://huggingface.co/docs/transformers

- **gfm-leaderboard** — Open-source benchmark and leaderboard infrastructure for comparing geospatial foundation models, with emphasis on evaluation transparency, reproducibility, and cross-model assessment in Earth observation workflows.  
  https://github.com/taylor-geospatial/gfm-leaderboard

- **GeoPandas** — Geospatial data structures and spatial operations in Python  
  https://geopandas.org/

- **Rasterio** — Raster data access and processing  
  https://rasterio.readthedocs.io/

- **xarray** — Labeled multi-dimensional arrays for climate and Earth system data  
  https://docs.xarray.dev/

- **scikit-learn** — Classical machine learning and data mining  
  https://scikit-learn.org/

---

### R

- **Awesome R** — Curated resources for R programming and data science  
  https://github.com/qinwf/awesome-R

- **sf** — Simple features for vector spatial data  
  https://r-spatial.github.io/sf/

- **terra** — Modern raster data processing in R  
  https://rspatial.org/terra/

- **tidyverse** — Data science tools for structured data analysis  
  https://www.tidyverse.org/

---

### GIS-Integrated Tools

- **ArcGIS Pro / ArcGIS API for Python** — GIS-native spatial analysis and GeoAI workflows  
  https://developers.arcgis.com/python/

- **QGIS** — Open-source desktop GIS with extensive plugin ecosystem  
  https://www.qgis.org/

- **Google Earth Engine** — Cloud-based geospatial analysis platform for Earth observation  
  https://earthengine.google.com/

- **Google Flood Hub**: Public Google Research platform for AI-driven flood forecasting, river-gauge monitoring, flood alerts, and local inundation probability/history layers.<br>
  It combines hydrology and inundation models to support flood preparedness up to 7 days in advance. Intended users include disaster agencies, NGOs, researchers, and people in flood-prone areas. Forecasts are informational and should be checked against official local sources.<br>
  https://sites.research.google/floods/l/0/0/3

- **GRASS GIS** — Advanced geospatial analysis and modeling system  
  https://grass.osgeo.org/

- **PostGIS** — Spatial database extension for PostgreSQL  
  https://postgis.net/

- **CesiumJS** — Open-source JavaScript library for 3D globes and maps; renders high-precision geospatial data and 3D tiles in the browser for visualization and digital-twin applications  
  https://cesium.com/platform/cesiumjs/

### Generative Earth & World Models

> Platforms where generative models are conditioned on real geospatial data
> (terrain, imagery, camera pose) — and the emerging trust/provenance issues they raise.

- **Google Earth × Nano Banana 2** — Geospatially grounded image generation inside
  Google Earth (web): generation conditioned on the current viewport's satellite basemap,
  3D terrain mesh, and camera parameters, with Gemini search grounding for landmark facts.
  Notably **pulled within a day of launch** after photorealistic edits of real landmarks
  raised misinformation concerns, then re-released with added safeguards — an early case
  study in provenance and governance for geo-referenced generative imagery.<br>
  🔗 https://blog.google/products-and-platforms/products/earth/nano-banana-google-earth-image-generation/<br>
  📰 Hands-on: https://www.zdnet.com/article/google-earth-added-nano-banana-and-i-immediately-reimagined-philly-with-zombies-and-evil-clowns/
