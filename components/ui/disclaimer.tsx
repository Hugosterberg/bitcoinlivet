import { Info } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

/**
 * Standard "not financial advice" notice. Brand requires this where relevant.
 */
export function Disclaimer({
  className,
  children,
}: {
  className?: string;
  /** Localized notice text — always pass it from the caller's messages. */
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground",
        className,
      )}
    >
      <Info
        size={18}
        weight="bold"
        aria-hidden
        className="mt-0.5 shrink-0 text-bitcoin"
      />
      <span>{children}</span>
    </p>
  );
}
