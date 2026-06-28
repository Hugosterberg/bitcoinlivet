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
  /** Message key under the `nav` namespace. */
  key: string;
  /** Canonical (sv) href; the i18n Link maps it to the active locale path. */
  href: string;
  /** Optional description message key under the `nav` namespace. */
  descKey?: string;
  /** Small icon shown next to the title in the navigation. */
  icon?: NavIconKey;
  /** Render with extra emphasis in the navigation. */
  highlight?: boolean;
};

export const mainNav: NavItem[] = [
  { key: "education", href: "/utbildning", descKey: "educationDesc", icon: "education", highlight: true },
  // (The "Funktioner" mega-menu is injected here in the header.)
  { key: "articles", href: "/artiklar", descKey: "articlesDesc", icon: "articles" },
  { key: "news", href: "/nyheter", descKey: "newsDesc", icon: "news" },
  { key: "about", href: "/om", descKey: "aboutDesc", icon: "about" },
  { key: "glossary", href: "/ordlista", descKey: "glossaryDesc", icon: "glossary" },
];

export type FooterItem = { key: string; href: string };

export const footerNav: { titleKey: string; items: FooterItem[] }[] = [
  {
    titleKey: "explore",
    items: [
      { key: "home", href: "/" },
      { key: "news", href: "/nyheter" },
      { key: "articles", href: "/artiklar" },
      { key: "data", href: "/data" },
      { key: "about", href: "/om" },
    ],
  },
  {
    titleKey: "learn",
    items: [
      { key: "education", href: "/utbildning" },
      { key: "glossary", href: "/ordlista" },
      { key: "halving", href: "/halvering" },
      { key: "beginnerGuides", href: "/artiklar?kategori=nyborjarguider" },
      { key: "saving", href: "/artiklar?kategori=sparande" },
    ],
  },
];
