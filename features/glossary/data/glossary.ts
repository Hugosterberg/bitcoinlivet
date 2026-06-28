/**
 * Bitcoin glossary. Plain, calm explanations — no hype, no advice.
 *
 * Bilingual: each term has a stable, locale-agnostic `id` and per-locale
 * `term`, `slug` and `definition`. The slug doubles as the anchor on the
 * glossary page (#slug), localized per locale.
 *
 * Each term has a `level` so readers can choose how deep to go:
 *   1 = Vanliga / Common
 *   2 = Djupare / Deeper
 *   3 = Djupast / Deepest
 */

import { routing, type Locale } from "@/i18n/routing";

export type GlossaryLevel = 1 | 2 | 3;

export type GlossaryTerm = {
  /** Stable, locale-agnostic id (shared across locales). */
  id: string;
  /** Display term. */
  term: string;
  /** URL/anchor-safe id, localized. */
  slug: string;
  /** Short, beginner-friendly definition. */
  definition: string;
  /** How technical the term is (1 = common, 3 = deepest). */
  level: GlossaryLevel;
};

type LevelMeta = {
  level: GlossaryLevel;
  label: string;
  description: string;
  /** Tailwind class for the small level dot. */
  dotClass: string;
};

const levelsByLocale: Record<Locale, LevelMeta[]> = {
  sv: [
    { level: 1, label: "Vanliga", description: "Begrepp alla har nytta av", dotClass: "bg-muted-foreground" },
    { level: 2, label: "Djupare", description: "För dig som vill förstå mer", dotClass: "bg-bitcoin/70" },
    { level: 3, label: "Djupast", description: "Tekniska detaljer", dotClass: "bg-bitcoin" },
  ],
  en: [
    { level: 1, label: "Common", description: "Terms everyone benefits from", dotClass: "bg-muted-foreground" },
    { level: 2, label: "Deeper", description: "For those who want to understand more", dotClass: "bg-bitcoin/70" },
    { level: 3, label: "Deepest", description: "Technical details", dotClass: "bg-bitcoin" },
  ],
};

export function getGlossaryLevels(locale: Locale): LevelMeta[] {
  return levelsByLocale[locale];
}

export function levelMeta(locale: Locale, level: GlossaryLevel): LevelMeta {
  return getGlossaryLevels(locale).find((l) => l.level === level) ?? getGlossaryLevels(locale)[0];
}

const svGlossary: GlossaryTerm[] = [
  // — Vanliga (1) —
  { id: "address", term: "Adress", slug: "adress", level: 1, definition: "En sträng som fungerar som ett kontonummer för att ta emot bitcoin. Du kan dela den fritt; den avslöjar inte din privata nyckel." },
  { id: "bitcoin", term: "Bitcoin", slug: "bitcoin", level: 1, definition: "Ett digitalt, decentraliserat pengasystem med ett förutbestämt maxutbud på 21 miljoner. Ingen enskild aktör styr det." },
  { id: "block", term: "Block", slug: "block", level: 1, definition: "En bunt transaktioner som läggs till i blockkedjan ungefär var tionde minut." },
  { id: "blockchain", term: "Blockkedja", slug: "blockkedja", level: 1, definition: "Den gemensamma, kronologiska liggaren över alla bitcoin-transaktioner. Block länkas ihop så att historiken blir mycket svår att ändra." },
  { id: "exchange", term: "Börs (växlingstjänst)", slug: "bors", level: 1, definition: "En handelsplats där du köper och säljer bitcoin mot kronor. Oftast en mellanhand som håller dina nycklar tills du flyttar ut bitcoin." },
  { id: "dca", term: "DCA (regelbundet sparande)", slug: "dca", level: 1, definition: "Dollar Cost Averaging: att köpa för ett fast belopp med jämna mellanrum i stället för allt på en gång. Jämnar ut priset över tid." },
  { id: "fiat", term: "Fiatvaluta", slug: "fiatvaluta", level: 1, definition: "Statligt utgivna pengar som kronor, euro och dollar. Utbudet kan ökas av centralbanker, vilket över tid kan urholka köpkraften." },
  { id: "halving", term: "Halvering", slug: "halvering", level: 1, definition: "Ungefär vart fjärde år halveras takten som nya bitcoin skapas i. Det gör utbudet förutsägbart och allt knappare." },
  { id: "hodl", term: "HODL", slug: "hodl", level: 1, definition: "Slang för att hålla i sin bitcoin långsiktigt i stället för att handla kortsiktigt. Kommer från en felstavning av ”hold”." },
  { id: "inflation", term: "Inflation", slug: "inflation", level: 1, definition: "När den allmänna prisnivån stiger så att varje krona räcker till mindre. Mäts i Sverige med konsumentprisindex (KPI)." },
  { id: "scarcity", term: "Knapphet", slug: "knapphet", level: 1, definition: "Att något finns i begränsad mängd. Bitcoins fasta tak på 21 miljoner gör knappheten trovärdig och förutsägbar." },
  { id: "purchasing-power", term: "Köpkraft", slug: "kopkraft", level: 1, definition: "Hur mycket varor och tjänster dina pengar faktiskt räcker till. Det är köpkraften, inte antalet kronor, som avgör din vardag." },
  { id: "max-supply", term: "Maxutbud", slug: "maxutbud", level: 1, definition: "Det finns aldrig fler än 21 miljoner bitcoin. Gränsen är inbyggd i protokollet och kan inte enkelt ändras." },
  { id: "wallet", term: "Plånbok (wallet)", slug: "planbok", level: 1, definition: "Programvara eller hårdvara som hanterar dina nycklar och låter dig ta emot och skicka bitcoin. Plånboken ”förvarar” nycklar, inte mynt." },
  { id: "private-key", term: "Privat nyckel", slug: "privat-nyckel", level: 1, definition: "Den hemliga koden som ger kontroll över dina bitcoin. Den som har den privata nyckeln äger pengarna, håll den hemlig." },
  { id: "sats", term: "Sats (satoshi)", slug: "sats", level: 1, definition: "Den minsta enheten av bitcoin. En bitcoin består av 100 000 000 sats, så du kan spara i små steg." },
  { id: "satoshi-nakamoto", term: "Satoshi Nakamoto", slug: "satoshi-nakamoto", level: 1, definition: "Pseudonymen för den okända person eller grupp som skapade Bitcoin och var aktiv 2008–2010. Den verkliga identiteten är fortfarande okänd." },
  { id: "sound-money", term: "Sunda pengar", slug: "sunda-pengar", level: 1, definition: "Pengar som behåller sitt värde över tid tack vare ett knappt och förutsägbart utbud. Bitcoins fasta tak är ett exempel." },
  { id: "volatility", term: "Volatilitet", slug: "volatilitet", level: 1, definition: "Hur mycket priset svänger upp och ner. Bitcoin är historiskt volatilt på kort sikt, ett skäl att tänka långsiktigt." },
  { id: "whitepaper", term: "Whitepaper", slug: "whitepaper", level: 1, definition: "Det korta dokument som Satoshi Nakamoto publicerade 2008 och som beskriver hur Bitcoin fungerar. Grunden för allt som följde." },

  // — Djupare (2) —
  { id: "confirmation", term: "Bekräftelse", slug: "bekraftelse", level: 2, definition: "Antalet block som byggts ovanpå blocket där din transaktion ligger. Fler bekräftelser gör transaktionen allt svårare att ångra." },
  { id: "block-reward", term: "Blockbelöning", slug: "blockbeloning", level: 2, definition: "De nya bitcoin plus avgifter som tillfaller den som hittar ett block. Den nya delen halveras var 210 000:e block." },
  { id: "censorship-resistance", term: "Censurmotstånd", slug: "censurmotstand", level: 2, definition: "Egenskapen att ingen enskild aktör kan hindra en giltig transaktion eller frysa dina pengar. Följer av decentraliseringen." },
  { id: "cold-storage", term: "Cold storage", slug: "cold-storage", level: 2, definition: "Förvaring av nycklar offline, utan internetuppkoppling. Minskar risken för stöld jämfört med en plånbok som alltid är uppkopplad." },
  { id: "self-custody", term: "Egen förvaring", slug: "egen-forvaring", level: 2, definition: "Att själv hålla i sina nycklar (self-custody) i stället för att lita på en börs. ”Not your keys, not your coins.”" },
  { id: "custodial", term: "Förvaringstjänst (custodial)", slug: "custodial", level: 2, definition: "När någon annan, t.ex. en börs, håller dina privata nycklar åt dig. Bekvämt, men du måste lita på förvararen." },
  { id: "full-node", term: "Full nod", slug: "full-nod", level: 2, definition: "En nod som laddar ner och självständigt verifierar hela blockkedjan enligt reglerna. Att köra en egen nod är att kunna lita på, inte fråga." },
  { id: "genesis-block", term: "Genesis-blocket", slug: "genesis-blocket", level: 2, definition: "Det allra första blocket (block 0), skapat den 3 januari 2009. Innehåller en rubrik om bankräddningar, en hälsning till eftervärlden." },
  { id: "hashrate", term: "Hashrate", slug: "hashrate", level: 2, definition: "Den samlade beräkningskraft som säkrar nätverket. Högre hashrate gör det dyrare och svårare att angripa kedjan." },
  { id: "hardware-wallet", term: "Hårdvaruplånbok", slug: "hardvaruplanbok", level: 2, definition: "En fysisk enhet som håller dina privata nycklar offline och signerar transaktioner internt. Ett populärt sätt att förvara säkert." },
  { id: "hot-wallet", term: "Hetplånbok (hot wallet)", slug: "hetplanbok", level: 2, definition: "En plånbok som är uppkopplad mot internet. Smidig för vardagsbruk, men mer utsatt än offline-förvaring." },
  { id: "kyc", term: "KYC (känn din kund)", slug: "kyc", level: 2, definition: "Regelkrav som tvingar tjänster att verifiera din identitet. Påverkar din integritet eftersom köp då knyts till dig." },
  { id: "lightning", term: "Lightning Network", slug: "lightning", level: 2, definition: "Ett lager ovanpå Bitcoin för snabba och billiga betalningar, lämpligt för små vardagsköp." },
  { id: "mempool", term: "Mempool", slug: "mempool", level: 2, definition: "Väntrummet för transaktioner som ännu inte kommit med i ett block. När mempoolen är full stiger avgifterna." },
  { id: "mining", term: "Mining (brytning)", slug: "mining", level: 2, definition: "Processen där datorer säkrar nätverket och skapar nya block. Brytare belönas med nya bitcoin och transaktionsavgifter." },
  { id: "node", term: "Nod", slug: "nod", level: 2, definition: "En dator som kör Bitcoin-programvaran och själv verifierar reglerna. Många noder gör nätverket decentraliserat." },
  { id: "peer-to-peer", term: "Peer-to-peer (P2P)", slug: "peer-to-peer", level: 2, definition: "Direkt mellan deltagare, utan mellanhand. Bitcoin skickas från person till person över ett nätverk av likställda noder." },
  { id: "proof-of-work", term: "Proof of work", slug: "proof-of-work", level: 2, definition: "Metoden där brytare lägger ner verklig energi för att få lägga till block. Gör det dyrt att fuska och säkrar historiken." },
  { id: "public-key", term: "Publik nyckel", slug: "publik-nyckel", level: 2, definition: "Härleds matematiskt från den privata nyckeln och används för att skapa adresser. Kan delas utan att äventyra dina pengar." },
  { id: "seed-phrase", term: "Seed phrase (återställningsfras)", slug: "seed-phrase", level: 2, definition: "12–24 ord som kan återskapa din plånbok. Skriv ner den och förvara den säkert offline, aldrig digitalt eller i bild." },
  { id: "transaction-fee", term: "Transaktionsavgift", slug: "transaktionsavgift", level: 2, definition: "Avgift i sat/vB som betalas till brytare för att få med en transaktion i ett block. Högre avgift ger snabbare bekräftelse." },

  // — Djupast (3) —
  { id: "bip", term: "BIP (Bitcoin Improvement Proposal)", slug: "bip", level: 3, definition: "Ett formellt förslag för att ändra eller standardisera något i Bitcoin. Hur uppgraderingar diskuteras och dokumenteras." },
  { id: "coinbase-transaction", term: "Coinbase-transaktion", slug: "coinbase-transaktion", level: 3, definition: "Den första transaktionen i varje block som skapar de nya bitcoin (blockbelöningen) till brytaren. Inte att förväxla med börsen Coinbase." },
  { id: "coinjoin", term: "CoinJoin", slug: "coinjoin", level: 3, definition: "En integritetsteknik där flera användare slår ihop sina betalningar i en gemensam transaktion för att försvåra spårning." },
  { id: "cpfp", term: "CPFP (Child Pays For Parent)", slug: "cpfp", level: 3, definition: "Att skynda på en fastnad transaktion genom att spendera dess utgång med hög avgift, så att brytare tar med båda." },
  { id: "dust", term: "Dust (damm)", slug: "dust", level: 3, definition: "Så små UTXO-belopp att det kan kosta mer i avgift att spendera dem än vad de är värda." },
  { id: "hd-wallet", term: "HD-plånbok / deriveringsväg", slug: "hd-planbok", level: 3, definition: "En hierarkiskt deterministisk plånbok (BIP32) som ur en enda seed härleder oändligt många nycklar längs en deriveringsväg." },
  { id: "hash-function", term: "Hashfunktion (SHA-256)", slug: "hashfunktion", level: 3, definition: "En envägsfunktion som gör om data till ett fast ”fingeravtryck”. Bitcoin använder SHA-256 i mining och för att länka block." },
  { id: "merkle-tree", term: "Merkle-träd", slug: "merkle-trad", level: 3, definition: "En hashstruktur som sammanfattar alla transaktioner i ett block till en enda rot-hash, vilket möjliggör effektiv verifiering." },
  { id: "multisig", term: "Multisig (multisignatur)", slug: "multisig", level: 3, definition: "Kräver flera nycklar för att spendera, t.ex. 2 av 3. Ökar säkerheten och används för delat ägande och bättre förvaring." },
  { id: "nonce", term: "Nonce", slug: "nonce", level: 3, definition: "Talet som brytare ändrar om och om igen för att hitta en blockhash som uppfyller svårighetskravet i proof of work." },
  { id: "psbt", term: "PSBT", slug: "psbt", level: 3, definition: "Partially Signed Bitcoin Transaction: ett standardformat för att samla in signaturer mellan enheter, t.ex. en hårdvaruplånbok." },
  { id: "rbf", term: "RBF (Replace-by-Fee)", slug: "rbf", level: 3, definition: "Att ersätta en obekräftad transaktion med en ny som har högre avgift, för att den ska bekräftas snabbare." },
  { id: "schnorr", term: "Schnorr-signaturer", slug: "schnorr", level: 3, definition: "Ett signatursystem som infördes med Taproot. Effektivare och mer privat än det äldre ECDSA och möjliggör signaturaggregering." },
  { id: "script", term: "Script (Bitcoin Script)", slug: "script", level: 3, definition: "Det enkla, avsiktligt begränsade språket som anger villkoren för att få spendera bitcoin. Inte ett fritt programmeringsspråk." },
  { id: "segwit", term: "SegWit", slug: "segwit", level: 3, definition: "Segregated Witness: en uppgradering (2017) som flyttar signaturdata och ökar kapaciteten samt löste s.k. transaction malleability." },
  { id: "difficulty-adjustment", term: "Svårighetsjustering", slug: "svarighetsjustering", level: 3, definition: "Var 2016:e block (~två veckor) justerar nätverket svårighetsgraden så att block fortsätter komma ungefär var tionde minut." },
  { id: "taproot", term: "Taproot", slug: "taproot", level: 3, definition: "En uppgradering (2021) som förbättrar integritet och effektivitet och får komplexa utgiftsvillkor att se ut som vanliga transaktioner." },
  { id: "timelock", term: "Timelock", slug: "timelock", level: 3, definition: "Ett villkor som hindrar att bitcoin spenderas före en viss tidpunkt eller blockhöjd. Används bl.a. i Lightning och arvslösningar." },
  { id: "utxo", term: "UTXO", slug: "utxo", level: 3, definition: "Unspent Transaction Output: en ”post” av bitcoin som ännu inte spenderats. Din balans är summan av dina UTXO:er." },
  { id: "watch-only", term: "Watch-only-plånbok", slug: "watch-only", level: 3, definition: "En plånbok som bara har publika nycklar: den kan visa saldo och ta emot, men inte spendera. Bra för bevakning utan risk." },
  { id: "xpub", term: "xpub (utökad publik nyckel)", slug: "xpub", level: 3, definition: "En nyckel som kan härleda alla dina mottagningsadresser utan att kunna spendera. Dela den försiktigt, den avslöjar hela din adresshistorik." },
];

const enGlossary: GlossaryTerm[] = [
  // — Common (1) —
  { id: "address", term: "Address", slug: "address", level: 1, definition: "A string that works like an account number for receiving bitcoin. You can share it freely; it doesn't reveal your private key." },
  { id: "bitcoin", term: "Bitcoin", slug: "bitcoin", level: 1, definition: "A digital, decentralised money system with a predetermined maximum supply of 21 million. No single actor controls it." },
  { id: "block", term: "Block", slug: "block", level: 1, definition: "A batch of transactions added to the blockchain roughly every ten minutes." },
  { id: "blockchain", term: "Blockchain", slug: "blockchain", level: 1, definition: "The shared, chronological ledger of all bitcoin transactions. Blocks are linked together so the history becomes very hard to change." },
  { id: "exchange", term: "Exchange", slug: "exchange", level: 1, definition: "A marketplace where you buy and sell bitcoin for fiat. Usually an intermediary that holds your keys until you withdraw your bitcoin." },
  { id: "dca", term: "DCA (regular saving)", slug: "dca", level: 1, definition: "Dollar Cost Averaging: buying a fixed amount at regular intervals instead of everything at once. Smooths out the price over time." },
  { id: "fiat", term: "Fiat currency", slug: "fiat-currency", level: 1, definition: "State-issued money like the krona, euro and dollar. The supply can be increased by central banks, which can erode purchasing power over time." },
  { id: "halving", term: "Halving", slug: "halving", level: 1, definition: "Roughly every four years the rate at which new bitcoin are created is halved. This makes the supply predictable and ever scarcer." },
  { id: "hodl", term: "HODL", slug: "hodl", level: 1, definition: "Slang for holding your bitcoin for the long term instead of trading short term. It comes from a misspelling of ”hold”." },
  { id: "inflation", term: "Inflation", slug: "inflation", level: 1, definition: "When the general price level rises so that each unit of money buys less. In Sweden it's measured with the consumer price index (CPI)." },
  { id: "scarcity", term: "Scarcity", slug: "scarcity", level: 1, definition: "That something exists in limited quantity. Bitcoin's fixed cap of 21 million makes the scarcity credible and predictable." },
  { id: "purchasing-power", term: "Purchasing power", slug: "purchasing-power", level: 1, definition: "How much in goods and services your money actually buys. It's purchasing power, not the number of units, that shapes your everyday life." },
  { id: "max-supply", term: "Maximum supply", slug: "max-supply", level: 1, definition: "There will never be more than 21 million bitcoin. The limit is built into the protocol and can't easily be changed." },
  { id: "wallet", term: "Wallet", slug: "wallet", level: 1, definition: "Software or hardware that manages your keys and lets you receive and send bitcoin. A wallet ”stores” keys, not coins." },
  { id: "private-key", term: "Private key", slug: "private-key", level: 1, definition: "The secret code that gives control over your bitcoin. Whoever has the private key owns the money — keep it secret." },
  { id: "sats", term: "Sat (satoshi)", slug: "sats", level: 1, definition: "The smallest unit of bitcoin. One bitcoin is made up of 100,000,000 sats, so you can save in small steps." },
  { id: "satoshi-nakamoto", term: "Satoshi Nakamoto", slug: "satoshi-nakamoto", level: 1, definition: "The pseudonym of the unknown person or group who created Bitcoin and was active 2008–2010. The real identity is still unknown." },
  { id: "sound-money", term: "Sound money", slug: "sound-money", level: 1, definition: "Money that keeps its value over time thanks to a scarce and predictable supply. Bitcoin's fixed cap is one example." },
  { id: "volatility", term: "Volatility", slug: "volatility", level: 1, definition: "How much the price swings up and down. Bitcoin is historically volatile in the short run — a reason to think long term." },
  { id: "whitepaper", term: "Whitepaper", slug: "whitepaper", level: 1, definition: "The short document Satoshi Nakamoto published in 2008 describing how Bitcoin works. The foundation for everything that followed." },

  // — Deeper (2) —
  { id: "confirmation", term: "Confirmation", slug: "confirmation", level: 2, definition: "The number of blocks built on top of the block holding your transaction. More confirmations make the transaction ever harder to reverse." },
  { id: "block-reward", term: "Block reward", slug: "block-reward", level: 2, definition: "The new bitcoin plus fees that go to whoever finds a block. The new portion halves every 210,000 blocks." },
  { id: "censorship-resistance", term: "Censorship resistance", slug: "censorship-resistance", level: 2, definition: "The property that no single actor can block a valid transaction or freeze your money. It follows from decentralisation." },
  { id: "cold-storage", term: "Cold storage", slug: "cold-storage", level: 2, definition: "Keeping keys offline, without an internet connection. Reduces the risk of theft compared with a wallet that's always online." },
  { id: "self-custody", term: "Self-custody", slug: "self-custody", level: 2, definition: "Holding your own keys instead of trusting an exchange. ”Not your keys, not your coins.”" },
  { id: "custodial", term: "Custodial service", slug: "custodial", level: 2, definition: "When someone else, e.g. an exchange, holds your private keys for you. Convenient, but you have to trust the custodian." },
  { id: "full-node", term: "Full node", slug: "full-node", level: 2, definition: "A node that downloads and independently verifies the whole blockchain against the rules. Running your own node means you can trust, not ask." },
  { id: "genesis-block", term: "The genesis block", slug: "genesis-block", level: 2, definition: "The very first block (block 0), created on 3 January 2009. It contains a headline about bank bailouts — a message to posterity." },
  { id: "hashrate", term: "Hash rate", slug: "hashrate", level: 2, definition: "The combined computing power that secures the network. A higher hash rate makes the chain more expensive and harder to attack." },
  { id: "hardware-wallet", term: "Hardware wallet", slug: "hardware-wallet", level: 2, definition: "A physical device that keeps your private keys offline and signs transactions internally. A popular way to store securely." },
  { id: "hot-wallet", term: "Hot wallet", slug: "hot-wallet", level: 2, definition: "A wallet connected to the internet. Convenient for everyday use, but more exposed than offline storage." },
  { id: "kyc", term: "KYC (know your customer)", slug: "kyc", level: 2, definition: "Regulatory requirements that force services to verify your identity. It affects your privacy because purchases are then tied to you." },
  { id: "lightning", term: "Lightning Network", slug: "lightning", level: 2, definition: "A layer on top of Bitcoin for fast and cheap payments, suited to small everyday purchases." },
  { id: "mempool", term: "Mempool", slug: "mempool", level: 2, definition: "The waiting room for transactions not yet included in a block. When the mempool is full, fees rise." },
  { id: "mining", term: "Mining", slug: "mining", level: 2, definition: "The process where computers secure the network and create new blocks. Miners are rewarded with new bitcoin and transaction fees." },
  { id: "node", term: "Node", slug: "node", level: 2, definition: "A computer running the Bitcoin software that verifies the rules itself. Many nodes make the network decentralised." },
  { id: "peer-to-peer", term: "Peer-to-peer (P2P)", slug: "peer-to-peer", level: 2, definition: "Directly between participants, without an intermediary. Bitcoin is sent from person to person over a network of equal nodes." },
  { id: "proof-of-work", term: "Proof of work", slug: "proof-of-work", level: 2, definition: "The method where miners spend real energy to add blocks. It makes cheating expensive and secures the history." },
  { id: "public-key", term: "Public key", slug: "public-key", level: 2, definition: "Derived mathematically from the private key and used to create addresses. It can be shared without endangering your money." },
  { id: "seed-phrase", term: "Seed phrase (recovery phrase)", slug: "seed-phrase", level: 2, definition: "12–24 words that can recreate your wallet. Write it down and keep it safely offline, never digitally or in a photo." },
  { id: "transaction-fee", term: "Transaction fee", slug: "transaction-fee", level: 2, definition: "A fee in sat/vB paid to miners to get a transaction into a block. A higher fee gives a faster confirmation." },

  // — Deepest (3) —
  { id: "bip", term: "BIP (Bitcoin Improvement Proposal)", slug: "bip", level: 3, definition: "A formal proposal to change or standardise something in Bitcoin. How upgrades are discussed and documented." },
  { id: "coinbase-transaction", term: "Coinbase transaction", slug: "coinbase-transaction", level: 3, definition: "The first transaction in each block, which creates the new bitcoin (the block reward) for the miner. Not to be confused with the Coinbase exchange." },
  { id: "coinjoin", term: "CoinJoin", slug: "coinjoin", level: 3, definition: "A privacy technique where several users combine their payments into one shared transaction to make tracing harder." },
  { id: "cpfp", term: "CPFP (Child Pays For Parent)", slug: "cpfp", level: 3, definition: "Speeding up a stuck transaction by spending its output with a high fee, so miners include both." },
  { id: "dust", term: "Dust", slug: "dust", level: 3, definition: "UTXO amounts so small that it can cost more in fees to spend them than they're worth." },
  { id: "hd-wallet", term: "HD wallet / derivation path", slug: "hd-wallet", level: 3, definition: "A hierarchical deterministic wallet (BIP32) that derives endless keys from a single seed along a derivation path." },
  { id: "hash-function", term: "Hash function (SHA-256)", slug: "hash-function", level: 3, definition: "A one-way function that turns data into a fixed ”fingerprint”. Bitcoin uses SHA-256 in mining and to link blocks." },
  { id: "merkle-tree", term: "Merkle tree", slug: "merkle-tree", level: 3, definition: "A hash structure that summarises all transactions in a block into a single root hash, enabling efficient verification." },
  { id: "multisig", term: "Multisig (multi-signature)", slug: "multisig", level: 3, definition: "Requires several keys to spend, e.g. 2 of 3. Increases security and is used for shared ownership and better custody." },
  { id: "nonce", term: "Nonce", slug: "nonce", level: 3, definition: "The number miners change over and over to find a block hash that meets the difficulty requirement in proof of work." },
  { id: "psbt", term: "PSBT", slug: "psbt", level: 3, definition: "Partially Signed Bitcoin Transaction: a standard format for collecting signatures across devices, e.g. a hardware wallet." },
  { id: "rbf", term: "RBF (Replace-by-Fee)", slug: "rbf", level: 3, definition: "Replacing an unconfirmed transaction with a new one that has a higher fee, so it confirms faster." },
  { id: "schnorr", term: "Schnorr signatures", slug: "schnorr", level: 3, definition: "A signature scheme introduced with Taproot. More efficient and private than the older ECDSA, and it enables signature aggregation." },
  { id: "script", term: "Script (Bitcoin Script)", slug: "script", level: 3, definition: "The simple, deliberately limited language that sets the conditions for spending bitcoin. Not a free-form programming language." },
  { id: "segwit", term: "SegWit", slug: "segwit", level: 3, definition: "Segregated Witness: an upgrade (2017) that moves signature data and increases capacity, and fixed so-called transaction malleability." },
  { id: "difficulty-adjustment", term: "Difficulty adjustment", slug: "difficulty-adjustment", level: 3, definition: "Every 2016 blocks (~two weeks) the network adjusts the difficulty so blocks keep arriving roughly every ten minutes." },
  { id: "taproot", term: "Taproot", slug: "taproot", level: 3, definition: "An upgrade (2021) that improves privacy and efficiency and makes complex spending conditions look like ordinary transactions." },
  { id: "timelock", term: "Timelock", slug: "timelock", level: 3, definition: "A condition that prevents bitcoin from being spent before a certain time or block height. Used in Lightning and inheritance setups, among others." },
  { id: "utxo", term: "UTXO", slug: "utxo", level: 3, definition: "Unspent Transaction Output: an ”entry” of bitcoin not yet spent. Your balance is the sum of your UTXOs." },
  { id: "watch-only", term: "Watch-only wallet", slug: "watch-only", level: 3, definition: "A wallet that only has public keys: it can show balances and receive, but not spend. Good for monitoring without risk." },
  { id: "xpub", term: "xpub (extended public key)", slug: "xpub", level: 3, definition: "A key that can derive all your receiving addresses without being able to spend. Share it carefully — it reveals your whole address history." },
];

const glossaryByLocale: Record<Locale, GlossaryTerm[]> = {
  sv: svGlossary,
  en: enGlossary,
};

export function getGlossary(locale: Locale): GlossaryTerm[] {
  return glossaryByLocale[locale];
}

/** Alphabetically sorted terms using the locale's collation. */
export function getSortedGlossary(locale: Locale): GlossaryTerm[] {
  return [...getGlossary(locale)].sort((a, b) => a.term.localeCompare(b.term, locale));
}

/** Maps a term's stable id to its slug (anchor) in every locale, for hreflang. */
export function getGlossarySlugsById(id: string): Record<Locale, string> {
  const slugs = {} as Record<Locale, string>;
  for (const locale of routing.locales) {
    const term = getGlossary(locale).find((t) => t.id === id);
    if (term) slugs[locale] = term.slug;
  }
  return slugs;
}
