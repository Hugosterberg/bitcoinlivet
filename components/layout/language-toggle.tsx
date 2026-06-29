"use client";

import { useParams } from "next/navigation";
import { GlobeSimple } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { usePathname, getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/site";

/**
 * Switches between the Swedish and English sites.
 *
 * In production each language lives on its own domain, so this links to the
 * OTHER domain's origin + the equivalent localized path (read at click time
 * from the page's own `<link rel="alternate" hreflang>`, which covers dynamic
 * content with per-locale slugs without bundling the content registries).
 *
 * On any non-production host (localhost, Vercel preview, www without a
 * redirect) there is no domain to switch to, so it instead flips the locale
 * in place via next-intl's `NEXT_LOCALE` cookie and navigates to the other
 * locale's path on the same host. This makes the language switch testable
 * before both production domains serve this code.
 */

/** Hosts that map to a locale via domain routing (no protocol). */
const PROD_HOSTS = routing.locales.map((l) => {
  try {
    return new URL(getSiteConfig(l).url).host;
  } catch {
    return "";
  }
});

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("language");

  const other: Locale = locale === "sv" ? "en" : "sv";
  const hasDynamicSegment = Object.keys(params).some((k) => k !== "locale");
  const fallbackPath = hasDynamicSegment
    ? "/"
    : getPathname({ href: pathname as "/", locale: other });
  const fallbackHref = `${getSiteConfig(other).url}${fallbackPath === "/" ? "" : fallbackPath}`;

  const label = other === "en" ? t("switchToEn") : t("switchToSv");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Exact equivalent (incl. localized dynamic slugs) from the page's hreflang.
    const link = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${other}"]`,
    );
    const target = link?.href || e.currentTarget.href;
    const targetUrl = new URL(target, window.location.origin);

    if (PROD_HOSTS.includes(window.location.host)) {
      // Production: navigate cross-domain to the other site.
      if (target !== e.currentTarget.href) {
        e.preventDefault();
        window.location.href = target;
      }
      return;
    }

    // Non-production: stay on this host, flip the locale via cookie.
    e.preventDefault();
    document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
    window.location.href =
      targetUrl.pathname + targetUrl.search + targetUrl.hash;
  }

  return (
    <a
      href={fallbackHref}
      hrefLang={other}
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-xs font-semibold uppercase text-muted-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin",
        className,
      )}
    >
      <GlobeSimple size={15} weight="bold" aria-hidden />
      {other}
    </a>
  );
}
