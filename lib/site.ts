/**
 * Central site configuration. Single source of truth for brand metadata,
 * navigation and external links used across layout, SEO and the sitemap.
 *
 * The brand is locale-derived: the Swedish site is "bitcoinlivet" on
 * bitcoinlivet.se, the English site is "bitcoinerlife" on bitcoinerlife.xyz.
 * Use `getSiteConfig(locale)` in locale-aware code; `siteConfig` is a Swedish
 * back-compat alias for call sites not yet localized.
 */

import type { Locale } from "@/i18n/routing";

export type SiteConfig = {
  name: string;
  /** Short brand tagline. */
  tagline: string;
  description: string;
  /** Absolute base URL (Open Graph, sitemap, canonical). */
  url: string;
  /** Open Graph locale, e.g. "sv_SE". */
  ogLocale: string;
  /** `<html lang>` value, e.g. "sv". */
  htmlLang: string;
  instagram: string;
  instagramHandle: string;
  /** Lightning address for the tip button; empty hides it. */
  lightningAddress: string;
};

const stripSlash = (url: string) => url.replace(/\/$/, "");

const SITE: Record<Locale, SiteConfig> = {
  sv: {
    name: "bitcoinlivet",
    tagline: "Bitcoin, sparande och sundare pengar, förklarat på svenska.",
    description:
      "bitcoinlivet är en svensk guide till Bitcoin, långsiktigt sparande, inflation och köpkraft. Lugn, datadriven och utbildande, utan hype.",
    url: stripSlash(
      process.env.NEXT_PUBLIC_SITE_URL_SV ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "https://bitcoinlivet.se",
    ),
    ogLocale: "sv_SE",
    htmlLang: "sv",
    instagram: "https://instagram.com/bitcoinlivet",
    instagramHandle: "@bitcoinlivet",
    lightningAddress: "",
  },
  en: {
    name: "bitcoinerlife",
    tagline: "Bitcoin, saving and sounder money, explained.",
    description:
      "bitcoinerlife is a calm, data-driven guide to Bitcoin, long-term saving, inflation and purchasing power. Educational, without the hype.",
    url: stripSlash(
      process.env.NEXT_PUBLIC_SITE_URL_EN ?? "https://bitcoinerlife.xyz",
    ),
    ogLocale: "en_US",
    htmlLang: "en",
    instagram: "https://instagram.com/bitcoinerlife",
    instagramHandle: "@bitcoinerlife",
    lightningAddress: "",
  },
};

export function getSiteConfig(locale: Locale): SiteConfig {
  return SITE[locale];
}

/** Swedish back-compat alias for call sites not yet localized. */
export const siteConfig = SITE.sv;

/** Navigation icon key, mapped to a Phosphor icon in
 *  components/layout/site-header.tsx. */
export type NavIconKey =
  | "education"
  | "articles"
  | "news"
  | "about"
  | "glossary";

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  /** Small icon shown next to the title in the navigation. */
  icon?: NavIconKey;
  /** Render with extra emphasis in the navigation. */
  highlight?: boolean;
};

export const mainNav: NavItem[] = [
  {
    title: "Utbildning",
    href: "/utbildning",
    description: "Interaktiv Bitcoinskola",
    icon: "education",
    highlight: true,
  },
  // (The "Funktioner" mega-menu is injected here in the header.)
  { title: "Artiklar", href: "/artiklar", description: "Guider och artiklar", icon: "articles" },
  { title: "Nyheter", href: "/nyheter", description: "Veckans Bitcoinnyheter", icon: "news" },
  { title: "Om", href: "/om", description: "Om bitcoinlivet", icon: "about" },
  { title: "Ordlista", href: "/ordlista", description: "Bitcoinbegrepp förklarade", icon: "glossary" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Utforska",
    items: [
      { title: "Hem", href: "/" },
      { title: "Nyheter", href: "/nyheter" },
      { title: "Artiklar", href: "/artiklar" },
      { title: "Bitcoindata", href: "/data" },
      { title: "Om bitcoinlivet", href: "/om" },
    ],
  },
  {
    title: "Lär dig",
    items: [
      { title: "Bitcoinskolan", href: "/utbildning" },
      { title: "Ordlista", href: "/ordlista" },
      { title: "Halveringen", href: "/halvering" },
      { title: "Nybörjarguider", href: "/artiklar?kategori=nyborjarguider" },
      { title: "Sparande", href: "/artiklar?kategori=sparande" },
    ],
  },
];
