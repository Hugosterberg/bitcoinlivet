import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CurrencyBtc,
  Lightning,
  Gauge,
  Timer,
  Newspaper,
  ArrowUpRight,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { buildAlternates } from "@/lib/seo";
import {
  getBitcoinMarket,
  getRecommendedFees,
  getFearGreed,
  getBlockHeight,
} from "@/features/bitcoin-data/data/live-data";
import { getBitcoinNews } from "@/features/bitcoin-data/data/news";
import { getHalvingInfo } from "@/features/bitcoin-data/data/metrics";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateShort,
  wrappable,
} from "@/lib/format";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const site = getSiteConfig(locale);
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: buildAlternates(locale, "/nyheter"),
    openGraph: {
      title: `${t("ogTitle")} · ${site.name}`,
      description: t("ogDesc"),
      url: "/nyheter",
      type: "website",
    },
  };
}

function SnapshotTile({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-bitcoin">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground tabular-nums [overflow-wrap:anywhere] sm:text-2xl">
        {wrappable(value)}
      </span>
      {sub ? (
        <span
          className={
            tone === "up"
              ? "text-xs font-medium text-emerald-400 tabular-nums [overflow-wrap:anywhere]"
              : tone === "down"
                ? "text-xs font-medium text-destructive tabular-nums [overflow-wrap:anywhere]"
                : "text-xs text-muted-foreground tabular-nums [overflow-wrap:anywhere]"
          }
        >
          {wrappable(sub)}
        </span>
      ) : null}
    </div>
  );
}

export default async function BitcoinTodayPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const [market, fees, fearGreed, height, news] = await Promise.all([
    getBitcoinMarket(),
    getRecommendedFees(),
    getFearGreed(),
    getBlockHeight(),
    getBitcoinNews(18),
  ]);

  const halving = height !== null ? getHalvingInfo(height) : null;
  const today = new Date();

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
              {t("eyebrow")}
            </p>
            <Badge variant="outline">{t("badge")}</Badge>
          </div>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("lead")}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("updated", { date: formatDate(today) })}
          </p>
        </header>

        {/* Snapshot */}
        <section aria-label={t("snapshotLabel")} className="mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SnapshotTile
              icon={<CurrencyBtc size={18} weight="bold" aria-hidden />}
              label={t("tilePrice")}
              value={formatCurrency(market.priceSek)}
              sub={t("priceChange", { percent: formatPercent(market.change24h) })}
              tone={market.change24h >= 0 ? "up" : "down"}
            />
            <SnapshotTile
              icon={<Lightning size={18} weight="fill" aria-hidden />}
              label={t("tileFee")}
              value={fees ? `${fees.fastestFee} sat/vB` : "–"}
              sub={fees ? t("feeForNext") : t("feeUnavailable")}
            />
            <SnapshotTile
              icon={<Gauge size={18} weight="fill" aria-hidden />}
              label={t("tileMood")}
              value={fearGreed ? `${fearGreed.value}/100` : "–"}
              sub={fearGreed ? fearGreed.label : t("moodUnavailable")}
            />
            <SnapshotTile
              icon={<Timer size={18} weight="bold" aria-hidden />}
              label={t("tileHalving")}
              value={halving ? t("halvingBlocks", { blocks: formatNumber(halving.blocksRemaining) }) : "–"}
              sub={halving ? `≈ ${formatDate(halving.estimatedDate)}` : t("halvingUnavailable")}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/data"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
            >
              {t("seeDashboard")}
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Headlines */}
        <section aria-label={t("headlinesLabel")} className="mt-12">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
              <Newspaper size={18} weight="fill" aria-hidden />
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {t("headlinesTitle")}
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("headlinesIntro")}
          </p>

          {news.items.length > 0 ? (
            <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {news.items.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-pretty font-medium text-foreground group-hover:text-bitcoin">
                        {item.title}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground/80">
                          {item.source}
                        </span>
                        <span aria-hidden>·</span>
                        <time dateTime={item.date.toISOString()} className="tabular-nums">
                          {formatDateShort(item.date)}
                        </time>
                      </p>
                    </div>
                    <ArrowUpRight
                      size={18}
                      weight="bold"
                      aria-hidden
                      className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-bitcoin"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
              <p className="font-heading text-lg font-semibold text-foreground">
                {t("noHeadlinesTitle")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("noHeadlinesText")}
              </p>
            </div>
          )}

          {news.sources.length > 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">
              {t("sources", { sources: news.sources.join(" · ") })}
            </p>
          ) : null}
        </section>

        <Disclaimer className="mt-12 max-w-2xl">
          {t("disclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}
