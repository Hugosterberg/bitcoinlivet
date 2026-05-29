"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Lightning } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { ModuleIconKey } from "@/features/education/data/courses";
import { ModuleIcon } from "@/features/education/components/module-icon";
import { useProgress } from "@/features/education/components/progress-provider";

export type ModuleCardData = {
  index: number;
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  icon: ModuleIconKey;
  lessonSlugs: string[];
  xp: number;
};

export function ModuleCard({ module }: { module: ModuleCardData }) {
  const { isLessonComplete, hydrated } = useProgress();

  const total = module.lessonSlugs.length;
  const done = hydrated
    ? module.lessonSlugs.filter((slug) => isLessonComplete(module.slug, slug)).length
    : 0;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const complete = done === total && total > 0;

  return (
    <Link
      href={module.href}
      className={cn(
        "group relative flex gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-colors sm:p-6",
        complete
          ? "border-bitcoin/40"
          : "border-border hover:border-bitcoin/40",
      )}
    >
      <div className="relative shrink-0">
        <span
          className={cn(
            "grid size-12 place-items-center rounded-xl transition-colors",
            complete
              ? "bg-bitcoin text-bitcoin-foreground"
              : "bg-bitcoin-muted text-bitcoin",
          )}
        >
          <ModuleIcon icon={module.icon} size={24} weight="bold" aria-hidden />
        </span>
        <span className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground tabular-nums">
          {module.index}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {module.title}
          </h3>
          {complete ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bitcoin-muted px-2 py-0.5 text-xs font-medium text-bitcoin">
              <CheckCircle size={13} weight="fill" aria-hidden />
              Klar
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{module.subtitle}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-bitcoin transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {done}/{total}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Lightning size={13} weight="fill" aria-hidden className="text-bitcoin" />
            {module.xp} XP
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-bitcoin">
            {done > 0 && !complete ? "Fortsätt" : complete ? "Repetera" : "Börja"}
            <ArrowRight
              size={15}
              weight="bold"
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
