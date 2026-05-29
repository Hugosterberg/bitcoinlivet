import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  CurrencyBtc,
  Lightning,
  Gauge,
  Timer,
  Newspaper,
  ArrowUpRight,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { SourceNote } from "@/features/bitcoin-data/components/source-note";
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
} from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nyheter: senaste om Bitcoin",
  description:
    "Ett lugnt urval Bitcoinnyheter från den senaste veckan, hämtade från bitcoinfokuserade källor, plus en snabb överblick av läget i SEK. Utan hype.",
  alternates: { canonical: "/bitcoin-idag" },
  openGraph: {
    title: "Nyheter · bitcoinlivet",
    description:
      "Veckans Bitcoinnyheter från bitcoinfokuserade källor, plus läget just nu i SEK. Minimalt och utan hype.",
    url: "/bitcoin-idag",
    type: "website",
  },
};

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
      <span className="font-heading text-xl font-semibold tracking-tight text-foreground tabular-nums sm:text-2xl">
        {value}
      </span>
      {sub ? (
        <span
          className={
            tone === "up"
              ? "text-xs font-medium text-emerald-400 tabular-nums"
              : tone === "down"
                ? "text-xs font-medium text-destructive tabular-nums"
                : "text-xs text-muted-foreground tabular-nums"
          }
        >
          {sub}
        </span>
      ) : null}
    </div>
  );
}

export default async function BitcoinTodayPage() {
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
              Nyheter
            </p>
            <Badge variant="outline">Senaste veckan</Badge>
          </div>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Senaste nytt om Bitcoin
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Ett lugnt urval rubriker från den senaste veckan, hämtade från
            bitcoinfokuserade källor, plus en snabb överblick av läget. Tänk
            långsiktigt: det här är en överblick, inte en uppmaning att agera.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Uppdaterad {formatDate(today)}
          </p>
        </header>

        {/* Snapshot */}
        <section aria-label="Läget just nu" className="mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SnapshotTile
              icon={<CurrencyBtc size={18} weight="bold" aria-hidden />}
              label="Pris"
              value={formatCurrency(market.priceSek)}
              sub={`${formatPercent(market.change24h)} senaste dygnet`}
              tone={market.change24h >= 0 ? "up" : "down"}
            />
            <SnapshotTile
              icon={<Lightning size={18} weight="fill" aria-hidden />}
              label="Avgift (snabbast)"
              value={fees ? `${fees.fastestFee} sat/vB` : "–"}
              sub={fees ? "för nästa block" : "ej tillgänglig nu"}
            />
            <SnapshotTile
              icon={<Gauge size={18} weight="fill" aria-hidden />}
              label="Marknadshumör"
              value={fearGreed ? `${fearGreed.value}/100` : "–"}
              sub={fearGreed ? fearGreed.label : "ej tillgängligt nu"}
            />
            <SnapshotTile
              icon={<Timer size={18} weight="bold" aria-hidden />}
              label="Till halvering"
              value={halving ? `${formatNumber(halving.blocksRemaining)} block` : "–"}
              sub={halving ? `≈ ${formatDate(halving.estimatedDate)}` : "ej tillgängligt nu"}
            />
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SourceNote
              source="CoinGecko · mempool.space · alternative.me"
              live={market.live}
            />
            <Link
              href="/data"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin underline decoration-bitcoin/40 underline-offset-4 hover:decoration-bitcoin"
            >
              Se hela dashboarden
              <ArrowRight size={15} weight="bold" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Headlines */}
        <section aria-label="Veckans rubriker" className="mt-12">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
              <Newspaper size={18} weight="fill" aria-hidden />
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Veckans rubriker
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ett urval rubriker från den senaste veckan, från bitcoinfokuserade
            källor. Jag länkar vidare och republicerar inget, läs källkritiskt
            och kom ihåg att nyheter ofta är brus i det långa loppet.
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
                Inga rubriker just nu
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Nyhetskällorna svarar inte för tillfället. Titta in igen om en
                stund, flödet uppdateras automatiskt.
              </p>
            </div>
          )}

          {news.sources.length > 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Källor: {news.sources.join(" · ")}. Uppdateras automatiskt varje
              timme.
            </p>
          ) : null}
        </section>

        <Disclaimer className="mt-12 max-w-2xl">
          Överblicken hämtas live och rubrikerna kommer från externa källor som
          jag inte styr över. Detta är inte finansiell rådgivning, och nyheter
          bör sällan styra långsiktiga beslut.
        </Disclaimer>
      </Container>
    </div>
  );
}
