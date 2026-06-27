/**
 * Shared types for course content ingested from Plan ₿ Network
 * (see scripts/sync-courses.mjs). Stable IDs are Plan B UUIDs
 * (`moduleId`/`partId`, `lessonId`/`chapterId`), shared across locales so
 * progress transfers; URL slugs are localized.
 */

/** Icon key, mapped to a Phosphor icon in components/education/module-icon.tsx. */
export type ModuleIconKey = "coins" | "bitcoin" | "stack" | "chart" | "shield";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
};

export type Lesson = {
  /** Stable Plan B chapterId (locale-neutral progress key). */
  id: string;
  /** Localized, human-readable URL slug. */
  slug: string;
  title: string;
  summary: string;
  /** Estimated reading time in minutes. */
  minutes: number;
  /** Rendered HTML body (converted from Plan B markdown at sync time). */
  html: string;
  quiz: QuizQuestion[];
};

export type CourseModule = {
  /** Stable Plan B partId (locale-neutral progress key for the module/badge). */
  id: string;
  /** Localized, human-readable URL slug. */
  slug: string;
  title: string;
  subtitle: string;
  icon: ModuleIconKey;
  lessons: Lesson[];
};

/** A whole course as emitted by the sync script. */
export type GeneratedCourse = {
  courseId: string;
  name: string;
  goal: string;
  objectives: string[];
  /** Content license (CC BY-SA 4.0) — surface as attribution. */
  license: string;
  /** Upstream source URL (pinned commit). */
  source: string;
  contributors: string[];
  modules: CourseModule[];
};
