# ai/ — context for AI agents working in this repo

bitcoinlivet is a **BAI Digital** product. Read in this order before coding:

1. **Company level:** [Hugosterberg/bai-digital-office](https://github.com/Hugosterberg/bai-digital-office)
   (local: `c:\Code\bai-digital-office`) — `ai/PLAYBOOK.md` defines how all
   agents work: `feat/<slug>` branches, human-reviewed PRs, definition of done.
2. **Engineering rules:** [../AGENTS.md](../AGENTS.md) — Next.js version
   caveats, vertical slice architecture, code standards.
3. **Product context** (this repo already documents itself in `docs/` —
   these files index it rather than duplicate it):

| Topic | Where it lives |
|---|---|
| Vision / what bitcoinlivet is | [docs/PROJECT_BRIEF.md](../docs/PROJECT_BRIEF.md) |
| Roadmap | [docs/ROADMAP.md](../docs/ROADMAP.md) |
| Architecture & stack | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Standing decisions | [DECISIONS.md](./DECISIONS.md) |
| Integrations | [docs/SUPABASE.md](../docs/SUPABASE.md) · [docs/RESEND.md](../docs/RESEND.md) · [docs/ANALYTICS.md](../docs/ANALYTICS.md) · [docs/INSTAGRAM.md](../docs/INSTAGRAM.md) |

The agent task queue for this repo: GitHub issues labeled `agent:ready`
(created from BAI Mission Control). Keeping this folder true is part of
every feature's definition of done.
