import { ImageResponse } from "next/og";

// Apple touch icon (home screen on iOS).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 126,
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
