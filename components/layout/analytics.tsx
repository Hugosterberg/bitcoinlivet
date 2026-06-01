"use client";

import { useEffect } from "react";
import Script from "next/script";

import { useConsent } from "@/components/layout/consent-store";

/**
 * Marketing & analytics tags, all optional (load only when their public ID is
 * set). See docs/ANALYTICS.md.
 *
 * Consent model:
 *  - Vercel Web Analytics (in app/layout.tsx) is cookieless → always on.
 *  - Google tags (GA4 + GTM) use **Consent Mode v2**: they load always but
 *    default to "denied"; cookies/ads data turn on only after the visitor
 *    grants consent. This is the ad-ready, EEA-compliant pattern.
 *  - Microsoft Clarity and the Meta Pixel set cookies and are loaded only
 *    *after* an explicit grant.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

// Sets Google Consent Mode defaults (denied) before any config runs.
const CONSENT_DEFAULT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;

export function SiteAnalytics() {
  const { consent } = useConsent();
  const granted = consent === "granted";

  // Consent Mode v2: update Google's consent state once the visitor decides.
  useEffect(() => {
    if (consent === null) return; // keep defaults (denied) until a choice
    const v = granted ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v,
    });
  }, [consent, granted]);

  // Microsoft Clarity — only after an explicit grant.
  useEffect(() => {
    if (!granted || !CLARITY_ID) return;
    let active = true;
    void import("@microsoft/clarity").then(({ default: Clarity }) => {
      if (!active) return;
      Clarity.init(CLARITY_ID);
      Clarity.consent(true);
    });
    return () => {
      active = false;
    };
  }, [granted]);

  return (
    <>
      {/* Google Analytics 4 (Consent Mode v2 — loads always, denied by default) */}
      {GA_ID ? (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`${CONSENT_DEFAULT}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}

      {/* Google Tag Manager (also Consent Mode aware) */}
      {GTM_ID ? (
        <Script id="gtm" strategy="afterInteractive">
          {`${CONSENT_DEFAULT}(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}

      {/* Meta (Facebook/Instagram) Pixel — only after explicit grant */}
      {granted && META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
