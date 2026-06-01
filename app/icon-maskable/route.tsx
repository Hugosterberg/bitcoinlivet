import { ImageResponse } from "next/og";

import { BrandIconMarkup } from "@/lib/brand-icon";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    <BrandIconMarkup canvas={512} variant="maskable" />,
    { width: 512, height: 512 },
  );
}
