---
title: "职业发展与产业地图"
description: "博士与学术职业资源、博士后机会、实习机会、GeoAI 与 Physical AI 公司。"
tags:
  - GeoAI
  - Autonomous-GeoAI
  - AI4Science
  - awesome-list
source: https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai
source_commit: 37f10a9ffb4abb44710086a806899e1d7e397873
order: 13
---

# 职业发展与产业地图

博士与学术职业资源、博士后机会、实习机会、GeoAI 与 Physical AI 公司。

> [!info] 来源与版本
> 本页整理自 [AutoGeoAI4Sci/awesome-autonomous-geoai](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai)，上游 commit [`37f10a9`](https://github.com/AutoGeoAI4Sci/awesome-autonomous-geoai/commit/37f10a9ffb4abb44710086a806899e1d7e397873)（2026-08-24）。
> GIStudioNote 只调整文档结构与导航；资源描述和外部链接来自上游，时效性与准确性请以原项目及链接目标为准。

## Internship and Company

### PhD and Academic Career Resources

- **CSPhD.org (博士栈)** — A free, Chinese-speaking community for PhD students and early-career researchers in computer science, AI, electrical engineering, and statistics. It shares PhD and research-assistant opportunities, internships and full-time roles, postdoctoral and faculty resources, peer-review invitations, and conference networking opportunities.<br>
  Rooted in North America and open to a global audience, it is a useful career and community resource for Autonomous GeoAI researchers navigating doctoral study and academic or industry transitions.<br>
  https://csphd.org/index.html

### **Esri (Environmental Systems Research Institute)**

_Focus:_ GeoAI · Spatial Data Science · GIScience · AI-Integrated GIS

Esri provides selective internship opportunities suitable for graduate students and PhD researchers working at the intersection of **geographic information science (GIScience)** and **artificial intelligence**. In addition to traditional GIS roles, Esri maintains dedicated **research- and GeoAI-oriented teams** that focus on spatial machine learning, deep learning for geospatial data, and the integration of AI models into GIS platforms.

**Relevant internship tracks include:**

- Research Intern (GeoAI / Spatial Data Science)
- AI / Machine Learning Intern (Geospatial focus)
- Spatial Data Science Intern

These internships typically emphasize:

- Spatial representation learning and geospatial machine learning
- Integration of deep learning models with GIS workflows (e.g., ArcGIS, spatial databases)
- Applied research with potential pathways to publications or long-term research collaboration

_Location:_ Redlands, CA  
_International students:_ CPT / J-1 supported for research-oriented roles  
_Website:_ https://www.esri.com/careers

> **Note:** Applicants should distinguish research- and AI-focused internships from general GIS or cartography roles, which are more application-oriented and less aligned with research-driven GeoAI trajectories.

### **ByteDance Seed — STEM Scientist Program (Seed STEM 科学家计划)**

_Focus:_ AI4Science · Foundation Models · Mathematics · Physics · Chemistry · Biology · Materials Science

ByteDance's **Seed** team (the group behind Seed 2.1, Seedance, Seedream, and related foundation models) is inviting **100 outstanding researchers from frontier STEM fields** to work on-site with the Seed team on **real scientific research problems**, using AI to accelerate scientific discovery and push the boundaries of machine intelligence. The first cohort runs for approximately **6 months**.

**Two participation tracks:**

- **Scientist Advisor** — scholars at academic institutions or senior industry experts in STEM fields
- **PhD Research Intern** — current PhD students with strong interest in exploring frontier problems with AI

**Who should apply:**

- Holds or is pursuing a PhD in a STEM field (or equivalent research experience)
- Deep academic grounding and thorough understanding of their discipline
- Strong conviction in AI-accelerated scientific discovery, with clear judgment of AI's application value and current capability boundaries in their own field
- Uses AI extensively as a productivity tool in daily research; programming proficiency preferred

**What participants get:**

- Large-scale compute resources for ambitious frontier research
- Close collaboration with a professional AI research team
- Highly competitive industry compensation

_Application materials:_ program application form + a short statement (1–2 problems in your field you most want to solve, and how you use AI in your work) + CV including 1–2 representative publications
_Listed disciplines:_ Mathematics, Physics, Chemistry, Biology, Materials Science, and other basic disciplines that can deeply integrate with large models
_Deadline:_ September 30, 2026
_Contact:_ SeedSTEM@bytedance.com
_Website:_ https://seed.bytedance.com/zh/

> **Note:** Although the listed disciplines are core STEM fields, the program explicitly welcomes **any basic discipline that can deeply integrate with large models** — making it directly relevant for Earth science, remote sensing, and GeoAI researchers who use AI as a first-class research instrument. Program materials are in Chinese; positions involve on-site collaboration with the Seed team.

### Geospatial / Physical AI Companies

### **Bellwether (X / Google)**

_Focus:_ Disaster Intelligence · Geospatial AI · Earth Prediction · Rapid Response · Climate Risk

Bellwether is an X (Google) moonshot building what it calls the **first prediction engine for the Earth and everything on it**. The project combines **AI and Earth information data** to anticipate severe weather impacts, assess damage to communities and infrastructure, and support public- and private-sector decision-making around disaster planning, response, and recovery.

For GeoAI researchers, Bellwether is especially relevant because it operationalizes **geospatial reasoning on aerial imagery and Earth observation data** in real disaster workflows rather than only benchmark settings. Public material highlights work on **wildfire prediction, rapid post-disaster scene assessment, and insurance-facing hazard intelligence**. In a Kansas City emergency response simulation, Bellwether analyzed aerial imagery of **407 homes in 20 minutes at 96% accuracy**, illustrating the company’s orientation toward time-critical disaster assessment.

**Relevant technical themes include:**

- Geospatial image matching and damage detection for disaster response
- Earth-scale prediction using AI + environmental / infrastructure data
- Wildfire risk modeling and hazard forecasting
- Decision support for emergency management, insurance, and resilience planning
- Bridging foundation-model-style reasoning with operational disaster intelligence

_Location:_ X / Google ecosystem, Mountain View, CA  
_Collaboration signal:_ Bellwether publicly invites collaboration via the X project page; treat it as a high-signal research/industry moonshot rather than a standardized internship pipeline  
_Website:_ https://x.company/projects/bellwether/  
_Field report:_ https://x.company/blog/posts/bellwether-kansas-city/

> **Note:** Bellwether is particularly important for researchers whose GeoAI trajectory includes **disaster intelligence, geospatial reasoning, risk forecasting, and public-sector response systems**. It represents a strong example of GeoAI moving from mapping toward action-oriented Earth prediction.

### **Inunda**

_Focus:_ Flood Inundation Modeling · Differentiable Simulation · GPU Computing · Agent-Enabled GeoAI · Global Hazard Modeling

Inunda describes itself as a **GPU-based, agent-enabled, differentiable flood inundation model** — "run a flood inundation model, fast, anywhere on the globe." Each of those three adjectives marks a departure from traditional hydrodynamic software (HEC-RAS, LISFLOOD-FP and kin), and together they sketch what a **simulation layer built for autonomous GeoAI** looks like:

- **GPU-based** — hydrodynamic simulation at interactive speed rather than overnight batch runs, enabling near-real-time inundation mapping during an unfolding event;
- **Differentiable** — gradients flow through the physics, so the model can be **calibrated end-to-end, embedded in hybrid ML–physics training loops, used for data assimilation, and inverted** (e.g., inferring boundary conditions or roughness fields from observed flood extents);
- **Agent-enabled** — the simulator is exposed as a **callable tool for LLM/GeoAI agents**, turning flood modeling from a desktop workflow into an _action_ inside an autonomous reasoning loop ("simulate this levee breach, compare against the satellite-observed extent, revise").

**Relevant technical themes include:**

- Differentiable physics and physics-informed ML for Earth-system simulation
- Simulation-as-a-tool interfaces for autonomous GeoAI agents
- Rapid global flood inundation mapping and forecasting
- Inverse modeling and data assimilation with EO observations
- GPU-accelerated shallow-water solvers for time-critical decision support

_Website:_ https://inunda.ai/

> **Note:** Public information is currently minimal (the site is a single-page teaser), so treat this as an early-stage signal rather than a documented platform. It is worth watching precisely because it packages the three ingredients — speed, differentiability, and an agent interface — that turn a physical simulator into a **tool call for autonomous GeoAI**, the same "assessment → action" layer that agent benchmarks like GeoDisaster (flood-safe routing, SAR flood monitoring) are beginning to evaluate.

### **Niantic Spatial**

_Focus:_ Spatial Intelligence · GeoAI · Visual Localization · 3D Reconstruction · Large Geospatial Models

Niantic Spatial builds a real-world model for **physical AI**, spanning **high-fidelity 3D reconstruction, vision-based localization, semantic scene understanding, and large-scale spatial intelligence systems**. Compared with traditional mapping companies, its differentiator is the ambition to move from local scene understanding to a **Large Geospatial Model (LGM)**: a machine learning system that connects millions of places into a shared understanding of the physical world.

For GeoAI and computer vision researchers, Niantic Spatial is relevant to problems such as **visual place recognition, multimodal scene understanding, reconstruction pipelines, AR/robotics interfaces, and machine understanding of real-world geography**. Its products and research direction sit at the boundary of **mapping, embodied AI, digital twins, and physical-world foundation models**.

**Relevant roles and research directions include:**

- Computer vision research and engineering for real-world spatial understanding
- Visual localization, VPS, and place recognition
- 3D reconstruction and digital twin generation from ground and aerial captures
- Vision-language and semantics-aware spatial modeling
- Infrastructure for spatial AI systems, robotics, and physical AI applications

_Location:_ San Francisco / Sunnyvale, CA, with additional roles sometimes listed elsewhere (e.g., London)  
_Openings:_ Current careers page lists active full-time positions; internship availability may vary by cycle and team  
_Website:_ https://www.nianticspatial.com/careers  
_Research / vision:_ https://www.nianticspatial.com/blog/largegeospatialmodel

> **Note:** Niantic Spatial should be understood not just as an AR company descendant, but as a leading **spatial foundation-model and physical-AI infrastructure company**. It is highly relevant for work on GeoAI, digital twins, robotics perception, and large-scale spatial representation learning.

### **WAYZ.AI (维智科技)**

_Focus:_ Spatiotemporal AI · Urban Digital Twins · Spatial Knowledge Graphs · Decision Intelligence · IoT Positioning

WAYZ.AI is a Shanghai-based enterprise and city intelligence company that develops an end-to-end **spatiotemporal AI** stack for decision support. Its Phy-gital platform combines spatiotemporal sensing, knowledge graphs, analytics, and intelligent interaction to help public-sector and commercial users move from observing spatial data to operational decisions.

For Autonomous GeoAI researchers, WAYZ.AI is relevant as an example of production-grade spatial intelligence aimed at **urban operations, emergency management, transport, retail, and finance**. Its public materials describe city-scale digital-twin engines and a large multimodal spatiotemporal knowledge graph, while its WAYZING platform connects multi-source location and IoT signals for indoor and outdoor sensing.

**Relevant technical themes include:**

- Spatiotemporal knowledge graphs and multimodal spatial data integration
- City digital twins for dynamic urban sensing, analysis, prediction, and decision support
- Location intelligence across GPS, Wi-Fi, cellular, Bluetooth, and IP signals
- IoT device monitoring, geofencing, tracking, and spatial operations
- Applied GeoAI for smart-city management, emergency response, mobility, and commercial site intelligence

_Location:_ Shanghai, China
_Website:_ https://www.wayz.ai/
_Company overview:_ https://www.wayz.ai/aboutus
_IoT positioning platform:_ https://www.wayz.ai/wayzingproduct

> **Positioning Insight:** WAYZ.AI is best viewed as a decision-intelligence and digital-twin operator built on spatiotemporal AI, rather than only a mapping or visualization vendor. It shows how spatial data, graph-based representations, and sensing infrastructure can support operational GeoAI in cities and enterprises.

### **Spexi**

_Focus:_ Drone Imagery Infrastructure · Spatial AI Training Data · Digital Twins · Photogrammetry · Physical AI

Spexi is a Vancouver-based geospatial company building a distributed drone-pilot network to deliver **standardized, ultra-high-resolution aerial imagery** on demand. Its product direction is unusually relevant to autonomous GeoAI because it sits at the **data infrastructure layer**: providing the structured aerial data that fuels **change detection, 3D reconstruction, digital twins, synthetic-data generation, and model training for spatial AI systems**.

Public materials describe Spexi’s imagery stack as **API-first**, integration-ready, and designed for **living world models**. The company emphasizes **1–3 cm imagery**, structured **nadir + oblique capture**, orthomosaics, 3D point clouds, and related datasets for computer vision and mapping workflows. Its 2026 partnership with **Niantic Spatial** is especially notable, positioning Spexi as a preferred drone imagery provider for **training real-world foundation models for physical AI** and enabling city-scale 3D reconstruction pipelines.

**Relevant role / ecosystem directions include:**

- Geospatial data platforms and API-delivered imagery workflows
- Drone capture standardization and scalable field operations
- Photogrammetry, 3D reconstruction, and digital twin pipelines
- Spatial AI / computer vision training data generation
- Change detection, asset monitoring, and infrastructure intelligence

_Location:_ Vancouver, Canada  
_Openings:_ Spexi’s public jobs board currently shows no open positions; however, its global pilot network and partner ecosystem remain highly relevant for collaboration and market tracking  
_Website:_ https://www.spexi.com/  
_About:_ https://www.spexi.com/about  
_AI page:_ https://www.spexi.com/ai  
_Partnership:_ https://www.spexi.com/blog/niantic-spatial-and-spexi-partner-to-turn-drone-imagery-into-intelligence-for-physical-ai

> **Note:** Spexi is especially valuable to watch if your interests include **real-world data acquisition for GeoAI**, rather than only downstream modeling. It represents the emerging layer where drone capture networks, geospatial APIs, and physical-AI training pipelines begin to merge.

### **Varjo Teleport**

_Focus:_ 3D Gaussian Splatting · Reality Capture · Digital Twins · Aerial / Drone 3D Reconstruction · Spatial Computing

Varjo is a Helsinki-based spatial computing company best known for professional-grade XR headsets used in pilot training, defense simulation, and industrial design. **Teleport** is its cloud reality-capture platform: users capture a scene with a phone, drone, or professional camera, and the service reconstructs it into a **photorealistic 3D Gaussian Splatting (3DGS) model** that is lightweight enough to stream and view in real time, even on mobile devices.

For autonomous GeoAI research, Teleport is notable as one of the first **production-grade, consumer-accessible 3DGS pipelines at geospatial scale**: it supports **multi-square-kilometre aerial scenes captured by any drone**, produces models ranging from roughly 1 million to 100 million splats while holding quality at neighborhood scale, and exposes a **developer API** for embedding reconstructions into third-party applications. Target markets include real estate, construction progress tracking, defense and training environments, and spatial application developers — effectively a turnkey path from raw capture to navigable digital twin.

**Relevant technical themes include:**

- 3D Gaussian Splatting as a cloud service (capture → reconstruction → real-time streaming)
- Large-scale aerial / drone reconstruction and city- or neighborhood-scale digital twins
- Lightweight, web- and mobile-renderable 3D scene representations
- Developer APIs for integrating photorealistic reconstructions into spatial applications
- Reality capture for simulation, training, and synthetic-environment generation

_Location:_ Helsinki, Finland
_Website:_ https://get.teleport.varjo.com/
_Company:_ https://varjo.com/

> **Positioning Insight:** Varjo Teleport shows radiance-field methods (3DGS) crossing from research demos into a **scalable commercial reconstruction service**. For GeoAI researchers it is a useful reference point for what production 3DGS pipelines deliver at aerial scale — and a potential source of photorealistic scene data for simulation, synthetic training data, and digital-twin work.

### **Texas A&M Institute for a Disaster Resilient Texas (IDRT)**

_Focus:_ Disaster Resilience · GeoAI · Hazard Analytics · Decision Support Systems

The Texas A&M Institute for a Disaster Resilient Texas (IDRT) is a multidisciplinary research institute dedicated to advancing **disaster resilience, hazard analytics, and decision-support systems** across Texas and beyond. IDRT serves as a bridge between **academic research, geospatial intelligence, and real-world disaster response and policy applications**, making it highly relevant for PhD researchers working on GeoAI and disaster intelligence.

Rather than offering standardized corporate-style internships, IDRT primarily supports **research-based engagement opportunities**, including graduate research assistance, summer research participation, and project-based collaboration aligned with ongoing institute initiatives.

**Relevant research engagement tracks include:**

- Research Intern / Research Assistant (Disaster Resilience & GeoAI)
- Graduate Researcher (Hazard Analytics & Spatial Intelligence)
- Summer Research Fellow (Disaster Intelligence Systems)

These research engagements typically emphasize:

- Geospatial and spatiotemporal analytics for disaster risk and resilience assessment
- Integration of GeoAI, machine learning, and spatial data infrastructures
- Development of decision-support tools for emergency management and policy planning
- Translational research connecting academic methods with operational disaster systems

_Location:_ Texas A&M University System (Texas-based; hybrid depending on project)  
_International students:_ CPT supported for research-based roles; no security clearance required  
_Website:_ https://idrt.tamug.edu/

> **Note:** IDRT opportunities are research-oriented and project-driven rather than traditional corporate internships. Engagement is typically established through direct contact with project leads or institute-affiliated faculty and is well-suited for PhD researchers pursuing GeoAI- and disaster-focused research trajectories.

### **IDEAAL DR2 at University of Washington (Applied Learning Fellowship)**

_Focus:_ Disaster Research Response · Environmental Health · Public Health Disasters · Applied Hazards Research

The **Investigations in Disasters and Emergencies: Advancing Applied Learning in Disaster Research Response (IDEAAL DR2)** fellowship is offered by the University of Washington **Center for Disaster Resilient Communities (CDRC)** in partnership with the **Bill Anderson Fund**. The program trains up to 25 advanced graduate students and early-career hazards and disaster researchers each year in environmental and public health disaster research methods.

The fellowship combines prerequisite readings and online training, a weeklong in-person intensive at the University of Washington campus in Seattle, an applied research experience, and follow-up monthly online workshops. The 2026 in-person short course is scheduled for **July 27-31, 2026**.

**Training themes include:**

- Foundations of disaster research and public health emergency research
- Reciprocity, community engagement, and research communication with affected communities and response partners
- Disaster research methods across implementation science, exposure science, epidemiology, and data science
- Tools for collecting, curating, managing, and sharing perishable disaster data
- Research design, grant development, and implementation of a publishable disaster research project

_Eligibility:_ Advanced graduate students, postdoctoral scholars, assistant professors, research scientists, and equivalent early-career researchers; U.S.-based researchers are the primary audience, with international applicants considered case by case<br>
_Financial support:_ Need-based travel stipends are available for the Seattle in-person training week<br>
_Website:_ https://cdrc.uw.edu/what-we-do/education-and-training/applied-learning-fellowships/

> **Note:** IDEAAL DR2 is a strong opportunity for GeoAI and disaster-intelligence researchers who want to connect technical methods with **public health disaster research, ethical field data collection, reciprocal community engagement, and publishable applied disaster research**. The 2026-2027 cohort application is closed; the program page states that the next application cycle is expected in late Winter 2027.

### **Arup (Risk & Resilience Engineering)**

_Focus:_ Multi-Hazard Risk · Climate Resilience · Infrastructure Systems · Quantitative Risk Modeling

Arup is a global engineering and risk consultancy with strong expertise in **multi-hazard risk assessment, climate adaptation, and infrastructure resilience**. Its Risk & Resilience teams operate at the intersection of **engineering, climate science, probabilistic risk modeling, and decision support**, making Arup particularly relevant for graduate students and PhD researchers interested in applying **GeoAI, spatial analytics, and simulation-based methods** to real-world infrastructure and urban systems.

Arup offers structured **Risk & Resilience Engineering Internship** opportunities suitable for graduate students and PhD researchers with backgrounds in engineering, climate science, GIScience, or spatial data science.

**Relevant internship tracks include:**

- Risk & Resilience Engineering Intern
- Climate Risk / Adaptation Intern
- Infrastructure Risk Analysis Intern

These internships typically emphasize:

- Qualitative and quantitative **multi-hazard risk assessment** (earthquake, flood, wind, heat, wildfire)
- Hazard and vulnerability modeling, including **climate change–informed hazard analysis**
- Probabilistic risk frameworks and tools (e.g., FEMA P-58, HAZUS, or similar methodologies)
- Application of **simulation, statistics, and engineering models** for infrastructure resilience
- Automation scripting for risk models and analytical workflows
- GIS-enabled spatial analysis and visualization for risk communication
- Development of **risk mitigation and adaptation strategies** using cost–benefit analysis and adaptation pathways

_Location:_ San Francisco, CA (and other global offices depending on team)  
_International students:_ CPT / J-1 typically supported for internship roles; no security clearance required  
_Website:_ https://www.arup.com/careers

> **Note:** Arup internships are applied-research and analytics-driven, positioned between academic research and professional practice. They are well suited for PhD researchers aiming to translate GeoAI, spatial risk modeling, and climate analytics into **operational resilience planning for cities and infrastructure**, rather than purely academic or software-only roles.

### **CARTO (Agentic GIS Platform)**

_Focus:_ Cloud-Native GIS · Spatial Analytics · GeoAI · Agentic GIS

CARTO is a leading **cloud-native spatial analytics platform** focused on enabling scalable geospatial analysis, location intelligence, and AI-integrated GIS workflows. With its recent emphasis on **Agentic GIS**, CARTO is exploring how **AI agents and structured geospatial commands** can operate autonomously within modern GIS ecosystems.

CARTO offers internship and early-career opportunities suitable for graduate students and PhD researchers working at the intersection of **GeoAI, spatial data science, and cloud-native geospatial systems**.

**Relevant internship and early-career tracks include:**

- Spatial Data Science Intern
- GeoAI / Machine Learning Intern
- Geospatial Software / Platform Intern
- Research Intern (Spatial Analytics & AI Systems)

These roles typically emphasize:

- Cloud-native spatial analytics and large-scale geospatial data processing
- Integration of **AI / machine learning models** into GIS workflows
- Development of **automation and agent-based geospatial tools** (e.g., CLI, APIs)
- Spatial SQL, Python-based geospatial analytics, and scalable data pipelines
- Bridging geospatial reasoning with AI agents for autonomous spatial reasoning
- Applied research and platform-oriented development with real-world use cases

_Location:_ New York, NY (global / remote-friendly teams depending on role)  
_International students:_ CPT / J-1 commonly supported for internship roles; no security clearance required  
_Website:_ https://carto.com/careers

> **Note:** CARTO opportunities are platform- and systems-oriented, sitting between GeoAI research and production-grade spatial infrastructure. They are particularly well-suited for PhD researchers interested in **Agentic GIS, cloud-native spatial intelligence, and AI-driven geospatial automation**, rather than traditional desktop GIS or cartography-focused roles.

### **Cyclomedia**

_Focus:_ Street-Level Reality Capture · LiDAR · Asset Intelligence · Digital Twins · Infrastructure Management

Cyclomedia is a geospatial data and intelligence company that digitizes the outdoor built environment at scale. Its core stack combines high-accuracy street-level imagery, LiDAR point clouds, aerial imagery, cloud-based visualization, AI-powered asset analytics, and APIs for GIS and enterprise workflows.

For Autonomous GeoAI researchers, Cyclomedia is relevant because it sits at the data and infrastructure layer for real-world spatial intelligence. Its products turn public roads, right-of-way assets, pavements, sidewalks, buildings, and utility contexts into measurable digital representations that support remote inspection, change awareness, asset inventories, and infrastructure decision-making. The company is especially close to research directions in street-view GeoAI, multimodal mobile mapping, public-space digital twins, infrastructure condition assessment, and AI-assisted urban operations.

**Relevant technical themes include:**

- Large-scale 360-degree street-level imagery and LiDAR capture
- Multimodal asset extraction and condition assessment
- Right-of-way intelligence for road safety, pedestrian safety, utilities, telecommunications, and tax/property workflows
- Remote measurement, desktop inspection, and change analysis through Street Smart
- GIS, CAD, asset-management, and enterprise integrations through APIs

_Website:_ https://www.cyclomedia.com/en-us<br>
_Products:_ https://www.cyclomedia.com/en-us/products/street-smart and https://www.cyclomedia.com/en-us/products/assets

> **Positioning Insight:** Cyclomedia is best understood as an operational reality-capture and infrastructure-intelligence company rather than only a street-view imagery provider. It is a useful industry signal for GeoAI work that needs city-scale ground-level data, interpretable asset intelligence, and production integration with public-sector infrastructure workflows.

### **LGND (Geospatial AI Embeddings Platform)**

_Focus:_ Earth Observation Foundation Models · Geospatial Embeddings · Vector Search · MCP · Agentic GeoAI

LGND is a **geospatial AI platform** that turns satellite and Earth-observation imagery into searchable **embeddings**, delivered through three products: an **API** (embeddings and search), **Discover** (geospatial data exploration), and **Studio** (dataset creation and validation). It builds on open Earth foundation models — including **Clay**, **FarSLIP**, and **AlphaEarth Foundations (AEF)** — and has released **15.2 billion pre-computed Sentinel-2 embeddings** under CC BY 4.0 on Source Cooperative, reflecting an open-science orientation.

**Research Tier — free for qualifying academics:** LGND offers complimentary **Pro-level access to the LGND Embeddings API** for academic researchers working with geospatial data.

- **150,000 monthly credits** (enough to embed Sentinel-2 imagery across the Continental US and Europe multiple times)
- Access to multiple foundation models (**Clay, FarSLIP, AEF**)
- **Embedding Export** to **GeoParquet** via S3
- **MCP Server** for querying collections and running inference in natural language
- **Code Assistant** with current API documentation

_Cost:_ Free for qualifying academics (subject to LGND's Terms of Service; resulting publications must be made public with proper acknowledgement)  
_Apply / Learn more:_ https://lgnd.ai/resources/research-tier · Docs: https://lgnd.ai/lgnd-docs

> **Note:** Highly relevant for autonomous-GeoAI and AI4Science researchers who need large-scale satellite embeddings **without training their own encoders** — e.g., damage assessment, change detection, land-cover, and cross-view tasks. The MCP Server and GeoParquet export fit naturally into agentic, reproducible GeoAI pipelines.

### **Ready (Geospatial Data Engineering)**

_Focus:_ Geospatial Data Engineering · Airflow ELT · Spatial SQL · Applied AI Agents

Ready is a remote-first startup building operational infrastructure for geospatial analysis and decision-making. Its **Data Intern** role is especially relevant for students and early-career researchers interested in production-grade geospatial data pipelines, spatial databases, cloud analytics, and applied AI systems.

**Relevant internship role:**

- Data Intern (Geospatial Data Engineering, Remote)

This internship typically emphasizes:

- Building and improving **Airflow ELT pipelines** that ingest, transform, and serve geospatial datasets at scale
- Supporting an **Airflow 2 to Airflow 3 migration**, including DAG porting, parity validation, and legacy pipeline retirement
- Writing type-hinted Python and spatial SQL across **PostGIS, Athena / Trino, PostgreSQL, Redshift, and DuckDB**
- Developing **dbt models**, semantic layer definitions, and documented business logic for geospatial tables
- Contributing to data quality systems, including schema validation, freshness monitoring, and spatial integrity checks
- Supporting **DataHub** adoption for schema documentation, lineage tracking, and metadata management
- Assisting with applied AI data agents using tools such as **LangGraph, LangChain, Bedrock Agent Core, MCP, and text-to-SQL workflows**

_Location:_ Remote; work is not permitted from China (excluding Hong Kong, Macau, and Taiwan), Russia, Iran, or North Korea<br>
_Employment type:_ Full-time, 3-month summer internship, then part-time through September<br>
_Compensation:_ $35-$40 per hour<br>
_Website:_ https://jobs.ashbyhq.com/ready/3db71e58-063f-461b-bf90-edf08dd53264

> **Note:** Ready is a strong fit for students whose GeoAI trajectory includes **production geospatial data infrastructure**, not only model development. The role is particularly aligned with Airflow, dbt, spatial SQL, AWS-style data systems, and agent-enabled data access.

### **EarthScope Student Career Internship Program**

_Focus:_ Earth Science Education · Geophysical Data · Computing & Data Science

EarthScope is an **NSF-supported consortium** focused on advancing Earth science through open geophysical data, instrumentation, and education infrastructure. Its **Student Career Internship Program** provides paid, structured internship opportunities that bridge **Earth science, data science, and educational support**, rather than product- or industry-driven development.

The **Computing and Data Science Academy Intern** track is particularly relevant for graduate students and PhD researchers with backgrounds in **GIS, remote sensing, spatial data science, or scientific computing**, and for those interested in supporting Earth science education and open science initiatives.

**Relevant internship and early-career tracks include:**

- Computing and Data Science Academy Intern
- Cloud Software Developer Intern
- Cloud OnRamp Intern

These internships typically emphasize:

- Development and testing of **Earth science educational and technical course materials**
- Supporting **data- and computation-intensive learning modules**
- Working with **geophysical and geospatial datasets** in instructional contexts
- Quality assurance of **tutorials, workflows, and learning resources**
- Collaboration with **scientists, educators, and technical teams**

_Location:_ Remote (U.S.)
_International students:_ Eligible with U.S. work authorization (e.g., CPT)
_Website:_ https://www.earthscope.org/education/student-internships/earthscope-student-career-internship-program/

> **Note:** EarthScope internships are **education- and infrastructure-oriented**, making them especially **well suited** for students interested in **Earth science education, open data ecosystems, and scientific cyberinfrastructure**, rather than algorithm-centric research or commercial software roles.

### **Mosaic (Geospatial Imaging Leaders)**

**Focus: Mobile Mapping · 360° Reality Capture · GeoAI · Computer Vision · Digital Twins**

Mosaic is a Prague-based leader in geospatial imaging, specializing in the development of the world’s most robust and precise industrial **360° street-level camera systems**. Their technology integrates ultra-high-resolution visual data with geospatial intelligence to provide foundational insights for urban mapping, surveying, and autonomous vehicle map updates. For PhD researchers, Mosaic offers a high-impact environment to bridge the gap between **Computer Vision, reality capture, and GIScience**.

**Relevant internship and early-career tracks include:**

- Computer Vision / AI Research Intern (Focus on automated feature extraction and 3D modeling)
- Python Developer Intern (Geospatial Pipelines & Image Processing)
- Geospatial Data Scientist (Focus on multi-sensor fusion and high-precision positioning)

These internships typically emphasize:

- **Large-Scale Reality Capture:** Developing algorithms to process massive amounts of high-resolution data for urban mapping and surveying.
- **Automated Feature Extraction:** Utilizing deep learning for calibration, stitching, and 3D modeling from 360° imaging data.
- **High-Precision Mobile Mapping:** Engineering tools for sub-centimeter accuracy in street-level data collection worldwide.
- **Advanced Spatial Reasoning:** Bridging the gap between raw megapixel data and actionable geospatial insights for digital twins.

_Location:_ Prague, Czech Republic

_International students:_ International applicants welcome; support for relevant internship visas typically available

_Website:_ [https://www.mosaic51.com/](https://www.mosaic51.com/)

> **Note:** Mosaic internships are **hardware-software integrated** and research-driven. They are particularly well suited for students interested in **mobile mapping tools, 3D reconstruction, and GeoAI**, rather than purely theoretical or non-spatial software roles.

### **DT360 / DebrisTech (Scalable Data Acquisition Solutions)**

_Focus:_ Post-Disaster Field Data Acquisition · Mobile Mapping · Corridor LiDAR · Helicopter and All-Terrain Capture · FEMA-Auditable Documentation

**DT360** is the data-acquisition brand operated alongside **DebrisTech, LLC** (founded 2010, headquartered in Picayune, Mississippi). The two businesses sit on either side of the same capability: DebrisTech performs **disaster debris monitoring** — the auditable documentation layer that lets government clients recover FEMA Category A reimbursement for storm debris removal — while DT360 productizes the **field data-collection fleet and sensing stack** that such work requires, and sells it into infrastructure, utility, and transportation markets.

DebrisTech's **Electronic Debris Management System** replaces handwritten load tickets with real-time capture on ruggedized iPads: barcode scanning, timestamped photographs, GPS-tagged locations, and digital signatures, authenticated through a three-factor scheme (serialized physical ticket, registered device, captured signature). Records flow into a central information database whose interactive map exposes the **exact pickup and disposal location of every debris ticket in real time**, backed by mobile command and communications centers for field operation where connectivity is unreliable. Reported operational scale includes **50+ million cubic yards of debris monitored** across **118 counties and municipalities** in roughly **17 states and U.S. territories**.

DT360 operates an **integrated aerial and ground fleet** designed around the premise that the hardest part of disaster and corridor data collection is reaching the scene at all. Road-going mobile mapping vehicles are paired with **off-road and amphibious all-terrain units** (including SHERP ATV/UTV platforms carrying [Mosaic](#mosaic-geospatial-imaging-leaders) 360-degree camera systems) and with **helicopter-based collection** over transmission lines, pipelines, and otherwise inaccessible terrain. Its mobile mapping team reports **250,000+ miles of roadway corridor captured**. Acquired corridor LiDAR is delivered through **Pathfinder**, a hosted platform where clients make their own measurements and flag areas requiring feature extraction; the **I-95 corridor** is published there across all **1,920 miles and 15 states**, aimed at state DOTs, utility providers, and broadband planners.

**Relevant technical themes include:**

- **Post-disaster reality capture** in degraded, flooded, and debris-obstructed environments where conventional survey vehicles cannot operate
- **Multi-platform sensor fusion** across vehicle-mounted 360-degree imagery, amphibious ground units, and rotary-wing aerial LiDAR
- **Corridor-scale LiDAR products** for roadway, transmission-line, pipeline, and broadband planning workflows
- **Evidence-grade geospatial provenance** — geotagged, timestamped, signature-authenticated records built to survive federal audit
- **Human-in-the-loop feature extraction**, where clients flag regions in delivered point clouds for downstream extraction work

_Location:_ Picayune, Mississippi, USA (nationwide field deployment across U.S. states and territories)<br>
_Website:_ [https://www.dt360.com/](https://www.dt360.com/) · DebrisTech: [https://debristech.com/](https://debristech.com/)

> **Positioning Insight:** DT360 is a useful industry reference for **disaster-response GeoAI** specifically because it operationalizes the unglamorous half of the problem: getting calibrated ground-level and aerial data out of an environment immediately after an event, and attaching provenance strong enough for a reimbursement audit. Research directions it maps onto closely include **debris volume estimation, cross-view (ground/aerial/satellite) damage assessment, post-event change detection, and accountable geospatial pipelines** — areas where academic work is usually bottlenecked by exactly the field data this company is built to produce. Note that DT360 and DebrisTech share leadership and branding but present as separate web properties; confirm the current corporate relationship, and any hiring or internship pathways, directly with the company before relying on it.

### **Snap Inc.**

_Focus:_ Computer Vision · AR Systems · Wearable AI · Visual Communication Platforms

Snap Inc. is a camera-first technology company building products at the intersection of **computer vision**, **augmented reality (AR)**, and **wearable computing**. In addition to the consumer-facing Snapchat platform, Snap maintains dedicated **AR- and perception-oriented engineering teams** through Spectacles and Snap AR (Lens Studio), focusing on real-time visual intelligence, 3D scene understanding, and on-device machine learning systems.

Snap provides selective internship opportunities suitable for graduate students and PhD researchers working in **computer vision, multimodal AI, AR/VR systems, and embodied perception**. These roles are particularly aligned with applied perception systems and production-level ML deployment in AR environments.

**Relevant internship tracks include:**

- Computer Vision Engineering Intern
- Machine Learning / AI Intern (AR focus)
- Research Intern (Perception / Vision Systems)
- AR Platform Engineering Intern

These internships typically emphasize:

- 3D scene reconstruction, SLAM, and spatial understanding
- Real-time object detection, segmentation, and tracking
- Multimodal perception pipelines (vision + sensor fusion)
- On-device model optimization and low-latency inference
- Integration of ML models into AR production systems

_Location:_ Vienna (Spectacles team), Los Angeles, Seattle (varies by team)  
_International students:_ CPT eligibility for U.S.-based roles; visa requirements vary by location  
_Website:_ https://careers.snap.com/

> **Note:** Applicants should distinguish research- and perception-focused internships from g

### **GeoWGS84.ai**

_Focus:_ GeoAI · Geospatial Foundation Models · Satellite Intelligence · AI-Driven Mapping

GeoWGS84.ai is a GeoAI-native company focused on advancing AI-driven geospatial intelligence systems. The company integrates satellite imagery, spatial data infrastructure, and deep learning pipelines to enable automated object detection, mapping, and large-scale spatial analytics.

In contrast to traditional GIS vendors, GeoWGS84.ai emphasizes scalable spatial AI models and AI-first geospatial reasoning workflows. Its technical direction aligns with emerging research areas such as geospatial foundation models, representation learning for Earth observation, and automated spatial knowledge extraction.

These internships typically emphasize:

- Deep learning for satellite and aerial imagery interpretation
- Object detection, segmentation, and spatial feature extraction
- Large-scale geospatial data processing and model deployment
- AI-enhanced mapping and spatial intelligence systems

_Location:_ Remote / Global (startup-style structure)  
_International students:_ Case-dependent; often flexible for research-oriented collaborations  
_Website:_ https://www.geowgs84.ai/

**Featured Insight:**

- **Top 10 GeoAI Companies in the World 2025**  
  Jul 1, 2025 · 3 min read  
  https://www.geowgs84.ai/post/top-10-geoai-companies-in-the-world-2025

> **Note:** GeoWGS84.ai represents a new generation of GeoAI-native companies that prioritize AI-driven spatial intelligence systems rather than traditional GIS software workflows.

### **Planet Labs**

_Focus:_ Satellite Intelligence · Earth Observation · Change Detection · AI for Climate & Defense

Planet operates one of the largest constellations of Earth-imaging satellites in the world, delivering high-frequency global imagery for commercial, environmental, defense, and humanitarian applications. The company integrates satellite data pipelines with cloud infrastructure and machine learning systems to enable large-scale geospatial intelligence.

Planet is particularly strong in time-series satellite analytics, change detection, and AI-driven monitoring systems.

**Relevant internship tracks include:**

- Machine Learning Intern (Earth Observation)
- AI / Deep Learning Intern (Change Detection Focus)
- Geospatial Data Science Intern
- Applied ML Intern (Satellite Intelligence)

These internships typically emphasize:

- Deep learning for satellite image analysis
- Embedding-based change detection models
- Temporal representation learning for Earth observation
- Large-scale geospatial data processing and cloud deployment

_Example Role:_

- **Machine Learning Intern, Solution Enablement** (Change Detection Focus)  
  Location: Haarlem, Netherlands  
  Focus: Deep learning & embedding-based approaches for land surface change detection  
  https://www.planet.com/company/careers/

_Global Offices:_ San Francisco, Washington DC, Germany, Austria, Slovenia, Netherlands  
_International students:_ Case-dependent; visa sponsorship varies by region  
_Website:_ https://www.planet.com/

> **Note:** Planet is especially relevant for PhD students working on bi-temporal imagery, satellite-based disaster monitoring, and embedding-driven change detection models.

### **EPRI (Electric Power Research Institute)**

_Focus:_ Climate AI · Energy System Resilience · Climate Risk Analytics

EPRI is a U.S.-based energy research organization operating at the intersection of climate science, data science, and energy infrastructure. The Energy Systems & Climate Analysis (ESCA) group applies AI/ML methods to climate hazard modeling and resilience assessment for electric utilities and government partners.

These internships typically emphasize:

- AI for climate and extreme weather modeling
- Hydroclimate and meteorological data analysis
- Climate risk quantification for infrastructure
- Energy system resilience analytics

_Location:_ Remote / U.S.-based  
_International students:_ U.S. work authorization typically required; CPT/AT case-dependent; no explicit visa sponsorship listed  
_Website:_ https://www.epri.com/  
_Climate Group:_ http://esca.epri.com/

### **ZestyAI**

_Focus:_ Climate Risk AI · Property Intelligence · Insurtech · Geospatial Machine Learning

ZestyAI is a property and climate risk analytics company serving the P&C insurance industry. The company builds AI-powered models that leverage **aerial imagery, property-level data, and environmental signals** to assess risks such as wildfire, hail, and water damage.

Their platform operates at the intersection of **remote sensing, geospatial analytics, and applied machine learning**, delivering property-specific intelligence for underwriting and risk pricing.

**Relevant role example:**

- Technical Talent Partner – Insurtech & AI (Remote, US/Canada)

**Technical relevance (for GeoAI / Disaster / Climate researchers):**

- Computer vision applied to high-resolution aerial imagery
- Property-level risk modeling and hazard analytics
- Climate risk quantification and insurance underwriting intelligence
- Applied ML/AI deployment in production-scale systems

_Location:_ Remote (US or Canada)  
_Headquarters:_ San Francisco, CA  
_Website:_ https://www.zesty.ai

> **Positioning Insight:** ZestyAI sits at the intersection of **climate risk modeling, geospatial AI, and insurance decision systems**, making it strategically aligned with research trajectories in disaster intelligence, hazard modeling, and AI-driven resilience analytics.

### **ICE Climate (Intercontinental Exchange)**

_Focus:_ Climate Risk Analytics · Geospatial Intelligence · Fixed Income Data · Real Estate Risk · Sustainable Finance

ICE Climate, part of Intercontinental Exchange (ICE), provides **climate data and analytics** that connect **physical climate risk, climate transition risk, and alternative datasets** to **fixed income securities and real estate assets**. Its public materials explicitly emphasize a **geospatial intelligence platform** that links climate-related risks to asset classes including **municipals, mortgage-backed securities, sovereigns, corporates, and real estate**.

This makes ICE Climate particularly relevant to researchers interested in the financial and operational layer of GeoAI: not only sensing hazards, but translating geospatial climate signals into **asset-level risk analytics, mortgage and property insights, portfolio assessment, and climate-aware decision support**. It is a strong example of how geospatial intelligence can be embedded into institutional finance, climate analytics, and large-scale risk infrastructure.

**Technical relevance (for GeoAI / Climate / Physical Risk researchers):**

- Geospatial linkage of physical climate risk to financial and real estate assets
- Asset- and portfolio-level climate risk analytics
- Property, mortgage, and securitized-product climate intelligence
- Integration of geospatial, alternative, and climate-transition datasets into decision systems
- Climate-aware analytics infrastructure for institutional users

_Website:_ https://www.ice.com/fixed-income-data-services/ice-climate-data-analytics

> **Positioning Insight:** ICE Climate shows how **geospatial intelligence, climate risk modeling, and financial decision infrastructure** converge, making it highly relevant for researchers thinking about GeoAI beyond disaster response alone and into asset, portfolio, and market-scale physical risk analytics.

### **Zipline**

_Focus:_ Autonomous Systems · Spatial Planning · Robotics · Geospatial Algorithms

Zipline designs and operates autonomous delivery drones, building large-scale instant logistics systems. The Spatial Planning Team develops long-term scalable systems that define **where and how autonomous aircraft fly**, including constraints, routing logic, and safety priors for real-world deployment.

**Relevant internship role:**

- Spatial Planning Intern (Summer 2026)

**Technical emphasis:**

- Path planning algorithms and multi-objective routing
- Spatial search and geospatial constraint modeling
- Data generation, transformation, and spatial analytics pipelines
- Real-world deployment of planning algorithms in autonomous systems

**Research alignment (GeoAI / Spatial Intelligence):**

- Algorithmic spatial reasoning in continuous 3D space
- Constraint-aware route optimization
- Large-scale spatial data ingestion and validation
- Bridging theoretical path planning with real-world operational constraints

_Location:_ South San Francisco, CA  
_Website:_ https://www.zipline.com/careers

> Particularly relevant if your trajectory includes spatial intelligence, autonomous systems, or algorithmic spatial decision-making beyond traditional GIS workflows.

### **RAND Corporation**

_Focus:_ Policy Research · Risk Analysis · AI for Public Policy · Systems Modeling · National Security · Climate & Disaster Research

RAND Corporation is a leading U.S. nonprofit research institution conducting rigorous, policy-oriented research across national security, public health, climate risk, artificial intelligence, socio-technical systems, and economic modeling.

The **Graduate Student Summer Associate Program** offers PhD students the opportunity to collaborate with RAND researchers on high-impact, decision-oriented research projects that directly inform government and institutional policy.

**Relevant research tracks include:**

- Artificial Intelligence & Data Science for Public Policy
- Risk and Decision Analysis
- Operations Research & Systems Engineering
- Climate, Energy & Disaster Resilience
- National Security & Technology Policy
- Economics, Statistics & Social Science Modeling

The program emphasizes:

- Quantitative modeling and simulation
- AI applications in governance and public systems
- Systems-level decision analysis
- Interdisciplinary collaboration
- Research with real-world policy impact

_Location:_ Santa Monica, CA (also Washington, D.C.; Pittsburgh, PA; Boston, MA)  
_Program Type:_ Research-intensive summer associate program  
_Eligibility:_ PhD students across engineering, computer science, statistics, economics, public policy, and related disciplines  
_Website:_ https://www.rand.org/jobs/summer-associates.html

> **Note:** Unlike traditional industry internships, RAND positions are research-driven and policy-oriented. The focus is on analytical rigor, modeling, and strategic decision support rather than product development.

### **AMap (Alibaba Local Services Group)**

_Focus:_ Spatial Intelligence · GeoAI · Multimodal Models · Autonomous Driving · Urban Computing

AMap is one of China’s leading digital mapping and spatial information platforms and operates under **Alibaba Group’s Local Services division**. The company actively develops technologies in **spatial intelligence and multimodal foundation models**, particularly for autonomous driving, high-definition mapping, spatiotemporal data intelligence, and large-scale urban computing systems.

**Relevant internship tracks include:**

- Generative AI / World Model Research Intern
- Multimodal Foundation Model Algorithm Intern (Image / Video / Cross-modal)
- VLA (Vision–Language–Action) Agent Research Intern
- Autonomous Driving Perception Algorithm Intern
- Spatiotemporal Data Modeling and Route Optimization Intern

These internships typically emphasize:

- Multimodal representation learning (Vision–Language–Map integration)
- Spatial semantic understanding and 3D scene modeling
- Training and optimization of large foundation models
- Large-scale trajectory and urban spatiotemporal data modeling
- Spatial reasoning capabilities in real-world environments

_Location:_ Beijing, China  
_Website:_ https://talent.amap.com/

> **Note:** Applicants with backgrounds in **GeoAI, GIScience, spatial representation learning, street-view or cross-view learning, and multimodal spatial models** are particularly well aligned with these research-oriented positions.

---

### **SenseTime (SenseEarth)**

_Focus:_ Remote Sensing Foundation Models · Multimodal Learning · Earth Observation · AI for Science · Digital Twin

SenseTime is a global artificial intelligence company specializing in computer vision and large-scale AI systems. Its **SenseEarth platform** focuses on intelligent remote sensing interpretation, multimodal Earth observation data fusion, and large-scale digital twin technologies for urban environments. The platform supports applications in natural resource monitoring, disaster response, and spatial intelligence systems.

**Relevant internship tracks include:**

- Remote Sensing Foundation Model / AI for Science Research Intern
- Multimodal Algorithm Research Intern (Vision / Remote Sensing / Cross-modal)
- Computer Vision Research Intern (3D Reconstruction / Digital Twin)
- GeoAI and Spatial Data Intelligence Algorithm Intern

These internships typically emphasize:

- Pretraining and fine-tuning of **vision foundation models for Earth observation**
- Fusion of multimodal geospatial data (optical imagery, SAR, satellite data, street-view imagery, etc.)
- Cross-view representation learning and large-scale spatial scene reconstruction
- GeoAI methods for real-world tasks such as change detection and disaster damage assessment
- Participation in high-impact research outputs (e.g., publications at **CVPR, ICCV, KDD**) or related patents

_Location:_ Beijing / Shanghai / Shenzhen, China  
_Website:_ https://hr.sensetime.com/

> **Note:** Candidates with strong research backgrounds in **AI for Science, GeoAI, multimodal spatial intelligence, and Earth observation analytics** are particularly competitive for these research-focused positions.

### **Synspective**

_Focus:_ Earth Observation · SAR Satellites · Remote Sensing AI · Disaster Monitoring · Spatial Intelligence

Synspective is a Japan-based Earth observation company developing a constellation of **small Synthetic Aperture Radar (SAR) satellites** to provide high-frequency, all-weather global monitoring. The company integrates **satellite data, geospatial analytics, and AI-driven insights** to support disaster response, infrastructure monitoring, and national security applications.

Synspective is particularly relevant for researchers working in **remote sensing, GeoAI, spatial data science, and Earth observation analytics**. Internships and research collaborations often involve working with **SAR imagery, satellite data pipelines, and geospatial machine learning models** for large-scale Earth monitoring.

**Relevant internship tracks include:**

- Remote Sensing / Earth Observation Intern
- Machine Learning Intern (Geospatial or SAR Data)
- Geospatial Data Scientist Intern
- Satellite Data Analytics Intern

These internships typically emphasize:

- SAR image processing and interferometric SAR (InSAR) analysis
- Machine learning for remote sensing and Earth observation data
- Large-scale geospatial data pipelines and satellite data platforms
- Disaster monitoring and infrastructure deformation detection
- AI-driven Earth observation analytics and spatial intelligence systems

_Location:_ Tokyo, Japan  
_International students:_ Opportunities depend on program availability and visa sponsorship  
_Website:_ https://synspective.com/recruit/

> **Note:** Compared with traditional optical Earth observation companies, Synspective focuses on **SAR-based monitoring**, enabling **all-weather and nighttime Earth observation**, which is particularly valuable for disaster monitoring, infrastructure stability analysis, and environmental change detection.

### **Treefera**

_Focus:_ Supply Chain Intelligence · Remote Sensing ML · Climate Risk · Commodity Mapping · Nature Intelligence

Treefera is a London-based climate-tech company building a **first-mile intelligence platform** for global agricultural and soft-commodity supply chains. Its technical stack sits at the intersection of **Earth observation, remote sensing machine learning, geospatial risk analytics, and nature-linked supply-chain intelligence**, turning satellite, radar, and LiDAR observations into plot-level decision support for compliance, risk, cost, performance, and exposure.

**Relevant full-time role:**

- Machine Learning Scientist – Remote Sensing

This role emphasizes:

- Commodity and plantation mapping for products such as **palm oil, cocoa, coffee, rubber, soy, and timber**
- Multi-sensor fusion across **satellite, radar, and LiDAR** for forest degradation, biomass, and canopy-height estimation
- Building lightweight downstream workflows on top of **EO foundation models**, including few-shot classifiers, similarity search, and regressors
- Validation against plot inventories and third-party reference datasets, with uncertainty quantification and QA artefacts
- Partnering with engineering on scalable inference pipelines across **millions of plots**

**Preferred / required technical profile includes:**

- Geospatial Python tools such as **rasterio, xarray, geopandas, GDAL, and STAC**
- Deep learning with **PyTorch** and classical ML with **scikit-learn**
- Remote sensing experience spanning **optical imagery, SAR, and/or LiDAR**
- Familiarity with **AWS or comparable cloud platforms**, Git-based collaboration, and production-oriented model development
- Exposure to **EO foundation models, multimodal fusion, time-series modeling, Google Earth Engine, Planetary Computer, or AWS Open Data**

_Location:_ London  
_Employment type:_ Full time  
_Location type:_ Hybrid  
_Department:_ Platform › Science & Analytics  
_Compensation:_ £75K–£90K + equity + bonus  
_Website:_ https://www.treefera.com/  
_Job posting:_ https://jobs.ashbyhq.com/treefera/b814e3e3-2b63-4a5d-a537-943e629e7a70/application

> **Positioning Insight:** Treefera is especially relevant for researchers interested in the convergence of **remote sensing foundation models, geospatial supply-chain intelligence, climate/nature risk analytics, and production-grade environmental AI systems**. It is a strong fit for trajectories that connect EO science with real-world operational decision-making.

### Reality Capture and Spatial Computing Company Map

_Focus:_ Reality Capture · Surveying · 3D Reconstruction · Digital Twins · Spatial Computing · Autonomous GeoAI Infrastructure

This company map collects firms and ecosystem organizations relevant to autonomous geospatial AI, especially the hardware, software, and service layers that produce or operationalize real-world spatial data. It is intended for research scouting, collaboration mapping, and industry awareness. Verify current roles and programs before treating any entry as an internship target.

#### Surveying, Positioning, and Mobile Mapping

- **Trimble** - Connected hardware and software across construction, geospatial, transportation, agriculture, and precise positioning. Relevant for GNSS, RTK, mobile mapping, construction technology, and geospatial workflow automation.<br>
  https://www.trimble.com/en

- **CHC Navigation / CHCNAV** - Navigation, positioning, and mapping technologies for geospatial, construction, navigation, and agriculture, including GNSS, LiDAR, UAV/USV, machine control, and real-time GNSS infrastructure.<br>
  https://www.chcnav.com/

- **Cyclomedia** - Street-level mobile mapping, high-accuracy 360-degree imagery, LiDAR point clouds, AI-derived asset intelligence, Street Smart visualization, and GIS/API integrations for public-space and infrastructure management. See the detailed Cyclomedia entry above for GeoAI-oriented notes.<br>
  https://www.cyclomedia.com/en-us

- **Mosaic (Geospatial Imaging Leaders)** - Robust 360-degree mobile mapping camera systems and services for street-level imagery, mapping, surveying, infrastructure inspection, 3D reconstruction, and digital twin workflows. See the detailed Mosaic entry above for internship-oriented notes.<br>
  https://www.mosaic51.com/

- **DT360 / DebrisTech** - Scalable field data acquisition across an integrated aerial and ground fleet: road-going mobile mapping vehicles, amphibious all-terrain units carrying 360-degree camera systems, and helicopter-based LiDAR over transmission lines, pipelines, and inaccessible terrain. Reports 250,000+ miles of roadway corridor captured, delivers corridor LiDAR through its Pathfinder platform (including all 1,920 miles of I-95 across 15 states), and pairs this with FEMA-auditable disaster debris monitoring. See the detailed DT360 / DebrisTech entry above for GeoAI-oriented notes.<br>
  https://www.dt360.com/

- **3GON Slovakia, s.r.o.** - Slovak distributor and integrator for precise measurement, data capture, drones, 3D technologies, software, monitoring, and spatial data processing.<br>
  https://www.3gon.sk/

#### 3D Scanning, Photogrammetry, and Gaussian Splatting

- **Varjo Teleport** - Cloud reality-capture platform turning phone, drone, or camera captures into photorealistic, real-time-streamable 3D Gaussian Splatting models, with drone-based multi-square-kilometre aerial reconstruction and a developer API (see full profile above).<br>
  https://get.teleport.varjo.com/

- **XGRIDS** - SLAM-based handheld LiDAR scanning, real-time 3D reconstruction, Lixel scanners, and 3D Gaussian Splatting-oriented spatial computing tools.<br>
  https://www.xgrids.com/

- **Rigsters** - 3D scanning and photogrammetry services, including laser or structured-light scanning, automated scanning rigs, large-scale digitization, and 3D model post-processing.<br>
  https://rigsters.com/services/

- **Tiki3D** - End-to-end reality 3D modeling software and hardware, covering photogrammetry, aerial and satellite imagery, LiDAR point clouds, real-time drone-based 3D modeling, and geospatial entity construction.<br>
  https://tiki3d.com/

- **Overhead4D** - Creative photogrammetry, 3D scanning, aerial works, VR/AR experiences, cultural heritage digitization, smart city capture, and UAV-based inspection.<br>
  https://overhead4d.com/

- **Blurry** - Browser-based hosting, sharing, and embedding for 3D Gaussian Splatting models, relevant to publishing and viewing 3DGS outputs from reality capture workflows.<br>
  https://www.useblurry.com/

#### Drone Data and Aerial Capture

- **AVAG** - Drone data platform for photogrammetric processing, spatial data delivery, CAD/WMS/3D model workflows, terrain analysis, volume calculations, cross-sections, and 2D/3D vectorization.<br>
  https://avagpro.com/

- **Skynamic** - Close-range drone aerial filming and image capture specialist. More media-production oriented than surveying, but relevant to aerial capture platforms and operator workflows.<br>
  https://www.skynamic.tv/about-us/

- **Spexi** - Vancouver-based drone imagery company building a distributed pilot network (LayerDrone) to deliver standardized, ultra-high-resolution aerial data for spatial AI, change detection, digital twins, photogrammetry, and physical AI workflows. Relevant for living world models, API-first geospatial data delivery, structured nadir/oblique imagery, orthomosaics, 3D point clouds, and emerging city-scale reconstruction pipelines (including its 2026 Niantic Spatial partnership around 3D intelligence and physical AI).<br>
  https://www.spexi.com/

#### 3D GIS, Digital Twins, and XR Visualization

- **Skyline Software Systems** - 3D geospatial software for photogrammetry, 3D mesh and Gaussian Splatting models, TerraExplorer, SkylineGlobe Server, digital twins, mapping, surveying, drone inspection, and city planning.<br>
  https://www.skylinesoft.com/

- **WAYZ.AI (维智科技)** - Spatiotemporal-AI decision-intelligence platform for city and enterprise digital twins; combines spatial sensing, multimodal spatiotemporal knowledge graphs, IoT positioning, and analytics for urban operations, emergency management, mobility, and commercial decision support. See the detailed WAYZ.AI entry above for GeoAI-oriented notes.<br>
  https://www.wayz.ai/

- **QuaternAR** - XR collaboration runtime for synchronized shared 3D environments across AR/VR headsets, 3D displays, desktops, and tablets. Relevant to spatial computing interfaces for collaborative geospatial or industrial scenes.<br>
  https://quaternar.com/

#### CAD, Wireless Planning, and Innovation Ecosystem

- **4 CAD solution s.r.o.** - CAD software and automation company focused on SOLIDWORKS-related workflows, CAD macros, AI CAD copilots, text-to-STEP/STL concepts, and engineering process automation.<br>
  https://www.4-cad.cz/

- **Hamina Wireless** - AI-assisted wireless network planning, site survey, live troubleshooting, and 3D Wi-Fi, private 5G, and IoT signal modeling. Relevant to indoor spatial modeling and infrastructure-aware digital twins.<br>
  https://www.hamina.com/

- **SAPIE (Slovak Alliance for Innovation Economy)** - Slovak nonprofit innovation-economy alliance and policy platform supporting startups, digital transformation, private-public collaboration, and the broader CEE innovation ecosystem.<br>
  https://sapie.sk/home

- **Taylor Geospatial** - St. Louis-based geospatial organization focused on the digital public good, democratizing GeoAI through global partnerships, geospatial innovation capacity building, open geospatial tooling, and community-facing spatial intelligence initiatives. Relevant to autonomous GeoAI ecosystem development, geospatial evaluation infrastructure, and public-interest geospatial AI.<br>
  https://taylorgeospatial.org/

#### Needs Name Verification

- **Shiyan-tech / Shiyan Intelligent Technology (tentative)** - Possible match: Shiyan Intelligent Technology (Guangzhou), also presented as Roboeye, an AI 3D vision company for manufacturing. Confirm the exhibitor logo, official English name, or event profile before treating this as a verified entry.<br>
  https://www.roboeye.ai/about.asp

---

## Postdoc Opportunities

_Curated top-tier postdoctoral opportunities for GeoAI researchers, organized into two
tracks — **geo-focused** (GIScience, remote sensing, Earth systems) and **AI-focused**
(computer science, machine learning) — plus discipline-open fellowships that fit either
path. Each track lists institutions and programs first, then the job boards where new
openings are posted._

---

### Geo-Focused (GIScience · Remote Sensing · Earth Systems)

- **Cornell University, School of Civil & Environmental Engineering — Postdoctoral Associate** _(current opening)_ — One-year postdoctoral position, with possible renewal for a total of two years, developing computational models of escalating regional hurricane disaster risk, multi-stakeholder interactions, insurance markets, and public-policy interventions; applications are reviewed immediately until the position is filled
  https://academicjobsonline.org/ajo/jobs/32321
- **Yale Center for Geospatial Solutions** — Yale's hub for geospatial data, technology, and policy; hires postdoctoral associates applying geospatial analytics and AI to land, water, climate, and biodiversity challenges<br>
  https://geospatial.yale.edu/
- **USGS Mendenhall Research Fellowship Program** — The flagship U.S. Geological Survey postdoc; research opportunities regularly include geospatial science, remote sensing, natural hazards, and machine learning<br>
  https://www.usgs.gov/centers/mendenhall-research-fellowship-program
- **NASA Postdoctoral Program (NPP)** — Research fellowships across NASA centers (including JPL and Goddard) in Earth science, remote sensing, and data science<br>
  https://npp.orau.org/
- **NSF SBE Postdoctoral Research Fellowships (SPRF)** — NSF-funded postdoc for the social, behavioral, and economic sciences; geography and spatial sciences are eligible disciplines<br>
  https://www.nsf.gov/funding/opportunities
- **NCAR Advanced Study Program (ASP) Postdoctoral Fellowship** — Independent research fellowship at the National Center for Atmospheric Research; strong fit for AI-for-Earth-systems work<br>
  https://asp.ucar.edu/
- **NOAA Climate & Global Change Postdoctoral Fellowship** — UCAR-administered fellowship pairing fellows with host scientists across U.S. climate research institutions<br>
  https://cpaess.ucar.edu/cgc
- **Columbia Climate School Postdoctoral Research Program** — Earth Institute–lineage postdoc for climate, sustainability, and Earth-systems research; welcomes computational and data-driven approaches<br>
  https://www.climate.columbia.edu/
- **DOE National Laboratory Named Fellowships** — Prestigious lab-specific postdocs such as ORNL's Wigner Fellowship and PNNL's Linus Pauling Distinguished Postdoctoral Fellowship; ORNL in particular hosts a dedicated GeoAI research group, and the national labs increasingly hire in AI/ML for Earth, climate, and geospatial applications<br>
  https://www.ornl.gov/careers · https://www.pnnl.gov/careers
- **I-GUIDE (NSF Institute for Geospatial Understanding through an Integrative Discovery Environment)** — NSF institute whose partner universities regularly post geospatial data science postdoc openings<br>
  https://iguide.illinois.edu/
- **AAG Jobs & Careers** _(job board)_ — The American Association of Geographers job board; the main venue for geography and GIScience postdoc and faculty listings<br>
  https://www.aag.org/jobs-careers/
- **Earthworks** _(job board)_ — Long-running international job board for geoscience, remote sensing, and GIS positions<br>
  https://www.earthworks-jobs.com/

### AI-Focused (Computer Science · Machine Learning)

- **CSPhD.org PhD / RA / Postdoc Board (博士栈机会看板)** — Live, filterable board of PhD, RA, and postdoc openings across CS and AI groups worldwide (hundreds of listings from 200+ schools, continuously updated); filter by the **Postdoc** type to surface AI/ML postdoc openings<br>
  https://csphd.org/board.html
- **CRA/NSF Computing Innovation Fellows (CIFellows)** — Computing-community postdoc program run by the Computing Research Association with NSF support<br>
  https://cra.org/cifellows/
- **Microsoft Research Postdoctoral Researcher Program** — One-to-two-year research positions across MSR labs; sustainability and AI-for-good teams work directly on geospatial and Earth data<br>
  https://www.microsoft.com/en-us/research/careers/
- **Allen Institute for AI (Ai2)** — Young Investigator (postdoc-equivalent) and research scientist roles; Ai2's climate modeling and open-model teams intersect with geospatial AI<br>
  https://allenai.org/careers
- **Harvard Data Science Initiative Postdoctoral Fellows** — Independent data-science research fellowship with freedom to collaborate across Harvard schools; spatial data science and urban analytics are represented themes<br>
  https://datascience.harvard.edu/
- **AcademicJobsOnline** _(postdoc and academic job board)_ — Application portal serving academic institutions worldwide, with postdoctoral openings across computer science, data science, Earth sciences, and related fields<br>
  https://academicjobsonline.org/ajo

### Open-Discipline Fellowships (Fit Either Track)

- **Schmidt Science Fellows** — Highly selective interdisciplinary postdoctoral fellowship that asks fellows to pivot into a new discipline; a strong fit for GeoAI researchers moving toward AI4Science or Earth-system applications<br>
  https://schmidtsciencefellows.org/
- **Miller Research Fellowship (UC Berkeley)** — Three-year independent fellowship at the Miller Institute for Basic Research in Science; open to all sciences, including Earth and computational sciences<br>
  https://miller.berkeley.edu/
- **Branco Weiss Fellowship — Society in Science** — Up-to-five-year, globally portable fellowship for researchers pursuing unconventional ideas at the interface of science and society<br>
  https://brancoweissfellowship.org/
- **Marie Skłodowska-Curie Postdoctoral Fellowships (MSCA-PF)** — The EU's flagship postdoc scheme (European and Global tracks); host institutions across Europe include leading GIScience and Earth observation groups<br>
  https://marie-sklodowska-curie-actions.ec.europa.eu/
- **Alexander von Humboldt Research Fellowship** — Flexible 6–24 month fellowship for postdoctoral research at any institution in Germany<br>
  https://www.humboldt-foundation.de/
- **Royal Society Newton International Fellowships** — Two-year fellowship for early-career researchers moving to the UK in the natural sciences<br>
  https://royalsociety.org/grants-schemes-awards/grants/newton-international/
