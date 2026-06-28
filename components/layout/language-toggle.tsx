"use client";

import { useParams } from "next/navigation";
import { GlobeSimple } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { usePathname, getPathname } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/site";

/**
 * Switches between the Swedish and English sites. Because each language lives
 * on its own domain, this links to the OTHER domain's origin + the equivalent
 * localized path.
 *
 * Static routes map cleanly via next-intl's `getPathname`. Dynamic content
 * routes (course lessons, articles) use slugs that differ per locale and can't
 * be mapped without the content registry, so they fall back to the other
 * domain's home.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("language");

  const other: Locale = locale === "sv" ? "en" : "sv";
  const hasDynamicSegment = Object.keys(params).some((k) => k !== "locale");
  // Only called for static routes (dynamic ones fall back to home), so the
  // pathname is a static one — cast to satisfy getPathname's typed href.
  const otherPath = hasDynamicSegment
    ? "/"
    : getPathname({ href: pathname as "/", locale: other });
  const href = `${getSiteConfig(other).url}${otherPath === "/" ? "" : otherPath}`;
  const label = other === "en" ? t("switchToEn") : t("switchToSv");

  return (
    <a
      href={href}
      hrefLang={other}
      aria-label={label}
      title={label}
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
