import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { PostCard } from "@/components/blog/post-card";
import { formatDate } from "@/lib/format";
import { getAllPosts, getPost, getPostSlugs } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.href },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: meta.href,
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} weight="bold" aria-hidden />
          Tillbaka till bloggen
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/blog?kategori=${meta.category}`}>
              <Badge variant="bitcoin">{meta.categoryLabel}</Badge>
            </Link>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock size={14} weight="bold" aria-hidden />
              {meta.readingTime} min läsning
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
              {meta.author ?? "Bitcoinlivet"}
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

        <Disclaimer className="mt-12" />
      </Container>

      {relatedPosts.length > 0 ? (
        <Container className="mt-20">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Läs vidare
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
