import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

/**
 * Locale-aware navigation helpers. Import `Link` (and the others) from here
 * instead of `next/link` / `next/navigation` so internal links resolve to the
 * correct per-locale path segment via `routing.pathnames`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
