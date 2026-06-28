import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { Hero } from "@/features/home/components/hero";
import { TrustIntro } from "@/features/home/components/trust-intro";
import { FeaturedMetrics } from "@/features/home/components/featured-metrics";
import { LearnCta } from "@/features/home/components/learn-cta";
import { EducationPreview } from "@/features/home/components/education-preview";
import { BlogPreview } from "@/features/home/components/blog-preview";
import { InstagramFeed } from "@/features/home/components/instagram-feed";
import { Newsletter } from "@/features/home/components/newsletter";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustIntro />
      <FeaturedMetrics />
      <LearnCta />
      <EducationPreview />
      <BlogPreview />
      <InstagramFeed />
      <Newsletter />
    </>
  );
}
