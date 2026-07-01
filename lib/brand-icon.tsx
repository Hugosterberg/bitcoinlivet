/**
 * Shared brand mark for favicon, PWA and Open Graph images.
 * Uses SVG paths instead of the ₿ Unicode glyph, which often fails to render
 * in @vercel/og (Satori) and shows a broken box in Vercel / PWA contexts.
 */

const ORANGE = "#f7931a";
const INK = "#0a0a0a";

/**
 * The classic tilted Bitcoin “₿” (public-domain Bitcoin logo letterform),
 * centered in a 64×64 viewBox.
 */
function BitcoinLetter() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="12 8 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={INK}
        d="M46.103 27.444c.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-.875-1.4 5.616c-.923-.23-1.871-.447-2.813-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.679 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.019 4.569 1.139c.85.213 1.683.436 2.503.646l-1.453 5.834 3.507.875 1.439-5.772c.958.26 1.888.5 2.798.726l-1.434 5.745 3.511.875 1.453-5.823c5.987 1.133 10.489.676 12.384-4.739 1.527-4.36-.076-6.875-3.226-8.515 2.294-.529 4.022-2.038 4.483-5.155zm-8.022 11.249c-1.085 4.36-8.426 2.003-10.806 1.412l1.928-7.729c2.38.594 10.012 1.77 8.878 6.317zm1.086-11.312c-.99 3.966-7.1 1.951-9.082 1.457l1.748-7.01c1.982.494 8.365 1.416 7.334 5.553z"
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
