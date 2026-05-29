"use client";

import type { ReactNode } from "react";
import { Flame, Medal, GraduationCap, Trophy } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { getLevelProgress } from "@/features/education/data/education";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/card";
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

function Stat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-heading text-lg font-semibold leading-none tracking-tight text-foreground tabular-nums">
          {value}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function ProgressDashboard({ totalLessons }: { totalLessons: number }) {
  const { data, completedCount, hydrated, reset } = useProgress();

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
        <div className="flex items-center gap-5">
          <div className="relative grid place-items-center">
            <Ring percent={lp.percentToNext} />
            <span className="absolute font-heading text-xl font-semibold text-foreground tabular-nums">
              {lp.current.level}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-bitcoin">
              Nivå {lp.current.level}
            </p>
            <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {lp.current.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              {formatNumber(data.xp)} XP
              {lp.next ? (
                <>
                  {" "}
                  · {formatNumber(lp.xpToNext)} XP till {lp.next.name}
                </>
              ) : (
                <> · högsta nivån uppnådd</>
              )}
            </p>
          </div>
        </div>

        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          <Stat
            icon={<GraduationCap size={18} weight="bold" aria-hidden />}
            value={`${completedCount}/${totalLessons}`}
            label="Lektioner"
          />
          <Stat
            icon={<Flame size={18} weight="fill" aria-hidden />}
            value={`${data.streak}`}
            label={data.streak === 1 ? "dag i rad" : "dagar i rad"}
          />
          <Stat
            icon={<Medal size={18} weight="fill" aria-hidden />}
            value={`${data.badges.length}`}
            label="märken"
          />
        </div>
      </div>

      {/* XP progress to next level */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Mot nästa nivå</span>
          <span className="tabular-nums">{lp.percentToNext}%</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-bitcoin/70 to-bitcoin transition-[width] duration-700"
            style={{ width: `${lp.percentToNext}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Trophy size={14} weight="fill" aria-hidden className="text-bitcoin" />
          {percentComplete}% av hela kursen klar
        </p>
        {hydrated && completedCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Vill du nollställa dina poäng och din kursprogress? Detta går inte att ångra.",
                )
              ) {
                reset();
              }
            }}
            className="text-xs font-medium text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground"
          >
            Nollställ progress
          </button>
        ) : null}
      </div>
    </Card>
  );
}
