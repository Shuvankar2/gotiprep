# SUVNKR Practice Hub — Documentation Set

Open-source, cross-platform (Web + Mobile) exam-prep practice platform combining **Typing Practice**, **Unseen Passage Practice**, **Sentence Completion Practice**, and **Email Writing Practice** — under the SUVNKR brand.

## Documents in this set

| Doc | Covers |
|---|---|
| [`PRD.md`](./PRD.md) | Product Requirements — problem, goals, feature scope, personas, monetization, milestones |
| [`SRS.md`](./SRS.md) | Software Requirements Specification — functional & non-functional requirements |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture — monorepo layout, component diagram, data models, deployment |
| [`TECH_STACK.md`](./TECH_STACK.md) | Concrete tech choices, licensing, repo checklist, phased execution roadmap |

## Read order
If you're starting fresh: **PRD → SRS → ARCHITECTURE → TECH_STACK**, then use the checklist in `TECH_STACK.md §4` to scaffold the repo.

## One-line pitch
> A single, ad-supported, open-source practice hub where students train for exam-style typing, unseen-passage, sentence-completion, and email-writing rounds — and get shareable proof they did it.

## Immediate next actions
1. Pick a final product name (working name used throughout: **SUVNKR Practice Hub**).
2. Scaffold the Turborepo per `TECH_STACK.md §4`.
3. Build `core-engine` (WPM/accuracy logic) first — everything else depends on it being correct and shared.
4. Ship Typing Practice on web before anything else (you already have the UI reference and prior art in your email-writing build).
