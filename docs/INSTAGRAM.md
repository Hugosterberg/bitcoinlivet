# Instagram-flöde – dina senaste inlägg

Startsidans Instagram-sektion kan visa dina **senaste inlägg automatiskt** i en
egen, varumärkesanpassad grid (inte en generisk widget).

## Varför en mellantjänst behövs

Instagrams gamla **Basic Display API stängdes ner i december 2024**. För att
hämta "senaste inlägg" krävs nu Instagram **Graph API**, vilket kräver ett
Business/Creator-konto, en Meta-app och en åtkomsttoken som måste förnyas var
~60:e dag. För att slippa det använder vi **[Behold.so](https://behold.so)** –
en gratis tjänst som sköter API:t och token-förnyelsen och ger en ren JSON-feed.

## Uppsättning (ca 3 min)

1. Skapa ett konto på [behold.so](https://behold.so) och **anslut ditt
   Instagram-konto** (Business/Creator; koppla det till en Facebook-sida om
   Behold ber om det – guiden visar hur).
2. Skapa en **Feed** och kopiera dess **JSON-endpoint**, t.ex.
   `https://feeds.behold.so/XXXXXXXX`.
3. Lägg den i `.env.local` (och på Vercel under Environment Variables):
   ```
   INSTAGRAM_FEED_URL=https://feeds.behold.so/XXXXXXXX
   ```
4. Starta om dev-servern.

Klart — de tre senaste inläggen laddas in och cachas i en timme
(`revalidate: 3600`). Klick på ett inlägg öppnar det på Instagram.

## Beteende utan feed

- **Ingen `INSTAGRAM_FEED_URL`:** faller tillbaka till manuella inbäddningar om
  du lagt in shortcodes i `features/home/data/instagram.ts`, annars en snygg
  platshållare. Sektionen ser aldrig trasig ut.
- **Fel/nere:** samma graceful fallback (inga krascher).

## Alternativ (om du vill äga API:t själv)

Instagram **Graph API** direkt: skapa en Meta-app, generera en long-lived token
och peka `INSTAGRAM_FEED_URL` mot din egen endpoint som returnerar samma
JSON-form (`{ posts: [{ permalink, mediaType, caption, sizes|mediaUrl, ... }] }`).
Säg till så hjälper jag dig koppla in det istället för Behold.
