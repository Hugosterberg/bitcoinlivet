import Link from "next/link";
import {
  GraduationCap,
  Trophy,
  Flame,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { moduleCount, totalLessons, totalXp } from "@/features/education/data/courses";

const HIGHLIGHTS = [
  { icon: Trophy, label: "Samla XP & nivåer" },
  { icon: Flame, label: "Bygg din streak" },
  { icon: Sparkle, label: "Lås upp märken" },
];

export function LearnCta() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl border border-bitcoin/25 bg-graphite px-6 py-12 sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="absolute left-[-10%] top-[-30%] h-72 w-72 rounded-full bg-bitcoin/15 blur-[110px]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-bitcoin-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bitcoin">
              <GraduationCap size={16} weight="fill" aria-hidden />
              Bitcoinskolan
            </span>
            <h2 className="mt-5 text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Lär dig Bitcoin, steg för steg, helt gratis
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base/7 text-muted-foreground">
              En interaktiv kurs på svenska som tar dig från nybörjare till
              trygg. Korta lektioner, quiz och en lärväg som gör det enkelt att
              fortsätta, i din egen takt.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Icon size={18} weight="fill" aria-hidden className="text-bitcoin" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="xl" className="rounded-full">
                <Link href="/utbildning">Börja lära dig</Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="rounded-full">
                <Link href="/ordlista">Slå upp ett begrepp</Link>
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { value: moduleCount, label: "Moduler" },
              { value: totalLessons, label: "Lektioner" },
              { value: totalXp, label: "XP att samla" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-background/40 px-2 py-3 text-center sm:p-5"
              >
                <dd className="font-heading text-xl font-semibold tracking-tight text-bitcoin tabular-nums sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-balance text-[11px] leading-snug text-muted-foreground sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
