/* Kurz: Schopnosti a limity AI (podle academy.claude.com/courses/ai-capabilities-and-limitations)
   Lekce "Try it out" z originálu jsou nahrazeny podrobnými ukázkami. */
AKADEMIE.add({
  id: "schopnosti-a-limity",
  emoji: "🧠",
  title: "Schopnosti a limity AI",
  category: "fluency",
  level: "Pro každého",
  desc: "Mentální modely, díky kterým poznáš, kdy Claude věřit a kdy ověřovat: předpovídání tokenů, znalosti, pracovní paměť a řiditelnost.",
  source: "https://academy.claude.com/courses/ai-capabilities-and-limitations",
  modules: [
    {
      title: "Začínáme",
      lessons: [
        {
          id: "cl-01",
          title: "Úvod: proč rozumět limitům",
          minutes: 3,
          lead: `Lidé buď AI věří příliš, nebo vůbec. Oba přístupy stojí čas a peníze. Tenhle kurz dá střední cestu: čtyři vlastnosti modelů, ze kterých plyne skoro všechno ostatní.`,
          blocks: [
            { t: "p", h: `Nebudeme řešit matematiku ani architekturu neuronových sítí. Zaměříme se na <b>čtyři vlastnosti</b>, které se v praxi projevují pořád:` },
            { t: "ol", items: [
              `<b>Předpovídání dalšího tokenu</b>: model text tvoří po kouscích podle pravděpodobnosti.`,
              `<b>Znalosti</b>: co model „ví“ z tréninku a jak spolehlivě.`,
              `<b>Pracovní paměť</b>: kontextové okno a jeho limity.`,
              `<b>Řiditelnost</b>: jak dobře model plní instrukce a jaké instrukce fungují.`
            ] },
            { t: "p", h: `U každé vlastnosti si ukážeme, co z ní plyne dobrého, co špatného a jak s tím pracovat. Praktická cvičení z originálu tu nahrazují komentované ukázky, takže vše zvládneš jen čtením.` },
            { t: "key", h: `Když porozumíš těmto čtyřem vlastnostem, většina „divného“ chování AI ti přestane být záhadou a začneš ho předvídat.` }
          ],
          quiz: [
            { q: "Které čtyři vlastnosti kurz rozebírá?", o: ["Rychlost, cena, velikost, jazyk", "Předpovídání tokenů, znalosti, pracovní paměť, řiditelnost", "Hardware, software, data, lidé"], a: 1, why: "Z těchto čtyř vlastností plyne většina silných i slabých stránek modelů." }
          ],
          cards: [
            { f: "Čtyři vlastnosti jazykových modelů", b: "Předpovídání dalšího tokenu, znalosti z tréninku, pracovní paměť (kontext), řiditelnost." }
          ],
          terms: []
        },
        {
          id: "cl-02",
          title: "Co myslíme slovem AI",
          minutes: 3,
          lead: `„AI“ je široký pojem. V tomto kurzu mluvíme konkrétně o velkých jazykových modelech, jako je Claude.`,
          blocks: [
            { t: "p", h: `Pod AI se schová doporučovací algoritmus, rozpoznávání obličejů i šachový program. Každý funguje jinak. My mluvíme o <b>velkých jazykových modelech (LLM)</b>: systémech trénovaných na textu, které přijímají text (a často i obrázky či dokumenty) a produkují text.` },
            { t: "h", x: "Co LLM je" },
            { t: "ul", items: [
              `Obrovská síť čísel (parametrů) naladěná na to, aby dobře pokračovala v textu.`,
              `Univerzální: stejný model píše básně, vysvětluje daně i opravuje kód.`,
              `Pravděpodobnostní: stejná otázka může dostat mírně jinou odpověď.`
            ] },
            { t: "h", x: "Co LLM není" },
            { t: "ul", items: [
              `Není to databáze nebo vyhledávač (i když může nástroje pro hledání používat).`,
              `Není to kalkulačka (i když počítat umí, jistější je nechat ho použít nástroj).`,
              `Nemá vlastní záměry ani přístup k tvým datům, dokud mu je nedáš.`
            ] },
            { t: "info", h: `Claude je LLM doladěný jako asistent. Když v kurzu píšeme „model“, myslíme obecně jakýkoli LLM; když „Claude“, myslíme konkrétně tento.` }
          ],
          quiz: [
            { q: "Co je velký jazykový model?", o: ["Databáze faktů s vyhledáváním", "Systém trénovaný na textu, který přijímá a produkuje text podle pravděpodobnosti", "Program na hraní šachů"], a: 1, why: "LLM je pravděpodobnostní model textu, ne databáze ani kalkulačka." }
          ],
          cards: [
            { f: "LLM není", b: "Databáze, vyhledávač ani kalkulačka. Je to pravděpodobnostní model textu, který může nástroje používat." }
          ],
          terms: [
            { t: "Parametry modelu", d: "Miliardy čísel uvnitř modelu, které se tréninkem naladily tak, aby model dobře pokračoval v textu." }
          ]
        },
        {
          id: "cl-03",
          title: "Jak AI získá svůj charakter",
          minutes: 4,
          lead: `Model prochází dvěma fázemi: předtrénováním na obrovském množství textu a doladěním, které z něj udělá asistenta s určitým chováním.`,
          blocks: [
            { t: "h", x: "Fáze 1: předtrénování" },
            { t: "p", h: `Model čte obrovské množství textu (knihy, weby, kód) a učí se předpovídat pokračování. Výsledek umí plynule pokračovat v jakémkoli textu, ale není to asistent: kdybys mu napsal/a otázku, mohl by pokračovat další otázkou, protože tak to na fórech bývá.` },
            { t: "h", x: "Fáze 2: doladění" },
            { t: "p", h: `Model se učí na příkladech dobrých rozhovorů a na zpětné vazbě od lidí: co je užitečná, upřímná, bezpečná odpověď. Anthropic navíc používá sadu zásad (tzv. konstituci), podle kterých se model učí hodnotit vlastní odpovědi.` },
            { t: "h", x: "Co z toho plyne" },
            { t: "ul", items: [
              `Model má <b>osobnost a hodnoty</b> dané doladěním: Claude je zdvořilý, přiznává nejistotu, odmítá škodlivé věci.`,
              `Doladění může vnést i <b>sklon vyhovět</b>: model chce být užitečný a někdy raději souhlasí, než oponuje.`,
              `Doladění <b>nezmění znalosti</b> z předtrénování. Co tam nebylo, model neví.`
            ] },
            { t: "ex", title: "Ukázka: stejný model před a po doladění", turns: [
              { who: "user", text: `Jak se dostanu z Prahy do Brna?` },
              { who: "bad", label: "Jen předtrénovaný model", text: `Jak se dostanu z Brna do Ostravy? Jak dlouho trvá cesta vlakem? Odpovědí: 3 · Zobrazit vlákno` },
              { who: "ai", label: "Doladěný asistent", text: `Nejrychleji vlakem (cca 2,5 h z hlavního nádraží) nebo autobusem (cca 2,5 až 3 h). Autem po D1 zhruba 2 až 2,5 h podle provozu. Chceš porovnat ceny nebo časy odjezdů?` }
            ], note: `První „odpověď“ je věrohodné pokračování internetového fóra. Až doladění naučí model odpovídat jako asistent.` }
          ],
          quiz: [
            { q: "Co dělá doladění (fine-tuning)?", o: ["Přidává modelu nová fakta", "Učí model chovat se jako užitečný a bezpečný asistent", "Zrychluje odpovědi"], a: 1, why: "Doladění tvaruje chování a osobnost, ne znalosti." },
            { q: "Odkud pochází sklon modelu souhlasit s uživatelem?", o: ["Z chyby v hardwaru", "Z doladění, které model učí být užitečný a vstřícný", "Z nedostatku dat"], a: 1, why: "Snaha vyhovět je vedlejší efekt tréninku na vstřícnost. Proto se ptej neutrálně." }
          ],
          cards: [
            { f: "Dvě fáze tréninku", b: "Předtrénování (předpovídat text, znalosti) a doladění (chování asistenta, hodnoty)." },
            { f: "Doladění nemění znalosti", b: "Charakter ano, fakta ne. Co model nezná z předtrénování, nezná ani po doladění." }
          ],
          terms: [
            { t: "Předtrénování", d: "První fáze tréninku: model se na obrovském množství textu učí předpovídat pokračování." },
            { t: "Konstituce (Anthropic)", d: "Sada zásad, podle kterých se Claude učí hodnotit a zlepšovat vlastní odpovědi během doladění." }
          ]
        }
      ]
    },
    {
      title: "Předpovídání dalšího tokenu",
      lessons: [
        {
          id: "cl-04",
          title: "Předpovídání dalšího tokenu",
          minutes: 5,
          lead: `Základní mechanismus: model generuje odpověď po malých kouscích a pokaždé vybírá pravděpodobné pokračování. Z toho plyne plynulost, kreativita i sklon k vymýšlení.`,
          blocks: [
            { t: "p", h: `Když Claude píše odpověď, nemá ji „v hlavě“ celou dopředu. Vybírá další token, pak další, pokaždé na základě všeho, co je před ním. Je to jako velmi zkušené doplňování věty, které zohledňuje celý dosavadní rozhovor.` },
            { t: "h", x: "Co z toho plyne dobrého" },
            { t: "ul", items: [
              `Výborně zvládá <b>předvídatelné vzory</b>: formáty, styly, šablony, překlady, přepisy.`,
              `Umí plynule <b>navázat</b> na cokoli: dokončit text, pokračovat ve stylu.`,
              `Generuje <b>varianty</b>: stejný obsah jinak, jiným tónem.`
            ] },
            { t: "h", x: "Co z toho plyne špatného" },
            { t: "ul", items: [
              `<b>Fabulace</b>: když pravděpodobné pokračování neodpovídá skutečnosti, model ho vytvoří stejně. Vymyšlený citát, neexistující funkce v programu, falešný odkaz.`,
              `<b>Hladkost není důkaz</b>: špatná odpověď zní stejně přesvědčivě jako správná.`,
              `<b>Dlouhé přesné výpočty</b>: každý krok je predikce, chyby se sčítají.`
            ] },
            { t: "ex", title: "Ukázka: kde predikce selže", turns: [
              { who: "user", text: `Jaké je přesné znění § 2079 občanského zákoníku?` },
              { who: "bad", text: `§ 2079: „Kupní smlouvou se prodávající zavazuje, že kupujícímu odevzdá věc… a kupující se zavazuje, že věc převezme a zaplatí prodávajícímu kupní cenu.“ Odstavec 2 dále stanoví, že…` }
            ], note: `Odstavec 1 je zde náhodou správně, protože jde o velmi známé ustanovení. U méně známého paragrafu by model vytvořil <b>věrohodně znějící, ale smyšlené znění</b>. Přesná citace zákona vždy patří do vyhledávání nebo přiloženého dokumentu, ne do paměti modelu.` },
            { t: "key", h: `Model nerozlišuje mezi „vím“ a „zní to pravděpodobně“. To rozlišení je tvoje práce, nebo práce nástrojů, které mu dáš.` }
          ],
          quiz: [
            { q: "Proč zní nesprávná odpověď AI stejně přesvědčivě jako správná?", o: ["Protože AI lže úmyslně", "Protože obě vznikají stejným mechanismem výběru pravděpodobného pokračování", "Protože je to chyba překladu"], a: 1, why: "Plynulost pochází z predikce, ne z pravdivosti. Hladkost nic nedokazuje." },
            { q: "Který úkol je pro predikci tokenů nejvhodnější?", o: ["Přepsat text do jiného stylu", "Odcitovat přesné znění málo známého paragrafu z paměti", "Spočítat přesně 17místné číslo"], a: 0, why: "Předvídatelné vzory (styl, formát) jsou silná stránka. Přesné citace a výpočty patří nástrojům." }
          ],
          cards: [
            { f: "Předpovídání dalšího tokenu", b: "Model tvoří odpověď po kouscích výběrem pravděpodobného pokračování. Plynulost proto nedokazuje správnost." },
            { f: "Fabulace", b: "Když pravděpodobné pokračování neodpovídá skutečnosti, model ho vytvoří stejně (citáty, odkazy, paragrafy)." }
          ],
          terms: [
            { t: "Fabulace (halucinace)", d: "Smyšlený, ale věrohodně znějící obsah vzniklý tím, že model pokračuje podle pravděpodobnosti, ne podle faktů." }
          ]
        },
        {
          id: "cl-05",
          title: "Ukázka: predikce tokenů v praxi",
          minutes: 5,
          lead: `Originální lekce je cvičení. Tady projdeme tři komentované scénáře, ze kterých se naučíš to samé bez zkoušení.`,
          blocks: [
            { t: "ex", title: "Scénář 1: doplnění známého vzoru (spolehlivé)", turns: [
              { who: "user", text: `Doplň: „Kdo jinému jámu kopá, …“` },
              { who: "ai", text: `„… sám do ní padá.“` }
            ], note: `Přísloví je v datech tisíckrát. Predikce je jistá. Podobně spolehlivé jsou formáty (adresa, e-mail), překlady běžných vět, standardní kód.` },
            { t: "ex", title: "Scénář 2: smyšlený, ale věrohodný detail (rizikové)", turns: [
              { who: "user", text: `Napiš odstavec o historii firmy Pekárna Vondráček z Kolína.` },
              { who: "bad", text: `Pekárna Vondráček byla založena roku 1923 Josefem Vondráčkem a proslula chlebem s kmínem. Po znárodnění v roce 1951 byla obnovena v roce 1992 vnukem zakladatele…` }
            ], note: `Model neví nic o konkrétní pekárně, ale ví, jak <b>typicky vypadá historie české pekárny</b>. Vytvořil tedy pravděpodobný příběh. Obrana: dodej podklady („tady je text z jejich webu“) nebo řekni „pokud informace nemáš, napiš to místo vymýšlení“.` },
            { t: "ex", title: "Scénář 3: správná instrukce mění chování", turns: [
              { who: "user", text: `Napiš odstavec o historii firmy Pekárna Vondráček z Kolína. Pokud o ní nemáš spolehlivé informace, řekni to a navrhni, co potřebuješ.` },
              { who: "ai", text: `O Pekárně Vondráček z Kolína nemám spolehlivé informace a nechci vymýšlet data. Pokud mi pošleš text z jejich webu, letáku nebo pár faktů (rok založení, zakladatel, specialita), napíšu z nich odstavec.` }
            ], note: `Instrukce dala „přiznání nejistoty“ vyšší pravděpodobnost než „věrohodný příběh“. Doladěný Claude se tak často zachová i bez instrukce, ale explicitní pokyn to výrazně zpevní.` },
            { t: "tip", h: `Zlaté pravidlo: <b>podklady místo paměti</b>. Cokoli specifického (tvoje firma, tvoje čísla, konkrétní dokument) modelu dej, nenech ho hádat.` }
          ],
          quiz: [
            { q: "Proč model vymyslel historii neznámé pekárny?", o: ["Chtěl uživatele potěšit", "Znal typický vzor takové historie a pokračoval podle něj", "Našel ji na internetu"], a: 1, why: "Predikce podle vzoru: model ví, jak takové texty obvykle vypadají, ne jaká je skutečnost." },
            { q: "Jaká instrukce nejlépe brání fabulaci u specifických faktů?", o: ["„Buď kreativní“", "„Pokud nemáš spolehlivé informace, řekni to místo vymýšlení“ plus dodané podklady", "„Odpověz co nejrychleji“"], a: 1, why: "Explicitní pokyn k přiznání nejistoty a podklady místo paměti." }
          ],
          cards: [
            { f: "Podklady místo paměti", b: "Cokoli specifického (firma, čísla, dokument) modelu dodej. Nenech ho hádat podle typického vzoru." },
            { f: "Pokyn proti fabulaci", b: "„Pokud nemáš spolehlivé informace, řekni to a nevymýšlej.“" }
          ],
          terms: []
        }
      ]
    },
    {
      title: "Znalosti",
      lessons: [
        {
          id: "cl-06",
          title: "Co model ví",
          minutes: 5,
          lead: `Znalosti modelu pocházejí z tréninkových dat. Jsou široké, ale nerovnoměrné a končí k určitému datu.`,
          blocks: [
            { t: "h", x: "Tři pravidla znalostí" },
            { t: "ol", items: [
              `<b>Čím častější téma v datech, tím spolehlivější.</b> Fotosyntéza, Python, druhá světová válka: výborně. Místní vyhláška, malá firma, nový produkt: špatně.`,
              `<b>Znalosti mají datum uzávěrky.</b> Model neví, co se stalo po konci tréninkových dat. Nové verze softwaru, nedávné události, aktuální ceny.`,
              `<b>Model neví, co neví.</b> Nemá vnitřní ukazatel spolehlivosti. Může být sebejistý u okrajového tématu a opatrný u běžného.`
            ] },
            { t: "h", x: "Mapa spolehlivosti" },
            { t: "table", head: ["Typ otázky", "Spolehlivost z paměti", "Co s tím"], rows: [
              ["Obecné pojmy, vysvětlení principů", "Vysoká", "Klidně věř, případně si nech vysvětlit jinak"],
              ["Známá fakta (hlavní města, data velkých událostí)", "Vysoká", "Věř, u přesných čísel ověř"],
              ["Odborné, ale zdokumentované (právo, medicína obecně)", "Střední", "Ověř u zdroje, ptej se na nejistotu"],
              ["Okrajové, lokální, nedávné", "Nízká", "Dodej podklady nebo zapni vyhledávání"],
              ["Tvoje interní data", "Žádná", "Vždy dodej (příloha, projekt, konektor)"]
            ] },
            { t: "ex", title: "Ukázka: datum uzávěrky", turns: [
              { who: "user", text: `Jaká je aktuální sazba DPH na knihy v ČR?` },
              { who: "ai", text: `Podle mých dat byly knihy od roku 2024 osvobozeny od DPH (sazba 0 %). Daňová pravidla se ale mění a moje znalosti mají datum uzávěrky, takže aktuální stav si ověř na webu Finanční správy, nebo mi dovol použít vyhledávání.` }
            ], note: `Dobrá odpověď: dává, co ví, <b>a přiznává uzávěrku</b>. Pokud model uzávěrku nezmíní, zeptej se: „Jak aktuální je tato informace?“` }
          ],
          quiz: [
            { q: "U kterého tématu jsou znalosti modelu z paměti nejspolehlivější?", o: ["Vysvětlení, jak funguje úrok", "Ceník místní autoškoly", "Změny v zákoně z minulého měsíce"], a: 0, why: "Obecné, časté téma. Lokální a nedávné věci model nezná nebo zná špatně." },
            { q: "Co znamená „model neví, co neví“?", o: ["Model je hloupý", "Model nemá vnitřní ukazatel spolehlivosti své odpovědi", "Model nikdy neodpoví"], a: 1, why: "Sebejistota modelu není spolehlivý signál správnosti." }
          ],
          cards: [
            { f: "Tři pravidla znalostí", b: "Čím častější téma, tím spolehlivější; znalosti mají datum uzávěrky; model neví, co neví." },
            { f: "Tvoje interní data", b: "Model je nikdy nemá z paměti. Vždy je dodej: příloha, projekt, konektor." }
          ],
          terms: [
            { t: "Datum uzávěrky znalostí", d: "Okamžik, do kterého sahají tréninková data. Novější události model z paměti nezná." }
          ]
        },
        {
          id: "cl-07",
          title: "Ukázka: jak poznat spolehlivost znalostí",
          minutes: 4,
          lead: `Komentované scénáře místo cvičení: jak se ptát, aby sis zvýšil/a jistotu, a kdy sáhnout po nástroji.`,
          blocks: [
            { t: "ex", title: "Scénář 1: nech model ohodnotit vlastní jistotu", turns: [
              { who: "user", text: `Kdy byl založen Klub českých turistů? Ke své odpovědi přidej, jak jsi si jistý, a proč.` },
              { who: "ai", text: `V roce 1888. Jistota vysoká: jde o známou, často uváděnou informaci s jednoznačným datem. Pokud potřebuješ přesné datum a jména zakladatelů, doporučuji ověřit na webu KČT.` }
            ], note: `Odhad jistoty od modelu není dokonalý, ale u okrajových témat často správně řekne „nízká“. Je to levný filtr.` },
            { t: "ex", title: "Scénář 2: rozlišení běžného a okrajového", turns: [
              { who: "user", text: `Kdo byl starostou Kutné Hory v roce 1995?` },
              { who: "ai", text: `Tohle je příliš specifická informace a nemám ji spolehlivě. Mohu to dohledat vyhledáváním, pokud ho povolíš, nebo doporučuji kroniku města či web Kutné Hory.` }
            ], note: `Správné chování: odmítnout hádat a navrhnout nástroj. Pokud model místo toho sebejistě uvede jméno, je to varovný signál.` },
            { t: "ex", title: "Scénář 3: přemostění uzávěrky nástrojem", turns: [
              { who: "user", text: `Jaká je aktuální verze Pythonu? Použij vyhledávání.` },
              { who: "ai", text: `(Po vyhledání) Aktuální stabilní verze je 3.x.y, vydaná … Zdroj: python.org.` }
            ], note: `Vyhledávání změní zdroj informace: z paměti modelu na aktuální stránku. Model pak jen čte a shrnuje, což umí spolehlivě.` },
            { t: "tip", h: `Praktické pravidlo: <b>pokud odpověď obsahuje jméno, číslo, datum nebo odkaz a záleží ti na tom, ověř to</b>. Všechno ostatní (vysvětlení, struktura, styl) jde použít rovnou.` }
          ],
          quiz: [
            { q: "Jak zvýšit jistotu u faktické otázky bez nástrojů?", o: ["Zeptat se dvakrát", "Požádat model, ať ohodnotí a zdůvodní svou jistotu", "Napsat otázku velkými písmeny"], a: 1, why: "Sebehodnocení není dokonalé, ale u okrajových témat často správně signalizuje nízkou jistotu." },
            { q: "Co dělá vyhledávání s problémem data uzávěrky?", o: ["Nic", "Mění zdroj z paměti modelu na aktuální stránky, model je pak jen shrnuje", "Prodlužuje uzávěrku o rok"], a: 1, why: "Nástroje dodají aktuální informaci; model spolehlivě čte a shrnuje." }
          ],
          cards: [
            { f: "Kdy ověřovat", b: "Když odpověď obsahuje jméno, číslo, datum nebo odkaz a záleží na tom. Vysvětlení a styl jde použít rovnou." },
            { f: "Sebehodnocení jistoty", b: "„Přidej, jak jsi si jistý a proč.“ Levný filtr na okrajová témata." }
          ],
          terms: []
        }
      ]
    },
    {
      title: "Pracovní paměť",
      lessons: [
        {
          id: "cl-08",
          title: "Pracovní paměť: kontextové okno",
          minutes: 5,
          lead: `Vše, co model v rozhovoru vidí, se vejde do kontextového okna. Je velké, ale konečné, a pozornost v něm není rovnoměrná.`,
          blocks: [
            { t: "h", x: "Co je v kontextu" },
            { t: "ul", items: [
              `Tvoje zprávy a přiložené soubory.`,
              `Odpovědi modelu (včetně těch, které se ti nelíbily).`,
              `Instrukce projektu, systémové pokyny, výsledky nástrojů (vyhledávání, konektory).`
            ] },
            { t: "h", x: "Tři vlastnosti pracovní paměti" },
            { t: "ol", items: [
              `<b>Tvrdý limit.</b> Když se kontext zaplní, nejstarší část se buď ořízne, nebo se rozhovor musí zkrátit (shrnout). Dlouhý chat po hodinách „zapomíná“ začátek.`,
              `<b>Nerovnoměrná pozornost.</b> Detail uprostřed 200stránkového dokumentu se v odpovědi snáz ztratí než začátek nebo konec.`,
              `<b>Vše je kontext, i chyby.</b> Pokud se rozhovor stočil špatně, staré chybné odpovědi dál ovlivňují nové.`
            ] },
            { t: "ex", title: "Ukázka: proč se v dlouhém chatu zhoršují odpovědi", turns: [
              { who: "user", label: "Po 2 hodinách v jednom chatu", text: `Tak ještě jednou uprav ten úvod jako předtím.` },
              { who: "ai", text: `Upravil jsem úvod, ale nejsem si jistý, kterou z dřívějších verzí myslíš „jako předtím“. Na začátku rozhovoru jsme řešili tři varianty. Můžeš vložit tu, ze které mám vyjít?` }
            ], note: `Rozhovor je plný verzí, poznámek a odboček. Model neví, na co odkazuješ. Řešení: <b>nový chat</b> s krátkým shrnutím a aktuální verzí textu.` },
            { t: "h", x: "Jak s pamětí pracovat" },
            { t: "ul", items: [
              `<b>Jeden úkol, jeden chat.</b> Nové téma = nový chat.`,
              `<b>Shrň a začni znovu.</b> „Shrň, na čem jsme se dohodli, do 10 bodů.“ Shrnutí vlož do nového chatu.`,
              `<b>Důležité dej na konec zadání.</b> Klíčová instrukce až za dlouhý dokument, ne před něj.`,
              `<b>U dlouhých dokumentů se ptej cíleně.</b> „V kapitole 4 najdi…“ místo „přečti a řekni, co je zajímavé“.`
            ] }
          ],
          quiz: [
            { q: "Proč se po hodinách v jednom chatu zhoršují odpovědi?", o: ["Model se unaví", "Kontext je zaplněný verzemi a odbočkami; nejstarší části mizí a odkazy jsou nejednoznačné", "Vypršel limit zpráv"], a: 1, why: "Pracovní paměť je konečná a všechno v ní (i chyby) ovlivňuje odpověď." },
            { q: "Kam dát klíčovou instrukci, když posíláš dlouhý dokument?", o: ["Na začátek, před dokument", "Na konec, za dokument", "Je to jedno"], a: 1, why: "Konec zadání má silnější pozornost; instrukce za dokumentem se méně ztratí." }
          ],
          cards: [
            { f: "Tři vlastnosti pracovní paměti", b: "Tvrdý limit, nerovnoměrná pozornost (střed se ztrácí), vše je kontext včetně chyb." },
            { f: "Jeden úkol, jeden chat", b: "Nové téma = nový chat. Dlouhý rozhovor shrň a pokračuj v novém." }
          ],
          terms: [
            { t: "Pracovní paměť modelu", d: "Kontextové okno: vše, co model při odpovědi vidí. Konečné, s nerovnoměrnou pozorností." }
          ]
        },
        {
          id: "cl-09",
          title: "Ukázka: práce s dlouhým dokumentem",
          minutes: 4,
          lead: `Jak se ptát na dlouhé podklady, aby se detaily neztratily. Tři scénáře s komentářem.`,
          blocks: [
            { t: "ex", title: "Scénář 1: obecná otázka nad 80 stranami (slabé)", turns: [
              { who: "user", text: `(Přiložena 80stránková smlouva) Je v té smlouvě něco, na co si mám dát pozor?` },
              { who: "bad", text: `Smlouva obsahuje standardní ustanovení o platebních podmínkách, odpovědnosti a ukončení. Doporučuji věnovat pozornost sankcím a výpovědní lhůtě.` }
            ], note: `Obecná otázka dostane obecnou odpověď. Model přelétl dokument a řekl, co u smluv bývá. Konkrétní past na straně 47 se ztratila.` },
            { t: "ex", title: "Scénář 2: cílené otázky (silné)", turns: [
              { who: "user", text: `(Stejná smlouva) Projdi smlouvu a vypiš: 1) všechny smluvní pokuty s částkami a článkem, 2) výpovědní lhůty obou stran, 3) každé ustanovení, kde je závazek jednostranně nevýhodný pro objednatele. U každého bodu cituj číslo článku.` },
              { who: "ai", text: `1) Smluvní pokuty: čl. 8.2, 0,5 % z ceny za každý den prodlení dodávky; čl. 8.5, 200 000 Kč za porušení mlčenlivosti…\n2) Výpovědní lhůty: objednatel 6 měsíců (čl. 12.1), dodavatel 1 měsíc (čl. 12.2).\n3) Nevýhodné pro objednatele: čl. 12.2 (asymetrická výpověď), čl. 9.4 (automatické prodloužení bez upozornění)…` }
            ], note: `Cílený seznam nutí model projít dokument systematicky a <b>citovat</b>. Odkaz na článek zároveň usnadní tvou kontrolu.` },
            { t: "ex", title: "Scénář 3: rozdělení na části", turns: [
              { who: "user", text: `Rozděl smlouvu podle kapitol. Pro každou kapitolu zvlášť shrň závazky objednatele do 3 bodů. Postupuj kapitolu po kapitole.` }
            ], note: `Rozdělení na části rozloží pozornost rovnoměrně. Hodí se pro velmi dlouhé nebo strukturované dokumenty.` },
            { t: "tip", h: `Vždy chtěj <b>citaci místa</b> (strana, článek, odstavec). Bez ní nepoznáš, zda model četl, nebo hádal.` }
          ],
          quiz: [
            { q: "Proč obecná otázka nad dlouhým dokumentem dává obecnou odpověď?", o: ["Model nechce číst", "Bez cílené otázky model shrne typické rysy takových dokumentů a detaily ze středu se ztratí", "Dokument je zašifrovaný"], a: 1, why: "Nerovnoměrná pozornost + obecné zadání = obecná odpověď." },
            { q: "Co zlepší kontrolu odpovědi nad dokumentem?", o: ["Kratší otázka", "Požadavek na citaci místa (článek, strana)", "Odeslání dokumentu dvakrát"], a: 1, why: "Citace umožní ověřit, že model četl, a rychle najít původní text." }
          ],
          cards: [
            { f: "Dlouhý dokument: jak se ptát", b: "Cílený seznam otázek, požadavek na citaci místa, případně postup po částech." }
          ],
          terms: []
        }
      ]
    },
    {
      title: "Řiditelnost",
      lessons: [
        {
          id: "cl-10",
          title: "Řiditelnost: jak model poslouchá instrukce",
          minutes: 5,
          lead: `Konkrétní, ověřitelné instrukce model plní spolehlivě. Abstraktní, dlouhé nebo protichůdné instrukce selhávají. Řiditelnost je o tom, jak instrukce formulovat.`,
          blocks: [
            { t: "h", x: "Co funguje spolehlivě" },
            { t: "ul", items: [
              `<b>Konkrétní a měřitelné</b>: „max 100 slov“, „tři odrážky“, „česky“, „bez slova ‚inovativní‘“.`,
              `<b>Ukázané příkladem</b>: „takto vypadá výstup, který chci“.`,
              `<b>Jedno hlavní pravidlo</b> a pár vedlejších, ne 30 pravidel stejné váhy.`,
              `<b>Pozitivní formulace</b>: „piš krátké věty“ funguje líp než „nepiš dlouhé souvětí“.`
            ] },
            { t: "h", x: "Co selhává" },
            { t: "ul", items: [
              `<b>Abstraktní</b>: „buď profesionální“, „ať to má šťávu“. Každý si to představí jinak, model také.`,
              `<b>Příliš dlouhé</b> seznamy pravidel: pár se jich ztratí, hlavně uprostřed.`,
              `<b>Protichůdné</b>: „stručně, ale vyčerpávajícím způsobem“.`,
              `<b>Instrukce skryté v příloze</b>: pokyn uprostřed dlouhého dokumentu má malou váhu.`
            ] },
            { t: "cmp",
              bad: { lbl: "Abstraktní", h: `Napiš to profesionálně a poutavě.` },
              good: { lbl: "Konkrétní", h: `Vykej, věty do 15 slov, žádné vykřičníky, jedna konkrétní číslovka v prvním odstavci, na konci jasná výzva k akci.` } },
            { t: "ex", title: "Ukázka: protichůdná instrukce", turns: [
              { who: "user", text: `Shrň článek stručně, ale nevynechej žádný detail.` },
              { who: "ai", text: `Tyhle požadavky jdou proti sobě. Nabízím dvě varianty: 1) 5 vět s hlavními body, 2) strukturovaný výtah po odstavcích, kde nic nechybí (cca 1 strana). Kterou chceš?` }
            ], note: `Dobrý model konflikt pojmenuje. Horší ho tiše vyřeší po svém. Formuluj tak, aby konflikt nevznikl: „Shrň do 5 vět; pak zvlášť vypiš všechna čísla a data z článku.“` }
          ],
          quiz: [
            { q: "Která instrukce je nejlépe řiditelná?", o: ["Ať je to profesionální", "Vykej a piš věty do 15 slov", "Ať to má šťávu"], a: 1, why: "Konkrétní a ověřitelné instrukce model plní spolehlivě." },
            { q: "Proč selhávají dlouhé seznamy pravidel?", o: ["Model umí jen 3 pravidla", "Pravidla stejné váhy se ztrácejí, hlavně uprostřed seznamu", "Model je ignoruje z principu"], a: 1, why: "Lepší je jedno hlavní pravidlo a pár vedlejších, plus příklad." }
          ],
          cards: [
            { f: "Řiditelnost: co funguje", b: "Konkrétní a měřitelné, ukázané příkladem, pár pravidel s jasnou prioritou, pozitivní formulace." },
            { f: "Řiditelnost: co selhává", b: "Abstraktní pokyny, dlouhé seznamy pravidel, protichůdné požadavky, instrukce schované v příloze." }
          ],
          terms: [
            { t: "Řiditelnost (steerability)", d: "Míra, do jaké model spolehlivě plní instrukce. Vysoká u konkrétních a ověřitelných pokynů, nízká u abstraktních." }
          ]
        },
        {
          id: "cl-11",
          title: "Ukázka: ladění instrukcí",
          minutes: 4,
          lead: `Jak z nefungující instrukce udělat fungující. Tři kroky na jednom příkladu.`,
          blocks: [
            { t: "ex", title: "Krok 1: abstraktní zadání", turns: [
              { who: "user", text: `Napiš odpověď nespokojenému zákazníkovi, ať je empatická.` },
              { who: "bad", text: `Vážený zákazníku, velmi nás mrzí Vaše nespokojenost. Vaše zpětná vazba je pro nás nesmírně důležitá a děláme vše pro to, abychom…` }
            ], note: `„Empatická“ se přeložila do korporátních frází. Model splnil instrukci podle svého nejpravděpodobnějšího výkladu.` },
            { t: "ex", title: "Krok 2: rozložení abstraktního pojmu na konkrétní kroky", turns: [
              { who: "user", text: `Napiš odpověď nespokojenému zákazníkovi. Empatie znamená: 1) zopakuj vlastními slovy jeho konkrétní problém, 2) uznej, že to bylo nepříjemné, jednou větou bez frází „vaše zpětná vazba je důležitá“, 3) řekni, co konkrétně uděláš a do kdy. Max 6 vět, tykání ne.` },
              { who: "ai", text: `Dobrý den, pane Dvořáku,\nrozumím, že objednávka měla dorazit v pátek a přišla až v úterý, navíc s poškozenou krabicí. To je opravdu nepříjemné, zvlášť když šlo o dárek.\nDnes Vám posíláme novou zásilku expresně, dorazí zítra do 12:00, a vracíme poštovné. Číslo zásilky Vám přijde SMS.\nDěkuji za trpělivost.` }
            ], note: `Stejná „empatie“, ale rozložená na <b>ověřitelné kroky</b>. Výsledek je konkrétní a lidský.` },
            { t: "ex", title: "Krok 3: uložení jako vzor", turns: [
              { who: "user", text: `Ulož si tento postup jako vzor „empatická odpověď“. Až příště řeknu „odpověz empaticky“, použij tyto 3 kroky.` }
            ], note: `V rámci jednoho chatu to funguje; trvale to uložíš do instrukcí projektu nebo jako skill.` },
            { t: "key", h: `Abstraktní pojem = rozlož ho na pozorovatelné chování. „Profesionální“, „přátelský“, „stručný“ jsou zkratky, které model dešifruje po svém. Napiš, co konkrétně mají znamenat.` }
          ],
          quiz: [
            { q: "Jak zlepšit instrukci „ať je to empatické“?", o: ["Napsat ji velkými písmeny", "Rozložit ji na konkrétní pozorovatelné kroky", "Přidat „prosím“"], a: 1, why: "Abstraktní pojem se převádí na ověřitelné chování: zopakuj problém, uznej, řekni řešení." },
            { q: "Kam trvale uložit osvědčený vzor instrukce?", o: ["Do jména chatu", "Do instrukcí projektu nebo jako skill", "Nikam, model si to pamatuje sám"], a: 1, why: "Chat je dočasný; projekt a skill jsou trvalé." }
          ],
          cards: [
            { f: "Abstraktní pojem v instrukci", b: "Rozlož ho na pozorovatelné chování („empatie = zopakuj problém, uznej, řekni řešení a termín“)." }
          ],
          terms: []
        }
      ]
    },
    {
      title: "Všechno dohromady",
      lessons: [
        {
          id: "cl-12",
          title: "Když se vlastnosti potkají",
          minutes: 5,
          lead: `V praxi se čtyři vlastnosti kombinují. Ukážeme si tři reálné situace a co v nich hraje roli.`,
          blocks: [
            { t: "ex", title: "Situace 1: dlouhá analýza dat s doporučením", turns: [
              { who: "user", text: `(Přiložený export prodejů za 3 roky, 40 000 řádků) Analyzuj prodeje a doporuč, kterou produktovou řadu zrušit.` }
            ], note: `<b>Pracovní paměť</b>: 40 000 řádků model nepřečte spolehlivě „očima“; potřebuje nástroj (kód, tabulkový procesor), který data spočítá. <b>Predikce</b>: bez nástroje by čísla „dopočítal“ věrohodně, ale špatně. <b>Řiditelnost</b>: „doporuč, co zrušit“ je velké rozhodnutí; lepší je chtít analýzu a varianty, rozhodnout sám/sama (delegace).` },
            { t: "ex", title: "Situace 2: text o novém produktu konkurence", turns: [
              { who: "user", text: `Napiš srovnání našeho produktu s novým modelem konkurence, který vyšel minulý měsíc.` }
            ], note: `<b>Znalosti</b>: produkt z minulého měsíce je za uzávěrkou. <b>Predikce</b>: model by mohl parametry vymyslet podle typického vzoru. Řešení: vyhledávání nebo dodané podklady, plus pokyn „pokud parametr nemáš ze zdroje, napiš ‚neověřeno‘“.` },
            { t: "ex", title: "Situace 3: dlouhý chat s mnoha pravidly", turns: [
              { who: "user", text: `(Třetí hodina chatu, 25 pravidel pro styl textu zadaných postupně) Proč zase používáš vykřičníky, když jsem to zakázal?` }
            ], note: `<b>Pracovní paměť</b> + <b>řiditelnost</b>: pravidlo z počátku chatu má malou váhu a je jedno z 25. Řešení: sepsat pravidla do jednoho seznamu s prioritami, dát ho do projektu, začít nový chat.` },
            { t: "h", x: "Univerzální recept" },
            { t: "ol", items: [
              `Specifická data dodej (znalosti), nebo zapni nástroj.`,
              `Výpočty a velká data nech nástroji, ne predikci.`,
              `Dlouhé věci rozděl, instrukce dej na konec, chat drž krátký (paměť).`,
              `Instrukce konkrétní, s prioritou, s příkladem (řiditelnost).`,
              `Rozhodnutí si nech, u faktů ověřuj (rozlišování a zodpovědnost z rámce 4D).`
            ] }
          ],
          quiz: [
            { q: "Co je hlavní riziko u zadání „analyzuj 40 000 řádků a doporuč“ bez nástrojů?", o: ["Model odmítne", "Model čísla „dopočítá“ predikcí a doporučení bude stát na smyšlených hodnotách", "Trvá to dlouho"], a: 1, why: "Velká data patří nástroji (kód, tabulka); predikce tokenů není výpočet." },
            { q: "Proč model po třech hodinách ignoruje pravidlo z počátku chatu?", o: ["Je vzpurný", "Pravidlo je daleko v kontextu a jedno z mnoha; ztrácí váhu", "Pravidla platí jen 1 hodinu"], a: 1, why: "Pracovní paměť a řiditelnost: sepiš pravidla s prioritami a dej je do projektu." }
          ],
          cards: [
            { f: "Univerzální recept", b: "Dodej data nebo nástroj; výpočty nástroji; dlouhé rozděl a instrukce na konec; instrukce konkrétní s příkladem; rozhodnutí si nech." }
          ],
          terms: []
        },
        {
          id: "cl-13",
          title: "Další kroky a závěrečný test",
          minutes: 5,
          lead: `Shrnutí a delší test z celého kurzu.`,
          blocks: [
            { t: "table", head: ["Vlastnost", "Silná stránka", "Slabina", "Obrana"], rows: [
              ["Predikce tokenů", "Vzory, styl, plynulost", "Fabulace, chybné výpočty", "Podklady, nástroje, pokyn „nevymýšlej“"],
              ["Znalosti", "Běžná témata", "Okrajové, nedávné, tvoje data", "Vyhledávání, přílohy, ověření"],
              ["Pracovní paměť", "Velký kontext", "Limit, střed se ztrácí, chyby zůstávají", "Nový chat, shrnutí, cílené otázky"],
              ["Řiditelnost", "Konkrétní instrukce", "Abstraktní, dlouhé, protichůdné", "Rozlož na kroky, příklad, priority"]
            ] },
            { t: "p", h: `Doporučené pokračování: kurz <b>AI zběhlost: rámec 4D</b>, který na tyto vlastnosti navazuje způsobem práce. Pak podle zájmu produkty (Cowork, Claude Code).` }
          ],
          quiz: [
            { q: "Hladká, sebejistá odpověď je důkazem…", o: ["správnosti", "ničeho; plynulost vzniká predikcí bez ohledu na pravdivost", "toho, že model použil vyhledávání"], a: 1, why: "Plynulost a správnost jsou nezávislé." },
            { q: "Doladění modelu mění…", o: ["znalosti", "chování a hodnoty", "velikost kontextu"], a: 1, why: "Charakter ano, fakta ne." },
            { q: "Nejméně spolehlivé z paměti modelu jsou…", o: ["obecné principy", "okrajová, lokální a nedávná fakta", "překlady běžných vět"], a: 1, why: "Čím vzácnější v datech, tím horší. Nedávné je za uzávěrkou." },
            { q: "Klíčová instrukce k dlouhému dokumentu patří…", o: ["před dokument", "za dokument", "doprostřed"], a: 1, why: "Konec zadání má silnější pozornost." },
            { q: "Instrukce „buď profesionální“ selhává, protože…", o: ["model neumí být profesionální", "je abstraktní a model ji vyloží po svém", "je moc krátká"], a: 1, why: "Rozlož ji na pozorovatelné chování." },
            { q: "U 40 000 řádků dat je správné…", o: ["nechat model číst a počítat z hlavy", "dát mu nástroj (kód, tabulku) a chtít analýzu, rozhodnout sám", "poslat data po 100 řádcích"], a: 1, why: "Velká data patří nástroji; rozhodnutí patří člověku." }
          ],
          cards: [
            { f: "Čtyři vlastnosti a obrany", b: "Predikce → podklady a nástroje; znalosti → vyhledávání a ověření; paměť → nový chat a cílené otázky; řiditelnost → konkrétní kroky a příklady." }
          ],
          terms: []
        }
      ]
    }
  ]
});
