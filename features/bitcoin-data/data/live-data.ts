import {
  SUPPLY,
  btcSnapshot,
  inflationHistory,
  priceHistory,
  type InflationPoint,
  type PricePoint,
} from "@/features/bitcoin-data/data/metrics";
import { dcaConfig, instagramSnapshots } from "@/features/bitcoin-data/data/portfolio";
import {
  assetBreakdown,
  BITCOIN_COLOR,
  ASSET_ESTIMATE_SOURCE,
  ASSET_ESTIMATE_HREF,
  type AssetGroup,
} from "@/features/bitcoin-data/data/assets";

/**
 * Server-side fetchers for free, key-less live data.
 *
 * - Bitcoin market data: CoinGecko (price, market cap and supply in SEK).
 * - Recommended network fees: mempool.space.
 * - Investment history (DCA): CoinGecko historical SEK prices.
 *
 * All cache with `revalidate` so we stay within free rate limits, and all
 * degrade gracefully (return a `live: false` fallback) if the request fails,
 * so pages never break. See docs/ROADMAP.md.
 */

const REVALIDATE_SECONDS = 120;
const REVALIDATE_HISTORY = 3600;
/** Long-term yearly price history changes slowly; refresh daily. */
const REVALIDATE_PRICE_HISTORY = 86_400;

export type BitcoinMarket = {
  priceSek: number;
  marketCapSek: number;
  change24h: number;
  /** Live circulating supply (BTC). */
  circulatingSupply: number;
  /** Max supply (21 000 000 BTC). */
  maxSupply: number;
  /** Share of max supply already issued, in percent. */
  issuedPercent: number;
  /** True when the data came from the live API, false when using fallback. */
  live: boolean;
  /** Attribution shown in the UI. */
  source: string;
};

const COINGECKO_MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=sek&ids=bitcoin&price_change_percentage=24h";

/** Fallback derived from the static placeholder snapshot. */
const marketFallback: BitcoinMarket = {
  priceSek: btcSnapshot.priceSek,
  marketCapSek: btcSnapshot.marketCapUsd * 10.5,
  change24h: btcSnapshot.change24h,
  circulatingSupply: SUPPLY.circulating,
  maxSupply: SUPPLY.max,
  issuedPercent: (SUPPLY.circulating / SUPPLY.max) * 100,
  live: false,
  source: "CoinGecko",
};

export async function getBitcoinMarket(): Promise<BitcoinMarket> {
  try {
    const res = await fetch(COINGECKO_MARKETS_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);

    const json = (await res.json()) as Array<{
      current_price?: number;
      market_cap?: number;
      circulating_supply?: number;
      max_supply?: number;
      price_change_percentage_24h?: number;
    }>;

    const b = json?.[0];
    if (!b || typeof b.current_price !== "number") {
      throw new Error("Oväntat svar från CoinGecko");
    }

    const circulatingSupply = b.circulating_supply ?? SUPPLY.circulating;
    const maxSupply = b.max_supply ?? SUPPLY.max;

    return {
      priceSek: b.current_price,
      marketCapSek: b.market_cap ?? circulatingSupply * b.current_price,
      change24h: b.price_change_percentage_24h ?? 0,
      circulatingSupply,
      maxSupply,
      issuedPercent: (circulatingSupply / maxSupply) * 100,
      live: true,
      source: "CoinGecko",
    };
  } catch {
    return marketFallback;
  }
}

/* ------------------------------------------------------------------ *
 * Asset allocation: Bitcoin's market cap vs other asset classes.
 * Bitcoin is live; the other classes are clearly-flagged estimates.
 * ------------------------------------------------------------------ */

export type AssetSlice = {
  name: string;
  valueUsd: number;
  percent: number;
  isBitcoin: boolean;
  /** "stocks" slices together make up the Aktier total. */
  group: AssetGroup;
  color: string;
};

export type AssetAllocation = {
  slices: AssetSlice[];
  /** Whether Bitcoin's value came from the live API. */
  btcLive: boolean;
  source: string;
  href: string;
};

const COINGECKO_BTC_USD =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin";

export async function getAssetAllocation(): Promise<AssetAllocation> {
  let btcUsd: number = btcSnapshot.marketCapUsd;
  let btcLive = false;

  try {
    const res = await fetch(COINGECKO_BTC_USD, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (res.ok) {
      const json = (await res.json()) as Array<{ market_cap?: number }>;
      const mc = json?.[0]?.market_cap;
      if (typeof mc === "number" && mc > 0) {
        btcUsd = mc;
        btcLive = true;
      }
    }
  } catch {
    // Keep the fallback Bitcoin market cap.
  }

  const raw = [
    ...assetBreakdown.map((a) => ({
      name: a.name,
      valueUsd: a.valueUsd,
      group: a.group,
      color: a.color,
      isBitcoin: false,
    })),
    {
      name: "Bitcoin",
      valueUsd: btcUsd,
      group: "standalone" as AssetGroup,
      color: BITCOIN_COLOR,
      isBitcoin: true,
    },
  ];

  const total = raw.reduce((sum, r) => sum + r.valueUsd, 0);
  // Keep the curated order (stocks contiguous); don't re-sort by size.
  const slices: AssetSlice[] = raw.map((r) => ({
    ...r,
    percent: (r.valueUsd / total) * 100,
  }));

  return {
    slices,
    btcLive,
    source: ASSET_ESTIMATE_SOURCE,
    href: ASSET_ESTIMATE_HREF,
  };
}

/* ------------------------------------------------------------------ *
 * Investment history (DCA): invested vs current value over time.
 * ------------------------------------------------------------------ */

export type InvestmentPoint = {
  /** YYYY-MM-DD of the sampled point (month end or today). */
  date: string;
  /** Short Swedish label, e.g. "jun 2024". */
  label: string;
  /** Cumulative invested SEK. */
  invested: number;
  /** Value of accrued BTC at that date's price, in SEK. */
  value: number;
  /** Cumulative BTC accrued. */
  btc: number;
};

export type InvestmentHistory = {
  points: InvestmentPoint[];
  totalInvested: number;
  currentValue: number;
  totalBtc: number;
  returnSek: number;
  returnPct: number;
  dailySek: number;
  startDate: string;
  days: number;
  live: boolean;
  source: string;
};

const dateFmt = new Intl.DateTimeFormat("sv-SE", { month: "short", year: "numeric" });
const monthLabel = (d: Date) => dateFmt.format(d);
const dateKey = (d: Date) => d.toISOString().slice(0, 10);

/** Builds the monthly DCA series given a price lookup for each day. */
function buildSeries(
  start: Date,
  end: Date,
  dailySek: number,
  priceFor: (key: string, prev: number) => number,
  seedPrice: number,
): { points: InvestmentPoint[]; totalInvested: number; totalBtc: number; lastPrice: number } {
  const points: InvestmentPoint[] = [];
  let cumBtc = 0;
  let cumInvested = 0;
  let lastPrice = seedPrice;

  const cur = new Date(start.getTime());
  const endKey = dateKey(end);

  while (cur.getTime() <= end.getTime()) {
    const key = dateKey(cur);
    const price = priceFor(key, lastPrice);
    lastPrice = price;
    cumInvested += dailySek;
    cumBtc += dailySek / price;

    const next = new Date(cur.getTime());
    next.setUTCDate(cur.getUTCDate() + 1);
    const isMonthEnd = next.getUTCMonth() !== cur.getUTCMonth();

    if (isMonthEnd || key === endKey) {
      points.push({
        date: key,
        label: monthLabel(cur),
        invested: Math.round(cumInvested),
        value: Math.round(cumBtc * price),
        btc: cumBtc,
      });
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  return { points, totalInvested: cumInvested, totalBtc: cumBtc, lastPrice };
}

export async function getInvestmentHistory(): Promise<InvestmentHistory> {
  const { dailySek, startDate } = dcaConfig;
  const start = new Date(`${startDate}T00:00:00Z`);
  const today = new Date();
  const days = Math.max(1, Math.ceil((today.getTime() - start.getTime()) / 86_400_000));

  // Manual mode: exact numbers pasted from monthly Instagram status posts.
  if (instagramSnapshots.length > 0) {
    const points: InvestmentPoint[] = instagramSnapshots.map((s) => {
      const d = new Date(`${s.month}-01T00:00:00Z`);
      return {
        date: dateKey(d),
        label: monthLabel(d),
        invested: s.invested,
        value: s.value,
        btc: 0,
      };
    });
    const last = points[points.length - 1];
    return {
      points,
      totalInvested: last.invested,
      currentValue: last.value,
      totalBtc: 0,
      returnSek: last.value - last.invested,
      returnPct: last.invested ? ((last.value - last.invested) / last.invested) * 100 : 0,
      dailySek,
      startDate,
      days,
      live: false,
      source: "Instagram (manuellt)",
    };
  }

  try {
    // The free CoinGecko history caps at 365 days, so compose a SEK series
    // from CryptoCompare BTC/USD (long, key-less) × Frankfurter USD→SEK rates.
    const limit = Math.min(days + 5, 2000);
    const ccUrl = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=${limit}`;
    const fxUrl = `https://api.frankfurter.app/${startDate}..${dateKey(today)}?from=USD&to=SEK`;

    const [ccRes, fxRes] = await Promise.all([
      fetch(ccUrl, { next: { revalidate: REVALIDATE_HISTORY } }),
      fetch(fxUrl, { next: { revalidate: REVALIDATE_HISTORY } }),
    ]);
    if (!ccRes.ok) throw new Error(`CryptoCompare HTTP ${ccRes.status}`);
    if (!fxRes.ok) throw new Error(`Frankfurter HTTP ${fxRes.status}`);

    const ccJson = (await ccRes.json()) as {
      Data?: { Data?: { time: number; close: number }[] };
    };
    const ccArr = ccJson.Data?.Data?.filter((d) => d.close > 0) ?? [];
    if (ccArr.length === 0) throw new Error("Tom prisserie från CryptoCompare");

    const usdByDay = new Map<string, number>();
    for (const d of ccArr) usdByDay.set(dateKey(new Date(d.time * 1000)), d.close);

    const fxJson = (await fxRes.json()) as {
      rates?: Record<string, { SEK?: number }>;
    };
    const fxByDay = new Map<string, number>();
    for (const [date, obj] of Object.entries(fxJson.rates ?? {})) {
      if (typeof obj.SEK === "number") fxByDay.set(date, obj.SEK);
    }

    // Build a continuous SEK price for every day, carrying forward the last
    // known USD price and FX rate over weekends/gaps.
    let lastUsd = ccArr[0].close;
    const sortedFx = [...fxByDay.values()];
    let lastRate = sortedFx.length ? sortedFx[0] : 10.5;
    const sekByDay = new Map<string, number>();
    {
      const cur = new Date(start.getTime());
      while (cur.getTime() <= today.getTime()) {
        const key = dateKey(cur);
        lastUsd = usdByDay.get(key) ?? lastUsd;
        lastRate = fxByDay.get(key) ?? lastRate;
        sekByDay.set(key, lastUsd * lastRate);
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    }
    const seed = sekByDay.get(dateKey(start)) ?? lastUsd * lastRate;

    const { points, totalInvested, totalBtc, lastPrice } = buildSeries(
      start,
      today,
      dailySek,
      (key, prev) => sekByDay.get(key) ?? prev,
      seed,
    );

    const currentValue = Math.round(totalBtc * lastPrice);
    return {
      points,
      totalInvested: Math.round(totalInvested),
      currentValue,
      totalBtc,
      returnSek: currentValue - Math.round(totalInvested),
      returnPct: totalInvested ? ((currentValue - totalInvested) / totalInvested) * 100 : 0,
      dailySek,
      startDate,
      days,
      live: true,
      source: "CryptoCompare · Frankfurter",
    };
  } catch {
    // Fallback: invested is deterministic; value uses a single fallback price.
    const price = btcSnapshot.priceSek;
    const { points, totalInvested, totalBtc } = buildSeries(
      start,
      today,
      dailySek,
      () => price,
      price,
    );
    const currentValue = Math.round(totalBtc * price);
    return {
      points,
      totalInvested: Math.round(totalInvested),
      currentValue,
      totalBtc,
      returnSek: currentValue - Math.round(totalInvested),
      returnPct: 0,
      dailySek,
      startDate,
      days,
      live: false,
      source: "Exempel (live-pris ej tillgängligt)",
    };
  }
}

/* ------------------------------------------------------------------ *
 * Long-term yearly price history (SEK), for the "Bitcoin i ett längre
 * perspektiv"-chart. Composed from CryptoCompare BTC/USD (key-less, full
 * history) × Frankfurter USD→SEK, same approach as the DCA series.
 * ------------------------------------------------------------------ */

export type PriceHistory = {
  points: PricePoint[];
  live: boolean;
  source: string;
};

const CRYPTOCOMPARE_ALL =
  "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&allData=true";

const PRICE_HISTORY_FIRST_YEAR = 2013;

export async function getBtcPriceHistory(): Promise<PriceHistory> {
  try {
    const today = new Date();
    const fxUrl = `https://api.frankfurter.app/${PRICE_HISTORY_FIRST_YEAR}-01-01..${dateKey(
      today,
    )}?from=USD&to=SEK`;

    const [ccRes, fxRes] = await Promise.all([
      fetch(CRYPTOCOMPARE_ALL, { next: { revalidate: REVALIDATE_PRICE_HISTORY } }),
      fetch(fxUrl, { next: { revalidate: REVALIDATE_PRICE_HISTORY } }),
    ]);
    if (!ccRes.ok) throw new Error(`CryptoCompare HTTP ${ccRes.status}`);
    if (!fxRes.ok) throw new Error(`Frankfurter HTTP ${fxRes.status}`);

    const ccJson = (await ccRes.json()) as {
      Data?: { Data?: { time: number; close: number }[] };
    };
    const ccArr = (ccJson.Data?.Data ?? []).filter((d) => d.close > 0);
    if (ccArr.length === 0) throw new Error("Tom prisserie från CryptoCompare");

    // Latest USD close per calendar year (the year-end print).
    const usdByYear = new Map<number, { day: string; close: number }>();
    for (const d of ccArr) {
      const date = new Date(d.time * 1000);
      const year = date.getUTCFullYear();
      const day = dateKey(date);
      const existing = usdByYear.get(year);
      if (!existing || day > existing.day) usdByYear.set(year, { day, close: d.close });
    }

    // FX rates sorted ascending, for a carry-forward lookup at each year-end.
    const fxJson = (await fxRes.json()) as {
      rates?: Record<string, { SEK?: number }>;
    };
    const fxDays = Object.entries(fxJson.rates ?? {})
      .map(([day, obj]) => [day, obj.SEK] as const)
      .filter((entry): entry is readonly [string, number] => typeof entry[1] === "number")
      .sort((a, b) => a[0].localeCompare(b[0]));
    if (fxDays.length === 0) throw new Error("Tomma växelkurser från Frankfurter");

    const rateOnOrBefore = (day: string): number => {
      let rate = fxDays[0][1];
      for (const [d, r] of fxDays) {
        if (d <= day) rate = r;
        else break;
      }
      return rate;
    };

    const currentYear = today.getUTCFullYear();
    const points: PricePoint[] = [];
    for (let year = PRICE_HISTORY_FIRST_YEAR; year <= currentYear; year++) {
      const usd = usdByYear.get(year);
      if (!usd) continue;
      points.push({
        year: String(year),
        priceSek: Math.round(usd.close * rateOnOrBefore(usd.day)),
      });
    }
    if (points.length < 2) throw new Error("För få datapunkter");

    return { points, live: true, source: "CryptoCompare · Frankfurter" };
  } catch {
    return { points: priceHistory, live: false, source: "Exempeldata" };
  }
}

/* ------------------------------------------------------------------ *
 * Fear & Greed Index (alternative.me) — sentiment, not a signal.
 * ------------------------------------------------------------------ */

export type FearGreed = {
  /** 0–100. */
  value: number;
  /** Swedish label, e.g. "Rädsla". */
  label: string;
  updated: Date;
  live: boolean;
  source: string;
};

const FNG_LABELS: { max: number; label: string }[] = [
  { max: 25, label: "Extrem rädsla" },
  { max: 45, label: "Rädsla" },
  { max: 55, label: "Neutral" },
  { max: 75, label: "Girighet" },
  { max: 100, label: "Extrem girighet" },
];

export function fearGreedLabel(value: number): string {
  return FNG_LABELS.find((b) => value <= b.max)?.label ?? "Neutral";
}

export async function getFearGreed(): Promise<FearGreed | null> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      next: { revalidate: REVALIDATE_HISTORY },
    });
    if (!res.ok) throw new Error(`alternative.me HTTP ${res.status}`);

    const json = (await res.json()) as {
      data?: { value?: string; timestamp?: string }[];
    };
    const d = json.data?.[0];
    const value = Number(d?.value);
    if (!Number.isFinite(value)) throw new Error("Oväntat svar");

    return {
      value,
      label: fearGreedLabel(value),
      updated: new Date(Number(d?.timestamp ?? Date.now() / 1000) * 1000),
      live: true,
      source: "alternative.me",
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Swedish inflation (SCB KPI, annual change) — replaces example data.
 * ------------------------------------------------------------------ */

export type InflationSeries = {
  points: InflationPoint[];
  live: boolean;
  source: string;
};

const SCB_KPI_URL =
  "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/KPItotM";

export async function getInflation(): Promise<InflationSeries> {
  try {
    const res = await fetch(SCB_KPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 86_400 },
      body: JSON.stringify({
        query: [
          {
            code: "ContentsCode",
            // 000004VV = "Årsförändring" (12-month inflation rate).
            selection: { filter: "item", values: ["000004VV"] },
          },
          {
            code: "Tid",
            selection: { filter: "top", values: ["132"] },
          },
        ],
        response: { format: "json" },
      }),
    });
    if (!res.ok) throw new Error(`SCB HTTP ${res.status}`);

    const json = (await res.json()) as {
      data?: { key: string[]; values: string[] }[];
    };
    const rows = json.data ?? [];
    if (rows.length === 0) throw new Error("Tom serie från SCB");

    // Pick one value per year: prefer December, else the latest month present.
    const byYear = new Map<string, { month: number; value: number }>();
    for (const row of rows) {
      const tid = row.key[0]; // "YYYYMmm"
      const year = tid.slice(0, 4);
      const month = Number(tid.slice(5));
      const value = Number(row.values[0]);
      if (!Number.isFinite(value)) continue;
      const existing = byYear.get(year);
      if (!existing || month > existing.month) byYear.set(year, { month, value });
    }

    const points: InflationPoint[] = [...byYear.entries()]
      .map(([year, { value }]) => ({ year, inflation: Math.round(value * 10) / 10 }))
      .sort((a, b) => a.year.localeCompare(b.year))
      .slice(-10);

    if (points.length === 0) throw new Error("Kunde inte tolka SCB-data");
    return { points, live: true, source: "SCB" };
  } catch {
    return { points: inflationHistory, live: false, source: "Exempeldata" };
  }
}

export type RecommendedFees = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  live: boolean;
};

const MEMPOOL_FEES_URL = "https://mempool.space/api/v1/fees/recommended";
const MEMPOOL_HEIGHT_URL = "https://mempool.space/api/blocks/tip/height";

/** Current block height (server-side), or null if unavailable. */
export async function getBlockHeight(): Promise<number | null> {
  try {
    const res = await fetch(MEMPOOL_HEIGHT_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`mempool HTTP ${res.status}`);
    const height = Number.parseInt(await res.text(), 10);
    return Number.isFinite(height) ? height : null;
  } catch {
    return null;
  }
}

export async function getRecommendedFees(): Promise<RecommendedFees | null> {
  try {
    const res = await fetch(MEMPOOL_FEES_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`mempool HTTP ${res.status}`);

    const json = (await res.json()) as Partial<RecommendedFees>;
    if (typeof json.fastestFee !== "number") {
      throw new Error("Oväntat svar från mempool.space");
    }

    return {
      fastestFee: json.fastestFee,
      halfHourFee: json.halfHourFee ?? json.fastestFee,
      hourFee: json.hourFee ?? json.fastestFee,
      economyFee: json.economyFee ?? json.hourFee ?? json.fastestFee,
      live: true,
    };
  } catch {
    return null;
  }
}
