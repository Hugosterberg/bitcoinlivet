import { ImageResponse } from "next/og";

import { BrandIconMarkup } from "@/lib/brand-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <BrandIconMarkup canvas={512} variant="default" />,
    size,
  );
}
