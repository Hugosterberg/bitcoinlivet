import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

/**
 * Instagram integration config.
 *
 * The feed uses free, key-less iframe embeds of public posts. To show real
 * posts, add their shortcodes below. The shortcode is the id in a post URL:
 *   https://www.instagram.com/p/ABC123xyz/  ->  shortcode: "ABC123xyz"
 *   https://www.instagram.com/reel/XYZ987/  ->  shortcode: "XYZ987", type: "reel"
 *
 * If the list is empty, the feed renders a branded placeholder + follow CTA,
 * so the section never looks broken.
 *
 * See docs/ROADMAP.md (section 4) for the upgrade path to the oEmbed API.
 */

export type InstagramPost = {
  shortcode: string;
  type?: "p" | "reel";
  /** Short Swedish label used for the iframe title / accessibility. */
  label?: string;
};

export const instagram = {
  handle: siteConfig.instagramHandle,
  profileUrl: siteConfig.instagram,
  // TODO(instagram): klistra in riktiga shortcodes från dina inlägg här.
  posts: [] as InstagramPost[],
} as const;

/** Builds the key-less embed URL for a public Instagram post. */
export function buildInstagramEmbedUrl(post: InstagramPost): string {
  const kind = post.type ?? "p";
  return `https://www.instagram.com/${kind}/${encodeURIComponent(
    post.shortcode,
  )}/embed/captioned`;
}

/* ------------------------------------------------------------------ *
 * Live feed — auto-loads the latest posts from a Behold.so JSON feed.
 *
 * Instagram's Basic Display API was shut down (Dec 2024), so a connected
 * service is required to fetch "latest posts". Behold (free) handles the
 * Instagram Graph API + token refresh and exposes a clean JSON endpoint.
 *
 * Each locale points at its own account's feed:
 *   sv → INSTAGRAM_FEED_URL      (@bitcoinlivet)
 *   en → INSTAGRAM_FEED_URL_EN   (@bitcoinerlife)
 * Without a URL for the active locale we fall back to the manual embeds /
 * placeholder above. The English site deliberately does NOT fall back to the
 * Swedish feed, so it never shows the wrong account's posts. See
 * docs/INSTAGRAM.md.
 * ------------------------------------------------------------------ */

export type InstagramLivePost = {
  id: string;
  permalink: string;
  imageUrl: string;
  caption: string;
  isVideo: boolean;
  likeCount?: number;
  commentsCount?: number;
  /** ISO timestamp of the post. */
  timestamp?: string;
  /** Dominant colour ("r,g,b") used as a placeholder background. */
  bgColor?: string;
};

export type InstagramProfile = {
  username: string;
  followersCount?: number;
  profilePictureUrl?: string;
  biography?: string;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function extractPosts(data: unknown): Record<string, unknown>[] {
  const rec = asRecord(data);
  const arr = Array.isArray(data)
    ? data
    : Array.isArray(rec?.posts)
      ? (rec!.posts as unknown[])
      : [];
  return arr
    .map(asRecord)
    .filter((r): r is Record<string, unknown> => r !== null);
}

function mapPost(p: Record<string, unknown>): InstagramLivePost | null {
  const permalink = str(p.permalink);
  if (!permalink) return null;

  const sizes = asRecord(p.sizes);
  const sized = (k: string) => str(asRecord(sizes?.[k])?.mediaUrl);
  const isVideo = str(p.mediaType) === "VIDEO";

  const imageUrl =
    (isVideo ? str(p.thumbnailUrl) : undefined) ??
    sized("medium") ??
    sized("small") ??
    sized("large") ??
    sized("full") ??
    str(p.mediaUrl) ??
    str(p.thumbnailUrl);
  if (!imageUrl) return null;

  const dominant = str(asRecord(p.colorPalette)?.dominant);

  return {
    id: str(p.id) ?? permalink,
    permalink,
    imageUrl,
    // prunedCaption drops trailing hashtag/mention spam — cleaner to display.
    caption: str(p.prunedCaption) ?? str(p.caption) ?? "",
    isVideo,
    likeCount: num(p.likeCount),
    commentsCount: num(p.commentsCount),
    timestamp: str(p.timestamp),
    bgColor: dominant ? `rgb(${dominant})` : undefined,
  };
}

function mapProfile(data: unknown): InstagramProfile | null {
  const rec = asRecord(data);
  const username = str(rec?.username);
  if (!rec || !username) return null;
  return {
    username,
    followersCount: num(rec.followersCount),
    profilePictureUrl: str(rec.profilePictureUrl),
    biography: str(rec.biography),
  };
}

/** The Behold feed endpoint for a locale, or undefined when unconfigured. */
function feedUrlForLocale(locale: Locale): string | undefined {
  return locale === "en"
    ? process.env.INSTAGRAM_FEED_URL_EN
    : process.env.INSTAGRAM_FEED_URL;
}

/**
 * Fetches the latest Instagram posts + profile for the given locale's account
 * (cached for an hour). Returns empty values when no feed is configured or on
 * any error, so the UI degrades nicely.
 */
export async function getInstagramFeed(
  limit = 3,
  locale: Locale = "sv",
): Promise<{
  profile: InstagramProfile | null;
  posts: InstagramLivePost[];
}> {
  const url = feedUrlForLocale(locale);
  if (!url) return { profile: null, posts: [] };

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { profile: null, posts: [] };
    const data: unknown = await res.json();
    const posts = extractPosts(data)
      .map(mapPost)
      .filter((p): p is InstagramLivePost => p !== null)
      .slice(0, limit);
    return { profile: mapProfile(data), posts };
  } catch {
    return { profile: null, posts: [] };
  }
}

/**
 * Coarse, locale-aware relative time ("today" / "idag", "3 days ago" / "3 dagar
 * sedan"). Uses the platform Intl formatter, bucketed by days/weeks/months/years.
 */
export function relativeTime(iso: string | undefined, locale: string): string | undefined {
  if (!iso) return undefined;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return undefined;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return rtf.format(0, "day");
  if (days < 7) return rtf.format(-days, "day");
  if (days < 30) return rtf.format(-Math.floor(days / 7), "week");
  if (days < 365) return rtf.format(-Math.floor(days / 30), "month");
  return rtf.format(-Math.floor(days / 365), "year");
}
