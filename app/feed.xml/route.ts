import { getSiteConfig } from "@/lib/site";
import { getHostLocale } from "@/lib/host-locale";
import { getAllPosts } from "@/features/blog/data/posts";

/** Escape the five XML predefined entities. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const locale = await getHostLocale();
  const site = getSiteConfig(locale);
  const base = site.url;
  const posts = getAllPosts(locale);
  const updated = posts[0]?.date
    ? new Date(posts[0].date).toUTCString()
    : new Date().toUTCString();
  const feedTitle = locale === "sv" ? "Artiklar" : "Articles";
  const lang = locale === "sv" ? "sv-SE" : "en-US";

  const items = posts
    .map((post) => {
      const url = `${base}${post.href}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.categoryLabel)}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}, ${feedTitle}</title>
    <link>${base}/artiklar</link>
    <description>${escapeXml(site.description)}</description>
    <language>${lang}</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
