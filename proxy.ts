import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18n = createMiddleware(routing);

/**
 * Two responsibilities per request:
 *  1. next-intl resolves the locale from the Host and rewrites the translated
 *     path segment to the underlying route.
 *  2. Supabase refreshes the auth session, decorating the intl response with
 *     fresh cookies so SSR sees a valid session.
 */
export async function proxy(request: NextRequest) {
  const response = handleI18n(request);
  return updateSession(request, response);
}

export const config = {
  /**
   * Run locale resolution + auth refresh on content routes only. Excludes:
   *  - `api`, `auth` (route handlers, must keep stable un-prefixed URLs)
   *  - `_next`, `_vercel` (internals)
   *  - root metadata image routes served outside `[locale]`
   *    (`icon`, `icon-maskable`, `apple-icon`, `opengraph-image`)
   *  - any path with a dot (sitemap.xml, robots.txt, manifest.webmanifest,
   *    feed.xml, favicon.ico, static assets)
   */
  matcher: [
    "/((?!api|auth|_next|_vercel|icon|icon-maskable|apple-icon|opengraph-image|.*\\..*).*)",
  ],
};
