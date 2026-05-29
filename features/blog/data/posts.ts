import type { ComponentType } from "react";

import * as vadArBitcoin from "@/content/blog/vad-ar-bitcoin.mdx";
import * as kommaIgangSpara from "@/content/blog/komma-igang-spara-bitcoin.mdx";
import * as inflationKopkraft from "@/content/blog/inflation-och-kopkraft.mdx";
import * as kopkraftForklarat from "@/content/blog/kopkraft-forklarat.mdx";
import * as bitcoinSundaPengar from "@/content/blog/bitcoin-sunda-pengar.mdx";
import * as makroForNyfikna from "@/content/blog/makroekonomi-for-nyfikna.mdx";

/**
 * Blog categories. Slugs are stable and used in URLs (?kategori=...).
 */
export const categories = {
  nyborjarguider: {
    label: "Nybörjarguider",
    description: "Börja från noll, tryggt och i din egen takt.",
  },
  bitcoin: {
    label: "Bitcoin",
    description: "Hur Bitcoin fungerar och varför det är annorlunda.",
  },
  sparande: {
    label: "Sparande",
    description: "Långsiktigt sparande och sunda vanor.",
  },
  inflation: {
    label: "Inflation",
    description: "Varför pengar tappar värde över tid.",
  },
  kopkraft: {
    label: "Köpkraft",
    description: "Vad dina pengar faktiskt räcker till.",
  },
  makroekonomi: {
    label: "Makroekonomi",
    description: "Pengar, räntor och de stora penseldragen.",
  },
} as const;

export type CategorySlug = keyof typeof categories;

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
  slug: string;
  href: string;
  categoryLabel: string;
};

type MdxModule = {
  metadata: PostFrontmatter;
  default: ComponentType;
};

const registry: Record<string, MdxModule> = {
  "vad-ar-bitcoin": vadArBitcoin as unknown as MdxModule,
  "komma-igang-spara-bitcoin": kommaIgangSpara as unknown as MdxModule,
  "inflation-och-kopkraft": inflationKopkraft as unknown as MdxModule,
  "kopkraft-forklarat": kopkraftForklarat as unknown as MdxModule,
  "bitcoin-sunda-pengar": bitcoinSundaPengar as unknown as MdxModule,
  "makroekonomi-for-nyfikna": makroForNyfikna as unknown as MdxModule,
};

function toPost(slug: string, meta: PostFrontmatter): Post {
  return {
    ...meta,
    slug,
    href: `/artiklar/${slug}`,
    categoryLabel: categories[meta.category]?.label ?? meta.category,
  };
}

export function getAllPosts(): Post[] {
  return Object.entries(registry)
    .map(([slug, mod]) => toPost(slug, mod.metadata))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  return Object.keys(registry);
}

export function getPost(
  slug: string,
): { meta: Post; Content: ComponentType } | null {
  const mod = registry[slug];
  if (!mod) return null;
  return { meta: toPost(slug, mod.metadata), Content: mod.default };
}

export function getFeaturedPost(): Post {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}
