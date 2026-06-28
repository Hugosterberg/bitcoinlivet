// Supabase "Send Email" auth hook — renders transactional auth emails in the
// user's language and sends them via Resend.
//
// Why: each language lives on its own domain (bitcoinlivet.se = sv,
// bitcoinerlife.xyz = en). The locale is derived from the `redirect_to` the app
// passed when triggering the email (e.g. password reset), so the email matches
// the site the user came from. With email confirmation turned off, the only
// auth email in practice is password recovery; signup/magiclink/email-change
// copy is included for completeness.
//
// Deploy (needs your Supabase project + a verified Resend domain):
//   1. supabase secrets set RESEND_API_KEY=... SEND_EMAIL_HOOK_SECRET=... \
//        RESEND_FROM='bitcoinlivet <noreply@bitcoinlivet.se>'
//   2. supabase functions deploy send-email --no-verify-jwt
//   3. Dashboard → Authentication → Hooks → Send Email → enable, point at this
//      function, and copy the generated secret into SEND_EMAIL_HOOK_SECRET.
// See docs/SUPABASE.md.

import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "").replace(
  "v1,whsec_",
  "",
);
const from = Deno.env.get("RESEND_FROM") ?? "bitcoinlivet <noreply@bitcoinlivet.se>";
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;

type Locale = "sv" | "en";

type EmailData = {
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
};

/** bitcoinerlife.xyz → en, everything else → sv. */
function localeFromRedirect(redirectTo: string): Locale {
  try {
    return new URL(redirectTo).hostname.includes("bitcoinerlife") ? "en" : "sv";
  } catch {
    return "sv";
  }
}

/** Supabase verification link that confirms the action, then redirects back. */
function verifyUrl(d: EmailData): string {
  const params = new URLSearchParams({
    token: d.token_hash,
    type: d.email_action_type,
    redirect_to: d.redirect_to,
  });
  return `${supabaseUrl}/auth/v1/verify?${params.toString()}`;
}

type Copy = { subject: string; heading: string; body: string; cta: string };

function copyFor(action: string, locale: Locale): Copy {
  const recovery: Record<Locale, Copy> = {
    sv: {
      subject: "Återställ ditt lösenord",
      heading: "Återställ ditt lösenord",
      body: "Klicka på knappen för att välja ett nytt lösenord. Ignorera mejlet om du inte begärt det.",
      cta: "Välj nytt lösenord",
    },
    en: {
      subject: "Reset your password",
      heading: "Reset your password",
      body: "Click the button to choose a new password. Ignore this email if you didn't request it.",
      cta: "Choose a new password",
    },
  };
  const confirm: Record<Locale, Copy> = {
    sv: {
      subject: "Bekräfta din e-postadress",
      heading: "Bekräfta din e-post",
      body: "Klicka på knappen för att bekräfta din e-postadress och aktivera kontot.",
      cta: "Bekräfta e-post",
    },
    en: {
      subject: "Confirm your email address",
      heading: "Confirm your email",
      body: "Click the button to confirm your email address and activate your account.",
      cta: "Confirm email",
    },
  };
  return action === "recovery" ? recovery[locale] : confirm[locale];
}

function renderHtml(c: Copy, url: string, brand: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0a0a0a;font-family:sans-serif;color:#fafafa">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px">
    <div style="font-size:20px;font-weight:600;margin-bottom:28px">${brand}</div>
    <h1 style="font-size:24px;font-weight:600;margin:0 0 12px">${c.heading}</h1>
    <p style="font-size:15px;line-height:1.6;color:#a1a1aa;margin:0 0 28px">${c.body}</p>
    <a href="${url}" style="display:inline-block;background:#f7931a;color:#0a0a0a;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:999px">${c.cta}</a>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  let data: { user: { email: string }; email_data: EmailData };
  try {
    data = new Webhook(hookSecret).verify(payload, headers) as typeof data;
  } catch {
    return new Response(JSON.stringify({ error: "invalid signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { user, email_data } = data;
  const locale = localeFromRedirect(email_data.redirect_to);
  const brand = locale === "en" ? "bitcoinerlife" : "bitcoinlivet";
  const c = copyFor(email_data.email_action_type, locale);
  const html = renderHtml(c, verifyUrl(email_data), brand);

  const { error } = await resend.emails.send({
    from,
    to: [user.email],
    subject: c.subject,
    html,
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
