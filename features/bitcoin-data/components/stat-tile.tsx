import { wrappable } from "@/lib/format";

/**
 * Small labelled statistic tile used across the data and halving pages:
 * an uppercase label, a prominent value and a muted sub-line.
 */
export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <p className="text-xs font-medium leading-snug text-muted-foreground sm:uppercase sm:tracking-wide">
        {label}
      </p>
      <p className="mt-1.5 font-heading text-xl font-semibold tracking-tight text-foreground tabular-nums [overflow-wrap:anywhere]">
        {wrappable(value)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground [overflow-wrap:anywhere]">
        {wrappable(sub)}
      </p>
    </div>
  );
}
