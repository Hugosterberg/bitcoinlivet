import { ImageResponse } from "next/og";

// Branded app/favicon icon (Bitcoin orange ₿), generated at build time.
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7931a",
          color: "#0a0a0a",
          fontSize: 360,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        ₿
      </div>
    ),
    size,
  );
}
