import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Allow MDX/Markdown files to be treated as pages and route content.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  // Keep options serializable so they work with Turbopack.
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
