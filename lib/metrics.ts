/**
 * Placeholder Bitcoin metrics and chart datasets.
 *
 * TODO(data): replace these static values with a real data source
 * (e.g. a price API or self-hosted node) via a server-side fetch.
 * Numbers below are illustrative and deliberately rounded — they exist to
 * demonstrate the dashboard UI, not to report live market data.
 */

export type LiveMetric = {
  id: string;
  label: string;
  /** Pre-formatted display value. */
  value: string;
  /** Optional secondary line, e.g. converted currency. */
  sub?: string;
  /** 24h change in percent, if relevant. */
  change?: number;
  hint?: string;
};

export const SUPPLY = {
  circulating: 19_850_000,
  max: 21_000_000,
} as const;

/** Bitcoin's genesis block was mined on 3 January 2009. */
export const GENESIS_DATE = new Date("2009-01-03T18:15:05Z");
/** The final satoshis are expected to be mined around the year 2140. */
export const LAST_COIN_YEAR = 2140;
/** ~144 blocks are mined per day at the 10-minute target. */
export const BLOCKS_PER_DAY = 144;
/** Rough world population, used for the "per person"-scarcity stat. */
export const WORLD_POPULATION = 8_100_000_000;

export type SupplyTimeline = {
  /** Years since the genesis block (Bitcoin's age). */
  ageYears: number;
  /** Approximate years left until the last bitcoin is issued (~2140). */
  yearsLeft: number;
  /** Target year when issuance ends. */
  lastCoinYear: number;
  /** Share of the max supply already issued, 0–100. */
  issuedPercent: number;
  /** BTC still left to be mined. */
  remaining: number;
  /** Current block subsidy in BTC (e.g. 3.125). */
  currentReward: number;
  /** Approximate new BTC issued per day at the current subsidy. */
  perDay: number;
  /** Approximate new BTC issued per year at the current subsidy. */
  perYear: number;
  /** Share of the full issuance timeline that has elapsed, 0–100. */
  timeElapsedPercent: number;
  /** Current annual supply growth (issuance) in percent. */
  supplyInflationPercent: number;
  /**
   * Stock-to-flow: years of current issuance needed to double the existing
   * supply. Higher = harder money.
   */
  yearsToDouble: number;
  /** Final BTC available per person (max supply / world population). */
  perPersonBtc: number;
  /** The same share expressed in satoshis. */
  perPersonSats: number;
};

/**
 * Derives clear, human-friendly supply facts: how long it took to reach the
 * current supply and how long is left until everything is issued. The supply
 * inputs are live (CoinGecko); the genesis date and ~2140 end are protocol
 * facts.
 */
export function getSupplyTimeline(
  circulating: number,
  max: number,
): SupplyTimeline {
  const now = Date.now();
  const yearMs = 365.2425 * 24 * 60 * 60 * 1000;
  const ageYears = (now - GENESIS_DATE.getTime()) / yearMs;
  const lastCoinDate = new Date(LAST_COIN_YEAR, 0, 1).getTime();
  const yearsLeft = Math.max(0, (lastCoinDate - now) / yearMs);
  const totalSpan = lastCoinDate - GENESIS_DATE.getTime();

  const lastPast = [...halvingHistory].reverse().find((h) => h.past);
  const currentReward = lastPast?.rewardAfter ?? 3.125;

  const perDay = currentReward * BLOCKS_PER_DAY;
  const perYear = perDay * 365.2425;

  return {
    ageYears,
    yearsLeft,
    lastCoinYear: LAST_COIN_YEAR,
    issuedPercent: (circulating / max) * 100,
    remaining: max - circulating,
    currentReward,
    perDay,
    perYear,
    timeElapsedPercent: ((now - GENESIS_DATE.getTime()) / totalSpan) * 100,
    supplyInflationPercent: (perYear / circulating) * 100,
    yearsToDouble: circulating / perYear,
    perPersonBtc: max / WORLD_POPULATION,
    perPersonSats: (max / WORLD_POPULATION) * 100_000_000,
  };
}

/** Bitcoin halves the block subsidy every 210,000 blocks (~4 years). */
export const BLOCKS_PER_HALVING = 210_000;
/** Protocol target: one block about every 10 minutes on average. */
export const MINUTES_PER_BLOCK = 10;
/** Difficulty is recalibrated every 2,016 blocks (~14 days). */
export const DIFFICULTY_ADJUSTMENT_BLOCKS = 2_016;
/** Approximate days between difficulty adjustments at the 10-minute target. */
export const DIFFICULTY_ADJUSTMENT_DAYS = Math.round(
  (DIFFICULTY_ADJUSTMENT_BLOCKS * MINUTES_PER_BLOCK) / (60 * 24),
);

export type HalvingInfo = {
  height: number;
  nextHalvingBlock: number;
  blocksRemaining: number;
  /** Halving number that the countdown leads up to (1 = first, etc.). */
  halvingNumber: number;
  /** Progress through the current reward epoch, 0–100. */
  epochProgress: number;
  /** Estimated date of the next halving. */
  estimatedDate: Date;
};

/** Derives halving details from the current block height. */
export function getHalvingInfo(height: number): HalvingInfo {
  const nextHalvingBlock =
    Math.floor(height / BLOCKS_PER_HALVING + 1) * BLOCKS_PER_HALVING;
  const blocksRemaining = nextHalvingBlock - height;
  const blocksIntoEpoch = BLOCKS_PER_HALVING - blocksRemaining;
  const epochProgress = (blocksIntoEpoch / BLOCKS_PER_HALVING) * 100;
  const estimatedDate = new Date(
    Date.now() + blocksRemaining * MINUTES_PER_BLOCK * 60_000,
  );
  return {
    height,
    nextHalvingBlock,
    blocksRemaining,
    halvingNumber: nextHalvingBlock / BLOCKS_PER_HALVING,
    epochProgress,
    estimatedDate,
  };
}

export type HalvingEvent = {
  /** 0 = genesis (no halving), 1 = first halving, … */
  number: number;
  block: number;
  /** Approximate date the halving occurred. */
  date: string;
  /** Block subsidy after the event, in BTC. */
  rewardAfter: number;
  /** Whether the event has already happened. */
  past: boolean;
};

/**
 * Historik över halveringar. Block och belopp är fasta protokollfakta;
 * datumen är de faktiska (för inträffade) respektive en uppskattning (kommande).
 * Hårdkodad – uppdatera i lib/metrics.ts → halvingHistory.
 */
export const halvingHistory: HalvingEvent[] = [
  { number: 0, block: 0, date: "2009-01-03", rewardAfter: 50, past: true },
  { number: 1, block: 210_000, date: "2012-11-28", rewardAfter: 25, past: true },
  { number: 2, block: 420_000, date: "2016-07-09", rewardAfter: 12.5, past: true },
  { number: 3, block: 630_000, date: "2020-05-11", rewardAfter: 6.25, past: true },
  { number: 4, block: 840_000, date: "2024-04-20", rewardAfter: 3.125, past: true },
  { number: 5, block: 1_050_000, date: "2028", rewardAfter: 1.5625, past: false },
];

/** Snapshot used for cards. Illustrative placeholder values. */
export const btcSnapshot = {
  priceSek: 1_085_000,
  priceUsd: 102_500,
  change24h: 1.8,
  marketCapUsd: 2_035_000_000_000,
  circulatingSupply: SUPPLY.circulating,
  maxSupply: SUPPLY.max,
  // ISO date of the snapshot.
  asOf: "2026-05-29",
} as const;

export const supplyIssuedPercent =
  (SUPPLY.circulating / SUPPLY.max) * 100;

/**
 * Long-term BTC price in SEK (yearly close, illustrative). Demonstrates the
 * long time-horizon framing that Bitcoinlivet emphasises.
 *
 * ⚠️ HÅRDKODAD EXEMPELDATA – uppdatera med riktig historik (t.ex. CoinGecko
 * `/coins/bitcoin/market_chart?vs_currency=sek`). Se docs/ROADMAP.md (P0).
 */
export type PricePoint = { year: string; priceSek: number };

export const priceHistory: PricePoint[] = [
  { year: "2013", priceSek: 8_400 },
  { year: "2014", priceSek: 3_400 },
  { year: "2015", priceSek: 4_500 },
  { year: "2016", priceSek: 10_000 },
  { year: "2017", priceSek: 146_000 },
  { year: "2018", priceSek: 39_000 },
  { year: "2019", priceSek: 76_000 },
  { year: "2020", priceSek: 305_000 },
  { year: "2021", priceSek: 486_000 },
  { year: "2022", priceSek: 173_000 },
  { year: "2023", priceSek: 444_000 },
  { year: "2024", priceSek: 980_000 },
  { year: "2025", priceSek: 1_060_000 },
];

/**
 * Illustrative purchasing-power comparison: the index value of 100 kr held
 * since 2013, in cash (eroded by inflation) vs the same amount measured
 * against a scarce-money benchmark. Placeholder, for education only.
 */
export type PurchasingPoint = {
  year: string;
  kontanter: number;
  hardPengar: number;
};

export const purchasingPower: PurchasingPoint[] = [
  { year: "2013", kontanter: 100, hardPengar: 100 },
  { year: "2015", kontanter: 98, hardPengar: 104 },
  { year: "2017", kontanter: 95, hardPengar: 121 },
  { year: "2019", kontanter: 92, hardPengar: 138 },
  { year: "2021", kontanter: 88, hardPengar: 171 },
  { year: "2023", kontanter: 80, hardPengar: 205 },
  { year: "2025", kontanter: 74, hardPengar: 244 },
];

/**
 * Illustrative annual consumer-price inflation (%). Placeholder values used
 * to explain why purchasing power changes over time.
 */
export type InflationPoint = { year: string; inflation: number };

export const inflationHistory: InflationPoint[] = [
  { year: "2016", inflation: 1.0 },
  { year: "2017", inflation: 1.8 },
  { year: "2018", inflation: 2.0 },
  { year: "2019", inflation: 1.8 },
  { year: "2020", inflation: 0.5 },
  { year: "2021", inflation: 2.2 },
  { year: "2022", inflation: 8.4 },
  { year: "2023", inflation: 8.5 },
  { year: "2024", inflation: 2.9 },
  { year: "2025", inflation: 2.1 },
];
