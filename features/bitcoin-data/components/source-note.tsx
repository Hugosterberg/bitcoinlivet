import { Database, Wrench } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

/**
 * Caption that states a data source and clearly flags hardcoded values.
 *
 * - `live` sources render a "Live"-tagged source link.
 * - `hardcoded` data renders a visible flag plus the file path to update,
 *   so it's obvious what still needs wiring to a live feed.
 */
export function SourceNote({
  source,
  href,
  live = false,
  hardcoded = false,
  updatePath,
  className,
}: {
  /** Human-readable source, e.g. "CoinGecko" or "Exempeldata". */
  source: string;
  /** Optional link to the source. */
  href?: string;
  /** Whether the data is fetched live. */
  live?: boolean;
  /** Whether the data is hardcoded in the repo. */
  hardcoded?: boolean;
  /** Where to edit the hardcoded data, e.g. "features/bitcoin-data/data/metrics.ts → priceHistory". */
  updatePath?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Database size={13} weight="bold" aria-hidden className="text-muted-foreground" />
        Källa:{" "}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-2 hover:decoration-bitcoin"
          >
            {source}
          </a>
        ) : (
          <span className="font-medium text-foreground">{source}</span>
        )}
      </span>

      {live ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
          Live
        </span>
      ) : null}

      {hardcoded ? (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-bitcoin-muted px-1.5 py-0.5 font-medium text-bitcoin"
          title={updatePath ? `Uppdatera i ${updatePath}` : undefined}
        >
          <Wrench size={11} weight="bold" aria-hidden />
          Hårdkodad{updatePath ? ` · ${updatePath}` : ""}
        </span>
      ) : null}
    </p>
  );
}
