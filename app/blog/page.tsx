import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Disclaimer } from "@/components/ui/disclaimer";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import {
  categories,
  getAllPosts,
  getFeaturedPost,
  type CategorySlug,
} from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blogg",
  description:
    "Guider och artiklar om Bitcoin, sparande, inflation och köpkraft, skrivna lugnt och på svenska.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blogg · Bitcoinlivet",
    description:
      "Guider och artiklar om Bitcoin, sparande, inflation och köpkraft.",
    url: "/blog",
    type: "website",
  },
};

function isCategory(value: string | undefined): value is CategorySlug {
  return !!value && value in categories;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const active = isCategory(kategori) ? kategori : undefined;

  const allPosts = getAllPosts();
  const featured = getFeaturedPost();

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Blogg
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Förstå Bitcoin och din ekonomi
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Tydliga guider om Bitcoin, sparande, inflation och köpkraft. Sök
            eller välj ett ämne nedan.
          </p>
        </header>

        <div className="mt-10">
          <BlogExplorer
            posts={allPosts}
            featured={featured}
            initialCategory={active}
          />
        </div>

        <Disclaimer className="mt-14 max-w-2xl">
          Allt innehåll är i utbildande syfte. Detta är inte finansiell
          rådgivning.
        </Disclaimer>
      </Container>
    </div>
  );
}
