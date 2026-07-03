# Architecture — observed stack (2026-07-03)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router, `app/[locale]/`) + TypeScript strict |
| Content | MDX (`@next/mdx`, `content/`), synced courses via `scripts/sync-courses.mjs` |
| i18n | `next-intl` (`i18n/`, `messages/`) — Swedish + English |
| Data/Auth | Supabase (`@supabase/ssr`, `supabase/`) |
| UI | Tailwind, `components/` + shadcn-style `components.json`, Phosphor icons |
| Analytics | Vercel Analytics + Microsoft Clarity |
| Structure | Vertical slices in `features/`, shared code in `lib/` |

## Commands (the real ones — never invent others)

```bash
npm run dev            # next dev
npm run build          # next build  ← must pass before any PR
npm run lint           # eslint      ← must pass before any PR
npm run sync:courses   # node scripts/sync-courses.mjs
```

There is no test script yet; definition of done = lint + build green and the
change observed working in `next dev`. If tests are added, update this file
and AGENTS.md in the same PR.

## Invariants

- All user-facing routes live under `app/[locale]/` — new pages must be
  localized (both `messages/` locales).
- Feature code goes in `features/<name>/` (vertical slice), not scattered
  across `app/` and `lib/`.
- SEO matters (see recent SEO foundation work) — new pages ship with
  metadata.
