"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { categories, type CategorySlug, type Post } from "@/lib/posts";
import { PostCard } from "@/components/blog/post-card";

type FilterSlug = CategorySlug | null;

const FILTERS: { slug: FilterSlug; label: string }[] = [
  { slug: null, label: "Alla" },
  ...(Object.entries(categories) as [
    CategorySlug,
    (typeof categories)[CategorySlug],
  ][]).map(([slug, c]) => ({ slug: slug as FilterSlug, label: c.label })),
];

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FilterSlug>(initialCategory ?? null);
  const deferredQuery = useDeferredValue(query);
  const searching = query.trim().length > 0;

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
          <span className="sr-only">Sök artiklar</span>
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
            placeholder="Sök bland artiklar …"
            className="h-12 w-full rounded-full border border-input bg-background pl-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Rensa sökning"
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={15} weight="bold" aria-hidden />
            </button>
          ) : null}
        </label>

        <nav aria-label="Filtrera artiklar efter kategori">
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
        <section className="mt-12" aria-label="Utvald artikel">
          <PostCard post={featured} featured />
        </section>
      ) : null}

      <section className="mt-12" aria-label="Artiklar">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {searching
              ? "Sökresultat"
              : category
                ? categories[category].label
                : "Fler artiklar"}
          </h2>
          <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            {results.length} {results.length === 1 ? "artikel" : "artiklar"}
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
                ? `Inga träffar för \u201d${query.trim()}\u201d`
                : "Inga artiklar i den här kategorin ännu"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searching
                ? "Prova ett annat sökord eller rensa filtret."
                : "Vi fyller på löpande. Titta gärna i en annan kategori under tiden."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
