import { ImageResponse } from "next/og";

import { BrandMarkTile } from "@/lib/brand-icon";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name}: Bitcoin, sparande och köpkraft`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
            {siteConfig.name}
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
            Bitcoin, sparande och sundare pengar
          </div>
          <div style={{ fontSize: 34, color: "#a1a1aa", marginTop: 14 }}>
            Lugn, datadriven utbildning på svenska, utan hype.
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
          bitcoinlivet.se
        </div>
      </div>
    ),
    size,
  );
}
