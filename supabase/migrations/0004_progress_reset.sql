-- Progress reset for the Plan ₿ Network course migration.
--
-- The education feature switched from the bespoke Swedish course to Plan B's
-- btc101 (see scripts/sync-courses.mjs). Lessons are now keyed by Plan B UUIDs
-- (module = partId, lesson = chapterId), shared across languages so progress
-- transfers between the Swedish and English sites.
--
-- The old per-lesson completions and module badges were keyed by retired
-- bespoke slugs (e.g. 'pengar' / 'vad-ar-pengar') that no longer exist and have
-- no 1:1 mapping to the new curriculum. We therefore clear them, but PRESERVE
-- each user's xp / streak / last_active so they keep their level as credit
-- (level is derived from xp). The client localStorage migration (v1 → v2 in
-- features/education/components/progress-provider.tsx) mirrors this exactly.
--
-- Safe to run once. Test on a copy and snapshot row counts first.

begin;

-- Per-lesson completions referenced retired slugs — drop them all.
delete from public.lesson_completions;

-- Clear earned module badges (old module slugs); keep xp/streak/last_active.
update public.user_progress
set badges = '{}',
    updated_at = now()
where badges <> '{}';

commit;
