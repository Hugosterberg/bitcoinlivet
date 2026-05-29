import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { HalvingCountdown } from "@/features/bitcoin-data/components/halving-countdown";
import { SourceNote } from "@/features/bitcoin-data/components/source-note";
import { StatTile } from "@/features/bitcoin-data/components/stat-tile";
import { getBitcoinMarket } from "@/features/bitcoin-data/data/live-data";
import {
  BLOCKS_PER_DAY,
  BLOCKS_PER_HALVING,
  DIFFICULTY_ADJUSTMENT_BLOCKS,
  DIFFICULTY_ADJUSTMENT_DAYS,
  halvingHistory,
  getSupplyTimeline,
  MINUTES_PER_BLOCK,
} from "@/features/bitcoin-data/data/metrics";
import { formatNumber, formatShare } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bitcoinhalveringen: så fungerar den",
  description:
    "Vad är Bitcoinhalveringen? Live nedräkning till nästa halvering, blocktid, historik över tidigare halveringar och en lugn förklaring av varför utbudet är förutsägbart.",
  alternates: { canonical: "/halvering" },
  openGraph: {
    title: "Bitcoinhalveringen · bitcoinlivet",
    description:
      "Live nedräkning, blocktid, historik och en enkel förklaring av Bitcoins halvering.",
    url: "/halvering",
    type: "website",
  },
};

export const revalidate = 300;

export default async function HalvingPage() {
  const market = await getBitcoinMarket();
  const supply = getSupplyTimeline(
    market.circulatingSupply,
    market.maxSupply,
  );
  const fmtYears = (v: number, decimals = 1) =>
    v.toLocaleString("sv-SE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Halveringen
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Bitcoins inbyggda klocka
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Ungefär vart fjärde år halveras takten som nya bitcoin skapas i. Det
            är regeln som gör utbudet förutsägbart och långsamt leder mot taket
            på 21 miljoner. Här är nedräkningen, hur block och tid hänger ihop,
            historiken och varför det spelar roll.
          </p>
        </header>

        {/* Live countdown + explainer */}
        <section className="mt-12 grid items-start gap-5 lg:grid-cols-2">
          <HalvingCountdown />
          <Card className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Vad är en halvering?
            </h2>
            <p className="text-base/7 text-muted-foreground">
              Varje gång en ny bunt transaktioner (ett block) läggs till i
              blockkedjan skapas det nya bitcoin som belöning till den som säkrar
              nätverket. Var {formatNumber(BLOCKS_PER_HALVING)}:e block, ungefär
              vart fjärde år, halveras den belöningen.
            </p>
            <p className="text-base/7 text-muted-foreground">
              Resultatet är ett utbud som ökar allt långsammare och vars takt
              är känd i förväg, ända fram till den sista bitcoinen runt år 2140.
              Ingen kan ändra på det i efterhand.
            </p>
            <Link
              href="/artiklar/bitcoin-sunda-pengar"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
            >
              Läs: Vad gör Bitcoin till sunda pengar?
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          </Card>
        </section>

        {/* Block & time */}
        <section aria-label="Block och tid" className="mt-5">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Block &amp; tid
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Halveringen mäts i block, inte i kalenderdagar. Bitcoin är byggt
              så att ett nytt block i snitt ska tas fram var {MINUTES_PER_BLOCK}
              :e minut, men enskilda block kan ta både kortare och längre tid.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Måltid per block"
                value={`≈ ${MINUTES_PER_BLOCK} min`}
                sub="i snitt, enligt protokollet"
              />
              <StatTile
                label="Block per halvering"
                value={formatNumber(BLOCKS_PER_HALVING)}
                sub="≈ 4 år vid måltiden"
              />
              <StatTile
                label="Svårighetsjustering"
                value={`var ${formatNumber(DIFFICULTY_ADJUSTMENT_BLOCKS)} block`}
                sub={`≈ var ${DIFFICULTY_ADJUSTMENT_DAYS}:e dag`}
              />
              <StatTile
                label="Block per dygn"
                value={`≈ ${BLOCKS_PER_DAY}`}
                sub={`vid ${MINUTES_PER_BLOCK} min/block`}
              />
            </div>

            <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4 sm:p-5">
              <h3 className="text-sm font-medium text-foreground">
                Varför vet vi inte exakt när halveringen sker?
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Block kommer inte exakt var {MINUTES_PER_BLOCK}:e minut. Ibland
                  går det snabbare, ibland långsammare, det är normalt.
                </li>
                <li>
                  Nätverket justerar svårighetsgraden ungefär var{" "}
                  {DIFFICULTY_ADJUSTMENT_DAYS}:e dag så medeltiden hålls nära
                  målet, även när datorkraften (hash rate) förändras.
                </li>
                <li>
                  Hash rate kan öka eller minska snabbt om nya gruvor startar
                  eller stänger. Därför är halveringsdatumet en uppskattning
                  baserad på nuvarande tempo, inte ett exakt klockslag.
                </li>
              </ul>
            </div>

            <SourceNote
              className="mt-4"
              source="Bitcoin-protokollet (blocktid, svårighetsjustering)"
              hardcoded
              updatePath="features/bitcoin-data/data/metrics.ts → MINUTES_PER_BLOCK, BLOCKS_PER_HALVING"
            />
          </Card>
        </section>

        {/* Current epoch supply */}
        <section aria-label="Utbud i nuvarande epok" className="mt-5">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Utbud i nuvarande epok
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Sedan halveringen i april 2024 är blockbelöningen{" "}
              {fmtYears(supply.currentReward, 4)} BTC. Nästa halvering sänker den
              till {fmtYears(supply.currentReward / 2, 4)} BTC.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Blockbelöning nu"
                value={`${fmtYears(supply.currentReward, 4)} BTC`}
                sub="halveras vid nästa epok"
              />
              <StatTile
                label="Nytt utbud per dag"
                value={`≈ ${formatNumber(Math.round(supply.perDay))} BTC`}
                sub={`vid ~${BLOCKS_PER_DAY} block/dygn`}
              />
              <StatTile
                label="Andel utgivet"
                value={formatShare(supply.issuedPercent)}
                sub={`${formatNumber(Math.round(market.circulatingSupply))} av ${formatNumber(market.maxSupply)} BTC`}
              />
              <StatTile
                label="Kvar att utvinna"
                value={`${formatNumber(Math.round(supply.remaining))} BTC`}
                sub={`till cirka år ${supply.lastCoinYear}`}
              />
            </div>

            <SourceNote
              className="mt-4"
              source="CoinGecko (cirkulerande utbud)"
              href="https://www.coingecko.com/sv"
              live={market.live}
              hardcoded={!market.live}
              updatePath={!market.live ? "features/bitcoin-data/data/metrics.ts → btcSnapshot (reserv)" : undefined}
            />
          </Card>
        </section>

        {/* History table */}
        <section className="mt-5">
          <Card className="p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Alla halveringar
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Från 50 BTC per block vid starten till allt mindre för varje epok.
            </p>

            <div className="mt-6 w-full overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      Halvering
                    </th>
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      Block
                    </th>
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      Tidpunkt
                    </th>
                    <th className="border-b border-border px-3 py-2 text-right font-semibold">
                      Blockbelöning
                    </th>
                    <th className="border-b border-border px-3 py-2 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {halvingHistory.map((event) => (
                    <tr key={event.number} className="align-middle">
                      <td className="border-b border-border px-3 py-3 font-medium text-foreground">
                        {event.number === 0 ? "Start (genesis)" : `#${event.number}`}
                      </td>
                      <td className="border-b border-border px-3 py-3 tabular-nums text-muted-foreground">
                        {formatNumber(event.block)}
                      </td>
                      <td className="border-b border-border px-3 py-3 tabular-nums text-muted-foreground">
                        {event.date}
                      </td>
                      <td className="border-b border-border px-3 py-3 text-right tabular-nums text-foreground">
                        {formatNumber(event.rewardAfter, {
                          maximumFractionDigits: 4,
                        })}{" "}
                        BTC
                      </td>
                      <td className="border-b border-border px-3 py-3">
                        {event.past ? (
                          <Badge variant="outline">Inträffad</Badge>
                        ) : (
                          <Badge variant="bitcoin">Kommande</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SourceNote
              className="mt-4"
              source="Bitcoin-protokollet (block & belopp), datum är faktiska/uppskattade"
              hardcoded
              updatePath="features/bitcoin-data/data/metrics.ts → halvingHistory"
            />
          </Card>
        </section>

        {/* Why it matters */}
        <section className="mt-5">
          <Card className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              Varför halveringen spelar roll
            </h2>
            <p className="max-w-3xl text-base/7 text-muted-foreground">
              Vanliga pengar kan tryckas i obegränsad mängd. Bitcoin går åt
              motsatt håll: tillflödet av nya mynt minskar enligt ett schema som
              ingen kan rucka på. Det gör knappheten trovärdig, du kan räkna ut
              exakt hur många bitcoin som finns vid en viss tidpunkt.
            </p>
            <p className="max-w-3xl text-base/7 text-muted-foreground">
              Halveringen är alltså inte en händelse att tajma, utan en
              illustration av en princip: förutsägbara, knappa pengar. Det är
              den principen jag tycker är värd att förstå.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/data"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                Se Bitcoindata live
              </Link>
              <Link
                href="/utbildning"
                className="text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
              >
                Lär dig i Bitcoinskolan
              </Link>
            </div>
          </Card>
        </section>

        <Disclaimer className="mt-10 max-w-2xl">
          Nedräkningen hämtas live från blockkedjan; beräknat datum är en
          uppskattning utifrån ~{MINUTES_PER_BLOCK} minuter per block. Detta är
          inte finansiell rådgivning.
        </Disclaimer>
      </Container>
    </div>
  );
}
