"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Info,
  Lightbulb,
  Lightning,
  Medal,
  Sparkle,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { XP_PER_CORRECT } from "@/features/education/data/education";
import type { Lesson, LessonBlock } from "@/features/education/data/courses";
import { maxLessonXp } from "@/features/education/data/courses";
import { Quiz, type QuizResult } from "@/features/education/components/quiz";
import { linkifyGlossary } from "@/features/glossary/components/glossary-linkify";
import {
  useProgress,
  type CompleteResult,
} from "@/features/education/components/progress-provider";

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-8 font-heading text-xl font-semibold tracking-tight text-foreground">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-base/8 text-muted-foreground">
          {linkifyGlossary(block.text)}
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-base/7 text-muted-foreground">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-bitcoin" aria-hidden />
              <span>{linkifyGlossary(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "callout": {
      const config = {
        info: { Icon: Info, className: "border-bitcoin/25 bg-bitcoin-muted text-bitcoin" },
        tip: { Icon: Lightbulb, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
        warning: { Icon: Warning, className: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
      }[block.tone];
      const { Icon } = config;
      return (
        <div className={cn("flex gap-3 rounded-xl border p-4", config.className)}>
          <Icon size={20} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
          <p className="text-sm/6 text-foreground">{linkifyGlossary(block.text)}</p>
        </div>
      );
    }
  }
}

export function LessonView({
  moduleSlug,
  moduleTitle,
  moduleHref,
  moduleLessonSlugs,
  lesson,
  prevHref,
  nextHref,
}: {
  moduleSlug: string;
  moduleTitle: string;
  moduleHref: string;
  moduleLessonSlugs: string[];
  lesson: Lesson;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const { isLessonComplete, completeLesson, hydrated } = useProgress();
  const alreadyComplete = hydrated && isLessonComplete(moduleSlug, lesson.slug);

  const [quizResult, setQuizResult] = useState<QuizResult>({
    answered: 0,
    total: lesson.quiz.length,
    correct: 0,
  });
  const [reward, setReward] = useState<CompleteResult | null>(null);

  const allAnswered = quizResult.answered === lesson.quiz.length;
  const maxXp = useMemo(() => maxLessonXp(lesson), [lesson]);

  function handleComplete() {
    const res = completeLesson({
      moduleSlug,
      lessonSlug: lesson.slug,
      correct: quizResult.correct,
      total: lesson.quiz.length,
      moduleLessonSlugs,
    });
    setReward(res);
  }

  const showReward = reward && !reward.alreadyDone;

  return (
    <article className="mx-auto max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Brödsmulor">
        <Link href="/utbildning" className="hover:text-foreground">
          Utbildning
        </Link>
        <span aria-hidden>/</span>
        <Link href={moduleHref} className="hover:text-foreground">
          {moduleTitle}
        </Link>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-bitcoin-muted px-2 py-0.5 font-medium text-bitcoin">
            <Lightning size={12} weight="fill" aria-hidden />
            {maxXp} XP
          </span>
          <span className="text-muted-foreground">{lesson.minutes} min läsning</span>
          {alreadyComplete ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
              <CheckCircle size={12} weight="fill" aria-hidden />
              Klarad
            </span>
          ) : null}
        </div>
        <h1 className="mt-3 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-pretty text-lg/8 text-muted-foreground">{lesson.summary}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4">
        {lesson.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      {/* Quiz */}
      {lesson.quiz.length > 0 ? (
        <section className="mt-12" aria-label="Kunskapsfrågor">
          <div className="flex items-center gap-2">
            <Sparkle size={18} weight="fill" className="text-bitcoin" aria-hidden />
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Testa dig själv
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Svara på frågorna för att låsa upp XP. Varje rätt svar ger {XP_PER_CORRECT} XP
            extra.
          </p>
          <div className="mt-5">
            <Quiz questions={lesson.quiz} onResult={setQuizResult} />
          </div>
        </section>
      ) : null}

      {/* Completion / reward */}
      <section className="mt-10">
        {showReward ? (
          <div className="animate-in fade-in zoom-in-95 rounded-2xl border border-bitcoin/40 bg-bitcoin-muted p-6 text-center duration-500">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-bitcoin text-bitcoin-foreground">
              <CheckCircle size={30} weight="fill" aria-hidden />
            </span>
            <p className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground">
              Bra jobbat!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Du fick{" "}
              <span className="font-semibold text-bitcoin">+{reward!.earnedXp} XP</span> för den här
              lektionen.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {reward!.leveledUp ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bitcoin/40 bg-background/40 px-3 py-1 text-sm font-medium text-bitcoin">
                  <TrendUp size={15} weight="bold" aria-hidden />
                  Ny nivå upplåst!
                </span>
              ) : null}
              {reward!.badgeEarned ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bitcoin/40 bg-background/40 px-3 py-1 text-sm font-medium text-bitcoin">
                  <Medal size={15} weight="fill" aria-hidden />
                  Modulmärke intjänat!
                </span>
              ) : null}
            </div>

            {nextHref ? (
              <Link
                href={nextHref}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-bitcoin px-5 py-2.5 text-sm font-semibold text-bitcoin-foreground transition-opacity hover:opacity-90"
              >
                Nästa lektion
                <ArrowRight size={16} weight="bold" aria-hidden />
              </Link>
            ) : (
              <Link
                href="/utbildning"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-bitcoin px-5 py-2.5 text-sm font-semibold text-bitcoin-foreground transition-opacity hover:opacity-90"
              >
                Tillbaka till översikten
                <ArrowRight size={16} weight="bold" aria-hidden />
              </Link>
            )}
          </div>
        ) : alreadyComplete ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <CheckCircle size={28} weight="fill" className="text-emerald-400" aria-hidden />
            <p className="text-sm text-foreground">
              Du har redan klarat den här lektionen. Repetera gärna, eller gå vidare.
            </p>
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-bitcoin hover:underline"
              >
                Nästa lektion
                <ArrowRight size={15} weight="bold" aria-hidden />
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {lesson.quiz.length > 0 && !allAnswered
                ? `Svara på alla frågor (${quizResult.answered}/${lesson.quiz.length}) för att slutföra lektionen.`
                : "Klart? Slutför lektionen och samla din XP."}
            </p>
            <button
              type="button"
              onClick={handleComplete}
              disabled={lesson.quiz.length > 0 && !allAnswered}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-bitcoin px-6 py-3 text-sm font-semibold text-bitcoin-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle size={18} weight="fill" aria-hidden />
              Slutför lektion
            </button>
          </div>
        )}
      </section>

      {/* Prev / next navigation */}
      <nav className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} weight="bold" aria-hidden />
            Föregående
          </Link>
        ) : (
          <span />
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Nästa
            <ArrowRight size={15} weight="bold" aria-hidden />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
