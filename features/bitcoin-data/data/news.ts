/**
 * Lightweight Bitcoin news aggregator. Pulls public RSS/Atom feeds
 * server-side (no API key) and merges them into a calm, minimal headline
 * list. We only keep title, link, source and date — we link out and never
 * republish content. Feeds are easy to edit below.
 */

export type NewsItem = {
  title: string;
  url: string;
  source: string;
  date: Date;
};

export type NewsResult = {
  items: NewsItem[];
  /** Names of the feeds that responded successfully. */
  sources: string[];
  live: boolean;
};

/**
 * Bitcoin-focused, key-less RSS/Atom feeds — deliberately Bitcoin-only sources
 * (no general "crypto" sites). Dead or changed feed URLs degrade gracefully
 * (see fetchFeed), so the list is safe to extend. RSS 2.0 and Atom both work.
 */
const FEEDS: { source: string; url: string }[] = [
  { source: "Bitcoin Magazine", url: "https://bitcoinmagazine.com/feed" },
  { source: "No BS Bitcoin", url: "https://www.nobsbitcoin.com/rss/" },
  { source: "Bitcoin Optech", url: "https://bitcoinops.org/feed.xml" },
  { source: "TFTC", url: "https://www.tftc.io/rss/" },
  // Best-effort: Swan publishes editorially but exposes no confirmed public
  // feed, so this may silently return nothing until the URL is verified.
  { source: "Swan", url: "https://www.swanbitcoin.com/blog/rss" },
];

/** Cache feeds for an hour so we stay friendly to the sources. */
const REVALIDATE = 3600;
/** Max headlines to keep per feed before merging (avoids one feed dominating). */
const PER_FEED = 12;
/** Default window: keep headlines from roughly the last week. */
const DEFAULT_WINDOW_DAYS = 7;

function decodeText(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCharCode(parseInt(n, 16)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function extractLink(block: string): string | null {
  // Atom: <link href="..." />
  const atom = block.match(/<link[^>]*\bhref="([^"]+)"/i);
  if (atom) return atom[1].trim();
  // RSS: <link>...</link> (optionally wrapped in CDATA)
  const rss = block.match(
    /<link>\s*(?:<!\[CDATA\[)?\s*([\s\S]*?)\s*(?:\]\]>)?\s*<\/link>/i,
  );
  return rss ? rss[1].trim() : null;
}

function extractDate(block: string): Date | null {
  const m =
    block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) ??
    block.match(/<published>([\s\S]*?)<\/published>/i) ??
    block.match(/<updated>([\s\S]*?)<\/updated>/i);
  if (!m) return null;
  const date = new Date(decodeText(m[1]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseFeed(xml: string, source: string): NewsItem[] {
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/\1>/gi) ?? [];
  const items: NewsItem[] = [];

  for (const block of blocks) {
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? decodeText(titleMatch[1]) : "";
    const url = extractLink(block);
    const date = extractDate(block);
    if (!title || !url || !date) continue;
    items.push({ title, url, source, date });
  }

  return items.slice(0, PER_FEED);
}

async function fetchFeed(feed: {
  source: string;
  url: string;
}): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        "User-Agent": "Bitcoinlivet/1.0 (+https://bitcoinlivet.se)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error(`${feed.source} HTTP ${res.status}`);
    const xml = await res.text();
    return parseFeed(xml, feed.source);
  } catch {
    return [];
  }
}

export async function getBitcoinNews(
  limit = 18,
  withinDays = DEFAULT_WINDOW_DAYS,
): Promise<NewsResult> {
  const settled = await Promise.all(FEEDS.map(fetchFeed));

  const sources: string[] = [];
  const merged: NewsItem[] = [];
  settled.forEach((items, i) => {
    if (items.length > 0) sources.push(FEEDS[i].source);
    merged.push(...items);
  });

  // De-duplicate by URL, then sort newest first.
  const seen = new Set<string>();
  const unique = merged.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
  unique.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Keep the last week's headlines; fall back to the newest if that window is
  // too sparse, so the page never looks empty.
  const cutoff = Date.now() - withinDays * 86_400_000;
  const recent = unique.filter((item) => item.date.getTime() >= cutoff);
  const items = (recent.length >= 6 ? recent : unique).slice(0, limit);

  return {
    items,
    sources,
    live: items.length > 0,
  };
}
