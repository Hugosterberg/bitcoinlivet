/**
 * Pure gamification logic for the Bitcoin-skolan (education) feature.
 * No React or browser APIs here so it can be used on the server and client.
 */

/** XP awarded for finishing a lesson's reading. */
export const XP_PER_LESSON = 50;
/** XP awarded per correctly answered quiz question. */
export const XP_PER_CORRECT = 15;

export type Level = {
  /** 1-based level number. */
  level: number;
  /** Swedish, calm, non-hype title. */
  name: string;
  /** XP required to reach this level. */
  minXp: number;
};

/**
 * Level thresholds tuned to the total XP available in the course
 * (≈1200 XP at full completion).
 */
export const LEVELS: Level[] = [
  { level: 1, name: "Nyfiken", minXp: 0 },
  { level: 2, name: "Utforskare", minXp: 120 },
  { level: 3, name: "Sparare", minXp: 300 },
  { level: 4, name: "Långsiktig", minXp: 540 },
  { level: 5, name: "Kunnig", minXp: 820 },
  { level: 6, name: "Bitcoiner", minXp: 1100 },
];

export type LevelProgress = {
  current: Level;
  next: Level | null;
  /** 0–100 progress towards the next level (100 when maxed). */
  percentToNext: number;
  /** XP still needed for the next level (0 when maxed). */
  xpToNext: number;
};

/** Resolves XP into the current level and progress towards the next. */
export function getLevelProgress(xp: number): LevelProgress {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }

  const next = LEVELS.find((l) => l.minXp > current.minXp) ?? null;
  if (!next) {
    return { current, next: null, percentToNext: 100, xpToNext: 0 };
  }

  const span = next.minXp - current.minXp;
  const into = xp - current.minXp;
  const percentToNext = Math.min(100, Math.round((into / span) * 100));
  return { current, next, percentToNext, xpToNext: Math.max(0, next.minXp - xp) };
}

/** Stable key for a lesson within the progress store. */
export function lessonKey(moduleSlug: string, lessonSlug: string): string {
  return `${moduleSlug}/${lessonSlug}`;
}

/** Today's date as a YYYY-MM-DD string in local time. */
export function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** Whole-day difference between two YYYY-MM-DD keys (b - a). */
export function dayDiff(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/**
 * Computes the next streak value given the last active day.
 * - Same day → unchanged.
 * - Yesterday → +1.
 * - Otherwise → reset to 1.
 */
export function nextStreak(
  current: number,
  lastActive: string | null,
  today = todayKey(),
): number {
  if (!lastActive) return 1;
  const diff = dayDiff(lastActive, today);
  if (diff <= 0) return Math.max(current, 1);
  if (diff === 1) return current + 1;
  return 1;
}
