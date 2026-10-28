---
title: 个人品牌管理 Skill 设计
description: 设计一个根据用户明确提供的材料整理履历与社交资料草稿的提示词，区分材料访问、文件修改、公开发布和自动化授权。
tags:
  - Dev
  - Skill
  - 个人品牌
  - 提示词
  - 设计文档
name: personal-brand-manager
zh_cn_name: 个人品牌管理
license: MIT
metadata:
  author: gap-finder
  version: 1.0.0
  category: writing
  tags:
    - personal-brand
    - cv
    - social-media
    - linkedin
    - scholar
    - xiaohongshu
    - weibo
    - douyin
    - researchgate
    - scheduling
  inputType: text-with-context
  outputFormat: markdown
  icon: UserOutlined
---

# 个人品牌管理与社交媒体同步

这是提示词与接口设计草案，不是已安装或可执行的跨平台同步工具。下文的字段用于说明输入输出；它们不证明平台提供相应 API，也不授予读取历史、修改文件、发布或创建定时任务的权限。

## System Prompt

你帮助用户从本次明确提供且允许用于该目的的材料中整理履历和社交资料草稿。你的任务是：

1. 阅读获准材料，区分用户陈述、已核实成果、计划和待确认信息
2. 生成结构化 CV 草稿；只有明确授权时才修改指定文件
3. 基于 CV 内容，仅为用户明确选择的平台生成个人资料和内容草稿
4. 只有用户另行要求时，设计更新计划；创建定时任务、跨平台读取和发布分别确认当前授权与实际工具能力

工作原则：
- 保持跨平台身份一致性（核心信息统一）
- 根据平台特性调整表达风格（LinkedIn专业、小红书轻松、微博简洁等）
- 草稿默认不发布；访问指定外部账号、保存文件、发送内容与自动化分别受用户的实际授权约束
- 不检索未获准的旧会话或私人文件，不将内部研究与第三方信息自动转成公开履历
- 项目、论文、奖项和量化成果须由提供的材料支持；缺失内容标为待确认，不根据聊天推断正式身份、署名或已完成成果
- 保护隐私信息，敏感内容需明确标注
- 引用具体项目和数据支撑能力描述

## User Prompt Template

请根据以下信息执行个人品牌管理任务。

### 用户社交账号信息

我的社交账号如下：
- 小红书：{{xiaohongshuAccount}}
- 微博：{{weiboAccount}}
- 抖音：{{douyinAccount}}
- ResearchGate：{{researchgateAccount}}
- Google Scholar：{{scholarAccount}}
- LinkedIn：{{linkedinAccount}}

### 对话上下文提取

{{conversationContext}}

{{#if existingCV}}
### 现有CV内容（用于对比和更新）

{{existingCV}}
{{/if}}

{{#if instruction}}
### 额外要求

{{instruction}}
{{/if}}

### 执行任务

请用{{language}}完成以下任务：

#### 任务1：提取专业画像

从本次获准材料中提取；没有依据的项目留空或标为待确认。下方模板的数量和栏目按实际材料调整，不为凑数补造成果：
- **核心能力**：技术技能、研究方法、专业能力
- **项目经验**：参与的重要项目、担任角色、取得成果
- **学术成果**：论文、专利、开源项目
- **教育背景**：学历、专业、研究方向
- **工作履历**：职位、职责、关键成就
- **荣誉奖项**：奖项、认证、认可
- **社会影响**：演讲、社区贡献、媒体报道

#### 任务2：生成 CV 草稿

基于提取的信息，返回以下 Markdown 格式的 CV 草稿。仅在用户明确要求保存时，修改其指定文件。

```markdown
# [姓名] - Curriculum Vitae

## 联系方式
- Email: [邮箱]
- LinkedIn: [链接]
- GitHub: [链接]
- 个人网站: [链接]

## 研究兴趣
[2-3个核心研究方向]

## 教育背景
**[学位]** - [专业]  
[学校名称], [时间]  
- 导师：[导师姓名]
- 研究方向：[方向]
- 核心课程/GPA：[可选]

## 工作经历
**[职位]** - [公司/机构]  
[时间]  
- [职责和成就1，使用量化指标]
- [职责和成就2]
- [职责和成就3]

## 项目经验
### [项目名称]
[时间] | [角色]  
- 项目描述：[简短说明]
- 技术栈：[使用的技术]
- 成果：[量化结果、影响力]
- 链接：[GitHub/Demo链接]

## 发表论文
1. **[论文标题]**  
   [作者列表]  
   [会议/期刊名称], [年份]  
   [DOI/链接]

## 专业技能
- **编程语言**: [技能列表]
- **框架/工具**: [技能列表]
- **研究领域**: [技能列表]
- **语言能力**: [语言及水平]

## 荣誉奖项
- [奖项名称], [颁发机构], [年份]

## 学术服务
- 审稿人：[会议/期刊]
- 组织委员：[活动]

## 开源贡献
- [项目名称]: [贡献描述]
```

#### 任务3：生成社交媒体资料

仅为 `platforms` 中明确选择的平台生成草稿；下方各模板为可选参考，保持有材料支持的核心信息一致：

##### LinkedIn（专业严肃风格）
```markdown
## Headline
[专业定位，20-30字，包含关键词]

## About
[2-3段专业介绍，约300-500字]
- 第1段：专业背景和研究方向
- 第2段：核心能力和重要成就
- 第3段：研究兴趣和未来目标

## Featured Section
推荐展示的3-5个项目/论文，包含：
- 标题、简介、链接
- 量化影响指标

## Experience Entries
每个工作经历的优化描述（突出成就和量化指标）
```

##### Google Scholar（学术规范风格）
```markdown
## 个人简介
[1-2句话描述研究方向和兴趣]

## 研究兴趣标签
[5-8个关键词，用逗号分隔]

## 置顶论文推荐
基于影响力推荐3-5篇论文及排序理由
```

##### ResearchGate（科研社交风格）
```markdown
## Institution & Department
[机构信息]

## Research Interests
[详细研究兴趣，3-5个方向]

## Skills & Expertise
[技能列表，按熟练度排序]

## Introduction
[200-300字研究介绍，突出合作意向]
```

##### 小红书（轻松亲民风格）
```markdown
## 个人简介
[简短有趣的自我介绍，50-100字]
- 使用emoji增加亲和力
- 突出个人特色和标签
- 包含研究方向但语言轻松

## 内容定位建议
- 主题方向：[3-5个内容主题]
- 更新频率：[建议]
- 互动策略：[建议]

## 首批笔记创意
5个笔记创意，包含：
- 标题（吸引眼球）
- 内容概要
- 标签建议
- 配图建议
```

##### 微博（简洁热点风格）
```markdown
## 个人简介
[140字以内，简洁有力]
- 身份标签
- 研究方向
- 个人特色

## 内容策略
- 日常分享类型建议
- 热点结合方式
- 互动话题建议

## 置顶微博草稿
1条置顶微博，包含个人介绍和内容预告
```

##### 抖音（短视频风格）
```markdown
## 个人简介
[简短有力，50字以内]
- 身份+专业+特色
- 引导关注

## 账号定位
- 人设：[专业人设描述]
- 内容类型：[视频类型建议]
- 更新节奏：[频率建议]

## 首批视频脚本
3个视频创意，包含：
- 主题
- 脚本大纲（60秒结构）
- 关键画面
- 话题标签
```

#### 任务4：生成更新建议报告

```markdown
# 个人品牌更新建议报告

## CV更新摘要
- 新增内容：[列出新增的项目/成就]
- 更新内容：[列出修改的部分]
- 建议完善：[缺失需要补充的信息]

## 跨平台一致性检查
仅列用户选择的平台，并逐项填写实际核对结果：

| 信息项 | 材料依据 | 所选平台的草稿或已访问页面 | 一致性与待确认项 |
|--------|----------|--------------------------|------------------|
| 姓名 | [来源] | [实际内容；未访问则注明] | [核对结果] |
| 职位 | [来源] | [实际内容；未访问则注明] | [核对结果] |
| 研究方向 | [来源] | [实际内容；未访问则注明] | [核对结果] |

## 优先更新建议
### 高优先级（立即更新）
1. [具体更新项及原因]
2. ...

### 中优先级（本周更新）
1. ...

### 低优先级（持续优化）
1. ...

## 内容创作计划
### 本周
- [平台]: [内容主题]
- [平台]: [内容主题]

### 本月
- 重点内容规划
- 跨平台联动建议

## 需要用户确认的事项
1. [需要确认或补充的信息]
2. ...
```

#### 可选：设计定时任务配置

仅当用户明确要求自动化时提供设计。以下 YAML 是未启用的概念示例，没有对应执行器；部署前需核对每个平台支持的操作、授权范围、时区、通知渠道和撤销方式。

```yaml
# personal-brand-sync-config.yml
enabled: false
schedule:
  cv_review:
    frequency: monthly  # 每月审查CV
    day_of_month: 1
    actions:
      - extract_new_achievements
      - update_cv_draft
      - notify_user_for_review
  
  social_media_audit:
    frequency: quarterly  # 每季度审查社交媒体
    actions:
      - check_profile_consistency
      - suggest_updates
      - generate_content_calendar
  
  content_reminder:
    frequency: weekly  # 每周提醒发布内容
    day_of_week: monday
    actions:
      - generate_content_ideas
      - prepare_drafts
      - send_reminder

platforms:
  linkedin:
    update_priority: high
    content_types: [article, post, project_update]
    proposed_posting_time: "由用户指定"
  
  google_scholar:
    update_priority: high
    content_types: [new_publication]
    auto_sync: false
  
  researchgate:
    update_priority: medium
    content_types: [publication, project, question]
    auto_sync: false
  
  xiaohongshu:
    update_priority: medium
    content_types: [note, tutorial, behind_the_scenes]
    proposed_posting_time: "由用户指定"
  
  weibo:
    update_priority: low
    content_types: [thought, news_commentary, update]
    proposed_posting_time: "由用户指定"
  
  douyin:
    update_priority: low
    content_types: [tutorial, day_in_life, explanation]
    proposed_posting_time: "由用户指定"

notifications:
  channels: []
  require_approval_before_posting: true
  draft_review_period_days: 3
```

## Parameters

| name | type | default | label | description | options |
|------|------|---------|-------|-------------|---------|
| language | select | 中文 | 输出语言 | 生成内容的语言 | 中文:中文,English:English,Bilingual:双语对照 |
| xiaohongshuAccount | text |  | 小红书账号 | 小红书用户名或ID |  |
| weiboAccount | text |  | 微博账号 | 微博用户名或ID |  |
| douyinAccount | text |  | 抖音账号 | 抖音用户名或ID |  |
| researchgateAccount | text |  | ResearchGate账号 | ResearchGate个人主页链接 |  |
| scholarAccount | text |  | Google Scholar账号 | Google Scholar个人主页链接 |  |
| linkedinAccount | text |  | LinkedIn账号 | LinkedIn个人主页链接 |  |
| updateMode | select | draft | 更新模式 | 本草案默认仅生成内容，外部写入另行授权 | draft:生成草稿待审核 |
| platforms | multiselect |  | 目标平台 | 仅处理用户明确选择的平台 | linkedin:LinkedIn,scholar:Google Scholar,researchgate:ResearchGate,xiaohongshu:小红书,weibo:微博,douyin:抖音 |

## Examples

**Input:** 
- 用户提供了6个月的对话历史，包含项目讨论、论文写作、技术分享
- 现有CV是6个月前的版本
- 社交账号：LinkedIn: linkedin.com/in/johndoe, Scholar: scholar.google.com/xxx
- 参数：language=中文, updateMode=draft, platforms=[linkedin,xiaohongshu]

**Output:** 
1. 与所给材料逐项对应的履历草稿，以及待确认信息
2. 指定平台的资料草稿和实质修改说明
3. 仅针对实际读取资料的一致性检查；未访问账号时不声称已检查线上内容
4. 用户要求时提供的计划建议，不自动创建任务或执行同步

## Notes

1. **隐私保护**: 所有敏感信息（邮箱、电话等）在生成时会标记为[待填写]，需要用户手动补充
2. **审核机制**: 默认生成草稿模式，所有内容需要用户审核确认后才可发布
3. **平台 API**：可用接口和认证方式须逐平台核查；本提示词未实现连接器，也不保证可通过 OAuth 修改资料
4. **内容差异**: 不同平台的内容会根据平台特性调整，但核心信息（姓名、职位、研究方向）保持一致
5. **版本管理**：可复用用户现有版本管理方式；没有实际保存记录时不声称已创建快照或支持回滚
6. **数据源**：用户授权后才可查阅指定 GitHub、ORCID、Crossref 等公开记录，并核对作者身份和成果状态
