import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  X,
  Check,
} from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { buildSlugAlternates, localizedUrl } from "@/lib/seo";
import { getPathname } from "@/i18n/navigation";
import { FunctionIcon } from "@/features/functions/components/function-icon";
import {
  getFunctions,
  getFunction,
  getFunctionSlugs,
  getFunctionSlugsById,
} from "@/features/functions/data/functions";

export const dynamicParams = false;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return getFunctionSlugs(params.locale as Locale).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const fn = getFunction(locale, slug);
  if (!fn) return {};
  const site = getSiteConfig(locale);
  const href = { pathname: "/funktioner/[slug]" as const, params: { slug: fn.slug } };
  return {
    title: fn.title,
    description: fn.metaDescription,
    alternates: buildSlugAlternates(locale, "/funktioner/[slug]", getFunctionSlugsById(fn.id)),
    openGraph: {
      title: `${fn.title} · ${site.name}`,
      description: fn.metaDescription,
      url: localizedUrl(locale, href),
      type: "article",
    },
  };
}

export default async function FunctionPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("functions");
  const fn = getFunction(locale, slug);
  if (!fn) notFound();

  const all = getFunctions(locale);
  const index = all.findIndex((f) => f.slug === fn.slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  const backHref = getPathname({ locale, href: "/funktioner" });
  const fnHref = (s: string) =>
    getPathname({ locale, href: { pathname: "/funktioner/[slug]", params: { slug: s } } });

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} weight="bold" aria-hidden />
          {t("allFunctions")}
        </Link>

        {/* Hero */}
        <header className="mt-5 max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-bitcoin-muted text-bitcoin">
              <FunctionIcon icon={fn.icon} size={28} weight="bold" aria-hidden />
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
              {t("eyebrowSingle")}
            </p>
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {fn.title}
          </h1>
          <p className="mt-4 text-pretty text-lg/8 text-muted-foreground">
            {fn.tagline}
          </p>
          <div className="mt-5 space-y-4 text-base/7 text-muted-foreground">
            {fn.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </header>

        {/* Idag vs Bitcoin */}
        <section aria-label={t("compareLabel")} className="mt-10">
          <Card className="grid gap-px overflow-hidden bg-border sm:grid-cols-2">
            <div className="bg-card p-6 sm:p-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <X size={18} weight="bold" aria-hidden />
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  {t("todayTitle")}
                </h2>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {fn.compare.map((row) => (
                  <li key={row.today} className="text-sm/6 text-muted-foreground">
                    {row.today}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card p-6 sm:p-8">
              <div className="flex items-center gap-2 text-bitcoin">
                <Check size={18} weight="bold" aria-hidden />
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  {t("withBitcoinTitle")}
                </h2>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {fn.compare.map((row) => (
                  <li key={row.bitcoin} className="text-sm/6 text-foreground">
                    {row.bitcoin}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        {/* Deep sections */}
        <div className="mt-12 max-w-3xl space-y-10">
          {fn.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base/7 text-muted-foreground">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Takeaways */}
        <section aria-label={t("takeawaysLabel")} className="mt-12 max-w-3xl">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("takeawaysTitle")}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {fn.takeaways.map((point) => (
                <li key={point} className="flex gap-3 text-base/7 text-muted-foreground">
                  <CheckCircle
                    size={20}
                    weight="fill"
                    aria-hidden
                    className="mt-1 shrink-0 text-bitcoin"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Related links */}
        {fn.related.length > 0 ? (
          <section aria-label={t("readFurtherLabel")} className="mt-10 max-w-3xl">
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              {t("readFurtherTitle")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {fn.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
                >
                  {link.label}
                  <ArrowRight size={14} weight="bold" aria-hidden />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Prev / next */}
        <nav className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-6">
          {prev ? (
            <Link
              href={fnHref(prev.slug)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={15} weight="bold" aria-hidden />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={fnHref(next.slug)}
              className="inline-flex items-center gap-1.5 text-right text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {next.title}
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <Disclaimer className="mt-10 max-w-2xl">
          {t("disclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}
