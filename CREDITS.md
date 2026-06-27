# Credits & content licensing

## Course content — Plan ₿ Network

The Bitcoin course in the education section ("Bitcoinskolan" / "Bitcoin school")
is sourced from **Plan ₿ Network**'s open educational content:

- Repository: https://github.com/PlanB-Network/bitcoin-educational-content
- Course: `btc101`
- License: **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**
  — https://creativecommons.org/licenses/by-sa/4.0/

The content is ingested at build time by [`scripts/sync-courses.mjs`](scripts/sync-courses.mjs)
and committed under `features/education/data/generated/` and `public/courses/`.
Re-run `npm run sync:courses` to update.

### Attribution & ShareAlike obligations

Per CC BY-SA 4.0, any page presenting this course content must:

1. **Attribute** Plan ₿ Network and link the licence (rendered on each lesson
   page, see `features/education/components/lesson-view.tsx`).
2. Keep adaptations/translations of the content under **CC BY-SA 4.0**.

This licence applies to the course *content* only — not to the application code,
which is licensed separately.
