# GIStudio Notes knowledge architecture review

Updated: 2026-08-27

This ledger records human decisions made after reading the generated `audit.md`. A similarity score is not itself a merge or migration decision.

## Confirmed overlap and separation decisions

- [done] `AI/prompts/提示词集锦.md` was an empty public placeholder for the substantive `tools/LLM Prompts.md` page. Merge into the tools page and preserve the old route as an alias.
- [done] `Data/hk_pop.md` and `Data/hk_population_data_analysis.md` are complementary: the first is a compact survey-frame note; the second is a dataset catalogue. Keep both and cross-link them.
- [done] `Anywriting/spatial-gen-1.md` and `Philosophy/production-of-space.md` are different layers: a reading trace and a public concept page. Keep both and cross-link them.
- [done] Keep `awesome-autonomous-geoai/research-philosophy.md` as the upstream-structured source page and retitle `research-philosophy-summary-zh.md` as a Chinese synthesis with extended interpretation because it has grown beyond a compact summary.

## Confirmed relationship repairs

- [done] Connect the Peters close reading to both research-question method pages.
- [done] Connect philosophical causality to the research problem and causal-orientation framework.
- [done] Connect the SEP usage guide to the Philosophy hub instead of linking it separately to every concept page.
- [done] Connect the KDD process note with the paper-specific GBDT workflow note.
- [done] Connect the raw spatial-production reading note with the curated concept page.
- [done] Connect the spatial-production reading note to its phenomenology and dialectics background pages.
- [done] Connect the AI classification page to the concrete NER, RL, DL, GenAI, and LLM topic entries it names.

## Placement review

- [done] `AI/Classification of AI.md`, `AI/KDD.md`, and the 3D-world note are valid AI pages; their immediate problem was missing navigation, not proven misplacement.
- [done] `Dev/fonts.md` and `Dev/skills/context.md` remain under Dev for now and are restored to the Dev index.
- [done] Move the 18-page SDG collection from `Writing/experts/sdg/` to `Sustainability/SDG/`, add a sustainability hub, and preserve every old published route with an alias.
- [done] Move the one-page `cloud/Cloud Studio.md` field to `Dev/cloud-studio.md` and preserve the old route with an alias.
- [done] Keep `Anywriting/spatial-gen-1.md` as an explicitly provisional reading trace, connect it to the curated Philosophy pages, and apply the promotion or retirement policy in `taxonomy.md` during later content-quality review.
- [done] Keep `Reading/GBDT.md` as a source-centered reading note and retitle it around the cited urban-gentrification workflow.
- [done] Merge the one-link `tools/Dev.md` stub into the tools hub and preserve the old route with an alias.
- [done] Merge the one-item root page `Reading Suggestions.md` into the Reading hub and preserve the old route with an alias.

## Glossary decisions

- [done] Create one shared glossary hub before creating one file per acronym.
- [done] Add the first-entry terms GIS, GeoAI, LLM, Agent, API, GPU, RL, MDP, SDG, DOI, KDD, NLP, and POI.
- [done] Add second-pass entries for machine learning, AI4Science, and Autonomous GeoAI after the frequency audit showed they recur across fields without an independent definition.
- [done] Move the vague `Reading/Definations.md` page to `Glossary/development-status-classifications.md`, rewrite it as a bounded terminology note, and preserve the old route with an alias.
- [done] Keep conference and institution abbreviations such as CVPR, SIGGRAPH, UCL, MIT, and IEEE at first mention or in a specialized conference page instead of creating standalone glossary entries.
- [done] Keep ambiguous abbreviations such as CI, IP, and MM in their page context until a stable site-wide meaning exists.
- [done] Keep mathematical symbols and local notation next to the equation or in the page appendix; place repeated technical vocabulary in the shared glossary.
- [done] Add CV, CNN, EO, AR, and VR after separating domain terms from conference and institution abbreviations.

## Rejected automatic relation candidates

- [drop] Do not link all Philosophy pages individually to the SEP usage guide; the Philosophy hub provides the useful relationship.
- [drop] Do not link unrelated AI tools merely because they share `AI`, `开源`, or `工具` tags.
- [drop] Do not link the Qwen N-gram Embedding page to every page tagged `深度学习` or `LLM`; require a specific explanatory dependency.
- [drop] Do not create glossary pages directly from raw acronym frequency. Frequency is a discovery signal, not evidence that a term blocks understanding.
