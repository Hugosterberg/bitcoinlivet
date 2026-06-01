import { ImageResponse } from "next/og";

import { BrandMarkTile } from "@/lib/brand-icon";
import { siteConfig } from "@/lib/site";
import { getPost, getPostSlugs } from "@/features/blog/data/posts";

export const alt = "bitcoinlivet, artikel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.meta.title ?? siteConfig.name;
  const category = post?.meta.categoryLabel ?? "Artiklar";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(900px 500px at 85% 0%, rgba(247,147,26,0.22), transparent 60%), #0a0a0a",
          padding: "72px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BrandMarkTile size={56} />
          <div style={{ fontSize: 30, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(247,147,26,0.15)",
              color: "#f7931a",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
          <div
            style={{
              fontSize: title.length > 60 ? 56 : 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#a1a1aa" }}>bitcoinlivet.se</div>
      </div>
    ),
    size,
  );
}
