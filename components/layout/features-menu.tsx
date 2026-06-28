"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { SquaresFour, CaretDown, ArrowRight } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFunctionMenu } from "@/features/functions/data/functions";
import { FunctionIcon } from "@/features/functions/components/function-icon";

/**
 * Desktop "Funktioner" mega-menu. Opens on hover and on click/keyboard, and
 * surfaces Bitcoin's key properties as a grid of links. The panel spans the
 * header width — it is positioned against the sticky <header>, which is the
 * nearest positioned ancestor.
 */
export function FeaturesMenu() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const functionMenu = getFunctionMenu(locale);
  const t = useTranslations("header");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on navigation by reacting to the changed pathname during render
  // (preferred over an effect for resetting state when a prop changes).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Highlight the trigger while on any destination reachable from the menu.
  const active = functionMenu.some(
    (f) => pathname === f.href || pathname.startsWith(`${f.href.split("#")[0]}/`),
  );

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  // Small delay on mouse-leave so brief gaps don't snap the panel shut.
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <li
      className="static"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active || open
            ? "text-bitcoin"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <SquaresFour size={16} weight={active || open ? "fill" : "regular"} aria-hidden />
        {t("features")}
        <CaretDown
          size={12}
          weight="bold"
          aria-hidden
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          className="absolute inset-x-0 top-full border-b border-border bg-background/95 backdrop-blur-md"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
              {functionMenu.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  onClick={() => setOpen(false)}
                  className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-bitcoin-muted text-bitcoin transition-colors group-hover:bg-bitcoin group-hover:text-bitcoin-foreground">
                    <FunctionIcon icon={feature.icon} size={18} weight="bold" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {feature.title}
                    </span>
                    <span className="mt-0.5 block text-xs/5 text-muted-foreground">
                      {feature.description}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-border/60 pt-4">
              <Link
                href={getPathname({ locale, href: "/utbildning" })}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-bitcoin transition-colors hover:text-bitcoin/80"
              >
                {tc("featuresLearnMore")}
                <ArrowRight size={15} weight="bold" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
