import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { BlogExplorer } from "@/features/blog/components/blog-explorer";
import {
  categories,
  getAllPosts,
  getFeaturedPost,
  type CategorySlug,
} from "@/features/blog/data/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  const site = getSiteConfig(locale);
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/artiklar" },
    openGraph: {
      title: `${t("ogTitle")} · ${site.name}`,
      description: t("ogDesc"),
      url: "/artiklar",
      type: "website",
    },
  };
}

function isCategory(value: string | undefined): value is CategorySlug {
  return !!value && value in categories;
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");

  const { kategori } = await searchParams;
  const active = isCategory(kategori) ? kategori : undefined;

  const allPosts = getAllPosts();
  const featured = getFeaturedPost();

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            {t("lead")}
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
          {t("disclaimer")}
        </Disclaimer>
      </Container>
    </div>
  );
}
