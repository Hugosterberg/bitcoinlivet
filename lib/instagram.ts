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
