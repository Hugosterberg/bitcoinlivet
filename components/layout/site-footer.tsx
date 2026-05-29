import Link from "next/link";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";

import { siteConfig, footerNav } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-graphite/40">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm/6 text-muted-foreground">
              {siteConfig.description}
            </p>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
            >
              <InstagramLogo size={18} weight="fill" aria-hidden />
              {siteConfig.instagramHandle}
            </a>
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold text-foreground">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.name}. Allt innehåll är i utbildande syfte.
          </p>
          <p className="max-w-md text-pretty">
            Detta är inte finansiell rådgivning. Gör alltid din egen research.
          </p>
        </div>
      </Container>
    </footer>
  );
}
