import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Allow MDX/Markdown files to be treated as pages and route content.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Renamed slugs (labels: Nyheter, Artiklar). Permanent redirects preserve
  // old links and SEO; query strings are carried over automatically.
  async redirects() {
    return [
      { source: "/bitcoin-idag", destination: "/nyheter", permanent: true },
      { source: "/blog", destination: "/artiklar", permanent: true },
      { source: "/blog/:path*", destination: "/artiklar/:path*", permanent: true },
    ];
  },
};

const withMDX = createMDX({
  // Keep options serializable so they work with Turbopack.
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
