import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CurrencyBtc,
  Coins,
  Stack,
  ChartLineUp,
  Wallet,
  TrendUp,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { MetricCard } from "@/features/bitcoin-data/components/metric-card";
import { SatsCalculator } from "@/features/bitcoin-data/components/sats-calculator";
import { SavingsCalculator } from "@/features/bitcoin-data/components/savings-calculator";
import { FeesWidget } from "@/features/bitcoin-data/components/fees-widget";
import { FearGreedWidget } from "@/features/bitcoin-data/components/fear-greed";
import { StatTile } from "@/features/bitcoin-data/components/stat-tile";
import { BtcPriceChart } from "@/features/bitcoin-data/components/charts/btc-price-chart";
import { InflationChart } from "@/features/bitcoin-data/components/charts/inflation-chart";
import { InvestmentChart } from "@/features/bitcoin-data/components/charts/investment-chart";
import { AssetAllocationChart } from "@/features/bitcoin-data/components/charts/asset-allocation-chart";
import { STOCKS_COLOR } from "@/features/bitcoin-data/data/assets";
import { btcSnapshot, getSupplyTimeline } from "@/features/bitcoin-data/data/metrics";
import {
  getAssetAllocation,
  getBitcoinMarket,
  getBtcPriceHistory,
  getFearGreed,
  getInflation,
  getInvestmentHistory,
  getRecommendedFees,
} from "@/features/bitcoin-data/data/live-data";
import {
  formatAmountWords,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatShare,
} from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "data" });
  const site = getSiteConfig(locale);
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/data" },
    openGraph: {
      title: `${t("ogTitle")} · ${site.name}`,
      description: t("ogDesc"),
      url: "/data",
      type: "website",
    },
  };
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col p-6">
      <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </Card>
  );
}

function SupplyBar({
  label,
  percent,
  muted,
}: {
  label: string;
  percent: number;
  muted?: boolean;
}) {
  const width = Math.min(100, Math.max(0, percent));
  return (
    <div>
      <div className="mb-1.5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3 text-sm">
        <span className="text-pretty text-muted-foreground">{label}</span>
        <span className="shrink-0 font-medium text-foreground tabular-nums">
          {width.toLocaleString("sv-SE", { maximumFractionDigits: 1 })} %
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={
            muted
              ? "h-full rounded-full bg-muted-foreground/50"
              : "h-full rounded-full bg-bitcoin"
          }
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default async function DataPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("data");
  const tCharts = await getTranslations("charts");

  const [market, fees, investment, fearGreed, inflation, allocation, priceHist] =
    await Promise.all([
      getBitcoinMarket(),
      getRecommendedFees(),
      getInvestmentHistory(),
      getFearGreed(),
      getInflation(),
      getAssetAllocation(),
      getBtcPriceHistory(),
    ]);

  const supply = getSupplyTimeline(
    market.circulatingSupply,
    market.maxSupply,
  );
  const fmtYears = (v: number, decimals = 1) =>
    v.toLocaleString("sv-SE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const btcSlice = allocation.slices.find((s) => s.isBitcoin);
  // The companies that make up the "Aktier" total, grouped for the legend.
  const stockSlices = allocation.slices.filter((s) => s.group === "stocks");
  const stocksValue = stockSlices.reduce((sum, s) => sum + s.valueUsd, 0);
  const stocksPercent = stockSlices.reduce((sum, s) => sum + s.percent, 0);
  // Top-level legend rows in pie order; the stocks block collapses to one entry.
  type LegendRow =
    | { kind: "asset"; slice: (typeof allocation.slices)[number] }
    | { kind: "stocks" };
  const legendRows: LegendRow[] = [];
  let stocksInserted = false;
  for (const slice of allocation.slices) {
    if (slice.group === "stocks") {
      if (!stocksInserted) {
        legendRows.push({ kind: "stocks" });
        stocksInserted = true;
      }
    } else {
      legendRows.push({ kind: "asset", slice });
    }
  }
  const fmtPercent = (v: number) =>
    `${v.toLocaleString("sv-SE", { maximumFractionDigits: v < 1 ? 2 : 1 })} %`;
  const fmtTrillions = (usd: number) =>
    tCharts("trillionsUsd", {
      value: (usd / 1_000_000_000_000).toLocaleString("sv-SE", {
        maximumFractionDigits: 1,
      }),
    });

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
              {t("eyebrow")}
            </p>
            {market.live ? (
              <Badge variant="bitcoin">{t("liveBadge")}</Badge>
            ) : (
              <Badge variant="outline">{t("exampleBadge")}</Badge>
            )}
          </div>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("leadBase")}
            {market.live ? t("leadLive") : t("leadStatic")}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {market.live
              ? t("sourceLive")
              : t("sourceStatic", { date: formatDate(btcSnapshot.asOf) })}
          </p>
        </header>

        {/* Key metrics */}
        <section aria-label={t("metricsLabel")} className="mt-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label={t("metricPrice")}
              value={formatCurrency(market.priceSek)}
              sub={t("perBitcoin")}
              change={market.change24h}
              icon={<CurrencyBtc size={20} weight="bold" aria-hidden />}
            />
            <MetricCard
              label={t("metricMarketCap")}
              value={formatCurrency(market.marketCapSek)}
              valueClassName="text-lg sm:text-xl leading-snug"
              sub={
                <>
                  ≈ {formatAmountWords(market.marketCapSek)}
                  <span className="block text-muted-foreground/70">
                    {t("globalTotal")}
                  </span>
                </>
              }
              icon={<Coins size={20} weight="bold" aria-hidden />}
            />
            <MetricCard
              label={t("metricCirculating")}
              value={`${formatNumber(Math.round(market.circulatingSupply))}`}
              valueClassName="text-lg sm:text-xl leading-snug"
              sub={t("ofMaxBtc", { max: formatNumber(market.maxSupply) })}
              icon={<Stack size={20} weight="bold" aria-hidden />}
            />
            <MetricCard
              label={t("metricIssuedShare")}
              value={formatShare(market.issuedPercent)}
              sub={t("ofMaxSupply")}
              icon={<ChartLineUp size={20} weight="bold" aria-hidden />}
            />
          </div>
        </section>

        {/* Supply over time */}
        <section aria-label={t("supplyLabel")} className="mt-5">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                {t("supplyTitle")}
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {t.rich("supplyIntro", {
                  age: fmtYears(supply.ageYears),
                  percent: formatShare(supply.issuedPercent),
                  year: supply.lastCoinYear,
                  yearsLeft: Math.round(supply.yearsLeft),
                  b: (chunks) => (
                    <span className="font-medium text-foreground">{chunks}</span>
                  ),
                })}
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatTile
                label={t("statBtcAge")}
                value={t("statBtcAgeValue", { years: fmtYears(supply.ageYears) })}
                sub={t("since")}
              />
              <StatTile
                label={t("metricIssuedShare")}
                value={formatShare(supply.issuedPercent)}
                sub={t("statIssuedShareSub", {
                  issued: formatNumber(Math.round(market.circulatingSupply)),
                  max: formatNumber(market.maxSupply),
                })}
              />
              <StatTile
                label={t("statRemaining")}
                value={t("statRemainingValue", { btc: formatNumber(Math.round(supply.remaining)) })}
                sub={t("statRemainingSub", { max: formatNumber(market.maxSupply) })}
              />
              <StatTile
                label={t("statAllIssued")}
                value={t("statAllIssuedValue", { year: supply.lastCoinYear })}
                sub={t("statAllIssuedSub", { years: Math.round(supply.yearsLeft) })}
              />
              <StatTile
                label={t("statBlockReward")}
                value={t("statBlockRewardValue", { btc: fmtYears(supply.currentReward, 4) })}
                sub={t("statBlockRewardSub")}
              />
              <StatTile
                label={t("statNewPerDay")}
                value={t("statNewPerDayValue", { btc: formatNumber(Math.round(supply.perDay)) })}
                sub={t("statNewPerDaySub")}
              />
            </div>

            <div className="mt-7 flex flex-col gap-5">
              <SupplyBar
                label={t("barIssued")}
                percent={supply.issuedPercent}
              />
              <SupplyBar
                label={t("barTimeElapsed")}
                percent={supply.timeElapsedPercent}
                muted
              />
              <p className="text-xs text-muted-foreground">
                {t("supplyNote", {
                  timePercent: Math.round(supply.timeElapsedPercent),
                  issuedPercent: Math.round(supply.issuedPercent),
                })}
              </p>
            </div>

            <div className="mt-8 border-t border-border/60 pt-6">
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                {t("scarcityTitle")}
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <StatTile
                  label={t("statSupplyInflation")}
                  value={t("statSupplyInflationValue", { value: fmtYears(supply.supplyInflationPercent, 2) })}
                  sub={t("statSupplyInflationSub")}
                />
                <StatTile
                  label={t("statDoubleTime")}
                  value={t("statDoubleTimeValue", { years: Math.round(supply.yearsToDouble) })}
                  sub={t("statDoubleTimeSub")}
                />
                <StatTile
                  label={t("statPerPerson")}
                  value={t("statPerPersonValue", { btc: fmtYears(supply.perPersonBtc, 4) })}
                  sub={t("statPerPersonSub", { sats: formatNumber(Math.round(supply.perPersonSats)) })}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("scarcityNote")}
              </p>
            </div>
          </Card>
        </section>

        {/* Price chart + calculator */}
        <section aria-label={t("priceCalcLabel")} className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard
              title={t("chartLongTitle")}
              description={t("chartLongDesc")}
            >
              <BtcPriceChart height={340} data={priceHist.points} />
            </ChartCard>
          </div>
          <div>
            <SatsCalculator priceSek={market.priceSek} live={market.live} />
          </div>
        </section>

        {/* Asset allocation: Bitcoin vs other asset classes */}
        <section aria-label={t("allocLabel")} className="mt-5">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                {t("allocTitle")}
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {t("allocIntro")}
              </p>
            </div>

            <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
              <div className="relative">
                <AssetAllocationChart data={allocation.slices} height={400} />
                {btcSlice ? (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    {/* Soft halo behind the centred Bitcoin figure. */}
                    <span
                      aria-hidden
                      className="absolute size-32 rounded-full bg-bitcoin/15 blur-2xl"
                    />
                    <span className="relative inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      <CurrencyBtc size={13} weight="fill" className="text-bitcoin" aria-hidden />
                      {t("allocBitcoin")}
                    </span>
                    <span className="relative mt-1 font-heading text-5xl font-bold tracking-tight text-bitcoin tabular-nums">
                      {fmtPercent(btcSlice.percent)}
                    </span>
                    <span className="relative mt-1.5 max-w-[8rem] text-[11px] leading-tight text-muted-foreground">
                      {t("allocOfWorld")}
                    </span>
                  </div>
                ) : null}
              </div>

              <div>
                <dl className="flex flex-col gap-2.5">
                  {legendRows.map((row) =>
                    row.kind === "asset" ? (
                      <div
                        key={row.slice.name}
                        className="flex items-center justify-between gap-4 border-b border-border/60 pb-2.5 last:border-0"
                      >
                        <dt className="flex min-w-0 items-center gap-2.5">
                          <span
                            aria-hidden
                            className="size-3 shrink-0 rounded-full"
                            style={{ backgroundColor: row.slice.color }}
                          />
                          <span
                            className={
                              row.slice.isBitcoin
                                ? "min-w-0 font-medium text-bitcoin [overflow-wrap:anywhere]"
                                : "min-w-0 font-medium text-foreground [overflow-wrap:anywhere]"
                            }
                          >
                            {row.slice.name}
                          </span>
                        </dt>
                        <dd className="flex shrink-0 items-baseline gap-2 tabular-nums">
                          <span className="font-heading text-base font-semibold text-foreground">
                            {fmtPercent(row.slice.percent)}
                          </span>
                          <span className="hidden text-xs text-muted-foreground sm:inline">
                            {fmtTrillions(row.slice.valueUsd)}
                          </span>
                        </dd>
                      </div>
                    ) : (
                      <div key="stocks" className="border-b border-border/60 pb-2.5 last:border-0">
                        <div className="flex items-center justify-between gap-4">
                          <dt className="flex min-w-0 items-center gap-2.5">
                            <span
                              aria-hidden
                              className="size-3 shrink-0 rounded-full"
                              style={{ backgroundColor: STOCKS_COLOR }}
                            />
                            <span className="min-w-0 font-medium text-foreground">
                              {t("allocStocks")}
                            </span>
                          </dt>
                          <dd className="flex shrink-0 items-baseline gap-2 tabular-nums">
                            <span className="font-heading text-base font-semibold text-foreground">
                              {fmtPercent(stocksPercent)}
                            </span>
                            <span className="hidden text-xs text-muted-foreground sm:inline">
                              {fmtTrillions(stocksValue)}
                            </span>
                          </dd>
                        </div>
                        <p className="mt-2 pl-[1.625rem] text-xs text-muted-foreground">
                          {t("allocLargest")}
                        </p>
                        <ul className="mt-1.5 flex flex-col gap-1.5 pl-[1.625rem]">
                          {stockSlices
                            .filter((s) => s.name !== "Övriga aktier")
                            .map((s) => (
                              <li
                                key={s.name}
                                className="flex items-center justify-between gap-3 text-xs"
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <span
                                    aria-hidden
                                    className="size-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: s.color }}
                                  />
                                  <span className="min-w-0 text-muted-foreground [overflow-wrap:anywhere]">
                                    {s.name}
                                  </span>
                                </span>
                                <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
                                  <span className="font-medium text-foreground/80">
                                    {fmtPercent(s.percent)}
                                  </span>
                                  <span className="hidden text-muted-foreground sm:inline">
                                    {fmtTrillions(s.valueUsd)}
                                  </span>
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ),
                  )}
                </dl>
              </div>
            </div>

          </Card>
        </section>

        {/* Min Bitcoinresa (DCA) */}
        <section aria-label={t("dcaLabel")} className="mt-5">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                    {t("dcaTitle")}
                  </h2>
                  {investment.live ? (
                    <Badge variant="bitcoin">{t("dcaBadgeLive")}</Badge>
                  ) : investment.source.startsWith("Instagram") ? (
                    <Badge variant="outline">{t("dcaBadgeInstagram")}</Badge>
                  ) : (
                    <Badge variant="outline">{t("dcaBadgeExample")}</Badge>
                  )}
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  {t("dcaIntro")}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label={t("dcaTotalInvested")}
                value={formatCurrency(investment.totalInvested)}
                valueClassName="text-lg sm:text-xl leading-snug"
                sub={t("dcaDaysBought", { days: formatNumber(investment.days) })}
                icon={<Wallet size={20} weight="bold" aria-hidden />}
              />
              <MetricCard
                label={t("dcaValueToday")}
                value={formatCurrency(investment.currentValue)}
                valueClassName="text-lg sm:text-xl leading-snug"
                change={investment.live ? investment.returnPct : undefined}
                icon={<ChartLineUp size={20} weight="bold" aria-hidden />}
              />
              <MetricCard
                label={t("dcaReturn")}
                value={`${investment.returnSek >= 0 ? "+" : ""}${formatCurrency(investment.returnSek)}`}
                valueClassName="text-lg sm:text-xl leading-snug"
                sub={formatPercent(investment.returnPct)}
                icon={<TrendUp size={20} weight="bold" aria-hidden />}
              />
              {investment.totalBtc > 0 ? (
                <MetricCard
                  label={t("dcaHoldings")}
                  value={`${formatNumber(investment.totalBtc, { maximumFractionDigits: 5 })} BTC`}
                  valueClassName="text-lg sm:text-xl leading-snug"
                  sub={t("dcaSats", { sats: formatNumber(Math.round(investment.totalBtc * 100_000_000)) })}
                  icon={<CurrencyBtc size={20} weight="bold" aria-hidden />}
                />
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-bitcoin" aria-hidden />
                {t("dcaLegendValue")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-chart-3" aria-hidden />
                {t("dcaLegendInvested")}
              </span>
            </div>
            <div className="mt-4">
              <InvestmentChart data={investment.points} height={320} />
            </div>

          </Card>
        </section>

        {/* Halvering teaser */}
        <section aria-label={t("halvingTeaserLabel")} className="mt-5">
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                {t("halvingTeaserTitle")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("halvingTeaserText")}
              </p>
            </div>
            <Link
              href="/halvering"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-bitcoin/40 bg-bitcoin-muted px-4 py-2 text-sm font-semibold text-bitcoin transition-colors hover:border-bitcoin/70"
            >
              {t("halvingTeaserCta")}
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          </Card>
        </section>

        {/* Live network data: fees + sentiment */}
        <section aria-label={t("networkLabel")} className="mt-5 grid gap-5 sm:grid-cols-2">
          <FeesWidget fees={fees} />
          <FearGreedWidget data={fearGreed} />
        </section>

        {/* Savings calculator */}
        <section aria-label={t("savingsLabel")} className="mt-5">
          <SavingsCalculator priceSek={market.priceSek} />
        </section>

        {/* Inflation (SCB) */}
        <section aria-label={t("inflationLabel")} className="mt-5">
          <ChartCard
            title={t("inflationTitle")}
            description={t("inflationDesc")}
          >
            <InflationChart height={300} data={inflation.points} />
          </ChartCard>
        </section>

        {/* Purchasing power explainer */}
        <section className="mt-5">
          <Card className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t("powerTitle")}
            </h2>
            <p className="max-w-3xl text-base/7 text-muted-foreground">
              {t("powerText")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/artiklar/kopkraft-forklarat"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                {t("readPower")}
              </Link>
              <Link
                href="/artiklar/inflation-och-kopkraft"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                {t("readInflation")}
              </Link>
            </div>
          </Card>
        </section>

        <Disclaimer className="mt-10 max-w-2xl">
          {t("disclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}
