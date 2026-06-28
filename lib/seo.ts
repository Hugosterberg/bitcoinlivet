import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteConfig } from "@/lib/site";

/** A locale-aware href, as accepted by next-intl's `getPathname`. */
type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute URL for `href` on `locale`'s domain, with its localized path. */
export function localizedUrl(locale: Locale, href: Href): string {
  return getSiteConfig(locale).url + getPathname({ locale, href });
}

/**
 * Builds `alternates` for a page: a self-referencing canonical on the current
 * domain (with the locale-correct path) plus cross-domain `hreflang` links to
 * every locale and an `x-default`. Use in every `generateMetadata` so the en
 * domain points at `/news` rather than the sv `/nyheter`.
 */
export function buildAlternates(
  locale: Locale,
  href: Href,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localizedUrl(l, href);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, href);

  return {
    canonical: localizedUrl(locale, href),
    languages,
  };
}

/**
 * Like {@link buildAlternates} but for dynamic content whose slug is localized
 * (differs per locale). Pass the route's pathname template and the slug for
 * every locale, resolved from the content's stable id.
 */
export function buildSlugAlternates(
  locale: Locale,
  pathname: "/funktioner/[slug]" | "/artiklar/[slug]",
  slugs: Record<Locale, string>,
): NonNullable<Metadata["alternates"]> {
  const url = (l: Locale) =>
    localizedUrl(l, { pathname, params: { slug: slugs[l] } });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = url(l);
  languages["x-default"] = url(routing.defaultLocale);

  return { canonical: url(locale), languages };
}

/** Alternates for a course module page (`/utbildning/[modul]`). */
export function buildModuleAlternates(
  locale: Locale,
  slugs: Record<Locale, string>,
): NonNullable<Metadata["alternates"]> {
  const url = (l: Locale) =>
    localizedUrl(l, { pathname: "/utbildning/[modul]", params: { modul: slugs[l] } });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = url(l);
  languages["x-default"] = url(routing.defaultLocale);

  return { canonical: url(locale), languages };
}

/** Alternates for a course lesson page (`/utbildning/[modul]/[lektion]`). */
export function buildLessonAlternates(
  locale: Locale,
  slugs: Record<Locale, { modul: string; lektion: string }>,
): NonNullable<Metadata["alternates"]> {
  const url = (l: Locale) =>
    localizedUrl(l, { pathname: "/utbildning/[modul]/[lektion]", params: slugs[l] });

  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = url(l);
  languages["x-default"] = url(routing.defaultLocale);

  return { canonical: url(locale), languages };
}
