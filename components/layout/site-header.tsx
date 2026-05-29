"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, GraduationCap } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <Container as="nav" aria-label="Huvudmeny" className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);

            if (item.highlight) {
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "ml-1 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "border-bitcoin bg-bitcoin text-bitcoin-foreground"
                        : "border-bitcoin/40 bg-bitcoin-muted text-bitcoin hover:border-bitcoin/70",
                    )}
                  >
                    <GraduationCap size={16} weight="fill" aria-hidden />
                    {item.title}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="lg" className="h-10 rounded-full px-5 text-sm">
            <Link href="/data">Se Bitcoindata</Link>
          </Button>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-md text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </Container>

      {open ? (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);

              if (item.highlight) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-base font-semibold transition-colors",
                      active
                        ? "border-bitcoin bg-bitcoin text-bitcoin-foreground"
                        : "border-bitcoin/40 bg-bitcoin-muted text-bitcoin",
                    )}
                  >
                    <GraduationCap size={18} weight="fill" aria-hidden />
                    {item.title}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
            <Button asChild size="lg" className="mt-2 h-11 rounded-full text-sm">
              <Link href="/data" onClick={() => setOpen(false)}>
                Se Bitcoindata
              </Link>
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
