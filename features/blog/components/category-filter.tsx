import Link from "next/link";

import { cn } from "@/lib/utils";
import { categories, type CategorySlug } from "@/features/blog/data/posts";

export function CategoryFilter({ active }: { active?: CategorySlug }) {
  const items: { slug: CategorySlug | null; label: string }[] = [
    { slug: null, label: "Alla" },
    ...(Object.entries(categories) as [
      CategorySlug,
      (typeof categories)[CategorySlug],
    ][]).map(([slug, c]) => ({ slug, label: c.label })),
  ];

  return (
    <nav aria-label="Filtrera artiklar efter kategori">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = (item.slug ?? null) === (active ?? null);
          const href = item.slug ? `/blog?kategori=${item.slug}` : "/blog";
          return (
            <li key={item.label}>
              <Link
                href={href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-bitcoin/40 bg-bitcoin-muted text-bitcoin"
                    : "border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
