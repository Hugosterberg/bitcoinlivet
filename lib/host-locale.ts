import { headers } from "next/headers";

import { routing, type Locale } from "@/i18n/routing";

/**
 * Resolves the active locale from the request `Host` header, for metadata
 * routes (sitemap, robots, manifest) that live outside `[locale]` and so don't
 * receive a locale param. Mirrors the domain table in {@link routing}:
 *   - bitcoinlivet.se   → sv
 *   - bitcoinerlife.xyz → en
 *
 * In local dev neither production domain exists, so it falls back to
 * `NEXT_PUBLIC_DEV_LOCALE` (if set to a known locale) or `defaultLocale`.
 */
export async function getHostLocale(): Promise<Locale> {
  const host = (await headers()).get("host")?.toLowerCase() ?? "";
  const hostname = host.split(":")[0];

  const match = routing.domains?.find(
    (d) => hostname === d.domain || hostname.endsWith(`.${d.domain}`),
  );
  if (match) return match.defaultLocale as Locale;

  const dev = process.env.NEXT_PUBLIC_DEV_LOCALE;
  return dev && routing.locales.includes(dev as Locale)
    ? (dev as Locale)
    : routing.defaultLocale;
}
