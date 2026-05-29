import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lightning } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { ModuleIcon } from "@/components/education/module-icon";
import { LessonList } from "@/components/education/lesson-list";
import { courseModules, getModule, maxLessonXp } from "@/lib/courses";
import { formatNumber } from "@/lib/format";

type Params = { modul: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return courseModules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { modul } = await params;
  const mod = getModule(modul);
  if (!mod) return {};
  return {
    title: `${mod.title}: Bitcoinskolan`,
    description: mod.subtitle,
    alternates: { canonical: `/utbildning/${mod.slug}` },
    openGraph: {
      title: `${mod.title} · Bitcoinskolan`,
      description: mod.subtitle,
      url: `/utbildning/${mod.slug}`,
      type: "website",
    },
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { modul } = await params;
  const mod = getModule(modul);
  if (!mod) notFound();

  const moduleXp = mod.lessons.reduce((sum, l) => sum + maxLessonXp(l), 0);
  const basePath = `/utbildning/${mod.slug}`;

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Link
            href="/utbildning"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} weight="bold" aria-hidden />
            Alla moduler
          </Link>

          <header className="mt-5 flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-bitcoin-muted text-bitcoin">
              <ModuleIcon icon={mod.icon} size={28} weight="bold" aria-hidden />
            </span>
            <div>
              <h1 className="text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {mod.title}
              </h1>
              <p className="mt-2 text-pretty text-base/7 text-muted-foreground">
                {mod.subtitle}
              </p>
            </div>
          </header>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground tabular-nums">
            <span>{mod.lessons.length} lektioner</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1 text-bitcoin">
              <Lightning size={14} weight="fill" aria-hidden />
              {formatNumber(moduleXp)} XP
            </span>
          </p>

          <section className="mt-8" aria-label="Lektioner">
            <LessonList
              moduleSlug={mod.slug}
              basePath={basePath}
              lessons={mod.lessons.map((l) => ({
                slug: l.slug,
                title: l.title,
                summary: l.summary,
                minutes: l.minutes,
              }))}
            />
          </section>
        </div>
      </Container>
    </div>
  );
}
