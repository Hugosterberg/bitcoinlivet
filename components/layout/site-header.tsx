"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  X,
  GraduationCap,
  Article,
  GlobeSimple,
  IdentificationBadge,
  Books,
  UserCircle,
  SignIn,
  type Icon,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { mainNav, type NavIconKey } from "@/lib/site";
import { functionMenu } from "@/features/functions/data/functions";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { FeaturesMenu } from "@/components/layout/features-menu";
import { DataCta } from "@/components/layout/data-cta";
import { useAuthUser } from "@/features/auth/components/use-auth-user";

const NAV_ICONS: Record<NavIconKey, Icon> = {
  education: GraduationCap,
  articles: Article,
  news: GlobeSimple,
  about: IdentificationBadge,
  glossary: Books,
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { signedIn } = useAuthUser();

  // Label/icon reflect auth state; both route to /konto (sign in/up or account).
  const accountActive = isActive(pathname, "/konto");
  const accountLabel = signedIn ? "Konto" : "Logga in";
  const AccountIcon = signedIn ? UserCircle : SignIn;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <Container as="nav" aria-label="Huvudmeny" className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.flatMap((item) => {
            const active = isActive(pathname, item.href);
            const NavI = item.icon ? NAV_ICONS[item.icon] : null;

            const node = item.highlight ? (
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
                  {NavI ? <NavI size={16} weight="fill" aria-hidden /> : null}
                  {item.title}
                </Link>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {NavI ? <NavI size={15} weight={active ? "fill" : "regular"} aria-hidden /> : null}
                  {item.title}
                </Link>
              </li>
            );

            // The "Funktioner" mega-menu sits right after Utbildning.
            return item.href === "/utbildning"
              ? [node, <FeaturesMenu key="funktioner" />]
              : [node];
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <DataCta className="gap-1.5 px-3.5 py-2 text-xs xl:gap-2 xl:px-5 xl:py-2.5 xl:text-sm" />
          <span aria-hidden className="h-5 w-px bg-border/70" />
          {signedIn ? (
            <Link
              href="/konto"
              aria-label="Konto"
              aria-current={accountActive ? "page" : undefined}
              className={cn(
                "grid size-9 place-items-center rounded-full transition-colors hover:bg-muted",
                accountActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <UserCircle size={22} weight={accountActive ? "fill" : "regular"} aria-hidden />
            </Link>
          ) : (
            <Link
              href="/konto"
              aria-current={accountActive ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors",
                accountActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Logga in
            </Link>
          )}
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
            {mainNav.flatMap((item) => {
              const active = isActive(pathname, item.href);
              const NavI = item.icon ? NAV_ICONS[item.icon] : null;

              const node = item.highlight ? (
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
                  {NavI ? <NavI size={18} weight="fill" aria-hidden /> : null}
                  {item.title}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {NavI ? <NavI size={18} weight={active ? "fill" : "regular"} aria-hidden /> : null}
                  {item.title}
                </Link>
              );

              if (item.href !== "/utbildning") return [node];

              // "Funktioner" group, listed right after Utbildning.
              return [
                node,
                <div key="funktioner" className="mt-1">
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Funktioner
                  </p>
                  {functionMenu.map((feature) => (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-bitcoin" aria-hidden />
                      {feature.title}
                    </Link>
                  ))}
                </div>,
              ];
            })}
            <Link
              href="/konto"
              aria-current={accountActive ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                accountActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <AccountIcon
                size={18}
                weight={accountActive || signedIn ? "fill" : "regular"}
                aria-hidden
              />
              {accountLabel}
            </Link>
            <DataCta className="mt-2 h-11 w-full" onClick={() => setOpen(false)} />
          </Container>
        </div>
      ) : null}
    </header>
  );
}
