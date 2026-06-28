import type { MetadataRoute } from "next";

import { getAllPosts } from "@/features/blog/data/posts";
import { getCourseModules } from "@/features/education/data/courses";
import { getFunctions, getFunctionSlugsById } from "@/features/functions/data/functions";
import { routing, type Locale } from "@/i18n/routing";
import { getHostLocale } from "@/lib/host-locale";
import { localizedUrl } from "@/lib/seo";

type Href = Parameters<typeof localizedUrl>[1];

/**
 * Per-domain sitemap. The active locale is derived from the request Host, so
 * bitcoinlivet.se serves the sv URLs and bitcoinerlife.xyz the en URLs, each
 * with its own localized path segments. Every entry carries `hreflang`
 * alternates linking the locales across domains.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = await getHostLocale();
  const courseModules = getCourseModules(locale);

  const languagesFor = (href: Href): Record<string, string> => {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = localizedUrl(l, href);
    return languages;
  };

  const entry = (
    href: Href,
    opts: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
  ): MetadataRoute.Sitemap[number] => ({
    url: localizedUrl(locale, href),
    alternates: { languages: languagesFor(href) },
    ...opts,
  });

  // hreflang alternates for content whose slug is localized (differs per locale).
  const slugLanguages = (
    pathname: "/funktioner/[slug]",
    slugs: Record<Locale, string>,
  ): Record<string, string> => {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[l] = localizedUrl(l, { pathname, params: { slug: slugs[l] } });
    }
    return languages;
  };

  // Current-locale URL only — used where cross-locale slugs aren't mapped yet.
  const localEntry = (
    href: Href,
    opts: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
  ): MetadataRoute.Sitemap[number] => ({
    url: localizedUrl(locale, href),
    ...opts,
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "weekly", priority: 1 }),
    entry("/utbildning", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/artiklar", { changeFrequency: "weekly", priority: 0.8 }),
    entry("/data", { changeFrequency: "daily", priority: 0.8 }),
    entry("/nyheter", { changeFrequency: "hourly", priority: 0.7 }),
    entry("/ordlista", { changeFrequency: "monthly", priority: 0.6 }),
    entry("/halvering", { changeFrequency: "weekly", priority: 0.7 }),
    entry("/funktioner", { changeFrequency: "monthly", priority: 0.7 }),
    entry("/om", { changeFrequency: "monthly", priority: 0.5 }),
    entry("/integritetspolicy", { changeFrequency: "yearly", priority: 0.2 }),
  ];

  const functionRoutes: MetadataRoute.Sitemap = getFunctions(locale).map((fn) => ({
    url: localizedUrl(locale, { pathname: "/funktioner/[slug]", params: { slug: fn.slug } }),
    alternates: {
      languages: slugLanguages("/funktioner/[slug]", getFunctionSlugsById(fn.id)),
    },
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Courses and posts use localized slugs; emit the current-locale URL only
  // until their cross-locale slug mapping is wired (no wrong hreflang links).
  const courseRoutes: MetadataRoute.Sitemap = courseModules.flatMap((module) => [
    localEntry(
      { pathname: "/utbildning/[modul]", params: { modul: module.slug } },
      { changeFrequency: "monthly", priority: 0.6 },
    ),
    ...module.lessons.map((lesson) =>
      localEntry(
        {
          pathname: "/utbildning/[modul]/[lektion]",
          params: { modul: module.slug, lektion: lesson.slug },
        },
        { changeFrequency: "monthly", priority: 0.5 },
      ),
    ),
  ]);

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) =>
    localEntry(
      { pathname: "/artiklar/[slug]", params: { slug: post.slug } },
      {
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      },
    ),
  );

  return [...staticRoutes, ...functionRoutes, ...courseRoutes, ...postRoutes];
}
