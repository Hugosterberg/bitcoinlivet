import Link from "next/link";
import { ArrowRight, CurrencyBtc, Coins, Stack } from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/ui/disclaimer";
import { MetricCard } from "@/features/bitcoin-data/components/metric-card";
import { SourceNote } from "@/features/bitcoin-data/components/source-note";
import { BtcPriceChart } from "@/features/bitcoin-data/components/charts/btc-price-chart";
import { getBitcoinMarket } from "@/features/bitcoin-data/data/live-data";
import {
  formatCurrency,
  formatNumber,
  formatShare,
} from "@/lib/format";

export async function FeaturedMetrics() {
  const market = await getBitcoinMarket();

  return (
    <Section className="border-y border-border bg-graphite/30">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Bitcoin i siffror"
          title="Data, inte drama"
          description={
            market.live
              ? "En överblick av läget, pris och marknadsvärde hämtas live. Hela dashboarden finns på datasidan."
              : "En överblick av läget. Hela dashboarden finns på datasidan."
          }
        />
        <Button asChild variant="outline" className="h-10 shrink-0 rounded-full px-5 text-sm">
          <Link href="/data">
            Till dashboarden
            <ArrowRight weight="bold" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <MetricCard
          label={market.live ? "Pris" : "Pris (exempel)"}
          value={formatCurrency(market.priceSek)}
          sub="per bitcoin"
          change={market.change24h}
          icon={<CurrencyBtc size={20} weight="bold" aria-hidden />}
        />
        <MetricCard
          label="Marknadsvärde"
          value={formatCurrency(market.marketCapSek)}
          valueClassName="text-lg sm:text-xl leading-snug"
          sub="totalt globalt värde"
          icon={<Coins size={20} weight="bold" aria-hidden />}
        />
        <MetricCard
          label="Utgivet utbud"
          value={formatShare(market.issuedPercent)}
          sub={`${formatNumber(Math.round(market.circulatingSupply))} / ${formatNumber(market.maxSupply)} BTC`}
          icon={<Stack size={20} weight="bold" aria-hidden />}
        />
      </div>

      <SourceNote
        className="mt-4"
        source="CoinGecko"
        href="https://www.coingecko.com/sv"
        live={market.live}
        hardcoded={!market.live}
        updatePath={!market.live ? "features/bitcoin-data/data/metrics.ts → btcSnapshot" : undefined}
      />

      <Card className="mt-5 p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Bitcoin i ett längre perspektiv
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Årsslut i SEK. Illustrerar det långa loppet.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <BtcPriceChart height={300} />
        </div>
        <SourceNote
          className="mt-4"
          source="Exempeldata"
          hardcoded
          updatePath="features/bitcoin-data/data/metrics.ts → priceHistory"
        />
      </Card>

      <Disclaimer className="mt-5">
        Pris och marknadsvärde hämtas live; långtidsgrafen ovan är exempeldata i
        utbildande syfte. Detta är inte finansiell rådgivning.
      </Disclaimer>
    </Section>
  );
}
