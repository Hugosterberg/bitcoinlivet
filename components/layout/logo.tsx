"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Brand wordmark with the Bitcoin "₿" glyph. Used in header and footer, and
 * acts as the link home. When you're already on the front page, clicking it
 * smooth-scrolls to the top rather than doing nothing.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name}: startsida`}
      onClick={() => {
        if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg bg-bitcoin font-heading text-lg font-bold text-bitcoin-foreground shadow-sm transition-transform group-hover:scale-105"
      >
        ₿
      </span>
      {showWordmark ? (
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          bitcoin<span className="text-bitcoin">livet</span>
        </span>
      ) : null}
    </Link>
  );
}
