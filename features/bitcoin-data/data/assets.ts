/**
 * "Bitcoin i relation till andra tillgångar" data, read from
 * assetmarketcap.com (2026-05). assetmarketcap.com has no free key-less API
 * (the free tier needs an account + key), so these are manual snapshot figures
 * refreshed by hand. Bitcoin's slice is fetched live (getAssetAllocation in
 * features/bitcoin-data/data/live-data.ts).
 *
 * The largest individual companies are shown as sub-slices of the "Aktier"
 * (stocks) total, so you can see each one's size next to Bitcoin without
 * double-counting: the companies plus "Övriga aktier" sum to the stocks total.
 *
 * Uppdatera: features/bitcoin-data/data/assets.ts → assetBreakdown.
 * Källa: assetmarketcap.com (avläst 2026-05).
 */

const T = 1_000_000_000_000;

/** "stocks" items together make up the Aktier total; the rest stand alone. */
export type AssetGroup = "standalone" | "stocks";

export type AssetItem = {
  name: string;
  valueUsd: number;
  group: AssetGroup;
  /** Chart + legend color. */
  color: string;
};

/** Total market cap of all listed companies (Aktier), per assetmarketcap.com. */
const STOCKS_TOTAL = 147.56 * T;

/**
 * Largest individual companies — each a slice of the Aktier total, coloured in
 * a shared indigo family so they read as "part of stocks".
 */
const companies: AssetItem[] = [
  { name: "NVIDIA", valueUsd: 5.11 * T, group: "stocks", color: "#5b53d6" },
  { name: "Alphabet", valueUsd: 4.61 * T, group: "stocks", color: "#7c72e3" },
  { name: "Apple", valueUsd: 4.58 * T, group: "stocks", color: "#9a90ee" },
  { name: "Microsoft", valueUsd: 3.34 * T, group: "stocks", color: "#b6aef5" },
  { name: "Amazon", valueUsd: 2.91 * T, group: "stocks", color: "#d2ccfa" },
];

const companiesSum = companies.reduce((sum, c) => sum + c.valueUsd, 0);

/** Base colour of the stocks family (used for the "Aktier" group in the legend). */
export const STOCKS_COLOR = "#4338ca";

/** Stocks beyond the named companies, so the Aktier total stays correct. */
const otherStocks: AssetItem = {
  name: "Övriga aktier",
  valueUsd: STOCKS_TOTAL - companiesSum,
  group: "stocks",
  color: STOCKS_COLOR,
};

/**
 * All non-Bitcoin slices, ordered for the donut: the stocks block sits where
 * the Aktier total belongs by size and is kept contiguous so the companies
 * sit together. Bitcoin is appended live in getAssetAllocation.
 */
export const assetBreakdown: AssetItem[] = [
  { name: "Fastigheter", valueUsd: 634.9 * T, group: "standalone", color: "#64748b" },
  { name: "Olja", valueUsd: 152.54 * T, group: "standalone", color: "#115e59" },
  otherStocks,
  ...companies,
  { name: "Valutor", valueUsd: 137.03 * T, group: "standalone", color: "#9f1239" },
  { name: "Guld", valueUsd: 30.69 * T, group: "standalone", color: "#ca8a04" },
  { name: "Koppar", valueUsd: 18.36 * T, group: "standalone", color: "#92400e" },
  { name: "Naturgas", valueUsd: 10.79 * T, group: "standalone", color: "#4d7c0f" },
  { name: "Silver", valueUsd: 4.27 * T, group: "standalone", color: "#94a3b8" },
];

/** Combined Aktier (stocks) total — companies + Övriga aktier. */
export const STOCKS_TOTAL_USD = STOCKS_TOTAL;

/** Bitcoin slice colour (the signature orange). */
export const BITCOIN_COLOR = "var(--color-chart-1)";

export const ASSET_ESTIMATE_SOURCE = "assetmarketcap.com (avläst 2026-05)";
export const ASSET_ESTIMATE_HREF = "https://assetmarketcap.com/";
