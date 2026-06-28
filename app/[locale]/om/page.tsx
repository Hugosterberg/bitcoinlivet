import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Compass,
  GraduationCap,
  ShieldCheck,
  InstagramLogo,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/om" },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDesc"),
      url: "/om",
      type: "website",
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const site = getSiteConfig(locale);

  const focusAreas = [
    {
      icon: GraduationCap,
      title: t("focusEducationTitle"),
      description: t("focusEducationText"),
    },
    {
      icon: Compass,
      title: t("focusLongTermTitle"),
      description: t("focusLongTermText"),
    },
    {
      icon: ShieldCheck,
      title: t("focusNoHypeTitle"),
      description: t("focusNoHypeText"),
    },
  ];

  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        {/* Intro */}
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("lead")}
          </p>
        </header>

        {/* Mission */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t("missionTitle")}
          </h2>
          <div className="mt-5 space-y-5 text-base/7 text-muted-foreground">
            <p>{t("missionP1")}</p>
            <p>{t("missionP2")}</p>
          </div>
        </section>

        {/* Educational focus */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t("focusTitle")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {focusAreas.map((area) => (
              <Card key={area.title} className="p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-bitcoin-muted text-bitcoin">
                  <area.icon size={22} weight="bold" aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm/6 text-muted-foreground">
                  {area.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Bitcoin matters */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t("whyTitle")}
          </h2>
          <div className="mt-5 space-y-5 text-base/7 text-muted-foreground">
            <p>{t("whyP1")}</p>
            <p>{t("whyP2")}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-10 rounded-full px-5 text-sm">
              <Link href="/artiklar">
                {t("readGuides")}
                <ArrowRight weight="bold" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 rounded-full px-5 text-sm">
              <Link href="/data">{t("seeData")}</Link>
            </Button>
          </div>
        </section>

        {/* Creator story */}
        <section className="mt-16">
          <Card className="overflow-hidden">
            <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:p-8">
              <div
                aria-hidden
                className="grid size-20 place-items-center rounded-2xl bg-bitcoin font-heading text-3xl font-bold text-bitcoin-foreground"
              >
                ₿
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                  {t("storyTitle")}
                </h2>
                <div className="mt-3 max-w-2xl space-y-4 text-sm/6 text-muted-foreground">
                  <p>{t("storyP1")}</p>
                  <p>{t("storyP2")}</p>
                  <p>{t("storyP3")}</p>
                  <p>{t("storyP4")}</p>
                  <p>{t("storyP5")}</p>
                </div>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
                >
                  <InstagramLogo size={18} weight="fill" aria-hidden />
                  {t("follow", { handle: site.instagramHandle })}
                </a>
              </div>
            </div>
          </Card>
        </section>

        <Disclaimer className="mt-12">
          {t("disclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}
