import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Compact stat with icon: stacks vertically on narrow screens so labels like
 * "dagar i rad" are never truncated; switches to a horizontal row from sm up.
 */
export function IconStat({
  icon,
  value,
  label,
  className,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border border-border bg-background/40 px-2 py-3 text-center sm:flex-row sm:items-center sm:gap-3 sm:p-3 sm:text-left",
        className,
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bitcoin-muted text-bitcoin sm:size-9">
        {icon}
      </span>
      <div className="min-w-0 w-full sm:w-auto">
        <p className="font-heading text-base font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-lg">
          {value}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
}
