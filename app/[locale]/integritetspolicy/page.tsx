import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { getSiteConfig } from "@/lib/site";
import { buildAlternates } from "@/lib/seo";
import { CookieSettingsButton } from "@/components/layout/cookie-settings-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: buildAlternates(locale, "/integritetspolicy"),
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base/7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const site = getSiteConfig(locale);

  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("lead", { name: site.name })}
          </p>
        </header>

        <Section title={t("collectTitle")}>
          <ul className="space-y-2">
            <li>
              <strong className="text-foreground">{t("collectAccountLabel")}</strong>{" "}
              {t("collectAccountText")}
            </li>
            <li>
              <strong className="text-foreground">{t("collectNewsletterLabel")}</strong>{" "}
              {t("collectNewsletterText")}
            </li>
            <li>
              <strong className="text-foreground">{t("collectAnalyticsLabel")}</strong>{" "}
              {t("collectAnalyticsText")}
            </li>
          </ul>
        </Section>

        <Section title={t("cookiesTitle")}>
          <p>
            <strong className="text-foreground">Google Analytics</strong>{" "}
            {t("cookiesP1Before")}{" "}
            <strong className="text-foreground">Microsoft Clarity</strong>{" "}
            {t("cookiesP1After")}{" "}
            <strong className="text-foreground">{t("cookiesP1Strong")}</strong>{" "}
            {t("cookiesP1End")}
          </p>
          <p>
            <CookieSettingsButton className="cursor-pointer font-medium text-bitcoin underline underline-offset-4 transition-colors hover:text-bitcoin/80" />
          </p>
        </Section>

        <Section title={t("legalTitle")}>
          <p>{t("legalText")}</p>
        </Section>

        <Section title={t("rightsTitle")}>
          <p>{t("rightsText")}</p>
        </Section>

        <Section title={t("contactTitle")}>
          <p>
            {t("contactBefore")}{" "}
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-bitcoin underline underline-offset-4 hover:text-bitcoin/80"
            >
              {site.instagramHandle}
            </a>{" "}
            {t("contactMiddle")}{" "}
            <Link
              href="/om"
              className="font-medium text-bitcoin underline underline-offset-4 hover:text-bitcoin/80"
            >
              {t("contactLink")}
            </Link>
            .
          </p>
        </Section>
      </Container>
    </div>
  );
}
