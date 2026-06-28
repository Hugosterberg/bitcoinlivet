import type { MetadataRoute } from "next";

import { getHostLocale } from "@/lib/host-locale";
import { getSiteConfig } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getHostLocale();
  const site = getSiteConfig(locale);
  const name =
    locale === "sv"
      ? `${site.name}: Bitcoin, sparande och köpkraft`
      : `${site.name}: Bitcoin, saving and purchasing power`;

  return {
    name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#f7931a",
    lang: locale === "sv" ? "sv-SE" : "en-US",
    categories: ["education", "finance"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
