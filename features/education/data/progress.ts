/**
 * Pure progression state + reducer for the education feature.
 *
 * No React, no browser, no Supabase — just the data shape and the logic that
 * advances it. This is the single source of truth reused by:
 *   - the client localStorage store (progress-provider.tsx), and
 *   - the server-side account sync (progress-sync.ts).
 *
 * Keeping the reducer here means an anonymous visitor and a signed-in user
 * earn XP, streaks and badges through identical rules.
 */

import {
  XP_PER_CORRECT,
  XP_PER_LESSON,
  getLevelProgress,
  lessonKey,
  nextStreak,
  todayKey,
} from "@/features/education/data/education";

export type LessonResult = { correct: number; total: number; xp: number };

export type ProgressData = {
  lessons: Record<string, LessonResult>;
  xp: number;
  streak: number;
  lastActive: string | null;
  /** Module slugs the user has fully completed. */
  badges: string[];
};

export const initialProgressData: ProgressData = {
  lessons: {},
  xp: 0,
  streak: 0,
  lastActive: null,
  badges: [],
};

export type CompleteArgs = {
  moduleSlug: string;
  lessonSlug: string;
  correct: number;
  total: number;
  /** All lesson slugs in the module, to detect module completion. */
  moduleLessonSlugs: string[];
};

export type CompleteResult = {
  earnedXp: number;
  alreadyDone: boolean;
  badgeEarned: boolean;
  leveledUp: boolean;
};

/**
 * Advances progression by completing one lesson. Returns the next state and a
 * summary of what was earned. Idempotent: completing an already-done lesson
 * leaves the state unchanged and reports `alreadyDone`.
 */
export function applyCompletion(
  prev: ProgressData,
  args: CompleteArgs,
  today = todayKey(),
): { next: ProgressData; result: CompleteResult } {
  const key = lessonKey(args.moduleSlug, args.lessonSlug);

  if (prev.lessons[key]) {
    return {
      next: prev,
      result: { earnedXp: 0, alreadyDone: true, badgeEarned: false, leveledUp: false },
    };
  }

  const earnedXp = XP_PER_LESSON + args.correct * XP_PER_CORRECT;
  const lessons = {
    ...prev.lessons,
    [key]: { correct: args.correct, total: args.total, xp: earnedXp },
  };

  const moduleDone = args.moduleLessonSlugs.every(
    (slug) => lessons[lessonKey(args.moduleSlug, slug)],
  );
  const badgeEarned = moduleDone && !prev.badges.includes(args.moduleSlug);
  const badges = badgeEarned ? [...prev.badges, args.moduleSlug] : prev.badges;

  const streak = nextStreak(prev.streak, prev.lastActive, today);
  const nextXp = prev.xp + earnedXp;
  const leveledUp =
    getLevelProgress(nextXp).current.level > getLevelProgress(prev.xp).current.level;

  return {
    next: { lessons, xp: nextXp, streak, lastActive: today, badges },
    result: { earnedXp, alreadyDone: false, badgeEarned, leveledUp },
  };
}

/**
 * Merges two progression states (e.g. anonymous localStorage into an account).
 * The union of completed lessons wins; aggregates are recomputed from the
 * merged lessons plus the larger streak / most recent activity.
 */
export function mergeProgress(a: ProgressData, b: ProgressData): ProgressData {
  const lessons = { ...a.lessons, ...b.lessons };
  const xp = Object.values(lessons).reduce((sum, l) => sum + l.xp, 0);
  const badges = Array.from(new Set([...a.badges, ...b.badges]));
  const lastActive =
    [a.lastActive, b.lastActive].filter(Boolean).sort().at(-1) ?? null;
  const streak = Math.max(a.streak, b.streak);
  return { lessons, xp, streak, lastActive, badges };
}
