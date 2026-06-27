import { defineRouting } from "next-intl/routing";

/**
 * Locale + domain routing.
 *
 * Each language lives on its own domain and is served at the root (no `/en`
 * prefix). The active locale is derived from the request Host:
 *   - bitcoinlivet.se   → sv (Swedish)
 *   - bitcoinerlife.xyz → en (English)
 *
 * `pathnames` translates the STATIC URL segments per locale. Dynamic segment
 * values (course slugs, blog slugs) are resolved by the content layer.
 *
 * In local dev neither production domain exists, so the middleware falls back
 * to `defaultLocale` (sv). Set NEXT_PUBLIC_DEV_LOCALE=en to preview English.
 */
export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localePrefix: "never",
  domains: [
    { domain: "bitcoinlivet.se", defaultLocale: "sv", locales: ["sv"] },
    { domain: "bitcoinerlife.xyz", defaultLocale: "en", locales: ["en"] },
  ],
  pathnames: {
    "/": "/",
    "/artiklar": { sv: "/artiklar", en: "/articles" },
    "/artiklar/[slug]": { sv: "/artiklar/[slug]", en: "/articles/[slug]" },
    "/utbildning": { sv: "/utbildning", en: "/learn" },
    "/utbildning/[modul]": { sv: "/utbildning/[modul]", en: "/learn/[modul]" },
    "/utbildning/[modul]/[lektion]": {
      sv: "/utbildning/[modul]/[lektion]",
      en: "/learn/[modul]/[lektion]",
    },
    "/funktioner": { sv: "/funktioner", en: "/features" },
    "/funktioner/[slug]": { sv: "/funktioner/[slug]", en: "/features/[slug]" },
    "/halvering": { sv: "/halvering", en: "/halving" },
    "/ordlista": { sv: "/ordlista", en: "/glossary" },
    "/om": { sv: "/om", en: "/about" },
    "/data": "/data",
    "/nyheter": { sv: "/nyheter", en: "/news" },
    "/konto": { sv: "/konto", en: "/account" },
    "/aterstall": { sv: "/aterstall", en: "/reset" },
    "/integritetspolicy": { sv: "/integritetspolicy", en: "/privacy" },
  },
});

export type Locale = (typeof routing.locales)[number];
