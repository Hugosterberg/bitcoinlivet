import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { categories, type CategorySlug } from "@/features/blog/data/posts";

export async function EducationPreview() {
  const t = await getTranslations("home");
  const entries = Object.entries(categories) as [
    CategorySlug,
    (typeof categories)[CategorySlug],
  ][];

  return (
    <Section>
      <SectionHeading
        eyebrow={t("eduPreviewEyebrow")}
        title={t("eduPreviewTitle")}
        description={t("eduPreviewDescription")}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([slug, category]) => (
          <Link
            key={slug}
            href={`/artiklar?kategori=${slug}`}
            className="group rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="flex h-full items-start justify-between gap-4 p-6 transition-colors group-hover:border-bitcoin/40">
              <div>
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  {category.label}
                </h3>
                <p className="mt-2 text-sm/6 text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <ArrowUpRight
                size={20}
                weight="bold"
                aria-hidden
                className="shrink-0 text-muted-foreground transition-colors group-hover:text-bitcoin"
              />
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
