import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, CurrencyBtc, Coins, Stack } from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/features/bitcoin-data/components/metric-card";
import { BtcPriceChart } from "@/features/bitcoin-data/components/charts/btc-price-chart";
import { getBitcoinMarket, getBtcPriceHistory } from "@/features/bitcoin-data/data/live-data";
import {
  currencyForLocale,
  formatAmountWords,
  formatCurrency,
  formatNumber,
  formatShare,
} from "@/lib/format";

export async function FeaturedMetrics() {
  const locale = await getLocale();
  const currency = currencyForLocale(locale);
  const [market, history, t] = await Promise.all([
    getBitcoinMarket(currency),
    getBtcPriceHistory(currency),
    getTranslations("home"),
  ]);

  return (
    <Section className="border-y border-border bg-graphite/30">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={t("metricsEyebrow")}
          title={t("metricsTitle")}
          description={market.live ? t("metricsDescLive") : t("metricsDescStatic")}
        />
        <Button asChild variant="outline" className="h-10 shrink-0 rounded-full px-5 text-sm">
          <Link href="/data">
            {t("metricsToDashboard")}
            <ArrowRight weight="bold" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <MetricCard
          label={market.live ? t("metricsPrice") : t("metricsPriceExample")}
          value={formatCurrency(market.price, locale)}
          sub={t("metricsPerBitcoin")}
          change={market.change24h}
          locale={locale}
          icon={<CurrencyBtc size={20} weight="bold" aria-hidden />}
        />
        <MetricCard
          label={t("metricsMarketCap")}
          value={formatCurrency(market.marketCap, locale)}
          valueClassName="text-lg sm:text-xl leading-snug"
          sub={
            <>
              ≈ {formatAmountWords(market.marketCap, locale)}
              <span className="block text-muted-foreground/70">
                {t("metricsTotalGlobal")}
              </span>
            </>
          }
          icon={<Coins size={20} weight="bold" aria-hidden />}
        />
        <MetricCard
          label={t("metricsIssuedSupply")}
          value={formatShare(market.issuedPercent, {}, locale)}
          sub={`${formatNumber(Math.round(market.circulatingSupply), {}, locale)} / ${formatNumber(market.maxSupply, {}, locale)} BTC`}
          icon={<Stack size={20} weight="bold" aria-hidden />}
        />
      </div>

      <Card className="mt-5 p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {t("metricsLongTitle")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("metricsLongDesc")}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <BtcPriceChart height={300} data={history.points} />
        </div>
      </Card>
    </Section>
  );
}
