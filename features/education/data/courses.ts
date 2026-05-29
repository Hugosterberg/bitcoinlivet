/**
 * Course content for Bitcoinskolan.
 *
 * Original Swedish material written for Bitcoinlivet, inspired by the
 * open-source curriculum from Plan ₿ Network
 * (https://github.com/PlanB-Network/bitcoin-educational-content, BTC101).
 * Extend or replace lessons here — the UI, routing and gamification adapt
 * automatically to the data below.
 */

import { XP_PER_CORRECT, XP_PER_LESSON } from "@/features/education/data/education";

/** Icon key, mapped to a Phosphor icon in components/education/module-icon.tsx. */
export type ModuleIconKey =
  | "coins"
  | "bitcoin"
  | "stack"
  | "chart"
  | "shield";

export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; tone: "info" | "tip" | "warning"; text: string };

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  /** Estimated reading time in minutes. */
  minutes: number;
  blocks: LessonBlock[];
  quiz: QuizQuestion[];
};

export type CourseModule = {
  slug: string;
  title: string;
  subtitle: string;
  icon: ModuleIconKey;
  lessons: Lesson[];
};

export const courseModules: CourseModule[] = [
  {
    slug: "pengar",
    title: "Vad är pengar?",
    subtitle: "Grunden till allt, varför pengar finns och vad som gör dem bra.",
    icon: "coins",
    lessons: [
      {
        slug: "vad-ar-pengar",
        title: "Vad pengar egentligen är",
        summary:
          "Pengar är ett verktyg för att spara och byta värde över tid och avstånd.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Innan pengar fanns bytte människor varor direkt mot varandra, byteshandel. Problemet är att det kräver en dubbel sammanträffande av behov: du måste hitta någon som både har det du vill ha och vill ha det du erbjuder. Pengar löser det genom att vara något alla accepterar.",
          },
          {
            type: "heading",
            text: "Pengars tre funktioner",
          },
          {
            type: "list",
            items: [
              "Bytesmedel: ett mellansteg som gör handel enkel.",
              "Värdebevarare: ett sätt att spara köpkraft till senare.",
              "Räkneenhet: ett gemensamt mått att sätta priser i.",
            ],
          },
          {
            type: "paragraph",
            text: "Genom historien har allt från snäckor och salt till boskap och guld använts som pengar. Det som fungerat bäst över tid har en sak gemensamt: det har varit svårt att skapa mer av.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Tänk på pengar som lagrad tid. Du arbetar, får betalt och sparar, pengarna ska bära din insats vidare till framtiden.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vilket problem löser pengar jämfört med byteshandel?",
            options: [
              "Att varor blir gratis",
              "Behovet av dubbel sammanträffande av behov",
              "Att priser aldrig ändras",
              "Att alla blir rika",
            ],
            answer: 1,
            explanation:
              "Pengar tar bort kravet att två parter måste vilja ha exakt det den andra erbjuder.",
          },
          {
            id: "q2",
            question: "Vilken av dessa är INTE en av pengars tre funktioner?",
            options: [
              "Bytesmedel",
              "Värdebevarare",
              "Räkneenhet",
              "Avkastningsgaranti",
            ],
            answer: 3,
            explanation:
              "Pengar garanterar ingen avkastning. De tre funktionerna är bytesmedel, värdebevarare och räkneenhet.",
          },
        ],
      },
      {
        slug: "egenskaper",
        title: "Vad gör pengar bra?",
        summary:
          "Hållbarhet, delbarhet, igenkännbarhet, portabilitet och knapphet.",
        minutes: 5,
        blocks: [
          {
            type: "paragraph",
            text: "Alla pengar är inte lika bra. Genom att jämföra olika egenskaper kan vi förstå varför guld slog ut snäckor, och varför Bitcoin är intressant i dag.",
          },
          {
            type: "list",
            items: [
              "Hållbarhet: håller pengarna över tid utan att förstöras?",
              "Delbarhet: går de att dela i mindre delar för små köp?",
              "Portabilitet: är de lätta att flytta och förvara?",
              "Igenkännbarhet: är de lätta att verifiera som äkta?",
              "Knapphet: är det svårt att skapa mer av dem?",
            ],
          },
          {
            type: "paragraph",
            text: "Knapphet är ofta den avgörande egenskapen för att bevara värde. Om vem som helst lätt kan skapa mer förlorar pengarna sin köpkraft, precis som en biljett som trycks i oändlighet blir värdelös.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Guld vann historiskt för att det var svårt att utvinna mer. Men guld är tungt och svårt att flytta och dela, där har digitala pengar en fördel.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vilken egenskap är ofta avgörande för att bevara värde?",
            options: ["Färg", "Knapphet", "Vikt", "Ålder"],
            answer: 1,
            explanation:
              "Om utbudet lätt kan ökas urholkas köpkraften. Knapphet skyddar värdet över tid.",
          },
          {
            id: "q2",
            question: "Vilken svaghet har guld som pengar?",
            options: [
              "Det är för vanligt",
              "Det är svårt att flytta och dela",
              "Det rostar snabbt",
              "Det går inte att verifiera",
            ],
            answer: 1,
            explanation:
              "Guld är hållbart och knappt men tungt, svårt att transportera och svårt att dela i små delar.",
          },
        ],
      },
      {
        slug: "harda-vs-mjuka-pengar",
        title: "Hårda och mjuka pengar",
        summary:
          "Varför ett förutsägbart utbud spelar roll för ditt sparande.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Hårda pengar är svåra att skapa mer av. Mjuka pengar är lätta att öka i mängd. Skillnaden avgör hur väl pengarna behåller sin köpkraft över tid.",
          },
          {
            type: "paragraph",
            text: "Dagens kronor, dollar och euro är fiatpengar, deras utbud bestäms av centralbanker och kan ökas. Det är ett politiskt verktyg, men det innebär också att den som sparar i kontanter gradvis kan tappa köpkraft.",
          },
          {
            type: "callout",
            tone: "warning",
            text: "Detta är inte finansiell rådgivning. Målet här är att förstå hur pengar fungerar, inte att rekommendera vad du ska göra med dina.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad kännetecknar 'hårda' pengar?",
            options: [
              "De är gjorda av metall",
              "De är svåra att skapa mer av",
              "De är olagliga",
              "De ökar alltid i värde",
            ],
            answer: 1,
            explanation:
              "Hårda pengar har ett utbud som är svårt att öka, vilket hjälper dem att behålla köpkraft.",
          },
          {
            id: "q2",
            question: "Vem bestämmer utbudet av fiatpengar som kronor?",
            options: [
              "Ingen, det är fast",
              "Centralbanker",
              "Affärerna",
              "FN",
            ],
            answer: 1,
            explanation:
              "Fiatpengars utbud styrs av centralbanker och kan ökas över tid.",
          },
        ],
      },
    ],
  },
  {
    slug: "bitcoin",
    title: "Vad är Bitcoin?",
    subtitle: "Ett digitalt, regelstyrt och gränslöst penningsystem.",
    icon: "bitcoin",
    lessons: [
      {
        slug: "introduktion",
        title: "Bitcoin på fem minuter",
        summary:
          "Ett öppet nätverk för att äga och skicka värde utan mellanhand.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Bitcoin är både ett nätverk och en valuta. Nätverket är en global, öppen databas som alla kan delta i. Valutan, bitcoin, är de enheter som flyttas runt i nätverket.",
          },
          {
            type: "paragraph",
            text: "Det skapades 2009 av den anonyma personen eller gruppen Satoshi Nakamoto. Idén: pengar som ingen enskild aktör kan kontrollera, censurera eller skapa mer av efter eget tycke.",
          },
          {
            type: "list",
            items: [
              "Öppet: vem som helst kan använda och granska det.",
              "Regelstyrt: reglerna gäller lika för alla.",
              "Gränslöst: fungerar likadant över hela världen.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "En bitcoin kan delas i 100 miljoner delar. Den minsta delen kallas 'sat' (satoshi). Du behöver inte köpa en hel bitcoin.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad heter den minsta enheten i Bitcoin?",
            options: ["Bit", "Sat", "Cent", "Wei"],
            answer: 1,
            explanation:
              "En bitcoin delas i 100 000 000 sats (satoshis), uppkallat efter Satoshi Nakamoto.",
          },
          {
            id: "q2",
            question: "Vem kan delta i och granska Bitcoin-nätverket?",
            options: [
              "Bara banker",
              "Bara programmerare",
              "Vem som helst",
              "Bara myndigheter",
            ],
            answer: 2,
            explanation:
              "Bitcoin är öppet, vem som helst kan använda, granska och bidra till nätverket.",
          },
        ],
      },
      {
        slug: "blockkedjan",
        title: "Blockkedjan enkelt förklarad",
        summary:
          "En gemensam kassabok där transaktioner samlas i block på rad.",
        minutes: 5,
        blocks: [
          {
            type: "paragraph",
            text: "Tänk dig en kassabok som tusentals datorer runt om i världen har en kopia av. Var tionde minut samlas nya transaktioner i ett 'block' som läggs till sist i boken. Blocken bildar en kedja, därav blockkedjan.",
          },
          {
            type: "paragraph",
            text: "Varje block pekar tillbaka på det förra. För att ändra en gammal transaktion skulle man behöva räkna om allt som kommit efter, på fler datorer än resten av nätverket tillsammans. Det gör historiken extremt svår att förfalska.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Eftersom alla har samma kopia behövs ingen central bank som för boken. Nätverket kommer överens om vad som är sant.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Ungefär hur ofta skapas ett nytt block?",
            options: ["Varje sekund", "Var tionde minut", "En gång per dag", "En gång i månaden"],
            answer: 1,
            explanation:
              "Nätverket siktar på ett nytt block ungefär var tionde minut.",
          },
          {
            id: "q2",
            question: "Varför är gammal historik svår att ändra?",
            options: [
              "Den är lösenordsskyddad",
              "Varje block bygger på det förra och kopiorna är många",
              "Polisen vaktar den",
              "Den raderas automatiskt",
            ],
            answer: 1,
            explanation:
              "Block länkas i en kedja och kopian finns hos hela nätverket, vilket gör förfalskning praktiskt taget omöjlig.",
          },
        ],
      },
      {
        slug: "decentralisering",
        title: "Varför ingen styr Bitcoin",
        summary:
          "Makt sprids mellan användare, noder och utvecklare, ingen enskild kontroll.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Bitcoin har ingen vd, inget huvudkontor och ingen knapp att stänga av. I stället sprids ansvaret mellan tusentals oberoende deltagare som var och en följer samma regler.",
          },
          {
            type: "list",
            items: [
              "Noder kontrollerar att alla regler följs.",
              "Brytare (miners) föreslår nya block och säkrar nätverket.",
              "Användare väljer vilken version av programvaran de kör.",
            ],
          },
          {
            type: "paragraph",
            text: "Förändringar i reglerna kräver bred enighet. Det gör Bitcoin trögrörligt, men också förutsägbart och svårt för någon enskild att manipulera.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vem kan ensam ändra Bitcoins regler?",
            options: ["Satoshi Nakamoto", "Ingen ensam", "De största bankerna", "USA:s regering"],
            answer: 1,
            explanation:
              "Regeländringar kräver bred enighet bland nätverkets deltagare, ingen enskild bestämmer.",
          },
          {
            id: "q2",
            question: "Vad gör en nod?",
            options: [
              "Skapar nya bitcoin gratis",
              "Kontrollerar att reglerna följs",
              "Sätter priset",
              "Lånar ut pengar",
            ],
            answer: 1,
            explanation:
              "Noder verifierar transaktioner och block mot reglerna och avvisar allt som inte stämmer.",
          },
        ],
      },
    ],
  },
  {
    slug: "knapphet",
    title: "Knapphet och utbud",
    subtitle: "De 21 miljonerna, halveringen och varför utbudet är förutsägbart.",
    icon: "stack",
    lessons: [
      {
        slug: "21-miljoner",
        title: "De 21 miljonerna",
        summary:
          "Bitcoins utbud är bestämt i förväg och kan aldrig överstiga 21 miljoner.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Det kommer aldrig att finnas mer än 21 miljoner bitcoin. Gränsen är inbyggd i reglerna och delas av alla i nätverket. Det är en av de viktigaste skillnaderna mot fiatpengar, vars mängd kan ökas.",
          },
          {
            type: "paragraph",
            text: "I dag är ungefär 19,8 miljoner redan utgivna. Resten frigörs långsamt, ända fram till runt år 2140. Eftersom utbudet är känt i förväg kan ingen överraska marknaden med att plötsligt skapa mer.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Räkna i sats i stället för i hela bitcoin. 21 miljoner bitcoin är 2 100 biljoner sats, gott om utrymme för små belopp.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Hur många bitcoin kan det som mest finnas?",
            options: ["1 miljon", "21 miljoner", "100 miljoner", "Obegränsat"],
            answer: 1,
            explanation: "Taket på 21 miljoner är inbyggt i Bitcoins regler.",
          },
          {
            id: "q2",
            question: "Varför är det viktigt att utbudet är känt i förväg?",
            options: [
              "Det gör priset fast",
              "Ingen kan överraska med att skapa mer",
              "Det gör bitcoin gratis",
              "Det stänger nätverket",
            ],
            answer: 1,
            explanation:
              "Ett förutsägbart utbud gör att ingen kan urholka värdet genom att plötsligt öka mängden.",
          },
        ],
      },
      {
        slug: "halveringen",
        title: "Halveringen",
        summary:
          "Vart fjärde år halveras takten som nya bitcoin skapas i.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Nya bitcoin skapas som belöning till brytare för varje block. Ungefär vart fjärde år (var 210 000:e block) halveras den belöningen. Det kallas halveringen.",
          },
          {
            type: "paragraph",
            text: "Effekten är att tillflödet av nya bitcoin minskar stegvis över tid, tills det till slut når noll. Det är denna regel som gör att vägen mot 21 miljoner är förutsägbar och avtagande.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Du kan följa nedräkningen till nästa halvering live på datasidan.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Hur ofta sker halveringen ungefär?",
            options: ["Varje år", "Vart fjärde år", "Vart tionde år", "Aldrig"],
            answer: 1,
            explanation: "Halveringen sker var 210 000:e block, vilket är ungefär vart fjärde år.",
          },
          {
            id: "q2",
            question: "Vad händer med nya bitcoin över tid?",
            options: [
              "De skapas allt snabbare",
              "Takten minskar stegvis mot noll",
              "De försvinner",
              "De fördubblas",
            ],
            answer: 1,
            explanation:
              "Varje halvering minskar tillflödet, tills inga nya bitcoin skapas runt år 2140.",
          },
        ],
      },
      {
        slug: "brytning",
        title: "Brytning och energi",
        summary:
          "Hur brytare säkrar nätverket och varför arbete kostar något.",
        minutes: 5,
        blocks: [
          {
            type: "paragraph",
            text: "Brytning (mining) är processen där datorer tävlar om att få lägga till nästa block. De som lyckas belönas med nya bitcoin och transaktionsavgifter. Tävlingen kräver el, och det är själva poängen.",
          },
          {
            type: "paragraph",
            text: "Att det kostar energi gör det dyrt att fuska. För att skriva om historiken skulle en angripare behöva mer datorkraft än resten av världen tillsammans, vilket skulle kosta enorma summor. Energin omvandlas alltså till säkerhet.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Allt mer brytning sker med överskottsel och förnybara källor, eftersom brytare söker sig till den billigaste energin, ofta den som annars skulle gå till spillo.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad belönas brytare med?",
            options: [
              "Inget",
              "Nya bitcoin och transaktionsavgifter",
              "Aktier",
              "Räntor",
            ],
            answer: 1,
            explanation:
              "Den som hittar ett giltigt block får blockbelöningen i nya bitcoin plus avgifterna i blocket.",
          },
          {
            id: "q2",
            question: "Varför är energiåtgången en fördel för säkerheten?",
            options: [
              "Den värmer upp datorerna",
              "Den gör det väldigt dyrt att fuska",
              "Den sänker priset",
              "Den krävs av lagen",
            ],
            answer: 1,
            explanation:
              "Eftersom angrepp skulle kräva enorm datorkraft och el blir det olönsamt att försöka manipulera nätverket.",
          },
        ],
      },
    ],
  },
  {
    slug: "kopkraft",
    title: "Inflation och köpkraft",
    subtitle: "Vad som händer med dina pengar över tid, och varför.",
    icon: "chart",
    lessons: [
      {
        slug: "inflation",
        title: "Vad inflation gör med dina pengar",
        summary:
          "När prisnivån stiger räcker samma summa till mindre.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Inflation betyder att den allmänna prisnivån stiger. Konkret: samma hundralapp köper lite mindre i år än i fjol. Över många år kan effekten bli stor.",
          },
          {
            type: "paragraph",
            text: "En orsak är att mängden pengar ökar snabbare än mängden varor och tjänster. När det finns fler kronor som jagar samma utbud stiger priserna.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Det är inte att varorna blir 'dyrare' i sig, det är ofta att pengarna blir mindre värda.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad innebär inflation?",
            options: [
              "Att pengar blir fler i plånboken",
              "Att den allmänna prisnivån stiger",
              "Att räntan alltid sjunker",
              "Att varor blir bättre",
            ],
            answer: 1,
            explanation:
              "Inflation är en stigande allmän prisnivå, vilket minskar pengars köpkraft.",
          },
          {
            id: "q2",
            question: "En vanlig orsak till inflation är att …",
            options: [
              "mängden pengar ökar snabbare än varorna",
              "folk sparar för mycket",
              "det finns för lite reklam",
              "vädret ändras",
            ],
            answer: 0,
            explanation:
              "När penningmängden växer snabbare än ekonomin tenderar priserna att stiga.",
          },
        ],
      },
      {
        slug: "kopkraft-over-tid",
        title: "Köpkraft över tid",
        summary:
          "Det viktiga är inte antalet kronor, utan vad de räcker till.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Köpkraft är hur mycket dina pengar faktiskt räcker till. Tusen kronor på kontot säger ingenting förrän vi vet vad de kan köpa. Med inflation urholkas köpkraften även om siffran på kontot står still.",
          },
          {
            type: "paragraph",
            text: "Därför mäter vi sparande i köpkraft, inte i kronor. Pengar med ett begränsat utbud har historiskt behållit köpkraft bättre än pengar vars mängd ökar.",
          },
          {
            type: "callout",
            tone: "info",
            text: "På datasidan finns en graf som jämför köpkraften hos pengar med växande respektive begränsat utbud.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad mäter köpkraft?",
            options: [
              "Antalet sedlar",
              "Vad pengarna räcker till",
              "Hur gammal valutan är",
              "Antalet banker",
            ],
            answer: 1,
            explanation:
              "Köpkraft handlar om vad pengarna kan köpa, inte om hur många kronor du har.",
          },
          {
            id: "q2",
            question: "Vad händer med köpkraften om siffran på kontot står still men inflationen är hög?",
            options: ["Den ökar", "Den är oförändrad", "Den minskar", "Den fördubblas"],
            answer: 2,
            explanation:
              "Med inflation köper samma belopp mindre över tid, köpkraften minskar.",
          },
        ],
      },
      {
        slug: "spara-langsiktigt",
        title: "Att spara långsiktigt",
        summary:
          "Tålamod, regelbundenhet och ett långt tidsperspektiv.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "Långsiktigt sparande handlar mindre om att pricka rätt tillfälle och mer om vana. Att spara regelbundet, oavsett dagsform på marknaden, tar bort en stor del av stressen.",
          },
          {
            type: "paragraph",
            text: "En vanlig metod är att köpa för ett fast belopp med jämna mellanrum. Då köper du ibland dyrt och ibland billigt, och slipper försöka tajma marknaden, något även proffs har svårt med.",
          },
          {
            type: "callout",
            tone: "warning",
            text: "Detta är inte finansiell rådgivning. Spara aldrig mer än du har råd att avvara och ta reda på hur det fungerar innan du börjar.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad kännetecknar långsiktigt sparande?",
            options: [
              "Att tajma toppar och bottnar",
              "Regelbundenhet och tålamod",
              "Att köpa allt på en gång",
              "Att följa tips på sociala medier",
            ],
            answer: 1,
            explanation:
              "Regelbundet sparande över lång tid minskar betydelsen av enskilda upp- och nedgångar.",
          },
          {
            id: "q2",
            question: "Vad är fördelen med att köpa för ett fast belopp regelbundet?",
            options: [
              "Man slipper tajma marknaden",
              "Man blir garanterat rik",
              "Priset blir alltid lägre",
              "Man behöver aldrig spara igen",
            ],
            answer: 0,
            explanation:
              "Regelbundna köp jämnar ut priset över tid och tar bort behovet av att gissa rätt tillfälle.",
          },
        ],
      },
    ],
  },
  {
    slug: "kom-igang",
    title: "Kom igång säkert",
    subtitle: "Köp dina första sats, förvara dem rätt och undvik fallgropar.",
    icon: "shield",
    lessons: [
      {
        slug: "kop-forsta-sats",
        title: "Köp dina första sats",
        summary:
          "Så fungerar en börs och varför du inte behöver köpa en hel bitcoin.",
        minutes: 4,
        blocks: [
          {
            type: "paragraph",
            text: "De flesta köper sin första bitcoin via en börs eller app. Du registrerar dig, legitimerar dig och kan sedan köpa för det belopp du vill, ända ner till några kronor.",
          },
          {
            type: "list",
            items: [
              "Du behöver inte köpa en hel bitcoin, köp i sats.",
              "Börja smått tills du förstår hur det fungerar.",
              "Jämför avgifter mellan olika tjänster.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Se ditt första köp som ett sätt att lära dig flödet, inte som en investering. Beloppet får gärna vara litet.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Måste du köpa en hel bitcoin?",
            options: [
              "Ja, alltid",
              "Nej, du kan köpa i sats",
              "Bara om du är över 18",
              "Bara via banken",
            ],
            answer: 1,
            explanation:
              "Du kan köpa en liten bråkdel, bitcoin delas i 100 miljoner sats.",
          },
          {
            id: "q2",
            question: "Vad är ett bra sätt att börja?",
            options: [
              "Köpa för allt du har direkt",
              "Börja smått och lär dig flödet",
              "Låna pengar till köpet",
              "Hoppa över att jämföra avgifter",
            ],
            answer: 1,
            explanation:
              "Att börja med ett litet belopp gör att du lär dig hur det fungerar utan stor risk.",
          },
        ],
      },
      {
        slug: "forvaring",
        title: "Förvaring och plånböcker",
        summary:
          "Skillnaden mellan att låta en börs förvara åt dig och att ta egen kontroll.",
        minutes: 5,
        blocks: [
          {
            type: "paragraph",
            text: "En bitcoin-plånbok förvarar inte mynt, den förvarar dina nycklar. Nyckeln är det som ger rätt att flytta dina bitcoin. Den som har nyckeln har kontrollen.",
          },
          {
            type: "paragraph",
            text: "Om dina bitcoin ligger kvar på en börs är det börsen som håller nyckeln åt dig. Att flytta dem till en egen plånbok kallas självförvaring, då ansvarar du själv, både för kontrollen och för säkerheten.",
          },
          {
            type: "callout",
            tone: "info",
            text: "Ett vanligt talesätt: 'Not your keys, not your coins.' Har du inte nyckeln, är det inte fullt ut dina bitcoin.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad förvarar en bitcoin-plånbok egentligen?",
            options: ["Fysiska mynt", "Dina nycklar", "Dina lösenord till banken", "Kvitton"],
            answer: 1,
            explanation:
              "Plånboken hanterar nycklarna som ger rätt att flytta dina bitcoin.",
          },
          {
            id: "q2",
            question: "Vad menas med självförvaring?",
            options: [
              "Att börsen sköter allt",
              "Att du själv håller dina nycklar",
              "Att staten förvarar dem",
              "Att du aldrig kan flytta dem",
            ],
            answer: 1,
            explanation:
              "Självförvaring innebär att du själv kontrollerar nycklarna, och därmed dina bitcoin.",
          },
        ],
      },
      {
        slug: "sakerhet",
        title: "Säkerhet och vanliga misstag",
        summary:
          "Skydda din återställningsfras och känn igen bedrägeriförsök.",
        minutes: 5,
        blocks: [
          {
            type: "paragraph",
            text: "När du skapar en egen plånbok får du en återställningsfras, oftast 12 eller 24 ord. Den är en säkerhetskopia av dina nycklar. Tappar du den kan du förlora åtkomsten; läcker den kan någon annan ta dina bitcoin.",
          },
          {
            type: "list",
            items: [
              "Skriv ner frasen på papper, inte i en bild eller ett mejl.",
              "Dela aldrig frasen med någon, oavsett vad de påstår.",
              "Ingen seriös tjänst frågar någonsin efter din fras.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Var skeptisk mot löften om snabba vinster, 'support' som hör av sig först och länkar i meddelanden. Bedragare utnyttjar stress och girighet.",
          },
        ],
        quiz: [
          {
            id: "q1",
            question: "Vad är en återställningsfras?",
            options: [
              "Ett lösenord till börsen",
              "En säkerhetskopia av dina nycklar",
              "Ett kvitto",
              "Din e-postadress",
            ],
            answer: 1,
            explanation:
              "Orden i återställningsfrasen kan återskapa dina nycklar, håll dem hemliga och säkra.",
          },
          {
            id: "q2",
            question: "Vem ska du dela din återställningsfras med?",
            options: [
              "Kundtjänst",
              "Ingen",
              "Din bank",
              "Den som hör av sig först",
            ],
            answer: 1,
            explanation:
              "Ingen seriös part behöver din fras. Delar du den kan du förlora dina bitcoin.",
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Derived data and helpers
 * ------------------------------------------------------------------ */

export type LessonRef = {
  module: CourseModule;
  lesson: Lesson;
  /** 1-based position in the full course flow. */
  index: number;
};

/** All lessons flattened in course order. */
export const lessonFlow: LessonRef[] = courseModules.flatMap((module) =>
  module.lessons.map((lesson) => ({ module, lesson, index: 0 })),
).map((ref, i) => ({ ...ref, index: i + 1 }));

export const totalLessons = lessonFlow.length;

/** Maximum XP achievable across the whole course. */
export const totalXp = lessonFlow.reduce(
  (sum, { lesson }) => sum + XP_PER_LESSON + lesson.quiz.length * XP_PER_CORRECT,
  0,
);

/** XP awarded for a single lesson when all quiz answers are correct. */
export function maxLessonXp(lesson: Lesson): number {
  return XP_PER_LESSON + lesson.quiz.length * XP_PER_CORRECT;
}

export function getModule(slug: string): CourseModule | undefined {
  return courseModules.find((m) => m.slug === slug);
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string,
): { module: CourseModule; lesson: Lesson } | undefined {
  const mod = getModule(moduleSlug);
  const lesson = mod?.lessons.find((l) => l.slug === lessonSlug);
  if (!mod || !lesson) return undefined;
  return { module: mod, lesson };
}

/** Previous/next lesson in the global course flow. */
export function getAdjacentLessons(moduleSlug: string, lessonSlug: string): {
  prev: LessonRef | null;
  next: LessonRef | null;
} {
  const i = lessonFlow.findIndex(
    (ref) => ref.module.slug === moduleSlug && ref.lesson.slug === lessonSlug,
  );
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? lessonFlow[i - 1] : null,
    next: i < lessonFlow.length - 1 ? lessonFlow[i + 1] : null,
  };
}
