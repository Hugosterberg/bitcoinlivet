# Decisions — standing choices for bitcoinlivet

_Lightweight ADR log. Newest first. Status: Active / Proposed / Reversed._

## 2026-07-03 — ai/ indexes docs/, never duplicates it — **Active**

This repo already documented itself in `docs/` (PROJECT_BRIEF, ROADMAP,
integration guides) before joining the BAI agent workflow. The `ai/` folder
therefore points at those files instead of copying them. One source of truth
per topic; a doc moves, the index updates.

## 2026-07-03 — BAI Digital workflow applies — **Active**

Work lands via `feat/<slug>` branches and human-reviewed PRs; the task queue
is GitHub issues labeled `agent:ready` (BAI Mission Control). Company rules:
[Hugosterberg/bai-digital-office](https://github.com/Hugosterberg/bai-digital-office) → `ai/PLAYBOOK.md`.
