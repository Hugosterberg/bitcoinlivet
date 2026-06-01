"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import {
  applyCompletion,
  initialProgressData,
  type CompleteArgs,
  type CompleteResult,
  type LessonResult,
  type ProgressData,
} from "@/features/education/data/progress";
import { lessonKey } from "@/features/education/data/education";
import {
  persistLessonCompletion,
  resetServerProgress,
} from "@/features/education/data/progress-sync";

export type { ProgressData, CompleteResult } from "@/features/education/data/progress";

const STORAGE_KEY = "bitcoinlivet:education:v1";

/* ------------------------------------------------------------------ *
 * Module-level store. Backed by localStorage for anonymous visitors and
 * by Supabase for signed-in users. Read via useSyncExternalStore so it
 * stays hydration-safe without refs-in-render or setState-in-effect.
 *
 * Mode:
 *  - "local"   → anonymous; reads/writes localStorage (unchanged behaviour).
 *  - "account" → signed in; hydrated from the server, writes sync to Supabase
 *                and are NOT mirrored to localStorage (so logging out reveals
 *                the anonymous state again, and devices don't leak progress).
 * ------------------------------------------------------------------ */

type Mode = "local" | "account";

let cache: ProgressData = initialProgressData;
let loaded = false;
let mode: Mode = "local";
const listeners = new Set<() => void>();

function readLocalStorage(): ProgressData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressData>;
      return {
        ...initialProgressData,
        ...parsed,
        lessons: parsed.lessons ?? {},
        badges: parsed.badges ?? [],
      };
    }
  } catch {
    // Ignore corrupt or unavailable storage.
  }
  return initialProgressData;
}

function ensureLoaded(): ProgressData {
  if (typeof window === "undefined") return initialProgressData;
  if (!loaded && mode === "local") {
    cache = readLocalStorage();
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

function notify() {
  listeners.forEach((l) => l());
}

function writeStore(next: ProgressData) {
  cache = next;
  loaded = true;
  if (mode === "local") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota or privacy-mode failures.
    }
  }
  notify();
}

function getServerSnapshot(): ProgressData {
  return initialProgressData;
}

// Stable references for the hydration flag store.
const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/** Reads the anonymous localStorage progression (for merging on login). */
export function getLocalProgressSnapshot(): ProgressData {
  if (typeof window === "undefined") return initialProgressData;
  return readLocalStorage();
}

/**
 * Switches the store into account mode and seeds it with the user's
 * server-side progression. Called from <ProgressSync> after a session loads.
 */
export function hydrateFromServer(data: ProgressData) {
  mode = "account";
  cache = data;
  loaded = true;
  notify();
}

/**
 * Reverts to anonymous mode and reloads localStorage. Called on sign-out.
 */
export function revertToLocalMode() {
  mode = "local";
  loaded = false;
  cache = initialProgressData;
  ensureLoaded();
  notify();
}

function completeLessonInStore(args: CompleteArgs): CompleteResult {
  const prev = ensureLoaded();
  const { next, result } = applyCompletion(prev, args);

  if (result.alreadyDone) return result;

  writeStore(next);

  if (mode === "account") {
    // Optimistic: UI already reflects `next`. Persist in the background.
    void persistLessonCompletion(args);
  }

  return result;
}

function resetStore() {
  if (mode === "account") {
    void resetServerProgress();
    cache = initialProgressData;
    loaded = true;
    notify();
    return;
  }

  cache = initialProgressData;
  loaded = true;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
  notify();
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
