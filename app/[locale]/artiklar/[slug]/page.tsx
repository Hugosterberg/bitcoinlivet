import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Clock } from "@phosphor-icons/react/dist/ssr";

import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { getSiteConfig } from "@/lib/site";
import { buildAlternates, localizedUrl } from "@/lib/seo";
import { PostCard } from "@/features/blog/components/post-card";
import { formatDate } from "@/lib/format";
import { getAllPosts, getPost, getPostSlugs } from "@/features/blog/data/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const { meta } = post;
  const href = { pathname: "/artiklar/[slug]" as const, params: { slug } };
  return {
    title: meta.title,
    description: meta.description,
    alternates: buildAlternates(locale, href),
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: localizedUrl(locale, href),
      publishedTime: meta.date,
      authors: meta.author ? [meta.author] : undefined,
      section: meta.categoryLabel,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("articles");
  const tFooter = await getTranslations("footer");
  const site = getSiteConfig(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, Content } = post;
  const related = getAllPosts()
    .filter((p) => p.slug !== meta.slug && p.category === meta.category)
    .slice(0, 3);
  const fallback = getAllPosts()
    .filter((p) => p.slug !== meta.slug)
    .slice(0, 3);
  const relatedPosts = (related.length > 0 ? related : fallback).slice(0, 3);

  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/artiklar"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden />
          {t("backToArticles")}
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/artiklar?kategori=${meta.category}`}>
              <Badge variant="bitcoin">{meta.categoryLabel}</Badge>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock size={14} weight="bold" aria-hidden />
              {t("readingTime", { minutes: meta.readingTime })}
            </span>
          </div>

          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-4 text-pretty text-lg/8 text-muted-foreground">
            {meta.description}
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {meta.author ?? site.name}
            </span>
            <span aria-hidden>·</span>
            <time dateTime={meta.date} className="tabular-nums">
              {formatDate(meta.date)}
            </time>
          </div>
        </header>

        <div className="mt-10">
          <Content />
        </div>

        <Disclaimer className="mt-12">{tFooter("notAdvice")}</Disclaimer>
      </Container>

      {relatedPosts.length > 0 ? (
        <Container className="mt-20">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("readMore")}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
