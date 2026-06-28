# Resend – nyhetsutskick till de som tackat ja

Skickar plattformsnyheter via e-post **endast till personer som accepterat**.
Fungerar utan konfiguration (utskick är då avstängt och påverkar inget annat).

## Samtyckesmodell (vilka får mejl?)

En adress hamnar i sändlistan **bara** genom ett aktivt opt-in:

| Källa | Opt-in |
| --- | --- |
| Nyhetsbrevsformuläret på startsidan | Att fylla i och skicka = man vill ha nyheter |
| Kontoregistrering | Endast om kryssrutan "få nyheter via e-post" är ikryssad |

Vid varje opt-in:
1. Adressen sparas i Supabase (`newsletter_subscribers`) – källan till sanning,
   med samtycke loggat på användaren (`user_metadata.marketing_consent*`).
2. Adressen läggs till som **kontakt i en Resend Audience**.

Utskick går till **audiencen** – aldrig till en lista som anroparen anger – så
ett utskick kan per definition bara nå de som tackat ja. Resend lägger även
automatiskt till en **avregistreringslänk** (lagkrav).

## 1. Sätt upp Resend

1. Skapa konto på [resend.com](https://resend.com) och **verifiera din domän**
   (Domains → Add). Krävs för att skicka från `@bitcoinlivet.se`.
2. **API Keys → Create** → kopiera till `RESEND_API_KEY`.
3. **Audiences → Create audience** → kopiera id:t till `RESEND_AUDIENCE_ID`.
   Det här är listan med alla som tackat ja (svenska som standard).
4. **Tvåspråkigt (valfritt):** skapa en andra audience för engelska och lägg
   id:t i `RESEND_AUDIENCE_ID_EN`. Då hamnar de som registrerar sig på
   bitcoinerlife.xyz i den, och svenska anmälningar i `RESEND_AUDIENCE_ID`, så
   utskick kan göras på rätt språk. Utan den variabeln hamnar alla i den enda
   audiencen (som tidigare).

## 2. Miljövariabler (`.env.local`, server-only)

```bash
RESEND_API_KEY=re_xxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-...        # svenska (bitcoinlivet.se)
RESEND_AUDIENCE_ID_EN=xxxxxxxx-xxxx-...     # valfritt: engelska (bitcoinerlife.xyz)
RESEND_FROM=bitcoinlivet <noreply@bitcoinlivet.se>
RESEND_FROM_EN=bitcoinerlife <noreply@bitcoinerlife.xyz>  # valfritt: engelsk avsändare
NEWSLETTER_ADMIN_TOKEN=<en lång slumpmässig hemlig sträng>
```

Avsändarnamnet följer språket: `RESEND_FROM` för svenska och `RESEND_FROM_EN`
för engelska utskick (faller tillbaka till `RESEND_FROM` om den inte är satt).

Inga av dessa får ha prefixet `NEXT_PUBLIC_` – de ska aldrig nå webbläsaren.
Lägg samma värden på Vercel under **Settings → Environment Variables**.

## 3. Skicka ett nyhetsbrev

Två sätt, båda går bara till audiencen (de som accepterat):

**A. Från Resend-dashboarden (enklast):** **Broadcasts → Create** → välj din
audience → skriv och skicka. Bra för manuella, redaktionella utskick.

**B. Via det skyddade API:t** (för automatisering/skript):

```bash
curl -X POST https://bitcoinlivet.se/api/newsletter/broadcast \
  -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Nytt på bitcoinlivet","html":"<p>Hej! ...</p>","language":"sv"}'
```

- Skyddas av `NEWSLETTER_ADMIN_TOKEN` (utan token är endpointen helt stängd).
- `subject` och `html` krävs. `name` (valfritt) är en intern etikett i Resend.
- `language` (valfritt, `"sv"`/`"en"`) väljer audience när
  `RESEND_AUDIENCE_ID_EN` är satt; annars används den enda audiencen.
- Mottagare kan **inte** anges av anroparen – alltid hela audiencen.

## Noteringar

- **Inga utskick utan opt-in.** Transaktionsmejl (t.ex. lösenordsåterställning)
  hanteras separat av Supabase Auth och berörs inte av detta.
- Skulle Resend tillfälligt fela vid en registrering förblir adressen sparad i
  Supabase (med samtycke). En engångs-backfill till audiencen kan göras vid
  behov; säg till så lägger jag till ett litet skript.
