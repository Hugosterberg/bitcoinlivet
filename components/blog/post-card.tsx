import Link from "next/link";
import { ArrowRight, Clock } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/format";
import type { Post } from "@/lib/posts";

export function PostCard({
  post,
  featured = false,
  className,
}: {
  post: Post;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={post.href}
      className={cn(
        "group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Card
        className={cn(
          "flex h-full flex-col p-6 transition-colors group-hover:border-bitcoin/40",
          featured && "lg:p-8",
        )}
      >
        <div className="flex items-center gap-3">
          <Badge variant="bitcoin">{post.categoryLabel}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={13} weight="bold" aria-hidden />
            {post.readingTime} min
          </span>
        </div>

        <h3
          className={cn(
            "mt-4 text-balance font-heading font-semibold tracking-tight text-foreground",
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}
        >
          {post.title}
        </h3>

        <p
          className={cn(
            "mt-3 text-pretty text-muted-foreground",
            featured ? "text-base/7" : "line-clamp-3 text-sm/6",
          )}
        >
          {post.description}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 pt-2">
          <time
            dateTime={post.date}
            className="text-xs text-muted-foreground tabular-nums"
          >
            {formatDateShort(post.date)}
          </time>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin">
            Läs mer
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Card>
    </Link>
  );
}
