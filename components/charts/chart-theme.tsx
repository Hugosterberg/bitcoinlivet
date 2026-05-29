import type { ReactNode } from "react";

/**
 * Shared chart styling tokens. Values reference CSS custom properties so
 * charts inherit the design system and stay consistent in dark mode.
 */
export const chartColors = {
  bitcoin: "var(--color-chart-1)",
  amber: "var(--color-chart-2)",
  gray: "var(--color-chart-3)",
  grayDeep: "var(--color-chart-4)",
  light: "var(--color-chart-5)",
  grid: "color-mix(in oklch, var(--foreground) 8%, transparent)",
  axis: "var(--color-muted-foreground)",
} as const;

export const axisTick = {
  fill: "var(--color-muted-foreground)",
  fontSize: 12,
} as const;

type TooltipRow = {
  label: string;
  value: string;
  color?: string;
};

/** Styled tooltip container used across charts for a consistent look. */
export function ChartTooltipCard({
  title,
  rows,
}: {
  title?: ReactNode;
  rows: TooltipRow[];
}) {
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      {title ? (
        <p className="mb-1.5 text-xs font-semibold text-foreground">{title}</p>
      ) : null}
      <ul className="space-y-1">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {row.color ? (
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
              ) : null}
              {row.label}
            </span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
