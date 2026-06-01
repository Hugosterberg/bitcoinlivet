import {
  Flame,
  Medal,
  GraduationCap,
  Lightning,
  Trophy,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { IconStat } from "@/components/ui/icon-stat";
import { formatNumber } from "@/lib/format";
import { getLevelProgress, lessonKey } from "@/features/education/data/education";
import { courseModules, totalLessons } from "@/features/education/data/courses";
import type { ProgressData } from "@/features/education/data/progress";

/** Formats a YYYY-MM-DD day key as a long Swedish date. */
function formatDay(day: string | null): string {
  if (!day) return "Ingen aktivitet än";
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(date);
}

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
        className="stroke-bitcoin"
        style={{ strokeDasharray: c, strokeDashoffset: offset }}
      />
    </svg>
  );
}

/**
 * Server-rendered statistics for a signed-in user, built from their account
 * progression (`ProgressData` from Supabase). Reuses the same XP/level/streak
 * helpers as the client dashboard so the numbers always agree.
 */
export function AccountStats({ data }: { data: ProgressData }) {
  const lp = getLevelProgress(data.xp);
  const completedCount = Object.keys(data.lessons).length;
  const percentComplete = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  const modules = courseModules.map((m) => {
    const done = m.lessons.filter(
      (l) => data.lessons[lessonKey(m.slug, l.slug)],
    ).length;
    return {
      slug: m.slug,
      title: m.title,
      done,
      total: m.lessons.length,
      badge: data.badges.includes(m.slug),
      pct: m.lessons.length ? Math.round((done / m.lessons.length) * 100) : 0,
    };
  });

  const started = completedCount > 0;

  return (
    <section aria-label="Din statistik" className="mt-6">
      <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
        Din statistik
      </h2>

      <div className="mt-4 grid gap-4">
        {/* Level + XP */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="relative grid shrink-0 place-items-center">
              <Ring percent={lp.percentToNext} />
              <span className="absolute font-heading text-xl font-semibold text-foreground tabular-nums">
                {lp.current.level}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-bitcoin">
                Nivå {lp.current.level}
              </p>
              <p className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {lp.current.name}
              </p>
              <p className="mt-1 text-pretty text-sm text-muted-foreground tabular-nums [overflow-wrap:anywhere]">
                {formatNumber(data.xp)} XP
                {lp.next ? (
                  <> · {formatNumber(lp.xpToNext)} XP till {lp.next.name}</>
                ) : (
                  <> · högsta nivån uppnådd</>
                )}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Mot nästa nivå</span>
              <span className="tabular-nums">{lp.percentToNext}%</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-bitcoin/70 to-bitcoin"
                style={{ width: `${lp.percentToNext}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <IconStat
            icon={<GraduationCap size={18} weight="bold" aria-hidden />}
            value={`${completedCount}/${totalLessons}`}
            label="Lektioner"
          />
          <IconStat
            icon={<Flame size={18} weight="fill" aria-hidden />}
            value={`${data.streak}`}
            label={data.streak === 1 ? "dag i rad" : "dagar i rad"}
          />
          <IconStat
            icon={<Medal size={18} weight="fill" aria-hidden />}
            value={`${data.badges.length}`}
            label="märken"
          />
          <IconStat
            icon={<Lightning size={18} weight="fill" aria-hidden />}
            value={formatNumber(data.xp)}
            label="XP totalt"
          />
        </div>

        {/* Per-course progress */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
              Genomförda kurser
            </h3>
            <span className="flex items-center gap-1.5 text-pretty text-xs text-muted-foreground">
              <Trophy size={14} weight="fill" aria-hidden className="shrink-0 text-bitcoin" />
              {percentComplete}% av hela kursen
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-4">
            {modules.map((m) => (
              <li key={m.slug}>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 font-medium text-foreground">
                    {m.badge ? (
                      <Medal size={15} weight="fill" aria-hidden className="shrink-0 text-bitcoin" />
                    ) : m.done === m.total ? (
                      <CheckCircle size={15} weight="fill" aria-hidden className="shrink-0 text-emerald-400" />
                    ) : null}
                    <span className="min-w-0 text-pretty">{m.title}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {m.done}/{m.total}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      m.pct === 100 ? "bg-bitcoin" : "bg-bitcoin/60",
                    )}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
            <Clock size={14} weight="bold" aria-hidden className="text-bitcoin" />
            Senaste aktivitet: <span className="text-foreground">{formatDay(data.lastActive)}</span>
          </p>

          {!started ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Du har inte börjat än. Gör din första lektion så fylls statistiken i
              här.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
