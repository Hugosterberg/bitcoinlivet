"use client";

import Link from "next/link";
import { CheckCircle, Circle, Clock } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useProgress } from "@/components/education/progress-provider";

export type LessonListItem = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
};

export function LessonList({
  moduleSlug,
  basePath,
  lessons,
}: {
  moduleSlug: string;
  basePath: string;
  lessons: LessonListItem[];
}) {
  const { isLessonComplete, hydrated } = useProgress();

  return (
    <ol className="flex flex-col gap-3">
      {lessons.map((lesson, i) => {
        const done = hydrated && isLessonComplete(moduleSlug, lesson.slug);
        return (
          <li key={lesson.slug}>
            <Link
              href={`${basePath}/${lesson.slug}`}
              className={cn(
                "group flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm transition-colors sm:p-5",
                done ? "border-bitcoin/30" : "border-border hover:border-bitcoin/40",
              )}
            >
              <span className="mt-0.5 shrink-0">
                {done ? (
                  <CheckCircle size={24} weight="fill" className="text-bitcoin" aria-hidden />
                ) : (
                  <Circle
                    size={24}
                    weight="bold"
                    className="text-muted-foreground/50 group-hover:text-bitcoin"
                    aria-hidden
                  />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
                    Lektion {i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} weight="bold" aria-hidden />
                    {lesson.minutes} min
                  </span>
                </div>
                <h3 className="mt-0.5 font-heading text-base font-semibold tracking-tight text-foreground">
                  {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{lesson.summary}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
