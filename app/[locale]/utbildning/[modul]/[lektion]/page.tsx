import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { LessonView } from "@/features/education/components/lesson-view";
import {
  getAdjacentLessons,
  getCourseModules,
  getLesson,
  getLessonSlugsById,
} from "@/features/education/data/courses";
import { routing, type Locale } from "@/i18n/routing";
import { buildLessonAlternates, localizedUrl } from "@/lib/seo";

type Params = { locale: Locale; modul: string; lektion: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  // Return the full params (incl. locale) so only valid locale+slug combos
  // build — slugs are localized, so the valid set differs per locale.
  return routing.locales.flatMap((locale) =>
    getCourseModules(locale).flatMap((module) =>
      module.lessons.map((lesson) => ({
        locale,
        modul: module.slug,
        lektion: lesson.slug,
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, modul, lektion } = await params;
  const found = getLesson(locale, modul, lektion);
  if (!found) return {};
  const { module, lesson } = found;
  const t = await getTranslations({ locale, namespace: "education" });
  return {
    title: `${lesson.title}: ${module.title}`,
    description: lesson.summary,
    alternates: buildLessonAlternates(locale, getLessonSlugsById(module.id, lesson.id)),
    openGraph: {
      title: `${lesson.title} · ${t("schoolBadge")}`,
      description: lesson.summary,
      url: localizedUrl(locale, {
        pathname: "/utbildning/[modul]/[lektion]",
        params: { modul: module.slug, lektion: lesson.slug },
      }),
      type: "article",
    },
  };
}

function lessonHref(ref: { module: { slug: string }; lesson: { slug: string } } | null) {
  return ref ? `/utbildning/${ref.module.slug}/${ref.lesson.slug}` : null;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, modul, lektion } = await params;
  setRequestLocale(locale);
  const found = getLesson(locale, modul, lektion);
  if (!found) notFound();

  const { module, lesson } = found;
  const { prev, next } = getAdjacentLessons(locale, module.slug, lesson.slug);

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <LessonView
          moduleId={module.id}
          moduleTitle={module.title}
          moduleHref={`/utbildning/${module.slug}`}
          moduleLessonIds={module.lessons.map((l) => l.id)}
          lesson={lesson}
          prevHref={lessonHref(prev)}
          nextHref={lessonHref(next)}
        />
      </Container>
    </div>
  );
}
