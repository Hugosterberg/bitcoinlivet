import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-24">
      <Container className="flex max-w-xl flex-col items-center text-center">
        <span className="font-heading text-6xl font-bold tracking-tight text-bitcoin">
          404
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground">
          Sidan kunde inte hittas
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          Länken kan vara fel eller så har sidan flyttats. Här är några vägar
          vidare.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="xl" className="rounded-full">
            <Link href="/">Till startsidan</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="rounded-full">
            <Link href="/artiklar">Läs artiklarna</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
