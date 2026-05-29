"use client";

import { useState } from "react";
import { Lightning, Copy, Check } from "@phosphor-icons/react";

import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";

/**
 * Optional Lightning tip jar. On-brand and entirely optional: set
 * `siteConfig.lightningAddress` to enable it, otherwise a tasteful
 * placeholder is shown so the section never looks broken.
 */
export function TipJar() {
  const address = siteConfig.lightningAddress;
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable – the address is visible to copy manually.
    }
  }

  return (
    <Card className="relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden
        className="absolute right-[-10%] top-[-50%] h-56 w-56 rounded-full bg-bitcoin/10 blur-[90px]"
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-bitcoin-muted text-bitcoin">
            <Lightning size={20} weight="fill" aria-hidden />
          </span>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Tipsa med Lightning
          </h2>
        </div>

        <p className="max-w-2xl text-base/7 text-muted-foreground">
          Gillar du innehållet? Bitcoinlivet är gratis och reklamfritt. Du kan
          stötta arbetet med en liten slant över Lightning, helt frivilligt.
        </p>

        {address ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 truncate rounded-full border border-border bg-background/60 px-4 py-2.5 font-mono text-sm text-foreground">
              {address}
            </code>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bitcoin px-5 py-2.5 text-sm font-semibold text-bitcoin-foreground transition-opacity hover:opacity-90"
            >
              {copied ? (
                <>
                  <Check size={16} weight="bold" aria-hidden />
                  Kopierad!
                </>
              ) : (
                <>
                  <Copy size={16} weight="bold" aria-hidden />
                  Kopiera adress
                </>
              )}
            </button>
          </div>
        ) : (
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-muted-foreground">
            <Lightning size={15} weight="fill" aria-hidden className="text-bitcoin" />
            Lightning-tips kommer snart.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Frivilligt stöd, ingen motprestation. Detta är inte finansiell
          rådgivning.
        </p>
      </div>
    </Card>
  );
}
