"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import {
  XP_PER_CORRECT,
  XP_PER_LESSON,
  getLevelProgress,
  lessonKey,
  nextStreak,
  todayKey,
} from "@/features/education/data/education";

const STORAGE_KEY = "bitcoinlivet:education:v1";

type LessonResult = { correct: number; total: number; xp: number };

export type ProgressData = {
  lessons: Record<string, LessonResult>;
  xp: number;
  streak: number;
  lastActive: string | null;
  /** Module slugs the user has fully completed. */
  badges: string[];
};

const initialData: ProgressData = {
  lessons: {},
  xp: 0,
  streak: 0,
  lastActive: null,
  badges: [],
};

/* ------------------------------------------------------------------ *
 * Module-level store backed by localStorage. Read via useSyncExternalStore
 * so it stays hydration-safe without refs-in-render or setState-in-effect.
 * ------------------------------------------------------------------ */

let cache: ProgressData = initialData;
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded(): ProgressData {
  if (typeof window === "undefined") return initialData;
  if (!loaded) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProgressData>;
        cache = {
          ...initialData,
          ...parsed,
          lessons: parsed.lessons ?? {},
          badges: parsed.badges ?? [],
        };
      }
    } catch {
      // Ignore corrupt or unavailable storage.
    }
    loaded = true;
  }
  return cache;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function writeStore(next: ProgressData) {
  cache = next;
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota or privacy-mode failures.
  }
  listeners.forEach((l) => l());
}

function getServerSnapshot(): ProgressData {
  return initialData;
}

// Stable references for the hydration flag store.
const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

type CompleteArgs = {
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

function completeLessonInStore(args: CompleteArgs): CompleteResult {
  const prev = ensureLoaded();
  const key = lessonKey(args.moduleSlug, args.lessonSlug);

  if (prev.lessons[key]) {
    return { earnedXp: 0, alreadyDone: true, badgeEarned: false, leveledUp: false };
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

  const today = todayKey();
  const streak = nextStreak(prev.streak, prev.lastActive, today);
  const nextXp = prev.xp + earnedXp;
  const leveledUp =
    getLevelProgress(nextXp).current.level > getLevelProgress(prev.xp).current.level;

  writeStore({ lessons, xp: nextXp, streak, lastActive: today, badges });

  return { earnedXp, alreadyDone: false, badgeEarned, leveledUp };
}

function resetStore() {
  cache = initialData;
  loaded = true;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
  listeners.forEach((l) => l());
}

/**
 * Passthrough wrapper kept for semantic grouping in the route layout.
 * The actual state lives in the module-level store above.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

type ProgressApi = {
  hydrated: boolean;
  data: ProgressData;
  completedCount: number;
  isLessonComplete: (moduleSlug: string, lessonSlug: string) => boolean;
  lessonResult: (moduleSlug: string, lessonSlug: string) => LessonResult | null;
  completeLesson: (args: CompleteArgs) => CompleteResult;
  reset: () => void;
};

export function useProgress(): ProgressApi {
  const data = useSyncExternalStore(subscribe, ensureLoaded, getServerSnapshot);
  const hydrated = useSyncExternalStore(noopSubscribe, getTrue, getFalse);

  return {
    hydrated,
    data,
    completedCount: Object.keys(data.lessons).length,
    isLessonComplete: (moduleSlug, lessonSlug) =>
      Boolean(data.lessons[lessonKey(moduleSlug, lessonSlug)]),
    lessonResult: (moduleSlug, lessonSlug) =>
      data.lessons[lessonKey(moduleSlug, lessonSlug)] ?? null,
    completeLesson: completeLessonInStore,
    reset: resetStore,
  };
}
