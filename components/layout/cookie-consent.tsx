"use client";

import { Cookie } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useConsent, setConsent } from "@/components/layout/consent-store";

/**
 * Minimalist, on-brand cookie-consent banner. Shown until the visitor makes a
 * choice; gates the optional analytics (GA4 + Clarity). Cookieless Vercel
 * Analytics is unaffected.
 */
export function CookieConsent() {
  const { consent, hydrated } = useConsent();

  // Only render once hydrated and while the choice is still undecided, so it
  // never flashes for returning visitors or causes hydration mismatches.
  if (!hydrated || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-samtycke"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md duration-500 animate-in fade-in slide-in-from-bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-graphite/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-bitcoin/15 blur-3xl"
        />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-bitcoin-muted text-bitcoin">
              <Cookie size={18} weight="fill" aria-hidden />
            </span>
            <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
              Cookies för analys
            </h2>
          </div>

          <p className="mt-3 text-sm/6 text-muted-foreground">
            Här används anonym statistik för att förstå hur sidan används och göra
            den bättre. Du väljer själv, det påverkar inte innehållet.
          </p>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              onClick={() => setConsent("granted")}
              className="h-9 flex-1 rounded-full text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-bitcoin/30"
            >
              Acceptera
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConsent("denied")}
              className="h-9 flex-1 rounded-full text-sm"
            >
              Avböj
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
