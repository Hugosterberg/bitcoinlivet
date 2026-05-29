import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/blog/components/post-card";
import { getAllPosts } from "@/features/blog/data/posts";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <Section className="border-t border-border bg-graphite/30">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Från artiklarna"
          title="Senaste artiklarna"
          description="Guider och förklaringar som hjälper dig att förstå Bitcoin och din egen ekonomi."
        />
        <Button asChild variant="outline" className="h-10 shrink-0 rounded-full px-5 text-sm">
          <Link href="/artiklar">
            Alla artiklar
            <ArrowRight weight="bold" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
