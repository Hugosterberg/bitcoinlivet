"use client";

import { useId, useState } from "react";
import { ArrowsDownUp } from "@phosphor-icons/react";

import { btcSnapshot } from "@/features/bitcoin-data/data/metrics";
import { formatNumber, formatCurrency, SATS_PER_BTC } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { SourceNote } from "@/features/bitcoin-data/components/source-note";

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function SatsCalculator({
  priceSek = btcSnapshot.priceSek,
  live = false,
}: {
  /** Current BTC price in SEK. Falls back to the placeholder snapshot. */
  priceSek?: number;
  /** Whether the price came from a live source. */
  live?: boolean;
} = {}) {
  const PRICE_SEK = priceSek;
  const sekId = useId();
  const satsId = useId();
  // Canonical amount of SEK; sats are derived from the placeholder price.
  const [sek, setSek] = useState<number>(500);
  // Track raw strings so typing feels natural.
  const [sekRaw, setSekRaw] = useState<string>("500");
  const [satsRaw, setSatsRaw] = useState<string>("");

  const sats = (sek / PRICE_SEK) * SATS_PER_BTC;
  const btc = sek / PRICE_SEK;

  function handleSek(raw: string) {
    setSekRaw(raw);
    setSatsRaw("");
    setSek(parseAmount(raw));
  }

  function handleSats(raw: string) {
    setSatsRaw(raw);
    setSekRaw("");
    const enteredSats = parseAmount(raw);
    setSek((enteredSats / SATS_PER_BTC) * PRICE_SEK);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Satskalkylator
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Räkna om mellan kronor och satoshis.
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
          <ArrowsDownUp size={20} weight="bold" aria-hidden />
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="space-y-1.5">
          <label
            htmlFor={sekId}
            className="text-sm font-medium text-muted-foreground"
          >
            Belopp i kronor
          </label>
          <div className="flex items-center rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <input
              id={sekId}
              inputMode="decimal"
              value={sekRaw !== "" ? sekRaw : sek ? formatNumber(Math.round(sek)) : ""}
              onChange={(e) => handleSek(e.target.value)}
              placeholder="0"
              className="h-12 w-full bg-transparent font-mono text-lg tabular-nums text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            <span className="ml-2 text-sm font-medium text-muted-foreground">kr</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={satsId}
            className="text-sm font-medium text-muted-foreground"
          >
            Motsvarar
          </label>
          <div className="flex items-center rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <input
              id={satsId}
              inputMode="numeric"
              value={satsRaw !== "" ? satsRaw : formatNumber(Math.round(sats))}
              onChange={(e) => handleSats(e.target.value)}
              placeholder="0"
              className="h-12 w-full bg-transparent font-mono text-lg tabular-nums text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            <span className="ml-2 text-sm font-medium text-muted-foreground">sats</span>
          </div>
          <p className="text-xs text-muted-foreground tabular-nums">
            ≈ {formatNumber(btc, { maximumFractionDigits: 8 })} BTC
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleSek(String(amount))}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
          >
            {formatNumber(amount)} kr
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted-foreground">
        {live
          ? `Beräknat på aktuellt pris om ${formatCurrency(PRICE_SEK)} per bitcoin.`
          : `Beräknat på ett exempelpris om ${formatCurrency(PRICE_SEK)} per bitcoin.`}
      </p>
      <SourceNote
        className="mt-2"
        source="CoinGecko"
        href="https://www.coingecko.com/sv"
        live={live}
        hardcoded={!live}
        updatePath={!live ? "features/bitcoin-data/data/metrics.ts → btcSnapshot" : undefined}
      />

      <Disclaimer className="mt-4" />
    </Card>
  );
}
