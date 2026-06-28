/**
 * Deep content for the "Funktioner" / "Features" pages — one rich page per
 * Bitcoin property, each motivating *why* the property matters in relation to
 * how money and payments work today. Calm, factual and anti-hype; never
 * financial advice.
 *
 * Bilingual: each function has a stable, locale-agnostic `id` and a localized
 * `slug` (URLs differ per domain, e.g. /funktioner/begransat-utbud vs
 * /features/limited-supply). hreflang/sitemap resolve the cross-locale slug via
 * the shared `id`.
 *
 * Halveringen has its own bespoke page at /halvering and is therefore not in
 * the functions list; it is added to the navigation menu separately below.
 */

import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/** Icon key, mapped to a Phosphor icon in
 *  features/functions/components/function-icon.tsx. */
export type FunctionIconKey =
  | "supply"
  | "halving"
  | "decentralisation"
  | "security"
  | "payments"
  | "purchasingPower"
  | "transparency";

/** A side-by-side contrast row: how it works today vs. with Bitcoin. */
export type FunctionCompare = { today: string; bitcoin: string };

export type FunctionSection = { heading: string; body: string[] };

export type RelatedLink = { href: string; label: string };

export type BitcoinFunction = {
  /** Stable, locale-agnostic identifier shared across locales. */
  id: string;
  /** Localized URL slug. */
  slug: string;
  icon: FunctionIconKey;
  title: string;
  /** Short line used in the mega-menu and the index cards. */
  menuDescription: string;
  /** Hero subtitle. */
  tagline: string;
  /** SEO meta description. */
  metaDescription: string;
  /** Lead paragraphs under the hero. */
  intro: string[];
  /** "Idag vs Bitcoin" contrast rows. */
  compare: FunctionCompare[];
  sections: FunctionSection[];
  /** Short takeaways. */
  takeaways: string[];
  related: RelatedLink[];
};

const svFunctions: BitcoinFunction[] = [
  {
    id: "limited-supply",
    slug: "begransat-utbud",
    icon: "supply",
    title: "Begränsat utbud",
    menuDescription:
      "Det kommer aldrig att finnas mer än 21 miljoner bitcoin. Taket är inbyggt och kan inte ändras.",
    tagline: "21 miljoner, för alltid. Varför ett fast tak förändrar allt.",
    metaDescription:
      "Bitcoin har ett matematiskt tak på 21 miljoner. Så fungerar det knappa, förutsägbara utbudet, och varför det skiljer sig från pengar som kan tryckas i obegränsad mängd.",
    intro: [
      "Bitcoin har ett tak inbyggt i sina regler: det kommer aldrig att finnas fler än 21 miljoner bitcoin. Ingen kan rösta fram fler, trycka fler i en kris eller smyga in undantag. Knappheten är inte ett löfte, den är en regel som var och en kan kontrollera själv.",
      "Det låter som en teknisk detalj, men det är kanske den enskilt viktigaste skillnaden mot pengarna vi använder i dag.",
    ],
    compare: [
      {
        today:
          "Centralbanker kan skapa nya pengar i princip obegränsat. Penningmängden växer år efter år, ofta snabbare i kriser.",
        bitcoin:
          "Utbudet är fastställt i kod. Det kan inte ökas, och takten nya bitcoin skapas i sjunker stegvis mot noll.",
      },
      {
        today:
          "Hur mycket pengar som finns, och vem som får de nya, avgörs av beslut du sällan ser eller kan påverka.",
        bitcoin:
          "Vem som helst kan ladda ner blockkedjan och själv räkna efter exakt hur många bitcoin som finns.",
      },
    ],
    sections: [
      {
        heading: "Pengar som kan tryckas urholkar sparande",
        body: [
          "När mängden pengar växer snabbare än mängden varor och tjänster tenderar priserna att stiga. Det är inte att saker blir 'dyrare' i sig, det är ofta att varje krona blir mindre värd. Den som sparar i kontanter förlorar då köpkraft i tysthet, år för år.",
          "Problemet är inte att pengar ibland skapas, utan att det inte finns någon gräns. Så länge mängden kan ökas finns alltid en frestelse att lösa kortsiktiga problem genom att späda ut det alla redan äger.",
        ],
      },
      {
        heading: "Ett tak ingen kan rucka på",
        body: [
          "Bitcoins 21 miljoner frigörs enligt ett schema som var känt från start. Nya bitcoin skapas som belöning till dem som säkrar nätverket, och den belöningen halveras ungefär vart fjärde år. I dag är runt 20 miljoner redan utgivna; de allra sista skapas först omkring år 2140.",
          "Det avgörande är att reglerna gäller lika för alla och inte kan ändras av en enskild aktör. Att ändra taket skulle kräva att en överväldigande majoritet av nätverket frivilligt gick med på att göra sina egna bitcoin mindre knappa, något ingen rationellt skulle vilja.",
        ],
      },
      {
        heading: "Varför knapphet är bra för världen",
        body: [
          "Pengar med ett känt, begränsat utbud belönar tålamod. När du vet att det du sparar inte kan spädas ut blir det lättare att tänka långsiktigt, planera och bygga. Historiskt har samhällen med stabila, hårda pengar haft lättare att spara och investera över generationer.",
          "Ett förutsägbart utbud är också mer rättvist: ingen grupp får tyst fördel av att stå närmast pengakranen. Alla räknar med samma regler.",
        ],
      },
    ],
    takeaways: [
      "Maxtak på 21 miljoner bitcoin, inbyggt i protokollet.",
      "Cirka 20 miljoner är redan utgivna; resten frigörs avtagande till ~2140.",
      "Ingen enskild aktör kan skapa fler eller ändra taket.",
      "Du kan själv verifiera utbudet med en egen nod.",
    ],
    related: [
      { href: "/halvering", label: "Läs om halveringen" },
      { href: "/data", label: "Se utbudet live" },
    ],
  },
  {
    id: "decentralisation",
    slug: "decentralisering",
    icon: "decentralisation",
    title: "Decentralisering",
    menuDescription:
      "Ingen central aktör styr Bitcoin. Nätverket drivs av tusentals oberoende noder.",
    tagline: "Ingen vd, inget huvudkontor, ingen avstängningsknapp.",
    metaDescription:
      "Bitcoin styrs inte av någon enskild aktör. Så fungerar decentraliseringen, varför ingen kan ta kontrollen, och vad det innebär för dig och världen.",
    intro: [
      "Bitcoin har ingen vd, inget huvudkontor och ingen knapp att stänga av. I stället sprids ansvaret mellan tusentals oberoende deltagare över hela världen som var och en följer samma regler.",
      "Det gör nätverket trögrörligt och svårt att förändra, vilket kan låta som en nackdel. I praktiken är det själva styrkan.",
    ],
    compare: [
      {
        today:
          "Banker och betalsystem styrs av enskilda aktörer som kan frysa konton, neka betalningar eller ändra villkoren.",
        bitcoin:
          "Tusentals oberoende noder följer samma regler. Ingen enskild kan ändra dem, censurera dig eller stänga av nätverket.",
      },
      {
        today:
          "Förtroendet vilar på institutioner: du måste lita på att de sköter sig och inte gör fel.",
        bitcoin:
          "Förtroendet vilar på öppen kod och matematik som vem som helst kan granska och köra själv.",
      },
    ],
    sections: [
      {
        heading: "Vad decentralisering betyder i praktiken",
        body: [
          "Tre grupper håller nätverket igång, utan att någon av dem bestämmer ensam. Noder laddar ner och kontrollerar att varje regel följs. Brytare föreslår nya block och lägger ner energi för att säkra dem. Användare väljer vilken version av programvaran de kör.",
          "Ingen behöver lita på någon annan. Om en brytare eller nod försöker bryta mot reglerna avvisas det helt enkelt av alla andra.",
        ],
      },
      {
        heading: "Varför ingen kan ta kontrollen",
        body: [
          "Förändringar i Bitcoins regler kräver bred enighet bland tusentals självständiga deltagare med olika intressen. Det gör det extremt svårt för någon enskild, vare sig ett företag, en stat eller en rik aktör, att ändra spelreglerna i sin egen favör.",
          "Samma egenskap gör nätverket motståndskraftigt. Det finns ingen central server att slå ut och ingen enskild punkt som kan fås att fallera.",
        ],
      },
      {
        heading: "Vad det ger dig och världen",
        body: [
          "Decentralisering ger censurmotstånd: en giltig transaktion kan inte stoppas och dina pengar kan inte frysas av en mellanhand. För många i världen, där banktillgång inte är självklar eller där den egna valutan kollapsar, är det inte en abstrakt princip utan en praktisk frihet.",
          "Det innebär också ett ansvar. När ingen kan stänga av dig kan ingen heller rädda dig om du tappar dina nycklar. Friheten och ansvaret hör ihop.",
        ],
      },
    ],
    takeaways: [
      "Ingen central aktör äger eller styr Bitcoin.",
      "Noder, brytare och användare balanserar varandra.",
      "Regeländringar kräver bred enighet, vilket skyddar mot manipulation.",
      "Ger censurmotstånd, men också eget ansvar för dina nycklar.",
    ],
    related: [
      { href: "/ordlista#nod", label: "Ordlista: Nod" },
      { href: "/ordlista#censurmotstand", label: "Ordlista: Censurmotstånd" },
    ],
  },
  {
    id: "security",
    slug: "sakerhet",
    icon: "security",
    title: "Säkerhet",
    menuDescription:
      "Kryptografi och proof of work gör det extremt dyrt att förfalska historiken.",
    tagline: "Energi förvandlad till säkerhet, och varför historiken är så svår att ändra.",
    metaDescription:
      "Hur skyddas Bitcoin? Så gör proof of work och kryptografi nätverkets historik extremt dyr att förfalska, och vad du själv ansvarar för.",
    intro: [
      "Bitcoin skyddas inte av lösenord eller av förtroende för en institution, utan av matematik och verkligt arbete. Det gör nätverkets historik praktiskt taget omöjlig att förfalska.",
      "Säkerheten finns på två nivåer: nätverkets, som sköts av protokollet, och din egen, som du själv ansvarar för.",
    ],
    compare: [
      {
        today:
          "Digitala konton skyddas av lösenord och av förtroende för institutioner som kan hackas, läcka eller missbrukas.",
        bitcoin:
          "Historiken skyddas av proof of work: en angripare måste överträffa hela nätverkets samlade datorkraft.",
      },
      {
        today:
          "En central databas kan ändras av den som har rätt behörighet, ibland i efterhand.",
        bitcoin:
          "Varje block bygger matematiskt på det förra. Att ändra något gammalt kräver att allt därefter räknas om.",
      },
    ],
    sections: [
      {
        heading: "Proof of work, kort förklarat",
        body: [
          "För att lägga till ett nytt block måste brytare lösa en beräkningsuppgift som kräver verklig el och hårdvara. Att hitta lösningen är svårt, men att kontrollera den är enkelt för alla andra. Den som lyckas belönas med nya bitcoin och avgifter.",
          "Att arbetet kostar något är hela poängen. Det knyter den digitala historiken till verklig energi, och gör det dyrt att försöka fuska.",
        ],
      },
      {
        heading: "Varför det blir dyrare att fuska över tid",
        body: [
          "Den samlade datorkraft som säkrar nätverket kallas hashrate, och den har vuxit enormt över åren. För att skriva om historiken skulle en angripare behöva mer kraft än resten av världens brytare tillsammans, och samtidigt betala för enorma mängder el.",
          "Ju mer nätverket växer, desto orimligare blir ett sådant angrepp. Energin omvandlas alltså löpande till säkerhet.",
        ],
      },
      {
        heading: "Din egen säkerhet",
        body: [
          "Nätverket kan vara hur säkert som helst, men dina bitcoin är bara så trygga som dina nycklar. Den som har den hemliga återställningsfrasen kontrollerar pengarna. Därför ska den skrivas ner offline, aldrig delas och aldrig matas in på uppmaning av någon som hör av sig.",
          "Just för att pengarna ska kunna ha en enda verklig ägare ligger ansvaret hos dig. Det är priset för att ingen mellanhand kan frysa, ta eller trolla bort det du äger.",
        ],
      },
    ],
    takeaways: [
      "Proof of work knyter säkerheten till verklig energi.",
      "Att ändra gammal historik kräver mer kraft än hela nätverket.",
      "Säkerheten växer i takt med nätverkets hashrate.",
      "Dina nycklar är ditt ansvar, skydda återställningsfrasen.",
    ],
    related: [
      { href: "/ordlista#proof-of-work", label: "Ordlista: Proof of work" },
    ],
  },
  {
    id: "fast-transactions",
    slug: "snabba-transaktioner",
    icon: "payments",
    title: "Snabba transaktioner",
    menuDescription:
      "Med lager som Lightning kan värde skickas världen över på sekunder, dygnet runt.",
    tagline: "Skicka värde vart som helst, dygnet runt, utan att fråga om lov.",
    metaDescription:
      "Hur snabbt är Bitcoin? Så fungerar baslagret och Lightning-nätverket, och varför gränslösa betalningar dygnet runt spelar roll.",
    intro: [
      "Bitcoin är öppet dygnet runt, året om. Det finns inga stängningstider, inga helger och inga gränser som stoppar en betalning. Hur snabbt det går beror på vilket lager du använder.",
      "Det är värt att vara ärlig: baslagret är byggt för säkerhet, inte hastighet. Det är ovanpå det som de riktigt snabba betalningarna sker.",
    ],
    compare: [
      {
        today:
          "Banköverföringar stannar på helger, stoppas vid gränser och kan ta dagar internationellt, ofta med höga avgifter.",
        bitcoin:
          "Nätverket är öppet 24/7. Med Lightning sker betalningar på sekunder för bråkdelar av ören.",
      },
      {
        today:
          "Att skicka pengar utomlands kräver ofta flera mellanhänder som var och en tar betalt och tar tid.",
        bitcoin:
          "Värde skickas direkt mellan parter, var som helst i världen, utan att be någon om tillåtelse.",
      },
    ],
    sections: [
      {
        heading: "Baslagret: avgörande, inte blixtsnabbt",
        body: [
          "På Bitcoins baslager samlas transaktioner i block ungefär var tionde minut. Det är medvetet långsamt: tiden och arbetet är det som gör historiken trygg och svår att ändra. Baslagret fungerar bäst som ett avvecklingslager för större eller slutgiltiga överföringar.",
          "När många vill in samtidigt stiger avgifterna, eftersom utrymmet i varje block är begränsat. Det är en naturlig kö, inte ett fel.",
        ],
      },
      {
        heading: "Lightning: vardagsbetalningar",
        body: [
          "Ovanpå baslagret finns Lightning Network, ett lager byggt för små, snabba betalningar. Där sker överföringar nästan omedelbart och för minimala avgifter, samtidigt som de till slut kan avräknas mot den säkra blockkedjan.",
          "Det är så Bitcoin kan vara både ett robust avvecklingslager och ett praktiskt sätt att betala för en kaffe, utan att tumma på säkerheten.",
        ],
      },
      {
        heading: "Varför gränslöshet spelar roll",
        body: [
          "För den som skickar pengar till familj i ett annat land kan dagens avgifter och väntetider äta upp en stor del av beloppet. Ett öppet nätverk dygnet runt sänker både kostnaden och tröskeln.",
          "Och för de många miljoner människor som saknar tillgång till en bank räcker det med en telefon för att ta emot och skicka värde. Tillgången är inte villkorad av var du bor eller vem du är.",
        ],
      },
    ],
    takeaways: [
      "Nätverket är öppet dygnet runt, utan helger eller gränser.",
      "Baslagret prioriterar säkerhet, med block ungefär var tionde minut.",
      "Lightning ger nära omedelbara betalningar för minimala avgifter.",
      "Gränslösa betalningar sänker trösklar för hela världen.",
    ],
    related: [
      { href: "/ordlista#lightning", label: "Ordlista: Lightning Network" },
      { href: "/ordlista#mempool", label: "Ordlista: Mempool" },
      { href: "/nyheter", label: "Se dagens avgifter" },
    ],
  },
  {
    id: "purchasing-power",
    slug: "kopkraft-pa-lang-sikt",
    icon: "purchasingPower",
    title: "Köpkraft på lång sikt",
    menuDescription:
      "Ett knappt, förutsägbart utbud är tänkt att bevara köpkraft när vanliga pengar urholkas.",
    tagline: "Mät sparande i vad pengarna räcker till, inte i antalet kronor.",
    metaDescription:
      "Varför mäts sparande i köpkraft? Så urholkar inflation vanliga pengar över tid, och tanken bakom Bitcoins knappa utbud som värdebevarare.",
    intro: [
      "Antalet kronor på kontot säger ingenting förrän vi vet vad de räcker till. Det som avgör din vardag är köpkraften, alltså hur mycket varor och tjänster pengarna faktiskt kan köpa.",
      "Och köpkraft är något som förändras, oftast långsamt och nästan omärkligt.",
    ],
    compare: [
      {
        today:
          "Vid 2 procents inflation halveras pengars köpkraft på ungefär 35 år. Kontanter tappar värde i tysthet.",
        bitcoin:
          "Ett fast utbud kan inte spädas ut. Tanken är att köpkraft bevaras i stället för att urholkas över tid.",
      },
      {
        today:
          "Du måste ta risk bara för att behålla värdet på dina sparpengar i takt med inflationen.",
        bitcoin:
          "Idén är pengar som inte behöver 'arbeta' för att inte tappa värde, eftersom de inte kan spädas ut.",
      },
    ],
    sections: [
      {
        heading: "Vad inflation gör med ditt sparande",
        body: [
          "Inflation betyder att den allmänna prisnivån stiger, så att samma summa räcker till lite mindre. Över ett enskilt år känns det sällan, men över ett decennium eller två blir effekten stor. En hundralapp som sparades för länge sedan köper i dag en bråkdel av vad den gjorde.",
          "En vanlig orsak är att mängden pengar ökar snabbare än mängden varor och tjänster. När det finns fler kronor som jagar samma utbud stiger priserna.",
        ],
      },
      {
        heading: "Knappa pengar och köpkraft",
        body: [
          "Pengar med ett begränsat, förutsägbart utbud kan inte spädas ut på samma sätt. Tanken är enkel: om ingen kan skapa mer, kan ingen heller urholka värdet av det du redan äger. Det är därför Bitcoins fasta tak är så centralt för hela idén om sundare pengar.",
          "Det betyder inte att priset är stabilt, tvärtom. Det betyder att den långsiktiga utspädningen, som drabbar vanliga pengar, är borttagen ur ekvationen.",
        ],
      },
      {
        heading: "Volatilitet på kort sikt, knapphet på lång sikt",
        body: [
          "Bitcoin svänger kraftigt i pris på kort sikt. Det är ett av skälen att tänka i år och decennier snarare än i veckor, och att aldrig spara mer än man har råd att avvara. Knappheten är ett argument om lång sikt, inte ett löfte om vad priset gör i morgon.",
          "Det här är inte finansiell rådgivning. Målet är att förstå skillnaden mellan pengar som kan spädas ut och pengar som inte kan det, så att du kan tänka klart kring ditt eget sparande.",
        ],
      },
    ],
    takeaways: [
      "Köpkraft, inte antalet kronor, är det som räknas.",
      "Inflation urholkar vanliga pengar långsamt men obönhörligt.",
      "Ett fast utbud kan inte spädas ut, vilket är tanken bakom värdebevarande.",
      "Volatilt på kort sikt, därför ett långsiktigt perspektiv.",
    ],
    related: [
      { href: "/artiklar/kopkraft-forklarat", label: "Läs: Köpkraft förklarat" },
      { href: "/data", label: "Se inflation och köpkraft" },
    ],
  },
  {
    id: "transparency",
    slug: "transparens",
    icon: "transparency",
    title: "Transparens",
    menuDescription:
      "Varje transaktion ligger öppet i blockkedjan och kan verifieras av vem som helst.",
    tagline: "En öppen kassabok som vem som helst kan granska.",
    metaDescription:
      "Bitcoins blockkedja är öppen och kan granskas av alla. Så fungerar transparensen, principen 'verifiera, lita inte', och hur den balanseras mot integritet.",
    intro: [
      "Bitcoin för en gemensam, öppen kassabok. Varje transaktion som någonsin gjorts, och varje bitcoin som finns, kan granskas av vem som helst, när som helst, utan att be om lov.",
      "Det är raka motsatsen till hur det finansiella systemet oftast fungerar i dag.",
    ],
    compare: [
      {
        today:
          "Det finansiella systemet är till stor del en svart låda. Du måste lita på att institutioner sköter bokföringen rätt.",
        bitcoin:
          "Hela blockkedjan är öppen. Vem som helst kan verifiera reglerna, utbudet och varje transaktion själv.",
      },
      {
        today:
          "Insyn i hur pengar skapas och rör sig är förbehållen ett fåtal.",
        bitcoin:
          "Insynen är total och gratis. Du behöver bara köra programvaran för att se allt med egna ögon.",
      },
    ],
    sections: [
      {
        heading: "Den öppna blockkedjan",
        body: [
          "Blockkedjan är en kronologisk liggare över alla transaktioner, kopierad till tusentals datorer världen över. Eftersom alla har samma kopia behövs ingen central bokförare, och eftersom allt är öppet kan ingen i tysthet skriva om historien.",
          "Det gör det möjligt att kontrollera saker som tidigare krävde blind tillit: hur många bitcoin som finns, att inga skapats utöver reglerna, och att en betalning verkligen ägt rum.",
        ],
      },
      {
        heading: "Verifiera, lita inte",
        body: [
          "Ett vanligt motto i Bitcoin är 'don't trust, verify', verifiera i stället för att lita på. Genom att köra en egen nod kan du själv kontrollera varje regel mot hela kedjan, utan att förlita dig på någon annans ord.",
          "Det flyttar makten från institutioner till individen. Du behöver inte tro på ett påstående, du kan kontrollera det.",
        ],
      },
      {
        heading: "Transparens och integritet",
        body: [
          "Öppenheten gäller transaktioner och adresser, inte namn. Adresser är pseudonyma, de avslöjar inte direkt vem du är, men eftersom allt är offentligt kan mönster ändå analyseras. Bitcoin är alltså transparent på system­nivå, men kräver eftertanke om du värdesätter integritet.",
          "Balansen är medveten: ett öppet system som alla kan granska, samtidigt som identiteten inte är inbyggd i kedjan.",
        ],
      },
    ],
    takeaways: [
      "Hela blockkedjan är öppen och kan granskas av vem som helst.",
      "Du kan verifiera utbud och regler själv, utan att lita på någon.",
      "En egen nod ger dig full insyn, 'verifiera, lita inte'.",
      "Adresser är pseudonyma, transparent på systemnivå men inte namngivet.",
    ],
    related: [
      { href: "/ordlista#full-nod", label: "Ordlista: Full nod" },
      { href: "/ordlista#blockkedja", label: "Ordlista: Blockkedja" },
    ],
  },
];

const enFunctions: BitcoinFunction[] = [
  {
    id: "limited-supply",
    slug: "limited-supply",
    icon: "supply",
    title: "Limited supply",
    menuDescription:
      "There will never be more than 21 million bitcoin. The cap is built in and can't be changed.",
    tagline: "21 million, forever. Why a fixed cap changes everything.",
    metaDescription:
      "Bitcoin has a mathematical cap of 21 million. How the scarce, predictable supply works, and why it differs from money that can be printed without limit.",
    intro: [
      "Bitcoin has a cap built into its rules: there will never be more than 21 million bitcoin. No one can vote more into existence, print more in a crisis or quietly slip in exceptions. The scarcity isn't a promise — it's a rule anyone can check for themselves.",
      "It sounds like a technical detail, but it may be the single most important difference from the money we use today.",
    ],
    compare: [
      {
        today:
          "Central banks can create new money essentially without limit. The money supply grows year after year, often faster in a crisis.",
        bitcoin:
          "The supply is fixed in code. It can't be increased, and the rate new bitcoin are created falls step by step toward zero.",
      },
      {
        today:
          "How much money exists, and who gets the new money, is decided by choices you rarely see or can influence.",
        bitcoin:
          "Anyone can download the blockchain and count for themselves exactly how many bitcoin exist.",
      },
    ],
    sections: [
      {
        heading: "Money that can be printed erodes savings",
        body: [
          "When the amount of money grows faster than the amount of goods and services, prices tend to rise. It isn't that things become 'more expensive' in themselves — it's often that each unit of money becomes worth less. Anyone saving in cash quietly loses purchasing power, year after year.",
          "The problem isn't that money is sometimes created, but that there's no limit. As long as the amount can be increased, there's always a temptation to solve short-term problems by diluting what everyone already owns.",
        ],
      },
      {
        heading: "A cap no one can move",
        body: [
          "Bitcoin's 21 million are released on a schedule known from the start. New bitcoin are created as a reward to those who secure the network, and that reward halves roughly every four years. Today around 20 million are already issued; the very last ones aren't created until around the year 2140.",
          "What matters is that the rules apply equally to everyone and can't be changed by a single actor. Changing the cap would require an overwhelming majority of the network to voluntarily agree to make their own bitcoin less scarce — something no one would rationally want.",
        ],
      },
      {
        heading: "Why scarcity is good for the world",
        body: [
          "Money with a known, limited supply rewards patience. When you know what you save can't be diluted, it becomes easier to think long term, plan and build. Historically, societies with stable, hard money have found it easier to save and invest across generations.",
          "A predictable supply is also fairer: no group gets a quiet advantage from standing closest to the money tap. Everyone works with the same rules.",
        ],
      },
    ],
    takeaways: [
      "A hard cap of 21 million bitcoin, built into the protocol.",
      "About 20 million are already issued; the rest release on a declining schedule to ~2140.",
      "No single actor can create more or change the cap.",
      "You can verify the supply yourself by running your own node.",
    ],
    related: [
      { href: "/halving", label: "Read about the halving" },
      { href: "/data", label: "See the supply live" },
    ],
  },
  {
    id: "decentralisation",
    slug: "decentralisation",
    icon: "decentralisation",
    title: "Decentralisation",
    menuDescription:
      "No central actor controls Bitcoin. The network is run by thousands of independent nodes.",
    tagline: "No CEO, no head office, no off switch.",
    metaDescription:
      "Bitcoin isn't controlled by any single actor. How decentralisation works, why no one can take control, and what it means for you and the world.",
    intro: [
      "Bitcoin has no CEO, no head office and no button to switch it off. Instead, responsibility is spread across thousands of independent participants around the world, each following the same rules.",
      "That makes the network slow-moving and hard to change, which might sound like a drawback. In practice it's the whole strength.",
    ],
    compare: [
      {
        today:
          "Banks and payment systems are run by individual actors who can freeze accounts, refuse payments or change the terms.",
        bitcoin:
          "Thousands of independent nodes follow the same rules. No single one can change them, censor you or shut down the network.",
      },
      {
        today:
          "Trust rests on institutions: you have to trust that they behave and don't make mistakes.",
        bitcoin:
          "Trust rests on open code and mathematics that anyone can inspect and run themselves.",
      },
    ],
    sections: [
      {
        heading: "What decentralisation means in practice",
        body: [
          "Three groups keep the network running, without any one of them deciding alone. Nodes download and check that every rule is followed. Miners propose new blocks and spend energy to secure them. Users choose which version of the software they run.",
          "No one has to trust anyone else. If a miner or node tries to break the rules, it's simply rejected by everyone else.",
        ],
      },
      {
        heading: "Why no one can take control",
        body: [
          "Changes to Bitcoin's rules require broad agreement among thousands of independent participants with different interests. That makes it extremely hard for any single party — a company, a state or a wealthy actor — to change the rules of the game in their own favour.",
          "The same property makes the network resilient. There's no central server to knock out and no single point that can be made to fail.",
        ],
      },
      {
        heading: "What it gives you and the world",
        body: [
          "Decentralisation gives censorship resistance: a valid transaction can't be stopped and your money can't be frozen by an intermediary. For many in the world, where access to banking isn't a given or where the local currency collapses, that isn't an abstract principle but a practical freedom.",
          "It also means responsibility. When no one can shut you out, no one can rescue you either if you lose your keys. The freedom and the responsibility go together.",
        ],
      },
    ],
    takeaways: [
      "No central actor owns or controls Bitcoin.",
      "Nodes, miners and users balance one another.",
      "Rule changes require broad agreement, which protects against manipulation.",
      "Gives censorship resistance, but also personal responsibility for your keys.",
    ],
    related: [
      { href: "/glossary#node", label: "Glossary: Node" },
      { href: "/glossary#censorship-resistance", label: "Glossary: Censorship resistance" },
    ],
  },
  {
    id: "security",
    slug: "security",
    icon: "security",
    title: "Security",
    menuDescription:
      "Cryptography and proof of work make it extremely expensive to forge the history.",
    tagline: "Energy turned into security, and why the history is so hard to change.",
    metaDescription:
      "How is Bitcoin protected? How proof of work and cryptography make the network's history extremely expensive to forge, and what you're responsible for yourself.",
    intro: [
      "Bitcoin isn't protected by passwords or by trust in an institution, but by mathematics and real work. That makes the network's history practically impossible to forge.",
      "Security exists on two levels: the network's, handled by the protocol, and your own, which is your responsibility.",
    ],
    compare: [
      {
        today:
          "Digital accounts are protected by passwords and by trust in institutions that can be hacked, leak or be misused.",
        bitcoin:
          "The history is protected by proof of work: an attacker has to outmatch the network's entire combined computing power.",
      },
      {
        today:
          "A central database can be changed by whoever has the right permissions, sometimes after the fact.",
        bitcoin:
          "Each block builds mathematically on the last. Changing anything old requires redoing everything after it.",
      },
    ],
    sections: [
      {
        heading: "Proof of work, briefly explained",
        body: [
          "To add a new block, miners have to solve a computational task that requires real electricity and hardware. Finding the solution is hard, but checking it is easy for everyone else. Whoever succeeds is rewarded with new bitcoin and fees.",
          "That the work costs something is the whole point. It ties the digital history to real energy, and makes cheating expensive to attempt.",
        ],
      },
      {
        heading: "Why cheating gets more expensive over time",
        body: [
          "The combined computing power that secures the network is called the hash rate, and it has grown enormously over the years. To rewrite the history, an attacker would need more power than the rest of the world's miners combined, while paying for huge amounts of electricity.",
          "The more the network grows, the more unreasonable such an attack becomes. Energy is thus continuously converted into security.",
        ],
      },
      {
        heading: "Your own security",
        body: [
          "The network can be as secure as you like, but your bitcoin are only as safe as your keys. Whoever has the secret recovery phrase controls the money. So it should be written down offline, never shared and never entered at the prompting of someone who reaches out to you.",
          "Precisely so that money can have a single true owner, the responsibility lies with you. That's the price of no intermediary being able to freeze, take or make disappear what you own.",
        ],
      },
    ],
    takeaways: [
      "Proof of work ties security to real energy.",
      "Changing old history requires more power than the whole network.",
      "Security grows with the network's hash rate.",
      "Your keys are your responsibility — protect the recovery phrase.",
    ],
    related: [
      { href: "/glossary#proof-of-work", label: "Glossary: Proof of work" },
    ],
  },
  {
    id: "fast-transactions",
    slug: "fast-transactions",
    icon: "payments",
    title: "Fast transactions",
    menuDescription:
      "With layers like Lightning, value can be sent around the world in seconds, around the clock.",
    tagline: "Send value anywhere, around the clock, without asking permission.",
    metaDescription:
      "How fast is Bitcoin? How the base layer and the Lightning network work, and why borderless payments around the clock matter.",
    intro: [
      "Bitcoin is open around the clock, all year. There are no closing hours, no weekends and no borders that stop a payment. How fast it goes depends on which layer you use.",
      "It's worth being honest: the base layer is built for security, not speed. The really fast payments happen on top of it.",
    ],
    compare: [
      {
        today:
          "Bank transfers pause on weekends, are stopped at borders and can take days internationally, often with high fees.",
        bitcoin:
          "The network is open 24/7. With Lightning, payments happen in seconds for fractions of a cent.",
      },
      {
        today:
          "Sending money abroad often requires several intermediaries, each of which charges and takes time.",
        bitcoin:
          "Value is sent directly between parties, anywhere in the world, without asking anyone for permission.",
      },
    ],
    sections: [
      {
        heading: "The base layer: decisive, not lightning-fast",
        body: [
          "On Bitcoin's base layer, transactions are gathered into blocks roughly every ten minutes. That's deliberately slow: the time and the work are what make the history secure and hard to change. The base layer works best as a settlement layer for larger or final transfers.",
          "When many want in at once, fees rise, because the space in each block is limited. It's a natural queue, not a fault.",
        ],
      },
      {
        heading: "Lightning: everyday payments",
        body: [
          "On top of the base layer sits the Lightning Network, a layer built for small, fast payments. There, transfers happen almost instantly and for minimal fees, while ultimately settling against the secure blockchain.",
          "That's how Bitcoin can be both a robust settlement layer and a practical way to pay for a coffee, without compromising on security.",
        ],
      },
      {
        heading: "Why being borderless matters",
        body: [
          "For someone sending money to family in another country, today's fees and waiting times can eat up a large part of the amount. An open network around the clock lowers both the cost and the threshold.",
          "And for the many millions of people without access to a bank, a phone is enough to receive and send value. Access isn't conditional on where you live or who you are.",
        ],
      },
    ],
    takeaways: [
      "The network is open around the clock, with no weekends or borders.",
      "The base layer prioritises security, with blocks roughly every ten minutes.",
      "Lightning gives near-instant payments for minimal fees.",
      "Borderless payments lower thresholds for the whole world.",
    ],
    related: [
      { href: "/glossary#lightning", label: "Glossary: Lightning Network" },
      { href: "/glossary#mempool", label: "Glossary: Mempool" },
      { href: "/news", label: "See today's fees" },
    ],
  },
  {
    id: "purchasing-power",
    slug: "purchasing-power",
    icon: "purchasingPower",
    title: "Purchasing power over the long run",
    menuDescription:
      "A scarce, predictable supply is meant to preserve purchasing power as ordinary money erodes.",
    tagline: "Measure saving by what the money buys, not by the number of kronor.",
    metaDescription:
      "Why is saving measured in purchasing power? How inflation erodes ordinary money over time, and the idea behind Bitcoin's scarce supply as a store of value.",
    intro: [
      "The number of kronor in your account says nothing until we know what they buy. What shapes your everyday life is purchasing power — how much in goods and services the money can actually buy.",
      "And purchasing power is something that changes, usually slowly and almost imperceptibly.",
    ],
    compare: [
      {
        today:
          "At 2 percent inflation, money's purchasing power halves in about 35 years. Cash loses value quietly.",
        bitcoin:
          "A fixed supply can't be diluted. The idea is that purchasing power is preserved rather than eroded over time.",
      },
      {
        today:
          "You have to take on risk just to keep the value of your savings in step with inflation.",
        bitcoin:
          "The idea is money that doesn't need to 'work' to avoid losing value, because it can't be diluted.",
      },
    ],
    sections: [
      {
        heading: "What inflation does to your savings",
        body: [
          "Inflation means the general price level rises, so the same sum buys a little less. Over a single year it's rarely felt, but over a decade or two the effect is large. A hundred-krona note saved long ago buys a fraction today of what it once did.",
          "A common cause is the amount of money growing faster than the amount of goods and services. When more kronor chase the same supply, prices rise.",
        ],
      },
      {
        heading: "Scarce money and purchasing power",
        body: [
          "Money with a limited, predictable supply can't be diluted in the same way. The idea is simple: if no one can create more, no one can erode the value of what you already own. That's why Bitcoin's fixed cap is so central to the whole idea of sounder money.",
          "It doesn't mean the price is stable — quite the opposite. It means the long-term dilution that affects ordinary money is taken out of the equation.",
        ],
      },
      {
        heading: "Volatility in the short run, scarcity in the long run",
        body: [
          "Bitcoin swings sharply in price in the short run. That's one reason to think in years and decades rather than weeks, and never to save more than you can afford to set aside. Scarcity is an argument about the long run, not a promise about what the price does tomorrow.",
          "This is not financial advice. The goal is to understand the difference between money that can be diluted and money that can't, so you can think clearly about your own saving.",
        ],
      },
    ],
    takeaways: [
      "Purchasing power, not the number of kronor, is what counts.",
      "Inflation erodes ordinary money slowly but relentlessly.",
      "A fixed supply can't be diluted, which is the idea behind preserving value.",
      "Volatile in the short run, hence a long-term perspective.",
    ],
    related: [
      { href: "/articles/purchasing-power-explained", label: "Read: Purchasing power explained" },
      { href: "/data", label: "See inflation and purchasing power" },
    ],
  },
  {
    id: "transparency",
    slug: "transparency",
    icon: "transparency",
    title: "Transparency",
    menuDescription:
      "Every transaction sits openly in the blockchain and can be verified by anyone.",
    tagline: "An open ledger that anyone can inspect.",
    metaDescription:
      "Bitcoin's blockchain is open and can be inspected by everyone. How transparency works, the 'don't trust, verify' principle, and how it's balanced against privacy.",
    intro: [
      "Bitcoin keeps a shared, open ledger. Every transaction ever made, and every bitcoin that exists, can be inspected by anyone, at any time, without asking permission.",
      "It's the exact opposite of how the financial system usually works today.",
    ],
    compare: [
      {
        today:
          "The financial system is largely a black box. You have to trust that institutions keep the books correctly.",
        bitcoin:
          "The entire blockchain is open. Anyone can verify the rules, the supply and every transaction themselves.",
      },
      {
        today:
          "Insight into how money is created and moves is reserved for a few.",
        bitcoin:
          "The insight is total and free. You only need to run the software to see everything with your own eyes.",
      },
    ],
    sections: [
      {
        heading: "The open blockchain",
        body: [
          "The blockchain is a chronological ledger of all transactions, copied to thousands of computers worldwide. Because everyone has the same copy, no central bookkeeper is needed, and because everything is open, no one can quietly rewrite history.",
          "That makes it possible to check things that previously required blind trust: how many bitcoin exist, that none were created beyond the rules, and that a payment really took place.",
        ],
      },
      {
        heading: "Don't trust, verify",
        body: [
          "A common motto in Bitcoin is 'don't trust, verify' — verify instead of relying on trust. By running your own node you can check every rule against the whole chain yourself, without relying on anyone else's word.",
          "It moves power from institutions to the individual. You don't have to believe a claim — you can check it.",
        ],
      },
      {
        heading: "Transparency and privacy",
        body: [
          "The openness applies to transactions and addresses, not names. Addresses are pseudonymous — they don't directly reveal who you are, but because everything is public, patterns can still be analysed. Bitcoin is thus transparent at the system level, but requires thought if you value privacy.",
          "The balance is deliberate: an open system everyone can inspect, while identity isn't built into the chain.",
        ],
      },
    ],
    takeaways: [
      "The entire blockchain is open and can be inspected by anyone.",
      "You can verify the supply and rules yourself, without trusting anyone.",
      "Your own node gives you full insight — 'don't trust, verify'.",
      "Addresses are pseudonymous, transparent at the system level but not named.",
    ],
    related: [
      { href: "/glossary#full-node", label: "Glossary: Full node" },
      { href: "/glossary#blockchain", label: "Glossary: Blockchain" },
    ],
  },
];

const functionsByLocale: Record<Locale, BitcoinFunction[]> = {
  sv: svFunctions,
  en: enFunctions,
};

export function getFunctions(locale: Locale): BitcoinFunction[] {
  return functionsByLocale[locale];
}

export function getFunction(
  locale: Locale,
  slug: string,
): BitcoinFunction | undefined {
  return getFunctions(locale).find((f) => f.slug === slug);
}

export function getFunctionSlugs(locale: Locale): string[] {
  return getFunctions(locale).map((f) => f.slug);
}

/**
 * Maps a function's stable id to its slug in every locale — used to build
 * hreflang/sitemap alternates across domains where the slugs differ.
 */
export function getFunctionSlugsById(id: string): Record<Locale, string> {
  const slugs = {} as Record<Locale, string>;
  for (const locale of routing.locales) {
    const fn = getFunctions(locale).find((f) => f.id === id);
    if (fn) slugs[locale] = fn.slug;
  }
  return slugs;
}

/* ------------------------------------------------------------------ *
 * Navigation menu (mega-menu + index). Includes the bespoke Halvering
 * page, ordered to match the site's framing.
 * ------------------------------------------------------------------ */

export type FunctionMenuItem = {
  title: string;
  description: string;
  /** Concrete, already-localized href for the active locale. */
  href: string;
  icon: FunctionIconKey;
};

/**
 * Menu hrefs are resolved to the active locale's concrete path (localized
 * static segment + localized slug) so links work on both domains; the visible
 * title/description come from the active locale's content.
 */
function toMenuItem(localized: BitcoinFunction, locale: Locale): FunctionMenuItem {
  return {
    title: localized.title,
    description: localized.menuDescription,
    href: getPathname({
      locale,
      href: { pathname: "/funktioner/[slug]", params: { slug: localized.slug } },
    }),
    icon: localized.icon,
  };
}

function halvingMenuItem(locale: Locale): FunctionMenuItem {
  return {
    title: locale === "sv" ? "Halveringen" : "The halving",
    description:
      locale === "sv"
        ? "Ungefär vart fjärde år halveras takten som nya bitcoin skapas i, allt knappare över tid."
        : "Roughly every four years the rate at which new bitcoin are created is halved — ever scarcer over time.",
    href: getPathname({ locale, href: "/halvering" }),
    icon: "halving",
  };
}

/** Order: supply, halving, decentralisation, security, payments, purchasing, transparency. */
export function getFunctionMenu(locale: Locale): FunctionMenuItem[] {
  const fns = getFunctions(locale);
  return [
    toMenuItem(fns[0], locale),
    halvingMenuItem(locale),
    ...fns.slice(1).map((fn) => toMenuItem(fn, locale)),
  ];
}
