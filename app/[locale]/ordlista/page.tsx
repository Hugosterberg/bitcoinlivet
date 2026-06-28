import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { GlossaryExplorer } from "@/features/glossary/components/glossary-explorer";
import { sortedGlossary } from "@/features/glossary/data/glossary";
import { getSiteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "glossary" });
  const site = getSiteConfig(locale);
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/ordlista" },
    openGraph: {
      title: `${t("ogTitle")} · ${site.name}`,
      description: t("ogDesc"),
      url: "/ordlista",
      type: "website",
    },
  };
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("glossary");
  const site = getSiteConfig(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: t("schemaName"),
    url: `${site.url}/ordlista`,
    hasDefinedTerm: sortedGlossary.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
    })),
  };

  return (
    <div className="py-14 sm:py-20">
      <Container>
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

        <div className="mt-10">
          <GlossaryExplorer terms={sortedGlossary} />
        </div>

        <Card className="mt-14 flex flex-col gap-3 p-6 sm:p-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("ctaTitle")}
          </h2>
          <p className="max-w-2xl text-base/7 text-muted-foreground">
            {t("ctaText")}
          </p>
          <Link
            href="/utbildning"
            className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
          >
            {t("ctaLink")}
          </Link>
        </Card>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
