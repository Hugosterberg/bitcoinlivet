import type { ReactNode } from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { formatPercent, wrappable } from "@/lib/format";

export function MetricCard({
  label,
  value,
  sub,
  change,
  icon,
  className,
  valueClassName,
  locale = "sv",
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  /** 24h change percent. Positive = green tint, negative = destructive. */
  change?: number;
  icon?: ReactNode;
  className?: string;
  /** Override the value typography, e.g. smaller text for long full sums. */
  valueClassName?: string;
  /** Active locale, so the change percent formats correctly (sv/en). */
  locale?: string;
}) {
  const hasChange = typeof change === "number";
  const positive = (change ?? 0) >= 0;

  return (
    <Card className={cn("flex flex-col gap-3 p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon ? <span className="text-bitcoin">{icon}</span> : null}
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "font-heading font-semibold tracking-tight text-foreground tabular-nums [overflow-wrap:anywhere]",
            valueClassName ?? "text-2xl sm:text-3xl",
          )}
        >
          {wrappable(value)}
        </span>
        <div className="flex items-center gap-2">
          {sub ? (
            <span className="text-sm text-muted-foreground tabular-nums [overflow-wrap:anywhere]">
              {typeof sub === "string" ? wrappable(sub) : sub}
            </span>
          ) : null}
          {hasChange ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums",
                positive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {positive ? (
                <TrendUp size={12} weight="bold" aria-hidden />
              ) : (
                <TrendDown size={12} weight="bold" aria-hidden />
              )}
              {formatPercent(change ?? 0, {}, locale)}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
