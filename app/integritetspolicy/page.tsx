import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/site";
import { CookieSettingsButton } from "@/components/layout/cookie-settings-button";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Så hanterar bitcoinlivet dina uppgifter: konton, nyhetsbrev, cookies och analys, samt dina rättigheter enligt GDPR.",
  alternates: { canonical: "/integritetspolicy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base/7 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-bitcoin">
            Integritet
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Integritetspolicy
          </h1>
          <p className="mt-5 text-pretty text-lg/8 text-muted-foreground">
            Den här sidan förklarar vilka uppgifter {siteConfig.name} samlar in,
            varför, och vilka rättigheter du har. Vi samlar bara in det som
            behövs och säljer aldrig dina uppgifter.
          </p>
        </header>

        <Section title="Vilka uppgifter vi samlar in">
          <ul className="space-y-2">
            <li>
              <strong className="text-foreground">Konto:</strong> om du skapar ett
              konto lagras din e-postadress och din kursprogression (XP, märken,
              genomförda lektioner) så att du kan fortsätta på flera enheter.
            </li>
            <li>
              <strong className="text-foreground">Nyhetsbrev:</strong> om du
              anmäler dig lagras din e-postadress och att du samtyckt till
              utskick. Du kan avregistrera dig när som helst.
            </li>
            <li>
              <strong className="text-foreground">Analys:</strong> anonym
              statistik om hur sidan används (besök, sidvisningar, ungefärlig
              källa). Detaljerad analys aktiveras bara med ditt samtycke.
            </li>
          </ul>
        </Section>

        <Section title="Cookies och analys">
          <p>
            <strong className="text-foreground">Google Analytics</strong> och{" "}
            <strong className="text-foreground">Microsoft Clarity</strong> (samt
            eventuell annonsmätning) använder cookies och laddas{" "}
            <strong className="text-foreground">först efter ditt samtycke</strong> i
            cookie-rutan. Du kan ändra ditt val när som helst:
          </p>
          <p>
            <CookieSettingsButton className="cursor-pointer font-medium text-bitcoin underline underline-offset-4 transition-colors hover:text-bitcoin/80" />
          </p>
        </Section>

        <Section title="Rättslig grund">
          <p>
            Konto- och nyhetsbrevsuppgifter behandlas för att leverera tjänsten
            respektive med stöd av ditt samtycke. Cookies för analys och annonser
            sätts endast med ditt samtycke (GDPR art. 6.1 a och ePrivacy).
          </p>
        </Section>

        <Section title="Dina rättigheter">
          <p>
            Du har rätt att få tillgång till, rätta och radera dina uppgifter,
            samt att återkalla ditt samtycke. Vill du radera ditt konto eller
            avregistrera dig från nyhetsbrevet, hör av dig så hjälper vi dig.
          </p>
        </Section>

        <Section title="Kontakt">
          <p>
            Frågor om dina uppgifter? Kontakta oss via{" "}
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-bitcoin underline underline-offset-4 hover:text-bitcoin/80"
            >
              {siteConfig.instagramHandle}
            </a>{" "}
            eller läs mer{" "}
            <Link
              href="/om"
              className="font-medium text-bitcoin underline underline-offset-4 hover:text-bitcoin/80"
            >
              om bitcoinlivet
            </Link>
            .
          </p>
        </Section>
      </Container>
    </div>
  );
}
