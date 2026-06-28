import {
  BookOpen,
  ChartLineUp,
  ShieldCheck,
  Hourglass,
} from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export async function TrustIntro() {
  const t = await getTranslations("home");

  const values = [
    { icon: BookOpen, title: t("trustEducational"), description: t("trustEducationalText") },
    { icon: ChartLineUp, title: t("trustDataDriven"), description: t("trustDataDrivenText") },
    { icon: ShieldCheck, title: t("trustAntiHype"), description: t("trustAntiHypeText") },
    { icon: Hourglass, title: t("trustLongTerm"), description: t("trustLongTermText") },
  ];

  return (
    <Section>
      <SectionHeading
        eyebrow={t("trustEyebrow")}
        title={t("trustTitle")}
        description={t("trustDescription")}
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
