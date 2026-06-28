/**
 * Course content for Bitcoinskolan.
 *
 * Ingested from Plan ₿ Network (PlanB-Network/bitcoin-educational-content,
 * CC BY-SA 4.0) by scripts/sync-courses.mjs. The generated, committed data is
 * read here — production never fetches from Plan B at runtime. Re-run the sync
 * to update or add courses.
 *
 * Stable IDs are Plan B UUIDs (module = partId, lesson = chapterId), shared
 * across locales so a user's progress and badges transfer between languages.
 * URL slugs are localized; progress is keyed by the UUIDs.
 */

import { XP_PER_CORRECT, XP_PER_LESSON } from "@/features/education/data/education";
import { generatedCourses } from "@/features/education/data/generated";
import { routing, type Locale } from "@/i18n/routing";
import type {
  CourseModule,
  GeneratedCourse,
  Lesson,
} from "@/features/education/data/course-types";

export type {
  CourseModule,
  GeneratedCourse,
  Lesson,
  ModuleIconKey,
  QuizQuestion,
} from "@/features/education/data/course-types";

/**
 * The active course per locale. We currently ship one course (btc101); the
 * array shape keeps room for more without changing the call sites.
 */
export function getCourse(locale: Locale): GeneratedCourse {
  return generatedCourses[locale][0];
}

export function getCourseModules(locale: Locale): CourseModule[] {
  return getCourse(locale).modules;
}

export type LessonRef = {
  module: CourseModule;
  lesson: Lesson;
  /** 1-based position in the full course flow. */
  index: number;
};

/** All lessons flattened in course order for the given locale. */
export function getLessonFlow(locale: Locale): LessonRef[] {
  return getCourseModules(locale)
    .flatMap((module) => module.lessons.map((lesson) => ({ module, lesson, index: 0 })))
    .map((ref, i) => ({ ...ref, index: i + 1 }));
}

/**
 * Course-shape stats (lesson count, max XP, module count) are identical across
 * locales because every language shares the same Plan B structure, so they are
 * computed once from the default locale and exposed as locale-agnostic values.
 */
const defaultModules = getCourseModules(routing.defaultLocale);

export const moduleCount = defaultModules.length;
export const totalLessons = defaultModules.reduce((n, m) => n + m.lessons.length, 0);

/** XP awarded for a single lesson when all quiz answers are correct. */
export function maxLessonXp(lesson: Lesson): number {
  return XP_PER_LESSON + lesson.quiz.length * XP_PER_CORRECT;
}

/** Maximum XP achievable across the whole course. */
export const totalXp = defaultModules.reduce(
  (sum, m) => sum + m.lessons.reduce((s, l) => s + maxLessonXp(l), 0),
  0,
);

export function getModule(locale: Locale, slug: string): CourseModule | undefined {
  return getCourseModules(locale).find((m) => m.slug === slug);
}

export function getLesson(
  locale: Locale,
  moduleSlug: string,
  lessonSlug: string,
): { module: CourseModule; lesson: Lesson } | undefined {
  const mod = getModule(locale, moduleSlug);
  const lesson = mod?.lessons.find((l) => l.slug === lessonSlug);
  if (!mod || !lesson) return undefined;
  return { module: mod, lesson };
}

/**
 * Maps a module's stable id to its slug in every locale, for hreflang/sitemap
 * alternates across domains (course slugs are localized).
 */
export function getModuleSlugsById(moduleId: string): Record<Locale, string> {
  const slugs = {} as Record<Locale, string>;
  for (const locale of routing.locales) {
    const mod = getCourseModules(locale).find((m) => m.id === moduleId);
    if (mod) slugs[locale] = mod.slug;
  }
  return slugs;
}

/**
 * Maps a lesson's stable id (within a module) to its `{ modul, lektion }` slug
 * pair in every locale, for hreflang/sitemap alternates.
 */
export function getLessonSlugsById(
  moduleId: string,
  lessonId: string,
): Record<Locale, { modul: string; lektion: string }> {
  const out = {} as Record<Locale, { modul: string; lektion: string }>;
  for (const locale of routing.locales) {
    const mod = getCourseModules(locale).find((m) => m.id === moduleId);
    const lesson = mod?.lessons.find((l) => l.id === lessonId);
    if (mod && lesson) out[locale] = { modul: mod.slug, lektion: lesson.slug };
  }
  return out;
}

/** Previous/next lesson in the global course flow. */
export function getAdjacentLessons(
  locale: Locale,
  moduleSlug: string,
  lessonSlug: string,
): { prev: LessonRef | null; next: LessonRef | null } {
  const flow = getLessonFlow(locale);
  const i = flow.findIndex(
    (ref) => ref.module.slug === moduleSlug && ref.lesson.slug === lessonSlug,
  );
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? flow[i - 1] : null,
    next: i < flow.length - 1 ? flow[i + 1] : null,
  };
}
