import Link from "next/link";
import { InstagramLogo, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { instagram, buildInstagramEmbedUrl } from "@/lib/instagram";

function FollowButton() {
  return (
    <Button asChild size="lg" variant="outline" className="h-10 rounded-full px-5 text-sm">
      <a href={instagram.profileUrl} target="_blank" rel="noopener noreferrer">
        <InstagramLogo weight="fill" aria-hidden />
        Följ {instagram.handle}
      </a>
    </Button>
  );
}

/** Branded placeholder shown until real post shortcodes are configured. */
function PlaceholderGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border bg-graphite text-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-bitcoin/15 via-transparent to-transparent"
          />
          <span className="relative grid size-12 place-items-center rounded-2xl bg-bitcoin-muted text-bitcoin">
            <InstagramLogo size={24} weight="fill" aria-hidden />
          </span>
          <p className="relative px-6 text-sm text-muted-foreground">
            Inlägg från {instagram.handle} visas här
          </p>
        </div>
      ))}
    </div>
  );
}

export function InstagramFeed() {
  const hasPosts = instagram.posts.length > 0;

  return (
    <Section className="border-t border-border">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Instagram"
          title={`Följ med på ${instagram.handle}`}
          description="Korta, begripliga Bitcoin-tankar i ditt flöde. Här är ett urval, följ för mer."
        />
        <div className="shrink-0">
          <FollowButton />
        </div>
      </div>

      <div className="mt-12">
        {hasPosts ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instagram.posts.map((post) => (
              <div
                key={post.shortcode}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <iframe
                  src={buildInstagramEmbedUrl(post)}
                  title={post.label ?? `Instagram-inlägg ${post.shortcode}`}
                  loading="lazy"
                  scrolling="no"
                  allow="encrypted-media"
                  className="h-[560px] w-full border-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <PlaceholderGrid />
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={instagram.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-bitcoin transition-colors hover:text-bitcoin/80"
        >
          Se hela kontot på Instagram
          <ArrowUpRight size={16} weight="bold" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
