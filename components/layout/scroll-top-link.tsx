"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A Next.js Link that, when its destination is the page you're already on,
 * smooth-scrolls to the top instead of doing nothing. (Same-route Link clicks
 * don't scroll by default.) For navigations to a different route, Next.js
 * already scrolls to top, so this behaves like a normal Link.
 */
export function ScrollTopLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (typeof href === "string" && href === pathname) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}
