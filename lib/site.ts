/**
 * Central site configuration. Single source of truth for brand metadata,
 * navigation and external links used across layout, SEO and the sitemap.
 */

export const siteConfig = {
  name: "bitcoinlivet",
  // Short brand tagline (Swedish).
  tagline: "Bitcoin, sparande och sundare pengar, förklarat på svenska.",
  description:
    "bitcoinlivet är en svensk guide till Bitcoin, långsiktigt sparande, inflation och köpkraft. Lugn, datadriven och utbildande, utan hype.",
  // Used for absolute URLs (Open Graph, sitemap). Override via env in prod.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://bitcoinlivet.se",
  locale: "sv_SE",
  // TODO(instagram): keep handle in sync with the live account.
  instagram: "https://instagram.com/bitcoinlivet",
  instagramHandle: "@bitcoinlivet",
  // TODO(lightning): fyll i en Lightning-adress (t.ex. namn@walletofsatoshi.com)
  // för att aktivera tipsknappen. Lämna tom för att visa platshållaren.
  lightningAddress: "",
} as const;

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
