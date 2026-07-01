import {
  Flame,
  Medal,
  GraduationCap,
  Lightning,
  Trophy,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";
import { IconStat } from "@/components/ui/icon-stat";
import { formatNumber } from "@/lib/format";
import { getLevelProgress, lessonKey } from "@/features/education/data/education";
import { getCourseModules, totalLessons } from "@/features/education/data/courses";
import type { ProgressData } from "@/features/education/data/progress";
import type { Locale } from "@/i18n/routing";

/** Formats a YYYY-MM-DD day key as a long, locale-aware date. */
function formatDay(day: string | null, locale: Locale, fallback: string): string {
  if (!day) return fallback;
  const date = new Date(`${day}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  const intlLocale = locale === "sv" ? "sv-SE" : "en-US";
  return new Intl.DateTimeFormat(intlLocale, { dateStyle: "long" }).format(date);
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
export async function AccountStats({
  data,
  locale,
}: {
  data: ProgressData;
  locale: Locale;
}) {
  const t = await getTranslations("education");
  const lp = getLevelProgress(data.xp);
  const completedCount = Object.keys(data.lessons).length;
  const percentComplete = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  const modules = getCourseModules(locale).map((m) => {
    const done = m.lessons.filter(
      (l) => data.lessons[lessonKey(m.id, l.id)],
    ).length;
    return {
      slug: m.slug,
      title: m.title,
      done,
      total: m.lessons.length,
      badge: data.badges.includes(m.id),
      pct: m.lessons.length ? Math.round((done / m.lessons.length) * 100) : 0,
    };
  });

  const started = completedCount > 0;

  return (
    <section aria-label={t("yourStats")} className="mt-6">
      <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
        {t("yourStats")}
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

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("towardsNextLevel")}</span>
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
          <IconStat
            icon={<Lightning size={18} weight="fill" aria-hidden />}
            value={formatNumber(data.xp, {}, locale)}
            label={t("xpTotal")}
          />
        </div>

        {/* Per-course progress */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">{t("completedCourses")}</h3>
            <span className="flex items-center gap-1.5 text-pretty text-xs text-muted-foreground">
              <Trophy size={14} weight="fill" aria-hidden className="shrink-0 text-bitcoin" />
              {t("percentOfCourse", { percent: percentComplete })}
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
            {t("lastActivity")} <span className="text-foreground">{formatDay(data.lastActive, locale, t("noActivity"))}</span>
          </p>

          {!started ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {t("notStarted")}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
