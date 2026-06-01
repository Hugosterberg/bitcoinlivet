# Supabase – nyhetsbrev, konton & progression

Det här dokumentet beskriver hur du aktiverar användarsystemet. Sajten
fungerar **utan** Supabase (progression sparas då lokalt i webbläsaren och
nyhetsbrevsformuläret visar ett tydligt "inte aktiverat ännu"-meddelande). När
du fyllt i miljövariablerna nedan slås allt på automatiskt.

## Arkitektur i korthet

| Område | Lagring | Anmärkning |
| --- | --- | --- |
| **Nyhetsbrev** | `newsletter_subscribers` | Ingen double opt-in, ingen e-post skickas. Dubbletter ignoreras. Skrivs via RPC `subscribe_to_newsletter` (security definer) – anon kan aldrig läsa listan. |
| **Kursinnehåll** | I kod (`features/education/data/courses.ts`) | Lagras **inte** i databasen. |
| **Slutförda lektioner** | `lesson_completions` (1 rad/lektion) | Spegling av `ProgressData.lessons`. Ger statistik och "senaste aktivitet". |
| **XP, streak, märken** | `user_progress` (1 rad/användare) | Aggregat som speglar dagens klientlogik 1:1. |

Anonyma besökare använder fortsatt `localStorage`. Vid inloggning slås den
lokala progressionen ihop med kontot (`mergeLocalIntoAccount`), och därefter
synkas allt mot Supabase. All användardata skyddas av **Row Level Security** –
en användare kan bara läsa och ändra sina egna rader.

## 1. Skapa projektet

1. Skapa ett projekt på [supabase.com](https://supabase.com).
2. Under **Project Settings → API**, kopiera:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** (eller **publishable**) key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Miljövariabler

Fyll i `.env.local` med värdena (filen finns redan i projektroten):

```bash
# Hela Project URL, inte bara projekt-id:t:
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
# Publishable key (sb_publishable_...) eller anon/public key (eyJ...):
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Använd **publishable/anon**-nyckeln, aldrig secret/service_role-nyckeln i en
`NEXT_PUBLIC_`-variabel (den kringgår RLS).

På Vercel: lägg samma variabler under **Project → Settings → Environment
Variables**. (`.env*` är redan gitignorerat, så `.env.local` checkas aldrig in.)

## 3. Kör migrationerna

Migrationerna ligger i `supabase/migrations/`.

**Alternativ A – Supabase CLI (rekommenderas):**

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

**Alternativ B – Dashboard:** öppna **SQL Editor** och kör innehållet i
`0001_newsletter.sql` följt av `0002_user_progress.sql`.

## 4. Konfigurera Auth

Under **Authentication → Providers** är **Email** påslaget som standard.

**Stäng av e-postbekräftelse** så att konton blir aktiva direkt vid
registrering (ingen bekräftelselänk):

> **Authentication → Sign In / Providers → Email → Confirm email → AV**

Då får nya konton en session omedelbart och `signUp` skickar dem direkt till
`/konto`. (Med inställningen på visas istället "Bekräfta din e-post".)

Triggern `on_auth_user_created` (i `0002`) skapar automatiskt en tom
`user_progress`-rad för varje ny användare.

#### Glömt lösenord (återställning)

"Glömt lösenord?" på inloggningssidan skickar ett mejl via Supabase. För att
länken ska fungera måste återställnings-URL:en vara tillåten:

> **Authentication → URL Configuration → Redirect URLs** — lägg till
> `http://localhost:3000/auth/callback` (utveckling) och
> `https://bitcoinlivet.se/auth/callback` (produktion).

Sätt även **Site URL** till din produktionsdomän. Flödet: mejllänk →
`/auth/callback` (växlar koden mot en session) → `/aterstall` (välj nytt
lösenord). För många utskick, konfigurera egen SMTP under **Authentication →
Emails** (Supabases standardutskick är hårt rate-limitade).

### Samtycke för nyhetsutskick (GDPR)

Registreringsformuläret har en **opt-in-kryssruta** (oförkryssad som standard)
där användaren kan godkänna nyhetsutskick. Vid registrering:

- Samtycket sparas på användaren i `user_metadata`
  (`marketing_consent` + `marketing_consent_at` för spårbarhet).
- Om kryssrutan är ikryssad läggs e-postadressen även till i
  `newsletter_subscribers` (samma lista som hemsidans nyhetsbrev), så att du har
  en samlad, laglig sändlista.

Samtycket är frivilligt och aldrig ett villkor för att skapa konto – det är så
ett giltigt opt-in enligt GDPR/ePrivacy ska fungera. Faktiska utskick kräver en
e-posttjänst (t.ex. Resend); den är inte kopplad ännu.

## 5. (Valfritt) Regenerera TypeScript-typer

`lib/supabase/types.ts` är handskriven och matchar migrationerna. Efter
schemaändringar kan den regenereras:

```bash
npx supabase gen types typescript --project-id <project-ref> --schema public > lib/supabase/types.ts
```

## 6. Verifiera

- **Nyhetsbrev:** skriv upp en adress på startsidan → en rad i
  `newsletter_subscribers`. Samma adress igen → fortfarande en rad.
- **Konto:** gå till `/konto`, skapa konto / logga in.
- **Progression:** slutför en lektion under `/utbildning` → rader dyker upp i
  `lesson_completions` och `user_progress`. Logga in i en annan webbläsare →
  progressionen följer med.
- **RLS:** i SQL Editor, verifiera att en användare inte kan läsa en annan
  användares rader.
