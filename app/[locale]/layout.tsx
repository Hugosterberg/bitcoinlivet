import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

import { cn } from "@/lib/utils";
import { getSiteConfig } from "@/lib/site";
import { buildAlternates } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteAnalytics } from "@/components/layout/analytics";
import { CookieConsent } from "@/components/layout/cookie-consent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = getSiteConfig(locale);
  const titleSuffix =
    locale === "sv"
      ? "Bitcoin, sparande och köpkraft"
      : "Bitcoin, saving and purchasing power";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name}: ${titleSuffix}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    keywords:
      locale === "sv"
        ? [
            "Bitcoin",
            "Bitcoin Sverige",
            "spara i Bitcoin",
            "inflation",
            "köpkraft",
            "sunda pengar",
            "långsiktigt sparande",
            "Bitcoin på svenska",
          ]
        : [
            "Bitcoin",
            "save in Bitcoin",
            "inflation",
            "purchasing power",
            "sound money",
            "long-term saving",
            "Bitcoin education",
          ],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    alternates: {
      ...buildAlternates(locale, "/"),
      types: {
        "application/rss+xml": [
          { url: "/feed.xml", title: `${site.name}: ${locale === "sv" ? "Artiklar" : "Articles"}` },
        ],
      },
    },
    openGraph: {
      type: "website",
      locale: site.ogLocale,
      url: site.url,
      siteName: site.name,
      title: `${site.name}: ${titleSuffix}`,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name}: ${titleSuffix}`,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    category: "finance",
    icons: {
      icon: [{ url: "/icon", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const skipToContent = locale === "sv" ? "Hoppa till innehåll" : "Skip to content";

  return (
    <html
      lang={locale}
      className={cn("dark h-full", geistSans.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bitcoin focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bitcoin-foreground"
          >
            {skipToContent}
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <Analytics />
          <SiteAnalytics />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
