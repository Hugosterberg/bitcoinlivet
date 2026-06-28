import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="py-24">
      <Container className="flex max-w-xl flex-col items-center text-center">
        <span className="font-heading text-6xl font-bold tracking-tight text-bitcoin">
          404
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          {t("lead")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl" className="rounded-full">
            <Link href="/">{t("home")}</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="rounded-full">
            <Link href="/artiklar">{t("readArticles")}</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
