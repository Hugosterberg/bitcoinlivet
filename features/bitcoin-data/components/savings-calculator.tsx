"use client";

import { useId, useMemo, useState } from "react";
import { PiggyBank } from "@phosphor-icons/react";

import { Card } from "@/components/ui/card";
import { SourceNote } from "@/features/bitcoin-data/components/source-note";
import {
  SATS_PER_BTC,
  formatCurrency,
  formatNumber,
} from "@/lib/format";

/**
 * Pedagogical savings calculator: shows how a recurring monthly amount adds up
 * and how many sats it buys *at today's price*. Deliberately makes no forecast
 * about future value — it is about habit and accumulation, not returns.
 */
export function SavingsCalculator({
  priceSek,
  live,
}: {
  priceSek: number;
  live: boolean;
}) {
  const monthlyId = useId();
  const yearsId = useId();
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const months = years * 12;
    const invested = monthly * months;
    const totalSats = priceSek > 0 ? (invested / priceSek) * SATS_PER_BTC : 0;
    return {
      invested,
      totalSats,
      totalBtc: totalSats / SATS_PER_BTC,
    };
  }, [monthly, years, priceSek]);

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid size-10 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
          <PiggyBank size={20} weight="fill" aria-hidden />
        </span>
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Sparkalkylator
          </h3>
          <p className="text-xs text-muted-foreground">
            Hur regelbundet sparande växer
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div>
            <label
              htmlFor={monthlyId}
              className="flex items-center justify-between text-sm font-medium text-foreground"
            >
              <span>Belopp per månad</span>
              <span className="tabular-nums text-bitcoin">
                {formatCurrency(monthly)}
              </span>
            </label>
            <input
              id={monthlyId}
              type="range"
              min={100}
              max={10000}
              step={100}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="mt-3 w-full accent-bitcoin"
              aria-describedby={`${monthlyId}-hint`}
            />
            <p id={`${monthlyId}-hint`} className="mt-1 text-xs text-muted-foreground">
              100 till 10 000 kr
            </p>
          </div>

          <div>
            <label
              htmlFor={yearsId}
              className="flex items-center justify-between text-sm font-medium text-foreground"
            >
              <span>Antal år</span>
              <span className="tabular-nums text-bitcoin">
                {years} {years === 1 ? "år" : "år"}
              </span>
            </label>
            <input
              id={yearsId}
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-3 w-full accent-bitcoin"
            />
            <p className="mt-1 text-xs text-muted-foreground">1 till 30 år</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-border bg-background/40 p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Totalt insatt
            </p>
            <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {formatCurrency(result.invested)}
            </p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Vid dagens pris
            </p>
            <p className="mt-1 font-heading text-xl font-semibold tracking-tight text-bitcoin tabular-nums">
              {formatNumber(Math.round(result.totalSats))} sats
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
              ≈ {formatNumber(result.totalBtc, { maximumFractionDigits: 4 })} BTC
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        Visar hur mycket du sätter in och hur många sats det motsvarar{" "}
        <strong className="font-medium text-foreground">vid dagens pris</strong>.
        Priset rör sig upp och ner, detta är ingen prognos om framtida värde.
      </p>
      <SourceNote
        className="mt-3"
        source={live ? "CoinGecko (dagens pris)" : "Exempelpris"}
        href={live ? "https://www.coingecko.com/sv" : undefined}
        live={live}
        hardcoded={!live}
        updatePath={!live ? "features/bitcoin-data/data/metrics.ts → btcSnapshot" : undefined}
      />
    </Card>
  );
}
