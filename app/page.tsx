import { Hero } from "@/components/sections/hero";
import { TrustIntro } from "@/components/sections/trust-intro";
import { FeaturedMetrics } from "@/components/sections/featured-metrics";
import { LearnCta } from "@/components/sections/learn-cta";
import { EducationPreview } from "@/components/sections/education-preview";
import { BlogPreview } from "@/components/sections/blog-preview";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { Newsletter } from "@/components/sections/newsletter";

export default function HomePage() {
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
