"use client";

import { useLocale, useTranslations } from "next-intl";
import { Flame, Medal, GraduationCap, Trophy } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { getLevelProgress } from "@/features/education/data/education";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { IconStat } from "@/components/ui/icon-stat";
import { useProgress } from "@/features/education/components/progress-provider";

function Ring({ percent }: { percent: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, percent) / 100) * c;
  return (
    <svg viewBox="0 0 80 80" className="size-20 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" className="stroke-muted" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        className="stroke-bitcoin transition-[stroke-dashoffset] duration-700"
        style={{ strokeDasharray: c, strokeDashoffset: offset }}
      />
    </svg>
  );
}

export function ProgressDashboard({ totalLessons }: { totalLessons: number }) {
  const { data, completedCount, hydrated, reset } = useProgress();
  const t = useTranslations("education");
  const locale = useLocale();

  const lp = getLevelProgress(data.xp);
  const percentComplete = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  return (
    <Card
      className={cn(
        "overflow-hidden p-6 transition-opacity sm:p-7",
        hydrated ? "opacity-100" : "opacity-60",
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="relative grid shrink-0 place-items-center">
            <Ring percent={lp.percentToNext} />
            <span className="absolute font-heading text-xl font-semibold text-foreground tabular-nums">
              {lp.current.level}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-bitcoin">
              {t("level")} {lp.current.level}
            </p>
            <p className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {t(`levels.${lp.current.level}`)}
            </p>
            <p className="mt-1 text-pretty text-sm text-muted-foreground tabular-nums [overflow-wrap:anywhere]">
              {formatNumber(data.xp, {}, locale)} XP
              {lp.next ? (
                <>
                  {" "}
                  ·{" "}
                  {t("xpToNext", {
                    xp: formatNumber(lp.xpToNext, {}, locale),
                    name: t(`levels.${lp.next.level}`),
                  })}
                </>
              ) : (
                <> · {t("maxLevel")}</>
              )}
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
          <IconStat
            icon={<GraduationCap size={18} weight="bold" aria-hidden />}
            value={`${completedCount}/${totalLessons}`}
            label={t("lessonsLabel")}
          />
          <IconStat
            icon={<Flame size={18} weight="fill" aria-hidden />}
            value={`${data.streak}`}
            label={data.streak === 1 ? t("dayStreakOne") : t("dayStreakMany")}
          />
          <IconStat
            icon={<Medal size={18} weight="fill" aria-hidden />}
            value={`${data.badges.length}`}
            label={t("badgesLabel")}
          />
        </div>
      </div>

      {/* XP progress to next level */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("towardsNextLevel")}</span>
          <span className="tabular-nums">{lp.percentToNext}%</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-bitcoin/70 to-bitcoin transition-[width] duration-700"
            style={{ width: `${lp.percentToNext}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="flex items-center gap-1.5 text-pretty text-xs text-muted-foreground">
          <Trophy size={14} weight="fill" aria-hidden className="shrink-0 text-bitcoin" />
          {t("percentDone", { percent: percentComplete })}
        </p>
        {hydrated && completedCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t("resetConfirm"))) {
                reset();
              }
            }}
            className="text-xs font-medium text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
          >
            {t("resetProgress")}
          </button>
        ) : null}
      </div>
    </Card>
  );
}
