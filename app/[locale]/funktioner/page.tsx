import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { FunctionIcon } from "@/features/functions/components/function-icon";
import { functionMenu } from "@/features/functions/data/functions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "functions" });
  const site = getSiteConfig(locale);
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/funktioner" },
    openGraph: {
      title: `${t("ogTitle")} · ${site.name}`,
      description: t("ogDesc"),
      url: "/funktioner",
      type: "website",
    },
  };
}

export default async function FunctionsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("functions");

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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {functionMenu.map((fn) => (
            <Link key={fn.title} href={fn.href} className="group">
              <Card className="flex h-full flex-col p-6 transition-colors group-hover:border-bitcoin/40">
                <span className="grid size-11 place-items-center rounded-xl bg-bitcoin-muted text-bitcoin transition-colors group-hover:bg-bitcoin group-hover:text-bitcoin-foreground">
                  <FunctionIcon icon={fn.icon} size={22} weight="bold" aria-hidden />
                </span>
                <h2 className="mt-5 font-heading text-lg font-semibold tracking-tight text-foreground">
                  {fn.title}
                </h2>
                <p className="mt-2 flex-1 text-sm/6 text-muted-foreground">
                  {fn.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin">
                  {t("readMore")}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <Disclaimer className="mt-12 max-w-2xl">
          {t("listDisclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}
