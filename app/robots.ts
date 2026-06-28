import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { getHostLocale } from "@/lib/host-locale";
import { getSiteConfig } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const locale = await getHostLocale();
  const site = getSiteConfig(locale);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/personal and non-content routes — no SEO value, keep them out.
      // Paths are localized per domain (e.g. /konto vs /account).
      disallow: [
        "/api/",
        getPathname({ locale, href: "/konto" }),
        getPathname({ locale, href: "/aterstall" }),
        "/auth/",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
