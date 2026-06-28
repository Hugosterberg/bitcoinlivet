"use client";

import { useTranslations } from "next-intl";

import { resetConsent } from "@/components/layout/consent-store";

/**
 * Footer link that reopens the cookie banner so visitors can change their
 * analytics-cookie choice at any time (a GDPR best practice).
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  const t = useTranslations("common");
  return (
    <button type="button" onClick={resetConsent} className={className}>
      {t("cookieSettings")}
    </button>
  );
}
