# Analys – besöksstatistik

Sajten kan köra tre analysverktyg. Alla är frivilliga och laddas **bara när de
är konfigurerade** (inget körs i utveckling eller innan du fyllt i ID).

| Verktyg | Vad det ger | Konfiguration |
| --- | --- | --- |
| **Vercel Web Analytics** | Besökare, sidvisningar, källor – cookiefritt | Redan på (via `@vercel/analytics`). Aktivera i Vercel-projektet under **Analytics**. |
| **Google Analytics 4** | Detaljerad trafik, händelser, mål | `NEXT_PUBLIC_GA_ID` |
| **Microsoft Clarity** | Heatmaps + sessionsinspelningar | `NEXT_PUBLIC_CLARITY_ID` |
| **Google Tag Manager** | Hantera taggar utan kod (valfritt) | `NEXT_PUBLIC_GTM_ID` |
| **Meta Pixel** | IG/FB-annonsmätning & retargeting | `NEXT_PUBLIC_META_PIXEL_ID` |

### Samtycke (Consent Mode v2) & konverteringshändelser

- **Google-taggar (GA4 + GTM)** använder **Consent Mode v2**: de laddas alltid
  men i läge `denied`; cookies/annonsdata slås på först när besökaren godkänner i
  cookie-rutan. Ad-redo och EU-kompatibelt.
- **Clarity** och **Meta Pixel** laddas först **efter** uttryckligt samtycke.
- **Konverteringshändelser** skickas automatiskt (`lib/analytics/track.ts`) till
  GA4, GTM och Meta: `newsletter_subscribe`, `sign_up`, `login`,
  `lesson_complete`, `course_complete`. Markera dem som *Conversions* i GA4
  (Admin → Events) och som standardhändelser i Meta för annonsoptimering.
- Besökaren kan ändra sitt val via **Cookie-inställningar** i sidfoten;
  integritetspolicy finns på `/integritetspolicy`.

> **GTM-varning:** om du lägger GA4 *inuti* GTM, ta bort `NEXT_PUBLIC_GA_ID` så
> att GA inte räknas dubbelt.

## 1. Google Analytics 4

1. Skapa en property på [analytics.google.com](https://analytics.google.com)
   → Admin → Data Streams → Web.
2. Kopiera **Measurement ID** (`G-XXXXXXXXXX`).
3. Lägg i `.env.local` (och på Vercel under Environment Variables):
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

## 2. Microsoft Clarity

1. Skapa ett projekt på [clarity.microsoft.com](https://clarity.microsoft.com).
2. Under **Settings → Overview** finns ditt **Project ID** (kort sträng).
3. Lägg i `.env.local` (och på Vercel):
   ```
   NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
   ```

## 3. Aktivera

Starta om dev-servern efter att du fyllt i värdena. På Vercel: lägg samma
variabler under **Settings → Environment Variables** och deploya om.

Verifiera: ladda sajten, öppna webbläsarens nätverksflik och leta efter anrop
till `googletagmanager.com` (GA) respektive `clarity.ms` (Clarity). I
verktygens egna dashboards syns realtidsbesökare inom någon minut.

## Integritet & cookies (GDPR) – samtycke inbyggt

Vercel Web Analytics är cookiefritt och körs alltid. **GA4 och Clarity sätter
cookies** och laddas därför **bara efter samtycke**:

- En minimalistisk **cookie-banner** (`components/layout/cookie-consent.tsx`)
  visas tills besökaren väljer **Acceptera** eller **Avböj**.
- Valet sparas i `localStorage` (`bitcoinlivet:cookie-consent:v1`).
- GA4/Clarity (`components/layout/analytics.tsx`) laddas endast när valet är
  **granted** *och* respektive ID är satt.

Vill du låta besökaren ändra sitt val senare kan en "Cookie-inställningar"-länk
i sidfoten nollställa nyckeln ovan — säg till så lägger jag till det. Komplettera
gärna även med en integritetspolicy som beskriver vad som samlas in.
