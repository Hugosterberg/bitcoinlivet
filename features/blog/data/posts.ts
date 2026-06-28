import type { ComponentType } from "react";

import * as vadArBitcoin from "@/content/blog/vad-ar-bitcoin.mdx";
import * as kommaIgangSpara from "@/content/blog/komma-igang-spara-bitcoin.mdx";
import * as inflationKopkraft from "@/content/blog/inflation-och-kopkraft.mdx";
import * as kopkraftForklarat from "@/content/blog/kopkraft-forklarat.mdx";
import * as bitcoinSundaPengar from "@/content/blog/bitcoin-sunda-pengar.mdx";
import * as makroForNyfikna from "@/content/blog/makroekonomi-for-nyfikna.mdx";

import * as whatIsBitcoin from "@/content/blog/en/what-is-bitcoin.mdx";
import * as startSaving from "@/content/blog/en/start-saving-in-bitcoin.mdx";
import * as inflationPurchasing from "@/content/blog/en/inflation-and-purchasing-power.mdx";
import * as purchasingPower from "@/content/blog/en/purchasing-power-explained.mdx";
import * as bitcoinSoundMoney from "@/content/blog/en/bitcoin-sound-money.mdx";
import * as macroCurious from "@/content/blog/en/macroeconomics-for-the-curious.mdx";

import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Blog categories. Keys are stable and shared across locales (used in the
 * ?kategori= query); only the label and description are localized.
 */
export const categorySlugs = [
  "nyborjarguider",
  "bitcoin",
  "sparande",
  "inflation",
  "kopkraft",
  "makroekonomi",
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

type CategoryMeta = { label: string; description: string };

const categoriesByLocale: Record<Locale, Record<CategorySlug, CategoryMeta>> = {
  sv: {
    nyborjarguider: { label: "Nybörjarguider", description: "Börja från noll, tryggt och i din egen takt." },
    bitcoin: { label: "Bitcoin", description: "Hur Bitcoin fungerar och varför det är annorlunda." },
    sparande: { label: "Sparande", description: "Långsiktigt sparande och sunda vanor." },
    inflation: { label: "Inflation", description: "Varför pengar tappar värde över tid." },
    kopkraft: { label: "Köpkraft", description: "Vad dina pengar faktiskt räcker till." },
    makroekonomi: { label: "Makroekonomi", description: "Pengar, räntor och de stora penseldragen." },
  },
  en: {
    nyborjarguider: { label: "Beginner guides", description: "Start from zero, safely and at your own pace." },
    bitcoin: { label: "Bitcoin", description: "How Bitcoin works and why it's different." },
    sparande: { label: "Saving", description: "Long-term saving and sound habits." },
    inflation: { label: "Inflation", description: "Why money loses value over time." },
    kopkraft: { label: "Purchasing power", description: "What your money actually buys." },
    makroekonomi: { label: "Macroeconomics", description: "Money, interest rates and the big strokes." },
  },
};

export function getCategories(locale: Locale): Record<CategorySlug, CategoryMeta> {
  return categoriesByLocale[locale];
}

export function isCategory(value: string | undefined): value is CategorySlug {
  return !!value && (categorySlugs as readonly string[]).includes(value);
}

export type PostFrontmatter = {
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-05-20". */
  date: string;
  category: CategorySlug;
  /** Estimated reading time in minutes. */
  readingTime: number;
  featured?: boolean;
  author?: string;
};

export type Post = PostFrontmatter & {
  /** Stable, locale-agnostic id (shared across locales). */
  id: string;
  slug: string;
  href: string;
  categoryLabel: string;
};

type MdxModule = {
  metadata: PostFrontmatter;
  default: ComponentType;
};

type Entry = { slug: string; mod: MdxModule };

/** Posts keyed by locale, then by stable id; each carries its localized slug. */
const postsByLocale: Record<Locale, Record<string, Entry>> = {
  sv: {
    "what-is-bitcoin": { slug: "vad-ar-bitcoin", mod: vadArBitcoin as unknown as MdxModule },
    "start-saving-in-bitcoin": { slug: "komma-igang-spara-bitcoin", mod: kommaIgangSpara as unknown as MdxModule },
    "inflation-and-purchasing-power": { slug: "inflation-och-kopkraft", mod: inflationKopkraft as unknown as MdxModule },
    "purchasing-power-explained": { slug: "kopkraft-forklarat", mod: kopkraftForklarat as unknown as MdxModule },
    "bitcoin-sound-money": { slug: "bitcoin-sunda-pengar", mod: bitcoinSundaPengar as unknown as MdxModule },
    "macroeconomics-for-the-curious": { slug: "makroekonomi-for-nyfikna", mod: makroForNyfikna as unknown as MdxModule },
  },
  en: {
    "what-is-bitcoin": { slug: "what-is-bitcoin", mod: whatIsBitcoin as unknown as MdxModule },
    "start-saving-in-bitcoin": { slug: "start-saving-in-bitcoin", mod: startSaving as unknown as MdxModule },
    "inflation-and-purchasing-power": { slug: "inflation-and-purchasing-power", mod: inflationPurchasing as unknown as MdxModule },
    "purchasing-power-explained": { slug: "purchasing-power-explained", mod: purchasingPower as unknown as MdxModule },
    "bitcoin-sound-money": { slug: "bitcoin-sound-money", mod: bitcoinSoundMoney as unknown as MdxModule },
    "macroeconomics-for-the-curious": { slug: "macroeconomics-for-the-curious", mod: macroCurious as unknown as MdxModule },
  },
};

function toPost(locale: Locale, id: string, entry: Entry): Post {
  const meta = entry.mod.metadata;
  return {
    ...meta,
    id,
    slug: entry.slug,
    href: getPathname({
      locale,
      href: { pathname: "/artiklar/[slug]", params: { slug: entry.slug } },
    }),
    categoryLabel: getCategories(locale)[meta.category]?.label ?? meta.category,
  };
}

export function getAllPosts(locale: Locale): Post[] {
  return Object.entries(postsByLocale[locale])
    .map(([id, entry]) => toPost(locale, id, entry))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(locale: Locale): string[] {
  return Object.values(postsByLocale[locale]).map((e) => e.slug);
}

export function getPost(
  locale: Locale,
  slug: string,
): { meta: Post; Content: ComponentType } | null {
  const found = Object.entries(postsByLocale[locale]).find(
    ([, entry]) => entry.slug === slug,
  );
  if (!found) return null;
  const [id, entry] = found;
  return { meta: toPost(locale, id, entry), Content: entry.mod.default };
}

export function getFeaturedPost(locale: Locale): Post {
  const posts = getAllPosts(locale);
  return posts.find((p) => p.featured) ?? posts[0];
}

/** Maps a post's stable id to its slug in every locale, for hreflang. */
export function getPostSlugsById(id: string): Record<Locale, string> {
  const slugs = {} as Record<Locale, string>;
  for (const locale of routing.locales) {
    const entry = postsByLocale[locale][id];
    if (entry) slugs[locale] = entry.slug;
  }
  return slugs;
}
