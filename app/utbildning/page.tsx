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
import { ModuleCard, type ModuleCardData } from "@/features/education/components/module-card";
import { courseModules, maxLessonXp, totalLessons, totalXp } from "@/features/education/data/courses";
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

const moduleCards: ModuleCardData[] = courseModules.map((module, i) => ({
  index: i + 1,
  slug: module.slug,
  href: `/utbildning/${module.slug}`,
  title: module.title,
  subtitle: module.subtitle,
  icon: module.icon,
  lessonSlugs: module.lessons.map((l) => l.slug),
  xp: module.lessons.reduce((sum, l) => sum + maxLessonXp(l), 0),
}));

const howItWorks = [
  {
    icon: <Lightning size={20} weight="fill" aria-hidden />,
    title: "Samla XP",
    text: "Varje slutförd lektion och rätt svar ger poäng som bygger din nivå.",
  },
  {
    icon: <Flame size={20} weight="fill" aria-hidden />,
    title: "Håll din streak",
    text: "Lär dig lite varje dag så växer din streak, små steg blir stor kunskap.",
  },
  {
    icon: <Medal size={20} weight="fill" aria-hidden />,
    title: "Tjäna märken",
    text: "Klara alla lektioner i en modul och lås upp ett märke för bemästrandet.",
  },
];

export default function UtbildningPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container>
        {/* Hero */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <Badge variant="bitcoin" className="px-3 py-1">
              <GraduationCap size={14} weight="fill" aria-hidden />
              Bitcoinskolan
            </Badge>
            <Badge variant="outline">Gratis</Badge>
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Lär dig Bitcoin, steg för steg
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            En lugn, interaktiv kurs på svenska. Läs korta lektioner, svara på
            kunskapsfrågor och samla XP medan du bygger en riktig förståelse för
            pengar, knapphet och köpkraft. Din progress sparas automatiskt i din
            webbläsare.
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
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Din lärväg
            </h2>
            <p className="text-sm text-muted-foreground tabular-nums">
              {courseModules.length} moduler · {totalLessons} lektioner ·{" "}
              {formatNumber(totalXp)} XP
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
