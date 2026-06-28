"use client";

import { useParams } from "next/navigation";
import { GlobeSimple } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { usePathname, getPathname } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/site";

/**
 * Switches between the Swedish and English sites. Each language lives on its own
 * domain, so this links to the OTHER domain's origin + the equivalent localized
 * path.
 *
 * The `href` is an SSR-safe fallback (static routes map cleanly via
 * `getPathname`; dynamic ones point at the other domain's home). On click, we
 * upgrade to the page's own `<link rel="alternate" hreflang>` target, which is
 * the exact equivalent — including dynamic content with per-locale slugs
 * (articles, functions, course lessons). Reading it from the DOM keeps the
 * toggle correct everywhere without pulling the content registries into the
 * client bundle.
 */
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
    const link = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${other}"]`,
    );
    if (link?.href && link.href !== e.currentTarget.href) {
      e.preventDefault();
      window.location.href = link.href;
    }
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
