import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";

import { footerNav, getSiteConfig } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { ScrollTopLink } from "@/components/layout/scroll-top-link";
import { CookieSettingsButton } from "@/components/layout/cookie-settings-button";

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const locale = (await getLocale()) as Locale;
  const site = getSiteConfig(locale);
  const t = await getTranslations("footer");

  return (
    <footer className="mt-24 border-t border-border bg-graphite/40">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm/6 text-muted-foreground">
              {site.description}
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-bitcoin/50 hover:text-bitcoin"
            >
              <InstagramLogo size={18} weight="fill" aria-hidden />
              {site.instagramHandle}
            </a>
          </div>

          {footerNav.map((group) => (
            <nav key={group.titleKey} aria-label={t(group.titleKey)}>
              <h2 className="text-sm font-semibold text-foreground">
                {t(group.titleKey)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <ScrollTopLink
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(item.key)}
                    </ScrollTopLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. {t("rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/integritetspolicy"
              className="transition-colors hover:text-foreground"
            >
              {t("privacy")}
            </Link>
            <CookieSettingsButton className="cursor-pointer transition-colors hover:text-foreground" />
            <p className="max-w-md text-pretty">{t("notAdvice")}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
