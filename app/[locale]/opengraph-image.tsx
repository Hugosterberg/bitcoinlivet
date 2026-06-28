import { ImageResponse } from "next/og";

import { BrandMarkTile } from "@/lib/brand-icon";
import { getSiteConfig } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const resolved: Locale = locale === "en" ? "en" : "sv";
  const site = getSiteConfig(resolved);
  const alt =
    resolved === "sv"
      ? `${site.name}: Bitcoin, sparande och köpkraft`
      : `${site.name}: Bitcoin, saving and purchasing power`;
  return [{ id: "og", alt, size, contentType }];
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const resolved: Locale = locale === "en" ? "en" : "sv";
  const site = getSiteConfig(resolved);
  const domain = site.url.replace(/^https?:\/\//, "");
  const title =
    resolved === "sv"
      ? "Bitcoin, sparande och sundare pengar"
      : "Bitcoin, saving and sounder money";
  const subtitle =
    resolved === "sv"
      ? "Lugn, datadriven utbildning på svenska, utan hype."
      : "Calm, data-driven education, without the hype.";

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
          <BrandMarkTile size={64} />
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 34, color: "#a1a1aa", marginTop: 14 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 26,
            color: "#f7931a",
            fontWeight: 600,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#f7931a" }} />
          {domain}
        </div>
      </div>
    ),
    size,
  );
}
