import { NextResponse } from "next/server";

import { getCurrentUser } from "@/features/auth/data/session";

/**
 * Lightweight auth-state endpoint for client UI (header, prompts).
 *
 * The server reads the auth cookie reliably, which avoids the timing race in
 * the browser client's cookie read right after a server-side login. Pages stay
 * static; only this route is dynamic.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    { user: user ? { id: user.id, email: user.email } : null },
    { headers: { "cache-control": "no-store" } },
  );
}
