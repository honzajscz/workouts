/* Kurz: Claude 101 (podle academy.claude.com/courses/claude-101) */
AKADEMIE.add({
  id: "claude-101",
  emoji: "👋",
  title: "Claude 101",
  category: "start",
  level: "Začátečník",
  desc: "Co Claude je, jak s ním vést první rozhovor, jak dostat lepší výsledky a jaké nástroje (projekty, artefakty, skills, konektory, Research) máš k dispozici.",
  source: "https://academy.claude.com/courses/claude-101",
  modules: [
    {
      title: "Seznámení s Claude",
      lessons: [
        {
          id: "c101-01",
          title: "Co je Claude?",
          minutes: 4,
          lead: `Claude je AI asistent od společnosti Anthropic. Umí číst, psát, analyzovat, programovat a přemýšlet nad problémy spolu s tebou. Tahle lekce vysvětlí, co to prakticky znamená a v čem se Claude liší od vyhledávače.`,
          blocks: [
            { t: "p", h: `Claude je <b>velký jazykový model</b> (LLM). Zjednodušeně: program, který se na obrovském množství textu naučil, jak lidé píší a uvažují, a díky tomu dokáže vést rozhovor, shrnovat dokumenty, navrhovat texty, vysvětlovat pojmy nebo psát kód.` },
            { t: "p", h: `Anthropic vyvíjí Claude s důrazem na to, aby byl <b>užitečný, poctivý a neškodný</b>. Claude se snaží říkat, když si není jistý, odmítá pomáhat s nebezpečnými věcmi a dá se s ním normálně diskutovat, včetně toho, že mu můžeš oponovat.` },
            { t: "h", x: "Kde Claude potkáš" },
            { t: "ul", items: [
              `<b>Webová aplikace</b> claude.ai v prohlížeči.`,
              `<b>Aplikace pro počítač</b> (Windows, Mac) a <b>mobilní aplikace</b> (iPhone, Android).`,
              `<b>Rozšíření pro Chrome</b>, které umí pracovat přímo s otevřenou webovou stránkou.`,
              `<b>Claude Code</b> pro programátory v terminálu nebo editoru.`,
              `<b>Claude API</b> pro firmy, které si Claude zabudují do vlastních produktů.`
            ] },
            { t: "h", x: "Jak se liší od vyhledávače" },
            { t: "cmp",
              bad: { lbl: "Vyhledávač", h: `Zadáš hesla, dostaneš seznam odkazů. Čtení, porovnání a rozhodnutí je na tobě.` },
              good: { lbl: "Claude", h: `Zadáš otázku i s kontextem, dostaneš odpověď šitou na míru. Můžeš se doptávat, nechat si věc vysvětlit jinak, přiložit vlastní dokument.` } },
            { t: "ex", title: "Ukázka: první otázka", turns: [
              { who: "user", text: `Vysvětli mi jednou větou, co je to inflace, a pak přidej jeden příklad z běžného života.` },
              { who: "ai", text: `Inflace je postupný růst cen zboží a služeb, kvůli kterému si za stejné peníze koupíš méně než dřív. Příklad: rohlík, který loni stál 3 Kč, dnes stojí 4 Kč, ačkoli je to pořád stejný rohlík.` }
            ], note: `Všimni si, že Claude dodržel obě části zadání: <b>jedna věta</b> a <b>jeden příklad</b>. Čím přesněji řekneš, co chceš, tím přesněji to dostaneš.` },
            { t: "info", h: `Claude nemá vlastní paměť napříč rozhovory (pokud si funkci paměti nezapneš) a nezná tvá interní data, dokud mu je neukážeš. Každý nový chat začíná „s čistým stolem“.` }
          ],
          quiz: [
            { q: "Co je Claude?", o: ["Vyhledávač, který vrací seznam odkazů", "AI asistent založený na velkém jazykovém modelu", "Program na úpravu fotek"], a: 1, why: "Claude je velký jazykový model od Anthropic, se kterým vedeš rozhovor a který ti pomáhá s textem, analýzou i kódem." },
            { q: "Co platí o novém chatu s Claude?", o: ["Claude si pamatuje vše z předchozích chatů automaticky", "Claude začíná bez znalosti tvých dat, dokud mu je neposkytneš", "Claude má přístup k tvému počítači"], a: 1, why: "Každý chat začíná s čistým stolem. Kontext, dokumenty nebo instrukce musíš dodat (nebo použít projekty a paměť)." }
          ],
          cards: [
            { f: "Claude", b: "AI asistent od Anthropic postavený na velkém jazykovém modelu; umí číst, psát, analyzovat a programovat." },
            { f: "Čím se Claude liší od vyhledávače?", b: "Nevrací odkazy, ale odpověď na míru; lze se doptávat a přikládat vlastní materiály." }
          ],
          terms: [
            { t: "Velký jazykový model (LLM)", d: "Program natrénovaný na velkém množství textu, který předpovídá pokračování textu a díky tomu umí odpovídat, shrnovat a tvořit." },
            { t: "Anthropic", d: "Společnost, která vyvíjí Claude s důrazem na bezpečnost a spolehlivost AI." }
          ]
        },
        {
          id: "c101-02",
          title: "Tvůj první rozhovor s Claude",
          minutes: 5,
          lead: `Rozhovor s Claude je jako rozhovor se schopným kolegou, který ale nezná tvou situaci. Ukážeme si, jak takový rozhovor začít a jak ho vést dál.`,
          blocks: [
            { t: "h", x: "Rozhraní chatu" },
            { t: "ul", items: [
              `<b>Pole pro zprávu</b> dole: sem píšeš. Tlačítkem <b>+</b> nebo sponkou přiložíš soubory (PDF, Word, obrázky, tabulky).`,
              `<b>Výběr modelu</b>: obvykle Sonnet (rychlý, univerzální) nebo Opus (nejchytřejší, na složité úlohy). Pro začátek nech výchozí.`,
              `<b>Levý panel</b>: historie chatů, projekty, hledání ve starších rozhovorech.`,
              `<b>Boční panel vpravo</b> se otevře, když Claude vytvoří artefakt (dokument, tabulku, aplikaci).`
            ] },
            { t: "h", x: "Rozhovor je dialog, ne jednorázový příkaz" },
            { t: "p", h: `Nejčastější chyba začátečníků: napsat jednu větu, dostat průměrnou odpověď a odejít. Claude dává nejlepší výsledky, když s ním <b>pokračuješ</b>: doptáš se, upřesníš, řekneš, co se ti nelíbí.` },
            { t: "ex", title: "Ukázka: doladění v několika krocích", turns: [
              { who: "user", text: `Napiš mi zprávu sousedům, že v sobotu od 9 do 14 budu vrtat kvůli montáži kuchyně.` },
              { who: "ai", text: `Dobrý den, sousedé,\nv sobotu 20. 9. budu mezi 9:00 a 14:00 montovat kuchyň, takže se ozve vrtání. Omlouvám se za hluk a děkuji za pochopení.\nJan z bytu 12` },
              { who: "user", text: `Dobré, ale míň formální, jsme kamarádi. A přidej, že pak zvu na kafe.` },
              { who: "ai", text: `Ahoj sousedi,\nv sobotu mezi 9 a 14 u nás bude chvíli hlučno, montuju kuchyň. Předem díky za trpělivost. A až bude hotovo, stavte se na kafe, ať to oslavíme!\nHonza` }
            ], note: `Druhá zpráva je krátká, ale mění dvě věci: <b>tón</b> a <b>obsah</b>. Claude si pamatuje celý rozhovor, nemusíš nic opakovat.` },
            { t: "h", x: "Užitečné úkony" },
            { t: "ul", items: [
              `<b>Upravit svou zprávu</b>: najedeš na svou zprávu a zvolíš úpravu. Claude odpoví znovu od toho místa.`,
              `<b>Zkusit jinou odpověď</b>: pod odpovědí je možnost vygenerovat jinou variantu.`,
              `<b>Kopírovat</b> odpověď jedním kliknutím, nebo ji rovnou upravit v artefaktu.`,
              `<b>Přiložit soubor</b>: Claude ho přečte a pracuje s jeho obsahem, včetně obrázků a screenshotů.`
            ] },
            { t: "tip", h: `Piš klidně česky. Claude česky rozumí i odpovídá dobře. Pokud chceš odpověď v jiném jazyce, stačí to říct.` }
          ],
          quiz: [
            { q: "Claude ti dal odpověď, která je moc formální. Co je nejlepší postup?", o: ["Založit nový chat a zkusit to znovu", "Napsat do stejného chatu, co chceš změnit", "Vzdát to, Claude formálnost neumí změnit"], a: 1, why: "Claude si pamatuje celý rozhovor. Stačí doplnit, co chceš jinak, a odpověď se přizpůsobí." },
            { q: "K čemu slouží přiložení souboru do chatu?", o: ["Claude si ho uloží navždy", "Claude ho přečte a pracuje s jeho obsahem v daném rozhovoru", "Soubor se pošle vývojářům Anthropic"], a: 1, why: "Přiložený soubor se stane součástí kontextu rozhovoru a Claude s ním může pracovat." }
          ],
          cards: [
            { f: "Nejčastější chyba začátečníka", b: "Jedna věta, průměrná odpověď a konec. Lepší je pokračovat: upřesnit, doptat se, říct, co změnit." },
            { f: "Úprava vlastní zprávy", b: "Umožní změnit zadání a nechat Claude odpovědět znovu od toho místa." }
          ],
          terms: [
            { t: "Prompt", d: "Zpráva nebo zadání, které Claude pošleš. Může být otázka, úkol, i text s přílohou." }
          ]
        },
        {
          id: "c101-03",
          title: "Jak dostat lepší výsledky",
          minutes: 6,
          lead: `Kvalita odpovědi závisí hlavně na kvalitě zadání. Dobrá zpráva: nejde o žádnou magii, stačí pár návyků.`,
          blocks: [
            { t: "h", x: "Pět prvků dobrého zadání" },
            { t: "ol", items: [
              `<b>Cíl</b>: co má vzniknout (e-mail, shrnutí, tabulka, plán).`,
              `<b>Kontext</b>: pro koho to je, proč to děláš, co už víš.`,
              `<b>Materiál</b>: přilož dokument, vlož text, dej příklad toho, co se ti líbí.`,
              `<b>Formát</b>: délka, jazyk, struktura (odrážky, tabulka, nadpisy).`,
              `<b>Omezení</b>: čemu se vyhnout, jaký tón, co nesmí chybět.`
            ] },
            { t: "cmp",
              bad: { lbl: "Slabé zadání", h: `Napiš mi něco o time managementu.` },
              good: { lbl: "Silné zadání", h: `Připravuji 10minutovou přednášku pro nové kolegy v účtárně o time managementu. Navrhni osnovu se 3 body, ke každému jeden praktický tip a jednu častou chybu. Tón přátelský, bez korporátních frází. Max 200 slov.` } },
            { t: "h", x: "Dej Claude roli" },
            { t: "p", h: `Věta „Jsi zkušený personalista“ nebo „Odpovídej jako trpělivý učitel matematiky pro páťáky“ zásadně mění styl i úroveň odpovědi.` },
            { t: "h", x: "Nech Claude klást otázky" },
            { t: "ex", title: "Ukázka: Claude se nejdřív zeptá", turns: [
              { who: "user", text: `Chci naplánovat oslavu 50. narozenin pro tátu. Než začneš navrhovat, polož mi 5 otázek, které potřebuješ znát.` },
              { who: "ai", text: `Rád pomůžu. Potřebuji vědět:\n1. Kolik hostů zhruba čekáte a jaký je rozpočet?\n2. Má být oslava překvapení, nebo o ní táta ví?\n3. Preferujete doma, v restauraci, nebo venku?\n4. Co táta má rád (hudba, jídlo, koníčky)?\n5. Jaký je termín a kolik máte času na přípravu?` }
            ], note: `Tenhle trik šetří spoustu času. Místo tří kol upřesňování dostaneš hned první návrh postavený na správných informacích.` },
            { t: "h", x: "Ukaž příklad" },
            { t: "p", h: `Když chceš konkrétní styl, vlož ukázku: „Tady je e-mail, který se mi líbí. Napiš podobným stylem odpověď na tuto poptávku.“ Příklad je pro Claude jasnější než dlouhý popis stylu.` },
            { t: "h", x: "Iteruj a kritizuj" },
            { t: "p", h: `Řekni, co je špatně: „Druhý odstavec je moc obecný, přidej konkrétní čísla.“ Nebo požádej Claude, ať sám zhodnotí svou odpověď: „Najdi tři slabá místa v tomto návrhu a oprav je.“` },
            { t: "warn", h: `Claude se občas splete nebo něco vymyslí (tzv. halucinace), hlavně u faktů, čísel a citací. Důležité věci si ověř. Víc v kurzu „Schopnosti a limity AI“.` }
          ],
          quiz: [
            { q: "Který prvek zadání nejvíc chybí v promptu „Napiš mi něco o time managementu“?", o: ["Zdvořilost", "Kontext, cíl a formát", "Velká písmena"], a: 1, why: "Chybí, pro koho to je, k čemu to bude a v jaké podobě. Bez toho Claude hádá a odpoví obecně." },
            { q: "Co udělá prosba „Než začneš, polož mi 5 otázek“?", o: ["Zpomalí práci bez užitku", "Pomůže Claude získat chybějící informace a udělat lepší první návrh", "Claude ji ignoruje"], a: 1, why: "Claude se doptá na to, co potřebuje, a první návrh je pak trefnější." },
            { q: "Jak nejlépe zadat konkrétní styl textu?", o: ["Dlouze popsat styl", "Vložit ukázku textu, který se ti líbí", "Použít velká písmena"], a: 1, why: "Příklad je nejjasnější způsob, jak sdělit styl. Claude ho napodobí." }
          ],
          cards: [
            { f: "Pět prvků dobrého zadání", b: "Cíl, kontext, materiál, formát, omezení." },
            { f: "Trik „polož mi otázky“", b: "Požádej Claude, ať se před řešením zeptá na chybějící informace. Ušetří kola upřesňování." },
            { f: "Role v zadání", b: "Věta „Jsi zkušený …“ mění styl i úroveň odpovědi." }
          ],
          terms: [
            { t: "Halucinace", d: "Sebevědomě znějící, ale nepravdivá odpověď AI. Nejčastěji u faktů, čísel, citací a odkazů." },
            { t: "Iterace", d: "Postupné vylepšování odpovědi dalšími zprávami: kritikou, upřesněním, doplněním." }
          ]
        },
        {
          id: "c101-04",
          title: "Jak s Claude pracuješ na počítači: Chat, Cowork, Code",
          minutes: 4,
          lead: `Aplikace Claude pro počítač nabízí tři režimy práce. Každý se hodí na jiný typ úkolu.`,
          blocks: [
            { t: "table", head: ["Režim", "Kdy ho použít", "Příklad"], rows: [
              ["<b>Chat</b>", "Otázky, psaní, přemýšlení, rychlé úkoly v jednom rozhovoru", "„Zkrať tento e-mail na polovinu.“"],
              ["<b>Cowork</b>", "Delší úkoly se soubory na tvém počítači; Claude pracuje samostatně a dá ti výsledek", "„Projdi 40 faktur ve složce a udělej z nich tabulku.“"],
              ["<b>Code</b>", "Programování: Claude čte a mění kód v projektu, spouští testy, vytváří commity", "„Oprav chybu v přihlašování a přidej test.“"]
            ] },
            { t: "h", x: "Chat" },
            { t: "p", h: `Klasický rozhovor. Vidíš každou odpověď a reaguješ. Hodí se na většinu každodenních věcí: e-maily, shrnutí, brainstorming, vysvětlování, tabulky.` },
            { t: "h", x: "Cowork" },
            { t: "p", h: `Dáš Claude <b>úkol a přístup ke složce</b> na počítači. Claude si sám naplánuje kroky, otevře soubory, vytvoří nové a průběžně hlásí postup. Ty zatím děláš něco jiného. Vhodné pro věci, které by v chatu vyžadovaly desítky kopírování.` },
            { t: "h", x: "Code" },
            { t: "p", h: `Pro vývojáře. Claude Code pracuje s celým repozitářem, umí spouštět příkazy a ověřovat výsledek. Popsán v samostatném kurzu „Claude Code 101“.` },
            { t: "ex", title: "Ukázka: stejný úkol, různé režimy", turns: [
              { who: "user", label: "V Chatu", text: `Tady je zápis ze schůzky (vložený text). Vytáhni z něj úkoly a termíny.` },
              { who: "user", label: "V Cowork", text: `Ve složce Schůzky/2026 jsou zápisy za celý rok. Ze všech vytáhni úkoly, termíny a odpovědné osoby a ulož je do jedné tabulky ukoly.xlsx.` }
            ], note: `Chat je na jeden dokument. Cowork zvládne celou složku a výsledek uloží jako soubor.` },
            { t: "tip", h: `Nevíš, který režim zvolit? Začni Chatem. Až zjistíš, že pořád něco kopíruješ sem a tam, je čas na Cowork.` }
          ],
          quiz: [
            { q: "Který režim zvolíš, když chceš zpracovat 40 souborů ve složce na počítači?", o: ["Chat", "Cowork", "Code"], a: 1, why: "Cowork dostane přístup ke složce a úkol zpracuje samostatně, včetně vytvoření výsledného souboru." },
            { q: "Co je typické pro režim Chat?", o: ["Claude pracuje sám hodinu bez tvého zásahu", "Vidíš každou odpověď a hned reaguješ", "Funguje jen pro programátory"], a: 1, why: "Chat je dialog krok za krokem. Cowork a Code pracují samostatněji." }
          ],
          cards: [
            { f: "Chat vs. Cowork vs. Code", b: "Chat: rozhovor krok za krokem. Cowork: samostatná práce se soubory na počítači. Code: programování v repozitáři." }
          ],
          terms: [
            { t: "Claude Cowork", d: "Režim aplikace pro počítač, ve kterém Claude samostatně plní delší úkoly se soubory na tvém disku." },
            { t: "Claude Code", d: "Nástroj pro programátory: Claude pracuje s kódem v terminálu nebo editoru, spouští příkazy a ověřuje výsledky." }
          ]
        }
      ]
    },
    {
      title: "Organizace práce a znalostí",
      lessons: [
        {
          id: "c101-05",
          title: "Projekty",
          minutes: 5,
          lead: `Projekt je složka, do které dáš dokumenty a instrukce, a Claude je pak zná v každém chatu uvnitř projektu. Přestaneš dokola vysvětlovat to samé.`,
          blocks: [
            { t: "h", x: "Co projekt obsahuje" },
            { t: "ul", items: [
              `<b>Znalosti projektu</b>: nahrané soubory (ceníky, směrnice, šablony, popis produktu). Claude je má k dispozici ve všech chatech projektu.`,
              `<b>Instrukce projektu</b>: stálé pokyny, například „Piš vždy česky, tykej, používej naši terminologii, výsledky dávej jako odrážky.“`,
              `<b>Chaty</b>: všechny rozhovory v projektu pohromadě. Claude může čerpat i z dřívějších chatů projektu (pokud je to zapnuté).`
            ] },
            { t: "ex", title: "Ukázka: instrukce projektu „Zákaznická podpora“", turns: [
              { who: "sys", text: `Jsi asistent podpory e-shopu s kávou. Odpovídej vždy česky, vykej, buď stručný a vstřícný. Reklamace řeš podle přiloženého dokumentu Reklamacni-rad.pdf. Nikdy neslibuj vrácení peněz, jen postup. Na konci vždy nabídni další pomoc.` },
              { who: "user", text: `Zákazník píše: „Balík přišel rozbitý, co s tím?“ Napiš odpověď.` },
              { who: "ai", text: `Dobrý den,\nmoc nás mrzí, že balík dorazil poškozený. Prosím pošlete nám fotografii poškození a číslo objednávky na reklamace@… Do 2 pracovních dnů se ozveme s řešením podle našeho reklamačního řádu.\nMohu pro Vás udělat ještě něco dalšího?` }
            ], note: `Claude použil tón, jazyk i pravidla z instrukcí a odkázal se na dokument. Nic z toho jsi nemusel/a psát do samotné zprávy.` },
            { t: "h", x: "Kdy založit projekt" },
            { t: "ul", items: [
              `Opakovaně řešíš stejný typ úkolu (týdenní report, odpovědi zákazníkům, příprava výuky).`,
              `Potřebuješ, aby Claude znal tvé podklady (ceník, smlouvy, styl značky).`,
              `Chceš mít rozhovory k jednomu tématu pohromadě.`
            ] },
            { t: "tip", h: `Založ si projekt „Moje učení Claude“ a dávej do něj poznámky z této appky. Můžeš se pak Claude ptát na to, co ses naučil/a.` },
            { t: "info", h: `Projekty jde sdílet s kolegy (podle plánu). Instrukce i znalosti pak platí pro všechny, kdo v projektu pracují.` }
          ],
          quiz: [
            { q: "Co jsou instrukce projektu?", o: ["Jednorázová zpráva v chatu", "Stálé pokyny, které platí ve všech chatech projektu", "Návod, jak Claude nainstalovat"], a: 1, why: "Instrukce projektu se použijí v každém chatu uvnitř projektu, nemusíš je opakovat." },
            { q: "Kdy se projekt vyplatí?", o: ["Na jednorázovou otázku", "Když opakovaně řešíš stejný typ úkolu se stejnými podklady", "Nikdy, chat stačí"], a: 1, why: "Projekt šetří opakované vysvětlování a nahrávání souborů." }
          ],
          cards: [
            { f: "Projekt", b: "Složka s vlastními znalostmi (soubory) a instrukcemi; Claude je zná ve všech chatech projektu." },
            { f: "Instrukce projektu", b: "Stálé pokyny o tónu, jazyku, pravidlech a formátu pro celý projekt." }
          ],
          terms: [
            { t: "Projekt", d: "Prostor v Claude, kde jsou pohromadě soubory (znalosti), stálé instrukce a chaty k jednomu tématu." },
            { t: "Znalosti projektu", d: "Soubory nahrané do projektu, které Claude používá jako podklad ve všech chatech projektu." }
          ]
        },
        {
          id: "c101-06",
          title: "Tvorba s artefakty",
          minutes: 5,
          lead: `Artefakt je samostatný výstup, který Claude vytvoří vedle rozhovoru: dokument, tabulka, diagram, webová stránka nebo malá aplikace. Můžeš ho upravovat, stahovat a sdílet.`,
          blocks: [
            { t: "p", h: `Když je výsledek delší nebo „hotová věc“ (ne jen odpověď), Claude ho otevře v <b>bočním panelu jako artefakt</b>. Rozhovor tak zůstane přehledný a výstup máš k dispozici jako celek.` },
            { t: "h", x: "Co může být artefakt" },
            { t: "ul", items: [
              `Textový dokument (článek, smlouva, návod), který lze dál editovat.`,
              `Kód nebo celá webová stránka, kterou Claude i rovnou zobrazí a spustí.`,
              `Interaktivní aplikace: kalkulačka, kvíz, jednoduchá hra, formulář.`,
              `Diagram, graf, vizualizace dat, prezentace nebo tabulka.`
            ] },
            { t: "ex", title: "Ukázka: artefakt z jedné věty", turns: [
              { who: "user", text: `Udělej mi jednoduchou kalkulačku, kolik měsíčně ušetřím, když přestanu kupovat kávu s sebou. Vstupy: cena kávy, počet káv za týden.` },
              { who: "ai", text: `Vytvořil jsem interaktivní kalkulačku (vpravo). Zadej cenu jedné kávy a počet za týden, hned se přepočítá měsíční a roční úspora. Chceš přidat i porovnání s cenou domácí kávy?` }
            ], note: `Vpravo se objeví funkční aplikace. Můžeš říct „přidej graf“ nebo „udělej to modré“ a Claude artefakt <b>upraví</b>, ne vytvoří nový.` },
            { t: "h", x: "Práce s artefaktem" },
            { t: "ul", items: [
              `<b>Verze</b>: každá úprava vytvoří novou verzi, můžeš se vracet zpět.`,
              `<b>Úpravy přímo v textu</b>: označíš část a požádáš o změnu jen té části.`,
              `<b>Stáhnout</b> jako soubor (Word, PDF, HTML, obrázek podle typu).`,
              `<b>Publikovat / sdílet</b> odkazem, aby si artefakt mohl otevřít i někdo bez Claude.`
            ] },
            { t: "tip", h: `Chceš artefakt? Řekni to: „Udělej z toho dokument v artefaktu.“ Naopak když chceš krátkou odpověď v chatu, řekni „odpověz přímo v chatu, bez artefaktu“.` }
          ],
          quiz: [
            { q: "Co je artefakt?", o: ["Chyba v odpovědi", "Samostatný výstup (dokument, aplikace, diagram) v bočním panelu, který lze upravovat a sdílet", "Nastavení modelu"], a: 1, why: "Artefakt je „hotová věc“ vedle rozhovoru, se svými verzemi a možností stažení nebo sdílení." },
            { q: "Řekneš „udělej tlačítko zelené“. Co Claude udělá s existujícím artefaktem?", o: ["Vytvoří úplně nový a starý smaže", "Upraví ho a vznikne nová verze", "Nic, artefakty nejdou měnit"], a: 1, why: "Artefakty se upravují postupně, každá změna je nová verze a starší jdou obnovit." }
          ],
          cards: [
            { f: "Artefakt", b: "Samostatný výstup v bočním panelu (dokument, aplikace, diagram); má verze, jde stáhnout i sdílet odkazem." }
          ],
          terms: [
            { t: "Artefakt", d: "Samostatný výstup, který Claude vytvoří vedle rozhovoru: dokument, kód, aplikace nebo vizualizace, s verzemi a možností sdílení." }
          ]
        },
        {
          id: "c101-07",
          title: "Práce se skills",
          minutes: 5,
          lead: `Skill je „návod v šuplíku“: sada instrukcí, kterou si Claude sám vytáhne, když se hodí k úkolu. Pomáhá dělat opakované věci stejně dobře pokaždé.`,
          blocks: [
            { t: "h", x: "K čemu skills jsou" },
            { t: "p", h: `Představ si, že máš v týmu způsob, jak psát zápisy ze schůzek: nadpis, účastníci, rozhodnutí, úkoly s termíny. Místo aby to Claude pokaždé vysvětloval/a, uložíš postup jako skill. Kdykoli pak řekneš „udělej zápis“, Claude postup najde a použije.` },
            { t: "h", x: "Vestavěné skills" },
            { t: "p", h: `Claude má zabudované skills pro práci s běžnými formáty: tvorba dokumentů Word, prezentací PowerPoint, tabulek Excel nebo PDF. Nemusíš nic nastavovat, prostě řekni „udělej z toho prezentaci“.` },
            { t: "h", x: "Vlastní skills" },
            { t: "p", h: `Vlastní skill je složka s textovým souborem <code>SKILL.md</code>, který má krátký <b>popis</b> (podle něj Claude pozná, kdy skill použít) a <b>postup</b>. Může obsahovat i šablony nebo ukázky.` },
            { t: "ex", title: "Ukázka: jednoduchý skill „zápis ze schůzky“", turns: [
              { who: "sys", mono: true, text: `---
name: zapis-ze-schuzky
description: Vytvoří strukturovaný zápis ze schůzky z poznámek nebo přepisu. Použij, když uživatel chce zápis, minutes nebo shrnutí schůzky.
---
Postup:
1. Zjisti datum, účastníky a téma.
2. Sepiš rozhodnutí jako odrážky.
3. Sepiš úkoly ve formátu: Kdo, Co, Do kdy.
4. Na konec dej sekci "Otevřené otázky".
Piš česky, stručně, bez vaty.` },
              { who: "user", text: `Tady je přepis z dnešní porady (vložený). Udělej zápis.` },
              { who: "ai", text: `Zápis z porady, 14. 9. 2026\nÚčastníci: Jana, Petr, Honza\n\nRozhodnutí:\n• Nový ceník platí od 1. 10.\n• Web přeloží externí agentura.\n\nÚkoly:\n• Petr, poslat ceník obchodníkům, do 18. 9.\n• Jana, vybrat agenturu, do 25. 9.\n\nOtevřené otázky:\n• Kdo schválí rozpočet na překlad?` }
            ], note: `Claude poznal z <b>description</b>, že se skill hodí, a dodržel strukturu z postupu. Příště bude zápis vypadat stejně.` },
            { t: "info", h: `Skills fungují v Chatu, v Cowork i v Claude Code. Podrobněji je rozebírá kurz „Úvod do agent skills“.` }
          ],
          quiz: [
            { q: "Podle čeho Claude pozná, že má použít určitý skill?", o: ["Podle názvu souboru", "Podle popisu (description) ve skillu, který porovná s tvým zadáním", "Musíš ho vždy ručně zapnout"], a: 1, why: "Popis skillu říká, kdy se hodí. Claude ho porovná se zadáním a skill si sám načte." },
            { q: "Co je hlavní přínos skillu?", o: ["Rychlejší internet", "Opakované úkoly se dělají pokaždé stejně dobře bez opakovaného vysvětlování", "Claude odpovídá delšími texty"], a: 1, why: "Skill uloží postup jednou a Claude ho použije pokaždé, když se hodí." }
          ],
          cards: [
            { f: "Skill", b: "Uložený postup (SKILL.md s popisem a kroky), který si Claude sám načte, když se hodí k úkolu." },
            { f: "Vestavěné skills", b: "Například tvorba Word, PowerPoint, Excel a PDF souborů; fungují bez nastavení." }
          ],
          terms: [
            { t: "Skill", d: "Složka s instrukcemi (SKILL.md) a případnými šablonami, kterou Claude automaticky použije u odpovídajících úkolů." },
            { t: "SKILL.md", d: "Hlavní soubor skillu: hlavička s názvem a popisem a pod ní postup, jak úkol dělat." }
          ]
        }
      ]
    },
    {
      title: "Rozšíření dosahu Claude",
      lessons: [
        {
          id: "c101-08",
          title: "Připojení tvých nástrojů (konektory)",
          minutes: 5,
          lead: `Konektory dovolí Claude číst (a někdy i zapisovat) data v aplikacích, které používáš: Google Drive, Gmail, kalendář, Slack, Notion, GitHub a další.`,
          blocks: [
            { t: "p", h: `Bez konektorů musíš Claude všechno kopírovat. S konektory se prostě zeptáš: „Co mám zítra v kalendáři?“ nebo „Najdi v Drive smlouvu s firmou Novák a shrň platební podmínky.“` },
            { t: "h", x: "Jak konektor zapnout" },
            { t: "steps", items: [
              `Otevři <b>Nastavení → Konektory</b> (název se může lišit podle verze).`,
              `Vyber službu a klikni na <b>Připojit</b>. Přihlásíš se ke službě a potvrdíš oprávnění.`,
              `V chatu pak konektor povol (u tlačítka nástrojů) a začni se ptát.`
            ] },
            { t: "ex", title: "Ukázka: kalendář + e-mail", turns: [
              { who: "user", text: `Podívej se do mého kalendáře na zítřek a napiš mi krátký přehled schůzek. U té s Novákem najdi v Gmailu poslední e-mail od něj a připomeň, co chtěl.` },
              { who: "ai", text: `Zítra máš 3 schůzky:\n• 9:00 Porada týmu (30 min)\n• 11:00 Novák, nabídka (60 min)\n• 15:00 Zubař\n\nPoslední e-mail od p. Nováka (10. 9.): žádá o cenovou nabídku na 20 licencí se slevou pro školy a ptá se na termín dodání. Chceš připravit body k jednání?` }
            ], note: `Claude použil dva konektory najednou a výsledek spojil. Pořád jde ale jen o <b>čtení</b>; žádný e-mail neodeslal.` },
            { t: "h", x: "Bezpečnost" },
            { t: "ul", items: [
              `Konektor má jen oprávnění, která mu dáš. Můžeš ho kdykoli odpojit.`,
              `Před akcemi, které něco mění (odeslat e-mail, vytvořit událost), se Claude typicky ptá na potvrzení.`,
              `Ve firmě může správce určit, které konektory jsou povolené.`
            ] },
            { t: "info", h: `Konektory technicky stojí na protokolu <b>MCP</b> (Model Context Protocol), otevřeném standardu pro připojení nástrojů k AI. Má vlastní kurz v této appce.` }
          ],
          quiz: [
            { q: "Co umožní konektor ke Google Drive?", o: ["Claude si stáhne celý tvůj Drive na server", "Claude může na tvůj pokyn vyhledat a přečíst dokumenty v Drive", "Automaticky maže staré soubory"], a: 1, why: "Konektor dává Claude přístup ke službě v rozsahu oprávnění, která schválíš. Používá ho na tvůj pokyn." },
            { q: "Claude přes konektor navrhne odeslat e-mail. Co se obvykle stane?", o: ["Odešle ho okamžitě", "Požádá o potvrzení, protože jde o akci, která něco mění", "Konektory e-maily posílat neumí nikdy"], a: 1, why: "Akce se změnou (odeslání, vytvoření) typicky vyžadují tvé potvrzení." }
          ],
          cards: [
            { f: "Konektor", b: "Propojení Claude s aplikací (Drive, Gmail, kalendář, Slack…), aby v ní mohl vyhledávat a pracovat s daty na tvůj pokyn." },
            { f: "MCP", b: "Model Context Protocol, otevřený standard, na kterém konektory stojí." }
          ],
          terms: [
            { t: "Konektor", d: "Propojení Claude s externí službou (Google Drive, Gmail, Slack, GitHub…) s oprávněními, která schválíš." }
          ]
        },
        {
          id: "c101-09",
          title: "Enterprise search: práce s firemními znalostmi",
          minutes: 3,
          lead: `Ve firemních plánech může Claude prohledávat všechny připojené firemní zdroje najednou a odpovídat s odkazy na původní dokumenty.`,
          blocks: [
            { t: "p", h: `Rozdíl proti jednotlivým konektorům: nemusíš vědět, <b>kde</b> informace je. Zeptáš se a Claude prohledá Drive, Slack, Confluence, SharePoint nebo jiné připojené systémy a poskládá odpověď.` },
            { t: "ex", title: "Ukázka: otázka napříč firmou", turns: [
              { who: "user", text: `Jaký je náš postup při nástupu nového zaměstnance a kdo za něj odpovídá?` },
              { who: "ai", text: `Podle dokumentu „Onboarding checklist“ (SharePoint, aktualizace březen 2026) má nástup 4 fáze: před nástupem (IT účet, technika), první den (uvítání, školení BOZP), první týden (buddy program) a 30denní zpětná vazba. Odpovídá HR partner týmu; v kanálu #hr-onboarding je zmíněno, že pro obchod je to Lucie K.\nZdroje: [Onboarding checklist], [Slack #hr-onboarding, 2. 9.]` }
            ], note: `Odpověď má <b>zdroje</b>. Vždy je dobré na ně kliknout a ověřit, hlavně u postupů, které se mění.` },
            { t: "ul", items: [
              `Claude vidí jen to, k čemu máš oprávnění ty. Cizí dokumenty nezobrazí.`,
              `Hodí se na otázky typu „kde je“, „jaký je postup“, „co jsme rozhodli“.`,
              `Dostupnost závisí na plánu (Team / Enterprise) a nastavení správce.`
            ] }
          ],
          quiz: [
            { q: "V čem je enterprise search jiný než jeden konektor?", o: ["Prohledá více připojených zdrojů najednou, aniž bys musel/a vědět, kde informace je", "Funguje jen offline", "Je jen pro programátory"], a: 0, why: "Enterprise search hledá napříč všemi připojenými firemními zdroji a odpoví s odkazy." },
            { q: "Může Claude přes enterprise search zobrazit dokument, ke kterému nemáš přístup?", o: ["Ano, vidí vše", "Ne, respektuje tvá oprávnění", "Jen pokud je to PDF"], a: 1, why: "Claude pracuje pouze s tím, k čemu máš přístup ty." }
          ],
          cards: [
            { f: "Enterprise search", b: "Hledání napříč připojenými firemními zdroji (Drive, Slack, SharePoint…) s odpovědí a odkazy na zdroje; respektuje tvá oprávnění." }
          ],
          terms: [
            { t: "Enterprise search", d: "Funkce firemních plánů: Claude prohledá všechny připojené firemní systémy a odpoví s odkazy na zdroje." }
          ]
        },
        {
          id: "c101-10",
          title: "Research: hloubkové rešerše",
          minutes: 4,
          lead: `Režim Research nechá Claude několik minut samostatně hledat na webu (a v připojených zdrojích), porovnávat prameny a sepsat zprávu s citacemi.`,
          blocks: [
            { t: "h", x: "Kdy Research použít" },
            { t: "cmp",
              bad: { lbl: "Běžný chat s webem", h: `Rychlá otázka s jednou dvěma zdroji: „Kolik stojí dálniční známka na rok 2026?“` },
              good: { lbl: "Research", h: `Otázka, kde chceš přehled z mnoha zdrojů: „Porovnej možnosti tepelných čerpadel pro starší rodinný dům v ČR včetně dotací a orientačních cen.“` } },
            { t: "h", x: "Jak to probíhá" },
            { t: "steps", items: [
              `Zapneš <b>Research</b> u pole pro zprávu a zadáš otázku (klidně dlouhou, s tím, co tě zajímá a co ne).`,
              `Claude si někdy položí upřesňující otázky, pak spustí desítky vyhledávání a čtení stránek. Trvá to jednotky až desítky minut.`,
              `Výsledkem je strukturovaná zpráva s <b>citacemi</b> u jednotlivých tvrzení. Můžeš se dál doptávat.`
            ] },
            { t: "ex", title: "Ukázka: zadání rešerše", turns: [
              { who: "user", text: `Chci koupit elektrokolo do 40 000 Kč na dojíždění 12 km po městě. Porovnej 5 modelů dostupných v ČR: dojezd, hmotnost, typ motoru, servis. Uveď zdroje a na závěr doporuč jeden model a vysvětli proč.` },
              { who: "ai", text: `(Po asi 8 minutách) Zpráva: Přehled 5 modelů v tabulce (dojezd 60 až 120 km, hmotnost 22 až 27 kg, středové vs. nábojové motory), sekce o servisní síti, shrnutí recenzí a doporučení jednoho modelu s odůvodněním. U každého údaje odkaz na e-shop nebo recenzi.` }
            ], note: `Dobré zadání rešerše obsahuje <b>rozpočet, účel, kritéria a požadovaný výstup</b>. Bez toho Claude hledá naslepo.` },
            { t: "warn", h: `I zpráva z Research může obsahovat chybu (zastaralá stránka, špatně přečtené číslo). U rozhodnutí s penězi si klíčové údaje ověř na uvedených zdrojích.` }
          ],
          quiz: [
            { q: "Kdy se Research vyplatí víc než běžná otázka?", o: ["Když chceš rychlou jednoduchou odpověď", "Když potřebuješ přehled z mnoha zdrojů s citacemi", "Když nemáš připojení k internetu"], a: 1, why: "Research je na hloubkové srovnání a přehledy; jednoduché otázky vyřeší běžný chat rychleji." },
            { q: "Co by dobré zadání pro Research mělo obsahovat?", o: ["Jen jedno klíčové slovo", "Účel, kritéria, omezení a požadovaný formát výstupu", "Prosbu, ať Claude nespěchá"], a: 1, why: "Čím jasnější kritéria, tím užitečnější zpráva." }
          ],
          cards: [
            { f: "Research", b: "Režim, ve kterém Claude několik minut samostatně hledá v mnoha zdrojích a sepíše zprávu s citacemi." }
          ],
          terms: [
            { t: "Research", d: "Hloubková rešerše: Claude provede desítky vyhledávání, porovná zdroje a napíše strukturovanou zprávu s citacemi." }
          ]
        }
      ]
    },
    {
      title: "Všechno dohromady",
      lessons: [
        {
          id: "c101-11",
          title: "Claude v akci: použití podle role",
          minutes: 5,
          lead: `Jak Claude reálně pomáhá lidem v různých profesích. Vyber si svou roli a inspiruj se, vzory se dají přenést kamkoli.`,
          blocks: [
            { t: "table", head: ["Role", "Typické úkoly pro Claude"], rows: [
              ["Marketing", "Návrhy kampaní, varianty textů, analýza zpětné vazby, obsahový kalendář"],
              ["Obchod", "Příprava na schůzku (shrnutí historie klienta), návrh nabídky, odpovědi na námitky"],
              ["Finance", "Vysvětlení odchylek v tabulce, kontrola smluv, příprava komentáře k reportu"],
              ["HR", "Popisy pozic, návrh otázek na pohovor, shrnutí zpětných vazeb, interní komunikace"],
              ["Právo", "První čtení smlouvy, hledání rizikových klauzulí, srovnání dvou verzí"],
              ["Vývoj", "Vysvětlení cizího kódu, opravy chyb, testy, dokumentace (viz Claude Code)"],
              ["Učitel", "Příprava hodiny, různé úrovně obtížnosti, zpětná vazba k pracím"],
              ["Kdokoli", "Shrnutí dlouhých textů, překlad, brainstorming, vysvětlení čehokoli „jako pro laika“"]
            ] },
            { t: "ex", title: "Ukázka: příprava na obchodní schůzku", turns: [
              { who: "user", text: `Zítra mám schůzku s firmou Alfa (přikládám poslední 3 e-maily a nabídku z června). Připrav mi: 1) shrnutí, kde jsme skončili, 2) tři pravděpodobné námitky a jak na ně, 3) cíl schůzky jednou větou.` },
              { who: "ai", text: `1) Kde jsme: v červnu nabídka na 50 licencí, Alfa chtěla slevu 15 % a zkušební období. Poslední e-mail (5. 9.): ptají se na možnost fakturace po kvartálech.\n2) Námitky: a) cena → nabídnout 10 % za roční závazek; b) migrace dat → ukázat postup a reference; c) zaškolení → 2 online školení v ceně.\n3) Cíl: odejít s dohodou na pilotu pro 10 uživatelů do konce října.` }
            ], note: `Vzor „shrň, předvídej, stanov cíl“ funguje pro jakoukoli schůzku, i mimo obchod.` },
            { t: "tip", h: `Nejlepší způsob, jak najít využití: sepiš si 5 úkolů, které tě tento týden nejvíc zdržovaly, a u každého se zeptej Claude, jak by ti s ním pomohl. Klidně to napiš jako zprávu Claude.` }
          ],
          quiz: [
            { q: "Který postup je univerzální pro přípravu na schůzku?", o: ["Shrň, kde jsme; předvídej námitky; stanov cíl", "Nech Claude schůzku vést", "Zeptej se jen na počasí"], a: 0, why: "Shrnutí, předvídání a jasný cíl fungují pro obchodní i interní schůzky." },
            { q: "Jak nejlépe zjistit, kde ti Claude pomůže?", o: ["Přečíst všechny kurzy", "Sepsat vlastní opakující se zdržující úkoly a zkusit je s Claude", "Počkat na doporučení kolegů"], a: 1, why: "Vlastní reálné úkoly jsou nejlepší startovní bod." }
          ],
          cards: [
            { f: "Vzor pro přípravu na schůzku", b: "Shrň, kde jsme; předvídej námitky; stanov cíl jednou větou." }
          ],
          terms: []
        },
        {
          id: "c101-12",
          title: "Další způsoby, jak s Claude pracovat",
          minutes: 4,
          lead: `Kromě Chatu, Cowork a Code existují další místa, kde Claude potkáš. Krátký přehled, ať víš, co existuje.`,
          blocks: [
            { t: "ul", items: [
              `<b>Claude v Chrome</b>: rozšíření, které vidí otevřenou stránku, umí ji shrnout, vyplnit formulář nebo projít několik stránek za tebe.`,
              `<b>Claude pro Microsoft 365</b>: doplňky do Wordu, Excelu, PowerPointu a Outlooku, které pracují přímo s otevřeným dokumentem.`,
              `<b>Claude v Slacku (Claude Tag)</b>: označíš Claude ve vlákně a on pomůže přímo tam, s kontextem konverzace.`,
              `<b>Claude Design</b>: tvorba vizuálních návrhů (mockupy, prezentace, grafika), které pak doladíš myší.`,
              `<b>Claude Code</b>: agent pro programování v terminálu, editoru i na webu.`,
              `<b>Claude API</b>: pro vývojáře, kteří staví vlastní aplikace s Claude uvnitř.`
            ] },
            { t: "ex", title: "Ukázka: Claude v Chrome", turns: [
              { who: "user", text: `Na této stránce s nabídkou bytu mi shrň parametry a spočítej, kolik by mě stál nájem za rok včetně poplatků.` },
              { who: "ai", text: `Byt 2+kk, 54 m², 4. patro s výtahem, nájem 18 500 Kč + poplatky 3 200 Kč měsíčně, kauce dvojnásobek nájmu. Ročně: (18 500 + 3 200) × 12 = 260 400 Kč, plus jednorázová kauce 37 000 Kč.` }
            ], note: `Nemusel/a jsi nic kopírovat, Claude si stránku přečetl sám.` },
            { t: "info", h: `Všechny tyhle varianty používají stejný model a stejné principy zadávání. Co se naučíš v Chatu, platí všude.` }
          ],
          quiz: [
            { q: "Co umí Claude v Chrome?", o: ["Nahradit prohlížeč", "Číst otevřenou stránku a pracovat s ní (shrnutí, formuláře, procházení)", "Jen měnit vzhled stránky"], a: 1, why: "Rozšíření vidí obsah stránky a může na ní provádět úkony za tebe." },
            { q: "Platí zásady dobrého zadání i v Slacku nebo v Excelu?", o: ["Ne, tam je to jiné", "Ano, model i principy jsou stejné", "Jen v Excelu"], a: 1, why: "Všechna rozhraní používají stejný model, principy zadávání se přenáší." }
          ],
          cards: [
            { f: "Kde všude je Claude", b: "Chat, Cowork, Code, Chrome, Microsoft 365, Slack (Claude Tag), Design, API." }
          ],
          terms: [
            { t: "Claude Tag", d: "Claude uvnitř Slacku: označíš ho ve vlákně a pomůže přímo tam." },
            { t: "Claude Design", d: "Nástroj pro tvorbu vizuálních návrhů, které lze dál upravovat ručně." }
          ]
        }
      ]
    },
    {
      title: "Závěr",
      lessons: [
        {
          id: "c101-13",
          title: "Co dál?",
          minutes: 3,
          lead: `Shrnutí kurzu a doporučení, kam pokračovat.`,
          blocks: [
            { t: "h", x: "Co už víš" },
            { t: "ul", items: [
              `Claude je AI asistent, se kterým vedeš <b>dialog</b> a postupně ladíš výsledek.`,
              `Dobré zadání má <b>cíl, kontext, materiál, formát a omezení</b>.`,
              `<b>Projekty</b> drží stálé podklady a instrukce, <b>artefakty</b> jsou hotové výstupy, <b>skills</b> uložené postupy.`,
              `<b>Konektory</b>, <b>enterprise search</b> a <b>Research</b> rozšiřují, k čemu se Claude dostane.`,
              `Claude potkáš v Chatu, Cowork, Code, Chrome, Microsoft 365, Slacku i API.`
            ] },
            { t: "h", x: "Doporučené pokračování" },
            { t: "ol", items: [
              `<b>Schopnosti a limity AI</b>: abys věděl/a, kdy Claude věřit a kdy ověřovat.`,
              `<b>AI zběhlost: rámec 4D</b>: způsob přemýšlení o spolupráci s AI.`,
              `Podle zájmu <b>Claude Cowork</b> nebo <b>Claude Code 101</b>.`
            ] },
            { t: "key", h: `Nejvíc se naučíš tím, že Claude dáš jeden skutečný úkol denně. Malý, ale skutečný.` }
          ],
          quiz: [
            { q: "Jaký je nejúčinnější způsob, jak se s Claude naučit pracovat?", o: ["Přečíst dokumentaci od začátku do konce", "Dávat mu denně malé skutečné úkoly a ladit zadání", "Používat ho jen na překlady"], a: 1, why: "Praxe na vlastních úkolech je nejrychlejší cesta." }
          ],
          cards: [
            { f: "Tři pilíře organizace práce v Claude", b: "Projekty (stálé podklady a instrukce), artefakty (hotové výstupy), skills (uložené postupy)." }
          ],
          terms: []
        }
      ]
    }
  ]
});
