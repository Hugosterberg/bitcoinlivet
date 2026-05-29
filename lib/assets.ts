/**
 * Global asset-class market caps for the "Bitcoin i relation till andra
 * tillgångar"-pie. There is no free public API for the total value of real
 * estate, equities, bonds or gold — these are slow-moving estimates that we
 * keep here and flag clearly. Bitcoin's value is fetched live (see
 * getAssetAllocation in lib/live-data.ts) and combined with these.
 *
 * Uppdatera siffrorna här: lib/assets.ts → assetClassEstimates.
 * Källor (uppskattningar): companiesmarketcap.com, 8marketcap.com.
 */

const T = 1_000_000_000_000;

export type AssetEstimate = { name: string; valueUsd: number };

/** Approximate global market caps in USD (excluding Bitcoin, which is live). */
export const assetClassEstimates: AssetEstimate[] = [
  { name: "Fastigheter", valueUsd: 330 * T },
  { name: "Obligationer", valueUsd: 140 * T },
  { name: "Aktier", valueUsd: 115 * T },
  { name: "Guld", valueUsd: 20 * T },
];

export const ASSET_ESTIMATE_SOURCE =
  "Uppskattningar · companiesmarketcap.com, 8marketcap.com";
export const ASSET_ESTIMATE_HREF = "https://8marketcap.com/";

/** Stable colors so the chart cells and the legend always match. */
export const assetColors: Record<string, string> = {
  Fastigheter: "var(--color-chart-4)",
  Obligationer: "var(--color-chart-3)",
  Aktier: "var(--color-chart-5)",
  Guld: "var(--color-chart-2)",
  Bitcoin: "var(--color-chart-1)",
};

export function assetColor(name: string): string {
  return assetColors[name] ?? "var(--color-chart-3)";
}
