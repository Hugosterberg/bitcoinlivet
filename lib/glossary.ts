/**
 * Bitcoin glossary (Swedish). Plain, calm explanations — no hype, no advice.
 *
 * Each term has a `level` so readers can choose how deep to go:
 *   1 = Vanliga  (alla har nytta av dem)
 *   2 = Djupare  (för dig som vill förstå mer)
 *   3 = Djupast  (tekniska detaljer)
 *
 * Terms are sorted alphabetically in the UI via {@link sortedGlossary}.
 */

export type GlossaryLevel = 1 | 2 | 3;

export type GlossaryTerm = {
  /** Display term. */
  term: string;
  /** URL/anchor-safe id. */
  slug: string;
  /** Short, beginner-friendly Swedish definition. */
  definition: string;
  /** How technical the term is (1 = vanlig, 3 = djupast). */
  level: GlossaryLevel;
};

export const glossaryLevels: {
  level: GlossaryLevel;
  label: string;
  description: string;
  /** Tailwind class for the small level dot. */
  dotClass: string;
}[] = [
  { level: 1, label: "Vanliga", description: "Begrepp alla har nytta av", dotClass: "bg-muted-foreground" },
  { level: 2, label: "Djupare", description: "För dig som vill förstå mer", dotClass: "bg-bitcoin/70" },
  { level: 3, label: "Djupast", description: "Tekniska detaljer", dotClass: "bg-bitcoin" },
];

export function levelMeta(level: GlossaryLevel) {
  return glossaryLevels.find((l) => l.level === level) ?? glossaryLevels[0];
}

export const glossary: GlossaryTerm[] = [
  // — Vanliga (1) —
  {
    term: "Adress",
    slug: "adress",
    definition:
      "En sträng som fungerar som ett kontonummer för att ta emot bitcoin. Du kan dela den fritt; den avslöjar inte din privata nyckel.",
    level: 1,
  },
  {
    term: "Bitcoin",
    slug: "bitcoin",
    definition:
      "Ett digitalt, decentraliserat pengasystem med ett förutbestämt maxutbud på 21 miljoner. Ingen enskild aktör styr det.",
    level: 1,
  },
  {
    term: "Block",
    slug: "block",
    definition:
      "En bunt transaktioner som läggs till i blockkedjan ungefär var tionde minut.",
    level: 1,
  },
  {
    term: "Blockkedja",
    slug: "blockkedja",
    definition:
      "Den gemensamma, kronologiska liggaren över alla bitcoin-transaktioner. Block länkas ihop så att historiken blir mycket svår att ändra.",
    level: 1,
  },
  {
    term: "Börs (växlingstjänst)",
    slug: "bors",
    definition:
      "En handelsplats där du köper och säljer bitcoin mot kronor. Oftast en mellanhand som håller dina nycklar tills du flyttar ut bitcoin.",
    level: 1,
  },
  {
    term: "DCA (regelbundet sparande)",
    slug: "dca",
    definition:
      "Dollar Cost Averaging: att köpa för ett fast belopp med jämna mellanrum i stället för allt på en gång. Jämnar ut priset över tid.",
    level: 1,
  },
  {
    term: "Fiatvaluta",
    slug: "fiatvaluta",
    definition:
      "Statligt utgivna pengar som kronor, euro och dollar. Utbudet kan ökas av centralbanker, vilket över tid kan urholka köpkraften.",
    level: 1,
  },
  {
    term: "Halvering",
    slug: "halvering",
    definition:
      "Ungefär vart fjärde år halveras takten som nya bitcoin skapas i. Det gör utbudet förutsägbart och allt knappare.",
    level: 1,
  },
  {
    term: "HODL",
    slug: "hodl",
    definition:
      "Slang för att hålla i sin bitcoin långsiktigt i stället för att handla kortsiktigt. Kommer från en felstavning av \u201dhold\u201d.",
    level: 1,
  },
  {
    term: "Inflation",
    slug: "inflation",
    definition:
      "När den allmänna prisnivån stiger så att varje krona räcker till mindre. Mäts i Sverige med konsumentprisindex (KPI).",
    level: 1,
  },
  {
    term: "Knapphet",
    slug: "knapphet",
    definition:
      "Att något finns i begränsad mängd. Bitcoins fasta tak på 21 miljoner gör knappheten trovärdig och förutsägbar.",
    level: 1,
  },
  {
    term: "Köpkraft",
    slug: "kopkraft",
    definition:
      "Hur mycket varor och tjänster dina pengar faktiskt räcker till. Det är köpkraften, inte antalet kronor, som avgör din vardag.",
    level: 1,
  },
  {
    term: "Maxutbud",
    slug: "maxutbud",
    definition:
      "Det finns aldrig fler än 21 miljoner bitcoin. Gränsen är inbyggd i protokollet och kan inte enkelt ändras.",
    level: 1,
  },
  {
    term: "Plånbok (wallet)",
    slug: "planbok",
    definition:
      "Programvara eller hårdvara som hanterar dina nycklar och låter dig ta emot och skicka bitcoin. Plånboken \u201dförvarar\u201d nycklar, inte mynt.",
    level: 1,
  },
  {
    term: "Privat nyckel",
    slug: "privat-nyckel",
    definition:
      "Den hemliga koden som ger kontroll över dina bitcoin. Den som har den privata nyckeln äger pengarna, håll den hemlig.",
    level: 1,
  },
  {
    term: "Sats (satoshi)",
    slug: "sats",
    definition:
      "Den minsta enheten av bitcoin. En bitcoin består av 100 000 000 sats, så du kan spara i små steg.",
    level: 1,
  },
  {
    term: "Satoshi Nakamoto",
    slug: "satoshi-nakamoto",
    definition:
      "Pseudonymen för den okända person eller grupp som skapade Bitcoin och var aktiv 2008–2010. Den verkliga identiteten är fortfarande okänd.",
    level: 1,
  },
  {
    term: "Sunda pengar",
    slug: "sunda-pengar",
    definition:
      "Pengar som behåller sitt värde över tid tack vare ett knappt och förutsägbart utbud. Bitcoins fasta tak är ett exempel.",
    level: 1,
  },
  {
    term: "Volatilitet",
    slug: "volatilitet",
    definition:
      "Hur mycket priset svänger upp och ner. Bitcoin är historiskt volatilt på kort sikt, ett skäl att tänka långsiktigt.",
    level: 1,
  },
  {
    term: "Whitepaper",
    slug: "whitepaper",
    definition:
      "Det korta dokument som Satoshi Nakamoto publicerade 2008 och som beskriver hur Bitcoin fungerar. Grunden för allt som följde.",
    level: 1,
  },

  // — Djupare (2) —
  {
    term: "Bekräftelse",
    slug: "bekraftelse",
    definition:
      "Antalet block som byggts ovanpå blocket där din transaktion ligger. Fler bekräftelser gör transaktionen allt svårare att ångra.",
    level: 2,
  },
  {
    term: "Blockbelöning",
    slug: "blockbeloning",
    definition:
      "De nya bitcoin plus avgifter som tillfaller den som hittar ett block. Den nya delen halveras var 210 000:e block.",
    level: 2,
  },
  {
    term: "Censurmotstånd",
    slug: "censurmotstand",
    definition:
      "Egenskapen att ingen enskild aktör kan hindra en giltig transaktion eller frysa dina pengar. Följer av decentraliseringen.",
    level: 2,
  },
  {
    term: "Cold storage",
    slug: "cold-storage",
    definition:
      "Förvaring av nycklar offline, utan internetuppkoppling. Minskar risken för stöld jämfört med en plånbok som alltid är uppkopplad.",
    level: 2,
  },
  {
    term: "Egen förvaring",
    slug: "egen-forvaring",
    definition:
      "Att själv hålla i sina nycklar (self-custody) i stället för att lita på en börs. \u201dNot your keys, not your coins.\u201d",
    level: 2,
  },
  {
    term: "Förvaringstjänst (custodial)",
    slug: "custodial",
    definition:
      "När någon annan, t.ex. en börs, håller dina privata nycklar åt dig. Bekvämt, men du måste lita på förvararen.",
    level: 2,
  },
  {
    term: "Full nod",
    slug: "full-nod",
    definition:
      "En nod som laddar ner och självständigt verifierar hela blockkedjan enligt reglerna. Att köra en egen nod är att kunna lita på, inte fråga.",
    level: 2,
  },
  {
    term: "Genesis-blocket",
    slug: "genesis-blocket",
    definition:
      "Det allra första blocket (block 0), skapat den 3 januari 2009. Innehåller en rubrik om bankräddningar, en hälsning till eftervärlden.",
    level: 2,
  },
  {
    term: "Hashrate",
    slug: "hashrate",
    definition:
      "Den samlade beräkningskraft som säkrar nätverket. Högre hashrate gör det dyrare och svårare att angripa kedjan.",
    level: 2,
  },
  {
    term: "Hårdvaruplånbok",
    slug: "hardvaruplanbok",
    definition:
      "En fysisk enhet som håller dina privata nycklar offline och signerar transaktioner internt. Ett populärt sätt att förvara säkert.",
    level: 2,
  },
  {
    term: "Hetplånbok (hot wallet)",
    slug: "hetplanbok",
    definition:
      "En plånbok som är uppkopplad mot internet. Smidig för vardagsbruk, men mer utsatt än offline-förvaring.",
    level: 2,
  },
  {
    term: "KYC (känn din kund)",
    slug: "kyc",
    definition:
      "Regelkrav som tvingar tjänster att verifiera din identitet. Påverkar din integritet eftersom köp då knyts till dig.",
    level: 2,
  },
  {
    term: "Lightning Network",
    slug: "lightning",
    definition:
      "Ett lager ovanpå Bitcoin för snabba och billiga betalningar, lämpligt för små vardagsköp.",
    level: 2,
  },
  {
    term: "Mempool",
    slug: "mempool",
    definition:
      "Väntrummet för transaktioner som ännu inte kommit med i ett block. När mempoolen är full stiger avgifterna.",
    level: 2,
  },
  {
    term: "Mining (brytning)",
    slug: "mining",
    definition:
      "Processen där datorer säkrar nätverket och skapar nya block. Brytare belönas med nya bitcoin och transaktionsavgifter.",
    level: 2,
  },
  {
    term: "Nod",
    slug: "nod",
    definition:
      "En dator som kör Bitcoin-programvaran och själv verifierar reglerna. Många noder gör nätverket decentraliserat.",
    level: 2,
  },
  {
    term: "Peer-to-peer (P2P)",
    slug: "peer-to-peer",
    definition:
      "Direkt mellan deltagare, utan mellanhand. Bitcoin skickas från person till person över ett nätverk av likställda noder.",
    level: 2,
  },
  {
    term: "Proof of work",
    slug: "proof-of-work",
    definition:
      "Metoden där brytare lägger ner verklig energi för att få lägga till block. Gör det dyrt att fuska och säkrar historiken.",
    level: 2,
  },
  {
    term: "Publik nyckel",
    slug: "publik-nyckel",
    definition:
      "Härleds matematiskt från den privata nyckeln och används för att skapa adresser. Kan delas utan att äventyra dina pengar.",
    level: 2,
  },
  {
    term: "Seed phrase (återställningsfras)",
    slug: "seed-phrase",
    definition:
      "12–24 ord som kan återskapa din plånbok. Skriv ner den och förvara den säkert offline, aldrig digitalt eller i bild.",
    level: 2,
  },
  {
    term: "Transaktionsavgift",
    slug: "transaktionsavgift",
    definition:
      "Avgift i sat/vB som betalas till brytare för att få med en transaktion i ett block. Högre avgift ger snabbare bekräftelse.",
    level: 2,
  },

  // — Djupast (3) —
  {
    term: "BIP (Bitcoin Improvement Proposal)",
    slug: "bip",
    definition:
      "Ett formellt förslag för att ändra eller standardisera något i Bitcoin. Hur uppgraderingar diskuteras och dokumenteras.",
    level: 3,
  },
  {
    term: "Coinbase-transaktion",
    slug: "coinbase-transaktion",
    definition:
      "Den första transaktionen i varje block som skapar de nya bitcoin (blockbelöningen) till brytaren. Inte att förväxla med börsen Coinbase.",
    level: 3,
  },
  {
    term: "CoinJoin",
    slug: "coinjoin",
    definition:
      "En integritetsteknik där flera användare slår ihop sina betalningar i en gemensam transaktion för att försvåra spårning.",
    level: 3,
  },
  {
    term: "CPFP (Child Pays For Parent)",
    slug: "cpfp",
    definition:
      "Att skynda på en fastnad transaktion genom att spendera dess utgång med hög avgift, så att brytare tar med båda.",
    level: 3,
  },
  {
    term: "Dust (damm)",
    slug: "dust",
    definition:
      "Så små UTXO-belopp att det kan kosta mer i avgift att spendera dem än vad de är värda.",
    level: 3,
  },
  {
    term: "HD-plånbok / deriveringsväg",
    slug: "hd-planbok",
    definition:
      "En hierarkiskt deterministisk plånbok (BIP32) som ur en enda seed härleder oändligt många nycklar längs en deriveringsväg.",
    level: 3,
  },
  {
    term: "Hashfunktion (SHA-256)",
    slug: "hashfunktion",
    definition:
      "En envägsfunktion som gör om data till ett fast \u201dfingeravtryck\u201d. Bitcoin använder SHA-256 i mining och för att länka block.",
    level: 3,
  },
  {
    term: "Merkle-träd",
    slug: "merkle-trad",
    definition:
      "En hashstruktur som sammanfattar alla transaktioner i ett block till en enda rot-hash, vilket möjliggör effektiv verifiering.",
    level: 3,
  },
  {
    term: "Multisig (multisignatur)",
    slug: "multisig",
    definition:
      "Kräver flera nycklar för att spendera, t.ex. 2 av 3. Ökar säkerheten och används för delat ägande och bättre förvaring.",
    level: 3,
  },
  {
    term: "Nonce",
    slug: "nonce",
    definition:
      "Talet som brytare ändrar om och om igen för att hitta en blockhash som uppfyller svårighetskravet i proof of work.",
    level: 3,
  },
  {
    term: "PSBT",
    slug: "psbt",
    definition:
      "Partially Signed Bitcoin Transaction: ett standardformat för att samla in signaturer mellan enheter, t.ex. en hårdvaruplånbok.",
    level: 3,
  },
  {
    term: "RBF (Replace-by-Fee)",
    slug: "rbf",
    definition:
      "Att ersätta en obekräftad transaktion med en ny som har högre avgift, för att den ska bekräftas snabbare.",
    level: 3,
  },
  {
    term: "Schnorr-signaturer",
    slug: "schnorr",
    definition:
      "Ett signatursystem som infördes med Taproot. Effektivare och mer privat än det äldre ECDSA och möjliggör signaturaggregering.",
    level: 3,
  },
  {
    term: "Script (Bitcoin Script)",
    slug: "script",
    definition:
      "Det enkla, avsiktligt begränsade språket som anger villkoren för att få spendera bitcoin. Inte ett fritt programmeringsspråk.",
    level: 3,
  },
  {
    term: "SegWit",
    slug: "segwit",
    definition:
      "Segregated Witness: en uppgradering (2017) som flyttar signaturdata och ökar kapaciteten samt löste s.k. transaction malleability.",
    level: 3,
  },
  {
    term: "Svårighetsjustering",
    slug: "svarighetsjustering",
    definition:
      "Var 2016:e block (~två veckor) justerar nätverket svårighetsgraden så att block fortsätter komma ungefär var tionde minut.",
    level: 3,
  },
  {
    term: "Taproot",
    slug: "taproot",
    definition:
      "En uppgradering (2021) som förbättrar integritet och effektivitet och får komplexa utgiftsvillkor att se ut som vanliga transaktioner.",
    level: 3,
  },
  {
    term: "Timelock",
    slug: "timelock",
    definition:
      "Ett villkor som hindrar att bitcoin spenderas före en viss tidpunkt eller blockhöjd. Används bl.a. i Lightning och arvslösningar.",
    level: 3,
  },
  {
    term: "UTXO",
    slug: "utxo",
    definition:
      "Unspent Transaction Output: en \u201dpost\u201d av bitcoin som ännu inte spenderats. Din balans är summan av dina UTXO:er.",
    level: 3,
  },
  {
    term: "Watch-only-plånbok",
    slug: "watch-only",
    definition:
      "En plånbok som bara har publika nycklar: den kan visa saldo och ta emot, men inte spendera. Bra för bevakning utan risk.",
    level: 3,
  },
  {
    term: "xpub (utökad publik nyckel)",
    slug: "xpub",
    definition:
      "En nyckel som kan härleda alla dina mottagningsadresser utan att kunna spendera. Dela den försiktigt, den avslöjar hela din adresshistorik.",
    level: 3,
  },
];

/** Alphabetically sorted terms (sv-SE collation). */
export const sortedGlossary = [...glossary].sort((a, b) =>
  a.term.localeCompare(b.term, "sv"),
);
