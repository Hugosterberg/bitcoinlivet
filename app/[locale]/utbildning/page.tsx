import type { Metadata } from "next";
import {
  GraduationCap,
  Lightning,
  Flame,
  Medal,
  ArrowSquareOut,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { ProgressDashboard } from "@/features/education/components/progress-dashboard";
import { SignInPrompt } from "@/features/auth/components/sign-in-prompt";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ModuleCard, type ModuleCardData } from "@/features/education/components/module-card";
import {
  getCourseModules,
  maxLessonXp,
  moduleCount,
  totalLessons,
  totalXp,
} from "@/features/education/data/courses";
import type { Locale } from "@/i18n/routing";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Utbildning: Bitcoinskolan",
  description:
    "Lär dig Bitcoin steg för steg i en interaktiv kurs på svenska. Samla XP, höj din nivå och håll din streak vid liv. Helt gratis.",
  alternates: { canonical: "/utbildning" },
  openGraph: {
    title: "Bitcoinskolan · bitcoinlivet",
    description:
      "Interaktiv Bitcoinutbildning på svenska med XP, nivåer och kunskapsfrågor.",
    url: "/utbildning",
    type: "website",
  },
};

function buildModuleCards(locale: Locale): ModuleCardData[] {
  return getCourseModules(locale).map((module, i) => ({
    index: i + 1,
    id: module.id,
    slug: module.slug,
    href: `/utbildning/${module.slug}`,
    title: module.title,
    subtitle: module.subtitle,
    icon: module.icon,
    lessonIds: module.lessons.map((l) => l.id),
    xp: module.lessons.reduce((sum, l) => sum + maxLessonXp(l), 0),
  }));
}

export default async function UtbildningPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("education");
  const moduleCards = buildModuleCards(locale);

  const howItWorks = [
    {
      icon: <Lightning size={20} weight="fill" aria-hidden />,
      title: t("collectXp"),
      text: t("collectXpText"),
    },
    {
      icon: <Flame size={20} weight="fill" aria-hidden />,
      title: t("keepStreak"),
      text: t("keepStreakText"),
    },
    {
      icon: <Medal size={20} weight="fill" aria-hidden />,
      title: t("earnBadges"),
      text: t("earnBadgesText"),
    },
  ];

  return (
    <div className="py-14 sm:py-20">
      <Container>
        {/* Hero */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <Badge variant="bitcoin" className="px-3 py-1">
              <GraduationCap size={14} weight="fill" aria-hidden />
              {t("schoolBadge")}
            </Badge>
            <Badge variant="outline">{t("free")}</Badge>
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("heroLead")}
          </p>
        </header>

        {/* Save-progress nudge (hidden once logged in) + progress dashboard.
            flex gap so a hidden prompt leaves no empty space. */}
        <div className="mt-10 flex flex-col gap-6">
          <SignInPrompt />
          <ProgressDashboard totalLessons={totalLessons} />
        </div>

        {/* How it works */}
        <section className="mt-12" aria-label="Så funkar det">
          <div className="grid gap-4 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <Card key={item.title} className="p-5">
                <span className="grid size-10 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
                  {item.icon}
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning path */}
        <section className="mt-14" aria-label="Kursmoduler">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {t("yourPath")}
            </h2>
            <p className="text-pretty text-sm text-muted-foreground tabular-nums">
              {t("pathStats", {
                modules: moduleCount,
                lessons: totalLessons,
                xp: formatNumber(totalXp),
              })}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {moduleCards.map((module) => (
              <ModuleCard key={module.slug} module={module} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
