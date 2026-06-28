"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { getCategories, type CategorySlug, type Post } from "@/features/blog/data/posts";
import { PostCard } from "@/features/blog/components/post-card";

type FilterSlug = CategorySlug | null;

function matches(post: Post, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    post.title.toLowerCase().includes(q) ||
    post.description.toLowerCase().includes(q) ||
    post.categoryLabel.toLowerCase().includes(q)
  );
}

export function BlogExplorer({
  posts,
  featured,
  initialCategory,
}: {
  posts: Post[];
  featured: Post;
  initialCategory?: CategorySlug;
}) {
  const t = useTranslations("blogExplorer");
  const locale = useLocale() as Locale;
  const categories = getCategories(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterSlug>(initialCategory ?? null);
  const deferredQuery = useDeferredValue(query);
  const searching = query.trim().length > 0;

  const FILTERS: { slug: FilterSlug; label: string }[] = [
    { slug: null, label: t("all") },
    ...(Object.entries(categories) as [CategorySlug, { label: string; description: string }][]).map(
      ([slug, c]) => ({ slug: slug as FilterSlug, label: c.label }),
    ),
  ];

  const results = useMemo(() => {
    return posts.filter(
      (p) => (category ? p.category === category : true) && matches(p, deferredQuery),
    );
  }, [posts, category, deferredQuery]);

  // The featured card only headlines the default, unfiltered view.
  const showFeatured = !searching && category === null;
  const grid = showFeatured
    ? results.filter((p) => p.slug !== featured.slug)
    : results;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <label className="relative block">
          <span className="sr-only">{t("searchLabel")}</span>
          <MagnifyingGlass
            size={18}
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-12 w-full rounded-full border border-input bg-background pl-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("clearSearch")}
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={15} weight="bold" aria-hidden />
            </button>
          ) : null}
        </label>

        <nav aria-label={t("filterByCategory")}>
          <ul className="flex flex-wrap gap-2">
            {FILTERS.map((item) => {
              const isActive = (item.slug ?? null) === (category ?? null);
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setCategory(item.slug)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-bitcoin/40 bg-bitcoin-muted text-bitcoin"
                        : "border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {showFeatured ? (
        <section className="mt-12" aria-label={t("featuredLabel")}>
          <PostCard post={featured} featured />
        </section>
      ) : null}

      <section className="mt-12" aria-label={t("articlesLabel")}>
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {searching
              ? t("searchResults")
              : category
                ? categories[category].label
                : t("moreArticles")}
          </h2>
          <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            {t("count", { count: results.length })}
          </span>
        </div>

        {grid.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">
              {searching
                ? t("noHitsSearch", { query: query.trim() })
                : t("noHitsCategory")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searching ? t("tryAnotherSearch") : t("tryAnotherCategory")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
