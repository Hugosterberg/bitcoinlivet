/**
 * Central site configuration. Single source of truth for brand metadata,
 * navigation and external links used across layout, SEO and the sitemap.
 */

export const siteConfig = {
  name: "Bitcoinlivet",
  // Short brand tagline (Swedish).
  tagline: "Bitcoin, sparande och sundare pengar, förklarat på svenska.",
  description:
    "Bitcoinlivet är en svensk guide till Bitcoin, långsiktigt sparande, inflation och köpkraft. Lugn, datadriven och utbildande, utan hype.",
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

export type NavItem = {
  title: string;
  href: string;
  description?: string;
  /** Render with extra emphasis in the navigation. */
  highlight?: boolean;
};

export const mainNav: NavItem[] = [
  { title: "Hem", href: "/" },
  {
    title: "Utbildning",
    href: "/utbildning",
    description: "Interaktiv Bitcoinskola",
    highlight: true,
  },
  { title: "Ordlista", href: "/ordlista", description: "Bitcoinbegrepp förklarade" },
  { title: "Blogg", href: "/blog", description: "Guider och artiklar" },
  { title: "Data", href: "/data", description: "Bitcoin dashboard" },
  { title: "Halveringen", href: "/halvering", description: "Nedräkning, block & historik" },
  { title: "Bitcoin idag", href: "/bitcoin-idag", description: "Dagens läge & rubriker" },
  { title: "Om", href: "/om", description: "Om Bitcoinlivet" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Utforska",
    items: [
      { title: "Hem", href: "/" },
      { title: "Bitcoin idag", href: "/bitcoin-idag" },
      { title: "Blogg", href: "/blog" },
      { title: "Bitcoindata", href: "/data" },
      { title: "Om Bitcoinlivet", href: "/om" },
    ],
  },
  {
    title: "Lär dig",
    items: [
      { title: "Bitcoinskolan", href: "/utbildning" },
      { title: "Ordlista", href: "/ordlista" },
      { title: "Halveringen", href: "/halvering" },
      { title: "Nybörjarguider", href: "/blog?kategori=nyborjarguider" },
      { title: "Sparande", href: "/blog?kategori=sparande" },
    ],
  },
];
