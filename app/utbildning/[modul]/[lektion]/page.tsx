import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { LessonView } from "@/components/education/lesson-view";
import { courseModules, getAdjacentLessons, getLesson } from "@/lib/courses";

type Params = { modul: string; lektion: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return courseModules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      modul: module.slug,
      lektion: lesson.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { modul, lektion } = await params;
  const found = getLesson(modul, lektion);
  if (!found) return {};
  const { module, lesson } = found;
  return {
    title: `${lesson.title}: ${module.title}`,
    description: lesson.summary,
    alternates: { canonical: `/utbildning/${module.slug}/${lesson.slug}` },
    openGraph: {
      title: `${lesson.title} · Bitcoinskolan`,
      description: lesson.summary,
      url: `/utbildning/${module.slug}/${lesson.slug}`,
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
  const { modul, lektion } = await params;
  const found = getLesson(modul, lektion);
  if (!found) notFound();

  const { module, lesson } = found;
  const { prev, next } = getAdjacentLessons(module.slug, lesson.slug);

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <LessonView
          moduleSlug={module.slug}
          moduleTitle={module.title}
          moduleHref={`/utbildning/${module.slug}`}
          moduleLessonSlugs={module.lessons.map((l) => l.slug)}
          lesson={lesson}
          prevHref={lessonHref(prev)}
          nextHref={lessonHref(next)}
        />
      </Container>
    </div>
  );
}
