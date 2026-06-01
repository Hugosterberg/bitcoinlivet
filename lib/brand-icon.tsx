/**
 * Shared brand mark for favicon, PWA and Open Graph images.
 * Uses SVG paths instead of the ₿ Unicode glyph, which often fails to render
 * in @vercel/og (Satori) and shows a broken box in Vercel / PWA contexts.
 */

const ORANGE = "#f7931a";
const INK = "#0a0a0a";

/** Stylised “B” paths (32×32 viewBox). */
function BitcoinLetter() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={INK}
        d="M18.4 14.1c2-.9 3.3-2.7 3.3-5.2 0-3.7-2.9-5.7-8.1-5.7H7v19.6h6.9c5.5 0 9-2.7 9-7.2 0-3.1-1.6-5.3-4.5-6.5zm-10.2-8.7h5.6c2.8 0 4.3 1.3 4.3 3.7s-1.5 3.8-4.2 3.8h-5.7V5.4zm0 14.8V14.5h6.4c2.8 0 4.4 1.4 4.4 4s-1.7 4.2-4.8 4.2h-5.9v2.5z"
      />
    </svg>
  );
}

export function BrandIconMarkup({
  canvas,
  variant = "default",
}: {
  /** Canvas edge length in px (e.g. 512, 180). */
  canvas: number;
  /** `maskable` insets the mark for Android adaptive-icon safe zone. */
  variant?: "default" | "maskable";
}) {
  const isMaskable = variant === "maskable";
  const tile = isMaskable ? Math.round(canvas * 0.72) : canvas;
  const radius = Math.round(tile * 0.18);
  const letter = Math.round(tile * 0.52);

  return (
    <div
      style={{
        width: canvas,
        height: canvas,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isMaskable ? INK : ORANGE,
      }}
    >
      <div
        style={{
          width: tile,
          height: tile,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: ORANGE,
          borderRadius: radius,
        }}
      >
        <div style={{ width: letter, height: letter, display: "flex" }}>
          <BitcoinLetter />
        </div>
      </div>
    </div>
  );
}

/** Small square mark for Open Graph header (64px tile). */
export function BrandMarkTile({ size = 64 }: { size?: number }) {
  const radius = Math.round(size * 0.18);
  const letter = Math.round(size * 0.52);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: radius,
        background: ORANGE,
      }}
    >
      <div style={{ width: letter, height: letter, display: "flex" }}>
        <BitcoinLetter />
      </div>
    </div>
  );
}
