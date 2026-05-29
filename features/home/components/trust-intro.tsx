import {
  BookOpen,
  ChartLineUp,
  ShieldCheck,
  Hourglass,
} from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

const values = [
  {
    icon: BookOpen,
    title: "Utbildande",
    description:
      "Här förklarar jag Bitcoin enkelt utan att förenkla för mycket. Du bygger en verklig förståelse, steg för steg.",
  },
  {
    icon: ChartLineUp,
    title: "Datadriven",
    description:
      "Tydliga grafer och siffror istället för känslor och rubriker. Se utvecklingen i ett längre perspektiv.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-hype",
    description:
      "Inga prisprognoser, inga heta tips. Jag fokuserar på principer som håller över tid.",
  },
  {
    icon: Hourglass,
    title: "Långsiktigt",
    description:
      "Jag tänker i år och decennier, inte i veckor. Sparande handlar om tålamod och sunda vanor.",
  },
];

export function TrustIntro() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Varför bitcoinlivet"
        title="En lugn ingång till en högljudd värld"
        description="Bitcoin omges av brus, spekulation och starka åsikter. Här gör jag tvärtom: saklig och begriplig kunskap som hjälper dig att tänka själv."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <Card key={value.title} className="p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-bitcoin-muted text-bitcoin">
              <value.icon size={22} weight="bold" aria-hidden />
            </span>
            <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground">
              {value.title}
            </h3>
            <p className="mt-2 text-sm/6 text-muted-foreground">
              {value.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
