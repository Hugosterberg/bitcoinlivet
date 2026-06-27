import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/features/blog/data/posts";
import { getCourseModules } from "@/features/education/data/courses";
import { bitcoinFunctions } from "@/features/functions/data/functions";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  // Sitemap is sv-only for now; per-domain (host-derived) sitemaps land in Phase 2.
  const courseModules = getCourseModules(routing.defaultLocale);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/utbildning`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/artiklar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/data`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/nyheter`, changeFrequency: "hourly", priority: 0.7 },
    { url: `${base}/ordlista`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/halvering`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/funktioner`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/om`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/integritetspolicy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const functionRoutes: MetadataRoute.Sitemap = bitcoinFunctions.map((fn) => ({
    url: `${base}/funktioner/${fn.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const courseRoutes: MetadataRoute.Sitemap = courseModules.flatMap((module) => [
    {
      url: `${base}/utbildning/${module.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...module.lessons.map((lesson) => ({
      url: `${base}/utbildning/${module.slug}/${lesson.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]);

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}${post.href}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...functionRoutes, ...courseRoutes, ...postRoutes];
}
