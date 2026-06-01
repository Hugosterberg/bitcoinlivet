import type { Metadata } from "next";
import Link from "next/link";
import {
  CurrencyBtc,
  Coins,
  Stack,
  ChartLineUp,
  Wallet,
  TrendUp,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
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

export const metadata: Metadata = {
  title: "Bitcoindata",
  description:
    "En lugn Bitcoin dashboard: pris, marknadsvärde, utbud, satskalkylator och grafer över inflation och köpkraft. Exempeldata i utbildande syfte.",
  alternates: { canonical: "/data" },
  openGraph: {
    title: "Bitcoindata · bitcoinlivet",
    description:
      "Pris, marknadsvärde, utbud, satskalkylator och grafer över inflation och köpkraft.",
    url: "/data",
    type: "website",
  },
};

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
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground tabular-nums">
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

export default async function DataPage() {
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
    `${(usd / 1_000_000_000_000).toLocaleString("sv-SE", {
      maximumFractionDigits: 1,
    })} biljoner USD`;

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
              Data
            </p>
            {market.live ? (
              <Badge variant="bitcoin">Live-data</Badge>
            ) : (
              <Badge variant="outline">Exempeldata</Badge>
            )}
          </div>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Bitcoin dashboard
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            En överblick av Bitcoin och de krafter som påverkar din köpkraft.
            {market.live
              ? " Pris, marknadsvärde, svensk inflation och prishistorik hämtas live; köpkraft visas som exempel."
              : " Siffrorna visas som exempeldata just nu."}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {market.live
              ? "Pris via CoinGecko, nätverk via mempool.space, inflation via SCB, uppdateras löpande."
              : `Senast uppdaterad (exempel): ${formatDate(btcSnapshot.asOf)}`}
          </p>
        </header>

        {/* Key metrics */}
        <section aria-label="Nyckeltal" className="mt-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Pris"
              value={formatCurrency(market.priceSek)}
              sub="per bitcoin"
              change={market.change24h}
              icon={<CurrencyBtc size={20} weight="bold" aria-hidden />}
            />
            <MetricCard
              label="Marknadsvärde"
              value={formatCurrency(market.marketCapSek)}
              valueClassName="text-lg sm:text-xl leading-snug"
              sub={
                <>
                  ≈ {formatAmountWords(market.marketCapSek)}
                  <span className="block text-muted-foreground/70">
                    globalt totalvärde
                  </span>
                </>
              }
              icon={<Coins size={20} weight="bold" aria-hidden />}
            />
            <MetricCard
              label="Cirkulerande utbud"
              value={`${formatNumber(Math.round(market.circulatingSupply))}`}
              valueClassName="text-lg sm:text-xl leading-snug"
              sub={`av ${formatNumber(market.maxSupply)} BTC`}
              icon={<Stack size={20} weight="bold" aria-hidden />}
            />
            <MetricCard
              label="Andel utgivet"
              value={formatShare(market.issuedPercent)}
              sub="av maxutbudet"
              icon={<ChartLineUp size={20} weight="bold" aria-hidden />}
            />
          </div>
        </section>

        {/* Supply over time */}
        <section aria-label="Utbud över tid" className="mt-5">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Utbud över tid
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Bitcoins utgivning är förutbestämd. Det mest slående: efter cirka{" "}
                {fmtYears(supply.ageYears)} år är redan{" "}
                <span className="font-medium text-foreground">
                  {formatShare(supply.issuedPercent)}
                </span>{" "}
                av alla bitcoin skapade, men de allra sista skapas först omkring
                år {supply.lastCoinYear}, om ungefär {Math.round(supply.yearsLeft)} år.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatTile
                label="Bitcoins ålder"
                value={`${fmtYears(supply.ageYears)} år`}
                sub="sedan 3 januari 2009"
              />
              <StatTile
                label="Andel utgivet"
                value={formatShare(supply.issuedPercent)}
                sub={`${formatNumber(Math.round(market.circulatingSupply))} av ${formatNumber(market.maxSupply)} BTC`}
              />
              <StatTile
                label="Kvar att utvinna"
                value={`${formatNumber(Math.round(supply.remaining))} BTC`}
                sub={`av ${formatNumber(market.maxSupply)} BTC totalt`}
              />
              <StatTile
                label="Allt utgivet (ungefär)"
                value={`år ${supply.lastCoinYear}`}
                sub={`om cirka ${Math.round(supply.yearsLeft)} år`}
              />
              <StatTile
                label="Block reward nu"
                value={`${fmtYears(supply.currentReward, 4)} BTC`}
                sub="halveras vart fjärde år"
              />
              <StatTile
                label="Nytt utbud per dag"
                value={`≈ ${formatNumber(Math.round(supply.perDay))} BTC`}
                sub="vid ~144 block per dygn"
              />
            </div>

            <div className="mt-7 flex flex-col gap-5">
              <SupplyBar
                label="Andel av alla bitcoin som är utgivna"
                percent={supply.issuedPercent}
              />
              <SupplyBar
                label="Andel av utgivningstiden (2009–2140) som passerat"
                percent={supply.timeElapsedPercent}
                muted
              />
              <p className="text-xs text-muted-foreground">
                Nästan alla bitcoin skapas tidigt: vi har passerat ~
                {Math.round(supply.timeElapsedPercent)} % av tiden men ~
                {Math.round(supply.issuedPercent)} % av utbudet är redan här.
              </p>
            </div>

            <div className="mt-8 border-t border-border/60 pt-6">
              <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
                Knapphet i siffror
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <StatTile
                  label="Utbudsinflation"
                  value={`${fmtYears(supply.supplyInflationPercent, 2)} %`}
                  sub="per år nu, sjunker mot noll"
                />
                <StatTile
                  label="Tid att dubbla utbudet"
                  value={`≈ ${Math.round(supply.yearsToDouble)} år`}
                  sub="vid dagens nyproduktion (stock-to-flow)"
                />
                <StatTile
                  label="Din andel om alla delade lika"
                  value={`${fmtYears(supply.perPersonBtc, 4)} BTC`}
                  sub={`≈ ${formatNumber(Math.round(supply.perPersonSats))} sats per person`}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Med 21 miljoner bitcoin och ~8,1 miljarder människor finns det
                bara en liten bråkdel per person. Knappheten ökar för varje
                halvering: nyproduktionen krymper medan efterfrågan kan växa.
              </p>
            </div>
          </Card>
        </section>

        {/* Price chart + calculator */}
        <section aria-label="Pris och kalkylator" className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard
              title="Bitcoin i ett längre perspektiv"
              description="Pris vid varje årsslut, i SEK. Illustrerar det långa loppet."
            >
              <BtcPriceChart height={340} data={priceHist.points} />
            </ChartCard>
          </div>
          <div>
            <SatsCalculator priceSek={market.priceSek} live={market.live} />
          </div>
        </section>

        {/* Asset allocation: Bitcoin vs other asset classes */}
        <section aria-label="Bitcoin i relation till andra tillgångar" className="mt-5">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Bitcoin i relation till andra tillgångar
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Världens samlade värde fördelat på stora tillgångar. Det sätter
                Bitcoins storlek i perspektiv. De största bolagen visas som en
                del av aktie-totalen, så du ser hur var och en står sig mot
                Bitcoin.
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
                      Bitcoin
                    </span>
                    <span className="relative mt-1 font-heading text-5xl font-bold tracking-tight text-bitcoin tabular-nums">
                      {fmtPercent(btcSlice.percent)}
                    </span>
                    <span className="relative mt-1.5 max-w-[8rem] text-[11px] leading-tight text-muted-foreground">
                      av världens tillgångar
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
                                ? "truncate font-medium text-bitcoin"
                                : "truncate font-medium text-foreground"
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
                            <span className="truncate font-medium text-foreground">
                              Aktier
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
                          varav de största bolagen:
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
                                  <span className="truncate text-muted-foreground">
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
        <section aria-label="Min Bitcoinresa" className="mt-5">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                    Min Bitcoinresa
                  </h2>
                  {investment.live ? (
                    <Badge variant="bitcoin">Live</Badge>
                  ) : investment.source.startsWith("Instagram") ? (
                    <Badge variant="outline">Instagram</Badge>
                  ) : (
                    <Badge variant="outline">Exempel</Badge>
                  )}
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Hur ett dagligt köp växer över tid, investerat belopp jämfört
                  med värdet idag. Värdet beräknas mot historiska BTC-priser i SEK.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Totalt investerat"
                value={formatCurrency(investment.totalInvested)}
                valueClassName="text-lg sm:text-xl leading-snug"
                sub={`${formatNumber(investment.days)} dagars köp`}
                icon={<Wallet size={20} weight="bold" aria-hidden />}
              />
              <MetricCard
                label="Värde idag"
                value={formatCurrency(investment.currentValue)}
                valueClassName="text-lg sm:text-xl leading-snug"
                change={investment.live ? investment.returnPct : undefined}
                icon={<ChartLineUp size={20} weight="bold" aria-hidden />}
              />
              <MetricCard
                label="Avkastning"
                value={`${investment.returnSek >= 0 ? "+" : ""}${formatCurrency(investment.returnSek)}`}
                valueClassName="text-lg sm:text-xl leading-snug"
                sub={formatPercent(investment.returnPct)}
                icon={<TrendUp size={20} weight="bold" aria-hidden />}
              />
              {investment.totalBtc > 0 ? (
                <MetricCard
                  label="Innehav"
                  value={`${formatNumber(investment.totalBtc, { maximumFractionDigits: 5 })} BTC`}
                  valueClassName="text-lg sm:text-xl leading-snug"
                  sub={`${formatNumber(Math.round(investment.totalBtc * 100_000_000))} sats`}
                  icon={<CurrencyBtc size={20} weight="bold" aria-hidden />}
                />
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-bitcoin" aria-hidden />
                Värde idag
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-chart-3" aria-hidden />
                Investerat
              </span>
            </div>
            <div className="mt-4">
              <InvestmentChart data={investment.points} height={320} />
            </div>

          </Card>
        </section>

        {/* Halvering teaser */}
        <section aria-label="Halveringen" className="mt-5">
          <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Halveringen
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ungefär vart fjärde år halveras blockbelöningen. Se live nedräkning,
                blocktid, historik och varför halveringsdatumet bara kan uppskattas.
              </p>
            </div>
            <Link
              href="/halvering"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-bitcoin/40 bg-bitcoin-muted px-4 py-2 text-sm font-semibold text-bitcoin transition-colors hover:border-bitcoin/70"
            >
              Se halveringen
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          </Card>
        </section>

        {/* Live network data: fees + sentiment */}
        <section aria-label="Live från nätverket" className="mt-5 grid gap-5 sm:grid-cols-2">
          <FeesWidget fees={fees} />
          <FearGreedWidget data={fearGreed} />
        </section>

        {/* Savings calculator */}
        <section aria-label="Sparkalkylator" className="mt-5">
          <SavingsCalculator priceSek={market.priceSek} />
        </section>

        {/* Inflation (SCB) */}
        <section aria-label="Inflation" className="mt-5">
          <ChartCard
            title="Inflation per år (enligt SCB)"
            description="Konsumentprisernas förändring (KPI) i Sverige. Höga år markeras i orange."
          >
            <InflationChart height={300} data={inflation.points} />
          </ChartCard>
        </section>

        {/* Purchasing power explainer */}
        <section className="mt-5">
          <Card className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Varför köpkraft är det som räknas
            </h2>
            <p className="max-w-3xl text-base/7 text-muted-foreground">
              Antalet kronor på kontot säger inte allt. Det som avgör din vardag
              är hur mycket de räcker till. När prisnivån stiger köper samma
              belopp mindre, det är därför vi mäter sparande i köpkraft, inte
              bara i siffror. Pengar med ett begränsat utbud har historiskt
              behållit köpkraften bättre än pengar vars mängd hela tiden växer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/artiklar/kopkraft-forklarat"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                Läs: Köpkraft förklarat
              </Link>
              <Link
                href="/artiklar/inflation-och-kopkraft"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                Läs: Inflation och köpkraft
              </Link>
            </div>
          </Card>
        </section>

        <Disclaimer className="mt-10 max-w-2xl">
          Pris, marknadsvärde, utbud, nätverksdata, svensk inflation (SCB) och
          prishistorik hämtas live. Min Bitcoinresa beräknas på ett dagligt köp
          mot historiska priser. Detta är inte finansiell rådgivning.
        </Disclaimer>
      </Container>
    </div>
  );
}
