# Bitcoinlivet – Datakällor, verktyg & roadmap

Det här dokumentet samlar **gratis datakällor**, **rekommenderade verktyg/integrationer**
och en **prioriterad funktionsplan** för Bitcoinlivet. Allt är valt för att passa
varumärket: svenskt, lugnt, datadrivet och anti-hype.

> Princip: börja med gratis, server-renderbara källor utan API-nyckel. Lägg till
> nycklar/tjänster först när en funktion verkligen kräver det. Cacha alltid
> (Next.js `revalidate`) så att vi är snälla mot gratis-API:er.

---

## 1. Gratis datakällor

### 1.1 Pris & marknad (Bitcoin)

| Källa | Nyckel? | Vad du får | Bra för | Anteckning |
| --- | --- | --- | --- | --- |
| [CoinGecko API](https://www.coingecko.com/en/api) | Nej (free tier) | Pris i **SEK/USD**, marknadsvärde, volym, historik (`/coins/bitcoin/market_chart`) | Pris-kort, långtidsgraf | Stödjer `vs_currency=sek` direkt. ~30 anrop/min. |
| [CoinCap API](https://docs.coincap.io/) | Nej | Pris, marknadsvärde, historik | Backup-källa | Enkel, generös gräns. |
| [Kraken public REST](https://docs.kraken.com/rest/) | Nej | Ticker, OHLC | Robust pris (EUR/USD) | Saknar SEK-par – konvertera via FX. |
| [Bitstamp](https://www.bitstamp.net/api/) / [Coinbase](https://docs.cloud.coinbase.com/) | Nej | Spot-ticker | Sanity-check mot CoinGecko | — |
| [Blockchain.com Charts/Stats](https://www.blockchain.com/explorer/api/charts_api) | Nej | Marknadspris + on-chain-tidsserier | Historiska grafer | — |

**Rekommendation:** CoinGecko som primär (SEK-stöd), CoinCap som fallback.

### 1.2 On-chain & nätverk

| Källa | Nyckel? | Vad du får | Bra för |
| --- | --- | --- | --- |
| [mempool.space API](https://mempool.space/docs/api/rest) | Nej (CORS: `*`) | Blockhöjd, avgifter, mempool, difficulty, hashrate | **Halveringsnedräkning**, avgiftswidget (redan delvis implementerat) |
| [Blockchain.info](https://www.blockchain.com/explorer/api) | Nej | Utbud, transaktioner, hashrate | Utbuds-/nätverksstatistik |
| [Bitnodes](https://bitnodes.io/api/) | Nej | Antal noder globalt | "Decentralisering"-widget |
| [Clark Moody Dashboard](https://bitcoin.clarkmoody.com/dashboard/) | — | Referens/inspiration | Designidéer för datavyer |

**Halvering:** härleds ur blockhöjd. Nästa halvering vid block `1 050 000`
(halvering var 210 000:e block). `nästa = Math.ceil(höjd / 210000) * 210000`.

### 1.3 Makro & inflation (för köpkraft-temat)

| Källa | Nyckel? | Vad du får | Bra för |
| --- | --- | --- | --- |
| [SCB öppna API (PxWeb)](https://www.scb.se/api) | Nej | **Svensk KPI/inflation** (officiell) | Inflationsgrafen – byt ut exempeldata |
| [Riksbanken SWEA API](https://developer.api.riksbank.se/) | Nej | Räntor, **SEK/USD-växelkurs** | Valutakonvertering, räntekontext |
| [Frankfurter](https://www.frankfurter.app/) | Nej | Gratis FX (ECB-data) | Enkel SEK↔USD-konvertering |
| [ECB SDW API](https://data.ecb.europa.eu/help/api/overview) | Nej | Euro-inflation, M3 | Jämförelse euro/Sverige |
| [FRED (St. Louis Fed)](https://fred.stlouisfed.org/docs/api/fred/) | Ja (gratis) | US CPI, **M2 penningmängd** | "Pengar trycks"-perspektivet |

**Rekommendation:** SCB för svensk inflation (perfekt för varumärket),
Riksbanken/Frankfurter för SEK-kurs.

### 1.4 Sentiment & övrigt

| Källa | Nyckel? | Vad du får | Bra för |
| --- | --- | --- | --- |
| [Alternative.me Fear & Greed](https://alternative.me/crypto/fear-and-greed-index/) | Nej | Index 0–100 | "Marknadshumör"-mätare (pedagogiskt, inte signal) |

---

## 2. Rekommenderade verktyg & integrationer

| Område | Rekommendation | Varför |
| --- | --- | --- |
| **Hosting** | Vercel | Bäst för Next.js; preview-deploys, edge, analytics. |
| **Analytics** | Vercel Web Analytics **eller** [Plausible](https://plausible.io) | Integritetsvänligt, cookie-fritt – passar anti-hype/förtroende. |
| **Nyhetsbrev** | [Resend](https://resend.com) + egen API-route, alt. [Buttondown](https://buttondown.com) / [MailerLite](https://www.mailerlite.com) / [Kit](https://kit.com) | Ersätt platshållarformuläret. Resend = utvecklarvänligt; Buttondown = enkelt och "indie". |
| **Sök** | [Pagefind](https://pagefind.app) | Statisk, snabb sök för bloggen utan backend. |
| **OG-bilder** | `next/og` (`ImageResponse`) | Dynamiska delningsbilder per artikel. |
| **RSS** | Egen `app/feed.xml/route.ts` | SEO + prenumeranter; lätt att bygga från `getAllPosts()`. |
| **Felövervakning** | [Sentry](https://sentry.io) | Fånga runtime-fel i produktion. |
| **CMS (om icke-tekniker ska skriva)** | Behåll **MDX**, alt. [Sanity](https://www.sanity.io) eller [Velite](https://velite.js.org)/Contentlayer | MDX räcker länge; Sanity om redaktörer behövs. |
| **Bilder** | `next/image` + Vercel | Optimering, AVIF/WebP, lazy-load. |
| **Donationer (valfritt, on-brand)** | [Strike](https://strike.me), [OpenNode](https://www.opennode.com) eller självhostad [BTCPay Server](https://btcpayserver.org) | "Tipsa med Lightning" – passar Bitcoin-temat. |
| **i18n (framtid)** | [next-intl](https://next-intl-docs.vercel.app) | Om engelsk version blir aktuell. |

---

## 3. Funktionsroadmap (prioriterad)

### P0 – Live-data (störst effekt)
- [x] **Live Bitcoin-pris** (CoinGecko, SEK) i datakorten och hero – server-fetch med fallback till exempeldata.
- [x] **Halveringsnedräkning** (mempool.space) – *implementerad som klientwidget med graceful states.*
- [x] **Avgiftswidget** (mempool.space `fees/recommended`) – sat/vB just nu.
- [x] Tydlig märkning "live" vs "exempel" på datasidan (`SourceNote`-komponenten).

### P1 – Svensk makro & verktyg
- [x] **Riktig inflationsgraf** från SCB (svensk KPI, årsförändring) – `getInflation()` i `lib/live-data.ts`.
- [x] **SEK-kurs** via Frankfurter → korrekt SEK i historik (`getInvestmentHistory`).
- [x] **DCA / sparkalkylator** ("Min Bitcoin-resa" + `SavingsCalculator`) – pedagogiskt, utan löften.
- [x] **Fear & Greed-mätare** (alternative.me) – förklarad som humör, inte signal.

### P2 – Innehåll, distribution & SEO
- [x] **Instagram-flöde** + länk till profilen.
- [x] **RSS-flöde** för bloggen (`app/feed.xml/route.ts`, länkad i `<head>`).
- [x] **OG-bilder** (`next/og`) – standardbild + dynamisk per blogginlägg.
- [x] **Bloggsök** – lättviktig klient-sök (titel/beskrivning/kategori) utan extra beroende, ersätter behovet av Pagefind tills vidare.
- [x] **Ordlista/begrepp** (`/ordlista`, ~27 termer, schema.org `DefinedTermSet`).
- [x] **Web Analytics** – `@vercel/analytics` (integritetsvänligt, no-op utanför Vercel).

### P3 – Fördjupning
- [x] Dedikerad **halveringssida** (`/halvering`) med live-nedräkning + historik.
- [x] "**Bitcoin idag**" (`/bitcoin-idag`) – daglig ögonblicksbild (pris/avgift/humör/halvering) + automatiska rubriker via RSS/Atom (Bitcoin Magazine, Cointelegraph, Bitcoin Optech). Cachas 1 h. Källor redigeras i `lib/news.ts`.
- [x] **Lightning-tipsjar** – konfigurerbar via `siteConfig.lightningAddress` (placeholder tills adress fylls i).
- [ ] Engelsk version (i18n) – kräver beslut om `next-intl` och översättningsarbete.

---

## 4. Instagram-integration (status & uppgradering)

**Nuvarande lösning (gratis, ingen nyckel):** `iframe`-inbäddning av publika inlägg
via `https://www.instagram.com/p/<shortcode>/embed/captioned`. Konfigureras i
`lib/instagram.ts` – klistra bara in shortcodes från dina inläggslänkar.

```
https://www.instagram.com/p/ABC123xyz/  →  shortcode = "ABC123xyz"
```

Om inga inlägg är konfigurerade visas ett snyggt platshållarflöde + "Följ"-knapp,
så sidan aldrig ser trasig ut.

**Uppgradering (när du vill ha automatiskt flöde):**
1. **Instagram oEmbed** (Meta Graph API) – kräver en Meta-app + token; ger
   officiell inbäddning och tillåter dynamisk hämtning.
2. **Instagram Basic Display API** – hämta dina senaste inlägg programmatiskt
   (kräver app-granskning av Meta).
3. Tredjepart (t.ex. Behold, EmbedSocial, SnapWidget) – enklast men oftast betalt.

Rekommendation: behåll iframe-inbäddningen tills du vill ha ett auto-uppdaterat
flöde – då är oEmbed via en server-route nästa steg (cacha resultatet).

---

## 5. Implementationsanteckningar

- **Cachning:** server-fetch med `export const revalidate = 60` (eller `fetch(..., { next: { revalidate } })`). Undvik att slå mot gratis-API:er per besök.
- **Felhantering:** varje datavy ska ha **loading / error / empty**-tillstånd (följer projektets princip).
- **Hemligheter:** lägg API-nycklar i `.env.local` / Vercel env vars. `NEXT_PUBLIC_*` endast för värden som får exponeras i klienten.
- **Disclaimer:** behåll "Detta är inte finansiell rådgivning." på alla datavyer.
- **Attribution:** vissa gratis-API:er (CoinGecko m.fl.) vill ha en liten "Powered by"-länk – respektera deras villkor.
