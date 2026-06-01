import Link from "next/link";
import {
  InstagramLogo,
  ArrowUpRight,
  Play,
  Heart,
  ChatCircle,
} from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import {
  instagram,
  buildInstagramEmbedUrl,
  getInstagramFeed,
  relativeTimeSv,
  type InstagramLivePost,
} from "@/features/home/data/instagram";

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

/** Live post card: the actual image, linking out to the post, with a hover. */
function LivePostCard({ post }: { post: InstagramLivePost }) {
  const label = post.caption
    ? post.caption.replace(/\s+/g, " ").slice(0, 120)
    : `Inlägg från ${instagram.handle}`;
  const time = relativeTimeSv(post.timestamp);
  const hasStats = post.likeCount != null || post.commentsCount != null || time;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-2xl border border-border bg-card"
      style={post.bgColor ? { backgroundColor: post.bgColor } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Behold CDN URLs; plain img avoids optimizer domain config. */}
      <img
        src={post.imageUrl}
        alt={label}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {post.isVideo ? (
        <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm">
          <Play size={14} weight="fill" aria-hidden />
        </span>
      ) : null}

      <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black/80 via-black/15 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {post.caption ? (
          <p className="line-clamp-3 text-xs/5 text-white">{post.caption}</p>
        ) : null}
        {hasStats ? (
          <div className="flex items-center gap-3 text-[11px] font-medium text-white/90">
            {post.likeCount != null ? (
              <span className="inline-flex items-center gap-1">
                <Heart size={12} weight="fill" aria-hidden />
                {formatNumber(post.likeCount)}
              </span>
            ) : null}
            {post.commentsCount != null ? (
              <span className="inline-flex items-center gap-1">
                <ChatCircle size={12} weight="fill" aria-hidden />
                {formatNumber(post.commentsCount)}
              </span>
            ) : null}
            {time ? <span className="ml-auto text-white/70">{time}</span> : null}
          </div>
        ) : null}
      </div>
    </a>
  );
}

export async function InstagramFeed() {
  const { profile, posts: livePosts } = await getInstagramFeed(3);
  const hasLive = livePosts.length > 0;
  const hasManual = instagram.posts.length > 0;

  return (
    <Section className="border-t border-border">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Instagram"
          title={`Följ med på ${instagram.handle}`}
          description="Korta, begripliga Bitcoin-tankar i ditt flöde. Här är ett urval, följ för mer."
        />
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <FollowButton />
          {profile?.followersCount ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">
                {formatNumber(profile.followersCount)}
              </span>{" "}
              följare på Instagram
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-12">
        {hasLive ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {livePosts.map((post) => (
              <LivePostCard key={post.id} post={post} />
            ))}
          </div>
        ) : hasManual ? (
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
