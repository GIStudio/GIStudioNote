# GIStudio Notes canonical content taxonomy

Updated: 2026-08-27

The folder path records a page's primary knowledge home. Tags and links record secondary fields, methods, audiences, and relationships. A cross-disciplinary page still has one canonical home.

## Placement decision

1. Identify the page's primary reader and purpose.
2. Decide whether it is a source reading, concept explanation, technical mechanism, practical guide, decision note, glossary entry, or hub.
3. Place it under the narrowest established field that owns the main question.
4. Express secondary relationships with tags and contextual links.
5. Create a top-level field only when several durable pages require their own hub.
6. Preserve old public routes with aliases or redirects after a confirmed move.

## Top-level fields

| Field | Owns | Does not own by itself |
|---|---|---|
| `AI/` | AI systems, agents, model families, GenAI, GeoAI, and LLM mechanisms | Generic development setup or source-only paper notes |
| `DL/` | Neural-network foundations, training objectives, losses, and progressive learning notes | Every product that happens to use deep learning |
| `RL/` | Reinforcement-learning concepts, algorithms, libraries, and MDP foundations | Generic agents without an RL formulation |
| `Graph/` | Graph theory, graph representation learning, GNNs, and urban graph computation | Any page containing a network diagram |
| `Data/` | Dataset catalogues, spatial units, data quality, and analysis-ready data decisions | Source-centered reading notes about a model |
| `Dev/` | Reproducible implementation, environments, servers, debugging, and engineering workflow | Tool lists with no implementation task |
| `tools/` | Tool selection, usage entry points, productivity, and bounded service notes | General software-engineering concepts |
| `Reading/` | Notes whose argument remains organized around a named source | Curated concept pages that stand independently of one source |
| `Writing/` | Research questions, argument, academic writing, publication, and public communication | Topical collections unrelated to writing practice |
| `Philosophy/` | Philosophical concepts interpreted for urban science | Raw reading traces or unsupported personal synthesis |
| `Sustainability/` | SDGs, sustainability indicators, and environmental or social-development frameworks | Writing templates that merely mention sustainability |
| `Glossary/` | Repeated terms and classifications that can be defined independently | Page-local symbols or every recurring acronym |
| `Anywriting/` | Explicitly provisional public notes awaiting promotion or retirement | The canonical explanation of a settled concept |
| `awesome-autonomous-geoai/` | One maintained, provenance-bound external collection | The canonical home of all GeoAI concepts |

## Source and concept pairing

A source-centered Reading page may coexist with a concept page when each serves a different reader question. Link them in context. Merge them only when both pages make the same claims for the same reader and one adds no independent evidence or use.

## Transitional content

`Anywriting/` is a staging surface. Each page should eventually reach one of three states.

- Promote it to a canonical field after evidence and prose review.
- Keep it as a clearly labeled reading trace and link the curated concept page.
- Mark it draft or retire it when it cannot meet the public evidence boundary.
