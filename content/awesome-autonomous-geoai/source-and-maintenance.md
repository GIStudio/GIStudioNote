---
title: "Awesome Autonomous GeoAI：来源、授权与更新方法"
description: "记录 GIStudioNote 整理版的上游来源、快照版本、目录映射、同步方法与 MIT 授权。"
tags:
  - GeoAI
  - Autonomous-GeoAI
  - AI4Science
  - awesome-list
source: https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai
source_commit: 2437033426f61cd557e645dfd8f73598d1332a6b
order: 90
---

# 来源、授权与更新方法

## 上游来源

- 仓库：[AutoGeoAI4Sci/awesome-autonomous-geoai](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai)
- 默认分支：`main`
- 本次快照：[`2437033426f61cd557e645dfd8f73598d1332a6b`](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai/commit/2437033426f61cd557e645dfd8f73598d1332a6b)
- 上游提交时间：`2026-07-26`
- 整理日期：`2026-07-29`

## 本地整理原则

1. 上游仍是资源条目的来源与贡献入口。
2. GIStudioNote 对 README 的二级栏目做完整映射，不遗漏资源栏目。
3. 本地只增加中文导航、阅读边界、来源提示和页面拆分。
4. 会议、职位、资助等时效性信息不在导入时自动判定有效。
5. 更新时如出现新的二级栏目，导入脚本会停止并要求人工决定归类，避免静默漏项。

## 页面映射

| 上游栏目                                                                | 本地页面                           |
| ----------------------------------------------------------------------- | ---------------------------------- |
| Books；Education                                                        | [[learning-resources]]             |
| Conferences；Research Groups；Journals                                  | [[research-community]]             |
| Selected Papers；Software                                               | [[papers-and-software]]            |
| Internship and Company                                                  | [[careers-and-industry]]           |
| Miscellaneous；Relevant Awesome Lists；Funding and Grants；Contributing | [[ecosystem-and-contributing]]     |
| RESEARCH_PHILOSOPHY.md                                                  | [[research-philosophy]]            |
| RESEARCH_PHILOSOPHY_SUMMARY_ZH.md                                       | [[research-philosophy-summary-zh]] |

## 更新步骤

```bash
git clone --depth 1 https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai.git /tmp/awesome-autonomous-geoai
UPSTREAM_COMMIT="$(git -C /tmp/awesome-autonomous-geoai rev-parse HEAD)" \
UPSTREAM_COMMIT_DATE="$(git -C /tmp/awesome-autonomous-geoai log -1 --format=%cs)" \
node scripts/import_awesome_autonomous_geoai.mjs /tmp/awesome-autonomous-geoai
npm run check
```

运行后应审阅差异，特别检查带日期的活动、职位、资助信息，以及上游内部链接。

## MIT License

以下授权文本来自上游仓库：

```text
MIT License

Copyright (c) 2026 AutonomousGeoAI4Science

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
