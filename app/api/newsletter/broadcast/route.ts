import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { isResendConfigured, sendNewsletterBroadcast } from "@/lib/resend";

/**
 * Protected endpoint to send a news email to everyone who has accepted
 * (the Resend Audience of consented subscribers). Owner-only.
 *
 * POST /api/newsletter/broadcast
 *   Header:  Authorization: Bearer <NEWSLETTER_ADMIN_TOKEN>
 *   Body:    { "subject": "...", "html": "<p>...</p>", "name"?: "internal label" }
 *
 * Recipients are never specified by the caller — the audience only contains
 * people who opted in, so a send can only reach consenting addresses.
 */

export const runtime = "nodejs";

function authorized(req: Request): boolean {
  const token = process.env.NEWSLETTER_ADMIN_TOKEN;
  if (!token) return false; // No token configured → endpoint stays closed.

  const header = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${token}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isResendConfigured) {
    return NextResponse.json(
      { error: "Resend är inte konfigurerat (se docs/RESEND.md)." },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as {
    subject?: unknown;
    html?: unknown;
    name?: unknown;
  } | null;

  const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
  const html = typeof body?.html === "string" ? body.html : "";
  const name = typeof body?.name === "string" ? body.name : undefined;

  if (!subject || !html) {
    return NextResponse.json(
      { error: "subject och html krävs." },
      { status: 400 },
    );
  }

  try {
    const broadcastId = await sendNewsletterBroadcast({ subject, html, name });
    return NextResponse.json({ ok: true, broadcastId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sändning misslyckades." },
      { status: 500 },
    );
  }
}
