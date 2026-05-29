/**
 * Deep content for the "Funktioner" pages — one rich page per Bitcoin
 * property, each motivating *why* the property matters in relation to how
 * money and payments work today. Calm, factual and anti-hype; never financial
 * advice.
 *
 * Halveringen has its own bespoke page at /halvering and is therefore not in
 * `bitcoinFunctions`; it is added to the navigation menu separately below.
 */

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

export const bitcoinFunctions: BitcoinFunction[] = [
  {
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
          "Bitcoins 21 miljoner frigörs enligt ett schema som var känt från start. Nya bitcoin skapas som belöning till dem som säkrar nätverket, och den belöningen halveras ungefär vart fjärde år. I dag är runt 19,8 miljoner redan utgivna; de allra sista skapas först omkring år 2140.",
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
      "Cirka 19,8 miljoner är redan utgivna; resten frigörs avtagande till ~2140.",
      "Ingen enskild aktör kan skapa fler eller ändra taket.",
      "Du kan själv verifiera utbudet med en egen nod.",
    ],
    related: [
      { href: "/utbildning/knapphet/21-miljoner", label: "Lektion: De 21 miljonerna" },
      { href: "/halvering", label: "Läs om halveringen" },
      { href: "/data", label: "Se utbudet live" },
    ],
  },
  {
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
      { href: "/utbildning/bitcoin/decentralisering", label: "Lektion: Varför ingen styr Bitcoin" },
      { href: "/ordlista#nod", label: "Ordlista: Nod" },
      { href: "/ordlista#censurmotstand", label: "Ordlista: Censurmotstånd" },
    ],
  },
  {
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
      { href: "/utbildning/knapphet/brytning", label: "Lektion: Brytning och energi" },
      { href: "/utbildning/kom-igang/sakerhet", label: "Lektion: Säkerhet och vanliga misstag" },
      { href: "/ordlista#proof-of-work", label: "Ordlista: Proof of work" },
    ],
  },
  {
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
      { href: "/utbildning/kopkraft/kopkraft-over-tid", label: "Lektion: Köpkraft över tid" },
      { href: "/artiklar/kopkraft-forklarat", label: "Läs: Köpkraft förklarat" },
      { href: "/data", label: "Se inflation och köpkraft" },
    ],
  },
  {
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
      { href: "/utbildning/bitcoin/blockkedjan", label: "Lektion: Blockkedjan enkelt förklarad" },
      { href: "/ordlista#full-nod", label: "Ordlista: Full nod" },
      { href: "/ordlista#blockkedja", label: "Ordlista: Blockkedja" },
    ],
  },
];

export function getFunction(slug: string): BitcoinFunction | undefined {
  return bitcoinFunctions.find((f) => f.slug === slug);
}

export function getFunctionSlugs(): string[] {
  return bitcoinFunctions.map((f) => f.slug);
}

/* ------------------------------------------------------------------ *
 * Navigation menu (mega-menu + index). Includes the bespoke Halvering
 * page, ordered to match the site's framing.
 * ------------------------------------------------------------------ */

export type FunctionMenuItem = {
  title: string;
  description: string;
  href: string;
  icon: FunctionIconKey;
};

function toMenuItem(f: BitcoinFunction): FunctionMenuItem {
  return {
    title: f.title,
    description: f.menuDescription,
    href: `/funktioner/${f.slug}`,
    icon: f.icon,
  };
}

const halvingMenuItem: FunctionMenuItem = {
  title: "Halveringen",
  description:
    "Ungefär vart fjärde år halveras takten som nya bitcoin skapas i, allt knappare över tid.",
  href: "/halvering",
  icon: "halving",
};

/** Order: supply, halving, decentralisation, security, payments, purchasing, transparency. */
export const functionMenu: FunctionMenuItem[] = [
  toMenuItem(bitcoinFunctions[0]),
  halvingMenuItem,
  ...bitcoinFunctions.slice(1).map(toMenuItem),
];
