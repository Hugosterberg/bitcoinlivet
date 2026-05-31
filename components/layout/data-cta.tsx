import Link from "next/link";
import { ChartLineUp } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

/**
 * Premium "Se Bitcoindata" call-to-action. Carries a live-pulse dot to signal
 * that the dashboard is live, a soft Bitcoin-orange glow and a gentle hover
 * lift. Replaces the old "Data" nav link, which pointed to the same place.
 */
export function DataCta({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/data"
      onClick={onClick}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-bitcoin px-5 py-2.5 text-sm font-semibold text-bitcoin-foreground shadow-lg shadow-bitcoin/25 ring-1 ring-inset ring-white/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-bitcoin/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* Soft sheen that drifts across on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      {/* Live pulse dot. */}
      <span className="relative flex size-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bitcoin-foreground/70" />
        <span className="relative inline-flex size-2 rounded-full bg-bitcoin-foreground" />
      </span>
      Se Bitcoindata
      <ChartLineUp
        size={16}
        weight="bold"
        aria-hidden
        className="transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}
