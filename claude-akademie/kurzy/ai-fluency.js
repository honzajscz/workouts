/* Kurz: AI zběhlost, rámec 4D (podle academy.claude.com/courses/ai-fluency-framework-foundations) */
AKADEMIE.add({
  id: "ai-fluency",
  emoji: "🧭",
  title: "AI zběhlost: rámec 4D",
  category: "fluency",
  level: "Pro každého",
  desc: "Způsob přemýšlení o spolupráci s AI: Delegace, Popis, Rozlišování a Zodpovědnost. Vychází z rámce autorů Ricka Dakana a Josepha Fellera.",
  source: "https://academy.claude.com/courses/ai-fluency-framework-foundations",
  modules: [
    {
      title: "Proč AI zběhlost",
      lessons: [
        {
          id: "fl-01",
          title: "Úvod do AI zběhlosti",
          minutes: 3,
          lead: `AI zběhlost (AI Fluency) není o tom umět technologii, ale umět s ní spolupracovat: efektivně, s rozmyslem, eticky a bezpečně.`,
          blocks: [
            { t: "p", h: `Kurz vznikl ve spolupráci Anthropic s akademiky Rickem Dakanem a Josephem Fellerem, kteří zkoumali, jak generativní AI mění tvůrčí a pracovní procesy. Výsledkem je <b>rámec 4D</b>: čtyři dovednosti, které dohromady tvoří zběhlost.` },
            { t: "h", x: "Čtyři D" },
            { t: "ul", items: [
              `<b>Delegace</b> (Delegation): rozhodnout, co dělat sám, co s AI a co nechat AI úplně.`,
              `<b>Popis</b> (Description): sdělit AI srozumitelně, co chci a jak.`,
              `<b>Rozlišování</b> (Discernment): kriticky posoudit, co AI vyprodukovala a jak se chovala.`,
              `<b>Zodpovědnost</b> (Diligence): nést odpovědnost za to, jak AI používám a co s výsledky dělám.`
            ] },
            { t: "key", h: `Zběhlost není o tom, kolik triků s prompty znáš. Je to schopnost rozhodnout, kdy AI použít, jak s ní mluvit, jak jí (ne)věřit a jak za výsledek ručit.` },
            { t: "p", h: `Kurz je určený komukoli, kdo s AI pracuje nebo bude pracovat, bez ohledu na obor.` }
          ],
          quiz: [
            { q: "Co je AI zběhlost?", o: ["Znalost programování AI modelů", "Schopnost efektivně, uvážlivě, eticky a bezpečně s AI spolupracovat", "Umění napsat co nejdelší prompt"], a: 1, why: "Zběhlost je o spolupráci: rozhodování, komunikaci, kritice a odpovědnosti." },
            { q: "Která čtveřice tvoří rámec 4D?", o: ["Data, Design, Dodání, Dokumentace", "Delegace, Popis, Rozlišování, Zodpovědnost", "Dotaz, Dialog, Diskuse, Důkaz"], a: 1, why: "Delegation, Description, Discernment, Diligence." }
          ],
          cards: [
            { f: "Rámec 4D", b: "Delegace, Popis, Rozlišování, Zodpovědnost: čtyři dovednosti spolupráce s AI." }
          ],
          terms: [
            { t: "AI zběhlost (AI Fluency)", d: "Schopnost spolupracovat s AI efektivně, uvážlivě, eticky a bezpečně." },
            { t: "Rámec 4D", d: "Delegace, Popis, Rozlišování a Zodpovědnost (Delegation, Description, Discernment, Diligence)." }
          ]
        },
        {
          id: "fl-02",
          title: "Proč AI zběhlost potřebujeme",
          minutes: 4,
          lead: `Generativní AI je jiná než dřívější nástroje: mluví s námi jazykem, je nepředvídatelná a schopná. Proto potřebujeme nový druh dovednosti.`,
          blocks: [
            { t: "h", x: "Tři důvody" },
            { t: "ol", items: [
              `<b>AI je všude a rychle se mění.</b> Co nefungovalo loni, letos funguje. Zběhlost je trvalá, konkrétní triky zastarávají.`,
              `<b>AI je nespolehlivá jinak než software.</b> Kalkulačka buď funguje, nebo ne. AI odpoví vždy, ale někdy špatně a sebejistě. Musíš umět rozlišit.`,
              `<b>Odpovědnost zůstává na člověku.</b> Když AI napíše chybný e-mail a ty ho odešleš, je to tvůj e-mail.`
            ] },
            { t: "h", x: "Tři způsoby spolupráce" },
            { t: "table", head: ["Způsob", "Co to znamená", "Příklad"], rows: [
              ["<b>Automatizace</b>", "AI dělá úkol za tebe podle zadání", "Přepis nahrávky do textu"],
              ["<b>Augmentace</b>", "Pracujete spolu, AI je partner v přemýšlení", "Společné ladění struktury článku"],
              ["<b>Agentnost</b>", "AI jedná samostatně tvým jménem podle nastavených pravidel", "Agent, který třídí příchozí e-maily a připravuje odpovědi"]
            ] },
            { t: "p", h: `Zběhlý člověk umí přepínat mezi těmito způsoby podle situace. Rutinní přepis automatizuje, tvůrčí problém řeší v augmentaci, dobře popsaný proces nechá agentovi.` },
            { t: "ex", title: "Ukázka: augmentace v praxi", turns: [
              { who: "user", text: `Píšu projev na svatbu bratra. Nechci, abys ho napsal za mě. Ptej se mě po jedné otázce na vzpomínky a pak mi pomoz je uspořádat.` },
              { who: "ai", text: `Jasně, půjdeme krok za krokem. První otázka: Jaká je tvoje nejstarší vzpomínka na bratra, na kterou se vždycky usměješ?` }
            ], note: `Tohle je <b>augmentace</b>: AI vede proces a pomáhá myslet, ale obsah je tvůj. Automatizace by byla „napiš projev“.` }
          ],
          quiz: [
            { q: "Proč je AI jinak nespolehlivá než běžný software?", o: ["Protože se často zasekne", "Protože odpoví vždy, ale někdy špatně a sebejistě", "Protože vyžaduje internet"], a: 1, why: "AI nedává chybové hlášky. Chybnou odpověď musíš rozpoznat sám/sama." },
            { q: "Které slovo popisuje situaci, kdy AI jedná samostatně tvým jménem podle pravidel?", o: ["Automatizace", "Augmentace", "Agentnost"], a: 2, why: "Agentnost (agency): AI jedná samostatně v mezích, které jsi nastavil/a." }
          ],
          cards: [
            { f: "Tři způsoby spolupráce s AI", b: "Automatizace (AI dělá za tebe), augmentace (myslíte spolu), agentnost (AI jedná samostatně podle pravidel)." },
            { f: "Proč zběhlost, ne triky", b: "Triky zastarávají, AI se mění. Dovednost rozhodovat, popisovat, rozlišovat a ručit zůstává." }
          ],
          terms: [
            { t: "Automatizace", d: "Způsob spolupráce, kdy AI vykoná úkol za tebe podle zadání." },
            { t: "Augmentace", d: "Způsob spolupráce, kdy AI rozšiřuje tvé myšlení: je partnerem, ne vykonavatelem." },
            { t: "Agentnost", d: "Způsob spolupráce, kdy AI samostatně jedná tvým jménem v mezích nastavených pravidel." }
          ]
        },
        {
          id: "fl-03",
          title: "Rámec 4D v kostce",
          minutes: 4,
          lead: `Přehled všech čtyř dovedností a jejich podčástí. Dál v kurzu si každou rozebereme zvlášť.`,
          blocks: [
            { t: "h", x: "1. Delegace: co, komu a proč" },
            { t: "ul", items: [
              `<b>Povědomí o problému</b>: čeho chci dosáhnout a co to obnáší.`,
              `<b>Povědomí o platformě</b>: co AI umí a neumí, který nástroj se hodí.`,
              `<b>Rozdělení práce</b>: co udělám sám/sama, co s AI, co nechám AI.`
            ] },
            { t: "h", x: "2. Popis: jak AI říct, co chci" },
            { t: "ul", items: [
              `<b>Popis produktu</b>: jak má vypadat výsledek.`,
              `<b>Popis procesu</b>: jak má AI postupovat.`,
              `<b>Popis chování</b>: jak se má AI chovat (tón, role, míra iniciativy).`
            ] },
            { t: "h", x: "3. Rozlišování: kritický pohled" },
            { t: "ul", items: [
              `<b>Rozlišování produktu</b>: je výsledek správný, úplný, vhodný?`,
              `<b>Rozlišování procesu</b>: dává postup AI smysl, nepřeskočila něco?`,
              `<b>Rozlišování chování</b>: chovala se AI přiměřeně (nepřeháněla jistotu, nevymýšlela)?`
            ] },
            { t: "h", x: "4. Zodpovědnost: ručím za to" },
            { t: "ul", items: [
              `<b>Zodpovědnost při tvorbě</b>: volím vhodné nástroje a data, myslím na soukromí.`,
              `<b>Transparentnost</b>: jsem otevřený/á o tom, že jsem AI použil/a.`,
              `<b>Zodpovědnost při nasazení</b>: za výsledek ručím já, ne AI.`
            ] },
            { t: "key", h: `Čtyři D nejsou kroky za sebou. Prolínají se: popisuješ, rozlišuješ, upravuješ popis, znovu rozlišuješ a celou dobu přemýšlíš, co delegovat a za co ručíš.` }
          ],
          quiz: [
            { q: "Kam patří otázka „Nepřeháněla AI svou jistotu?“", o: ["Delegace", "Rozlišování chování", "Popis produktu"], a: 1, why: "Rozlišování (discernment) chování hodnotí, jak se AI chovala, nejen co vyprodukovala." },
            { q: "Které tři podčásti má Popis?", o: ["Produkt, proces, chování", "Problém, platforma, práce", "Tvorba, transparentnost, nasazení"], a: 0, why: "Popisuješ, jak má vypadat výsledek, jak postupovat a jak se AI má chovat." }
          ],
          cards: [
            { f: "Tři složky Delegace", b: "Povědomí o problému, povědomí o platformě, rozdělení práce." },
            { f: "Tři složky Popisu", b: "Produkt (výsledek), proces (postup), chování (tón, role, iniciativa)." },
            { f: "Tři složky Rozlišování", b: "Produkt, proces, chování: co vzniklo, jak to vzniklo, jak se AI chovala." },
            { f: "Tři složky Zodpovědnosti", b: "Při tvorbě (nástroje, data), transparentnost (přiznat AI), při nasazení (ručím za výsledek)." }
          ],
          terms: [
            { t: "Delegace (4D)", d: "Rozhodování, které části úkolu dělat sám, které s AI a které nechat AI, na základě znalosti problému a platformy." },
            { t: "Popis (4D)", d: "Sdělení AI, jaký má být výsledek, jak postupovat a jak se chovat." },
            { t: "Rozlišování (4D)", d: "Kritické hodnocení výstupu, postupu i chování AI." },
            { t: "Zodpovědnost (4D)", d: "Odpovědné používání AI: volba nástrojů, transparentnost a ručení za výsledek." }
          ]
        }
      ]
    },
    {
      title: "Základy generativní AI",
      lessons: [
        {
          id: "fl-04",
          title: "Jak generativní AI funguje",
          minutes: 5,
          lead: `Nemusíš rozumět matematice. Stačí pár mentálních modelů, díky kterým budeš vědět, proč AI odpovídá tak, jak odpovídá.`,
          blocks: [
            { t: "h", x: "Trénink: čtení téměř všeho" },
            { t: "p", h: `Jazykový model se učí tak, že prochází obrovské množství textu a trénuje se v jediné věci: <b>uhodnout, co bude následovat</b>. Po miliardách pokusů se v něm „usadí“ gramatika, fakta, styly, způsoby uvažování. Nemá databázi faktů, má vzorce.` },
            { t: "h", x: "Odpověď vzniká po kouskách" },
            { t: "p", h: `Model generuje text po malých jednotkách (tokenech), vždy vybírá pravděpodobné pokračování. Proto zní plynule i tehdy, když obsah není správný. A proto dvě stejné otázky mohou dostat trochu jinou odpověď.` },
            { t: "h", x: "Doladění: jak model dostane charakter" },
            { t: "p", h: `Po základním tréninku se model dolaďuje na dialog: aby byl užitečný, upřímný, odmítal škodlivé věci a měl konzistentní „osobnost“. Claude má díky tomu svůj styl a hodnoty.` },
            { t: "h", x: "Kontextové okno: pracovní paměť" },
            { t: "p", h: `Vše, co v rozhovoru napíšeš a přiložíš, plus vše, co model odpoví, tvoří <b>kontext</b>. Má omezenou velikost. Co v něm není, model „nevidí“. Nový chat = prázdný kontext.` },
            { t: "ex", title: "Ukázka: proč AI zní jistě i při chybě", turns: [
              { who: "user", text: `Kdo napsal knihu „Stíny nad Vltavou“ z roku 1987?` },
              { who: "bad", text: `Knihu napsal Jiří Novák, vyšla v nakladatelství Odeon a získala cenu…` },
              { who: "ai", text: `Knihu s tímto názvem a rokem neznám, možná jde o méně známý titul nebo nepřesný název. Nechci vymýšlet autora. Pokud máš další údaje (nakladatelství, žánr), zkusím to dohledat, případně můžeme použít vyhledávání.` }
            ], note: `První odpověď je hladká a vymyšlená (model „pokračoval, jak to obvykle chodí“). Druhá je správné chování: přiznat nejistotu. Dobře doladěný model se chová jako ta druhá, ale ne vždy, proto ověřuj.` }
          ],
          quiz: [
            { q: "Co se jazykový model během tréninku učí?", o: ["Ukládat fakta do databáze", "Předpovídat, co bude v textu následovat", "Procházet internet v reálném čase"], a: 1, why: "Model se učí předpovídat pokračování textu. Z toho vyplývají jeho silné i slabé stránky." },
            { q: "Co je kontextové okno?", o: ["Okno prohlížeče", "Omezená pracovní paměť rozhovoru: vše, co model v dané chvíli vidí", "Seznam všech dřívějších chatů"], a: 1, why: "Do kontextu patří zprávy, přílohy a odpovědi v aktuálním rozhovoru. Má omezenou velikost." }
          ],
          cards: [
            { f: "Jak se model učí", b: "Předpovídá další kousek textu na obrovském množství dat; z toho vzniknou vzorce, ne databáze faktů." },
            { f: "Kontextové okno", b: "Omezená pracovní paměť: vše, co model v rozhovoru vidí. Nový chat začíná prázdný." }
          ],
          terms: [
            { t: "Token", d: "Malá jednotka textu (část slova, slovo, znak), po které model text čte i generuje." },
            { t: "Kontextové okno", d: "Množství textu, které model v jednu chvíli vidí: zprávy, přílohy a odpovědi v rozhovoru. Má pevný limit." },
            { t: "Doladění (fine-tuning)", d: "Druhá fáze tréninku, která z modelu předpovídajícího text udělá užitečného a bezpečného asistenta." }
          ]
        },
        {
          id: "fl-05",
          title: "Schopnosti a limity v kostce",
          minutes: 4,
          lead: `Krátký přehled, v čem je AI silná a kde selhává. Podrobný kurz na toto téma je v appce zvlášť, tady jen to nejnutnější pro rámec 4D.`,
          blocks: [
            { t: "table", head: ["Silné stránky", "Slabé stránky"], rows: [
              ["Práce s jazykem: psaní, přepis stylu, shrnutí, překlad", "Přesná fakta o okrajových nebo nových věcech"],
              ["Vysvětlování a strukturování myšlenek", "Přesné počítání a dlouhé řetězce logiky bez nástrojů"],
              ["Rychlé generování variant a nápadů", "Dlouhé dokumenty: detaily z prostředka se mohou ztratit"],
              ["Kód, tabulky, formáty", "Přehnaná jistota a snaha vyhovět (souhlasí, i když nemá)"],
              ["Trpělivost a dostupnost", "Neví, co neví; nezná tvá interní data bez kontextu"]
            ] },
            { t: "h", x: "Praktické důsledky" },
            { t: "ul", items: [
              `Čím <b>běžnější</b> téma, tím spolehlivější odpověď. U vzácných témat ověřuj.`,
              `Dej AI <b>nástroje</b> (vyhledávání, kalkulačku, dokumenty), místo abys spoléhal/a na paměť modelu.`,
              `Ptej se <b>neutrálně</b>. Otázka „Souhlasíš, že je to skvělý plán?“ často dostane souhlas.`
            ] },
            { t: "ex", title: "Ukázka: neutrální vs. návodná otázka", turns: [
              { who: "bad", label: "Návodně", text: `Moje strategie je otevřít třetí pobočku už letos. Je to skvělý nápad, že?` },
              { who: "user", label: "Neutrálně", text: `Zvažuji otevřít třetí pobočku letos. Uveď 3 nejsilnější argumenty pro a 3 proti a řekni, jaké informace bys ještě potřeboval k rozhodnutí.` }
            ], note: `Druhá formulace vyžaduje od AI vyváženost. První ji tlačí k souhlasu.` }
          ],
          quiz: [
            { q: "U kterého typu otázky je největší riziko vymyšlené odpovědi?", o: ["Vysvětli, jak funguje fotosyntéza", "Jaké je datum narození málo známého regionálního politika", "Zkrať tento odstavec"], a: 1, why: "Okrajová fakta model nemá dobře „zažitá“, ale odpoví stejně plynule. Ověřuj." },
            { q: "Proč se ptát neutrálně?", o: ["Aby AI odpověděla rychleji", "Protože návodná otázka tlačí AI k souhlasu", "Neutrální otázky jsou kratší"], a: 1, why: "Modely mají sklon vyhovět. Neutrální otázka vede k vyváženější odpovědi." }
          ],
          cards: [
            { f: "Kdy AI nejvíc věřit", b: "U běžných témat a práce s jazykem. U okrajových faktů, čísel a novinek ověřovat." },
            { f: "Návodná otázka", b: "Formulace, která tlačí AI k určité odpovědi („je to skvělé, že?“). Ptej se neutrálně." }
          ],
          terms: [
            { t: "Sklon vyhovět (sycophancy)", d: "Tendence AI souhlasit s uživatelem a potvrzovat jeho názor, i když by měla oponovat." }
          ]
        }
      ]
    },
    {
      title: "Delegace",
      lessons: [
        {
          id: "fl-06",
          title: "Delegace zblízka",
          minutes: 5,
          lead: `Delegace začíná dřív, než napíšeš první prompt. Je to rozhodnutí, co vůbec s AI dělat a proč.`,
          blocks: [
            { t: "h", x: "Povědomí o problému" },
            { t: "p", h: `Ujasni si: Co je cíl? Jak poznám, že je hotovo? Které části jsou rutinní a které vyžadují můj úsudek, vztahy nebo znalost kontextu, kterou AI nemá?` },
            { t: "h", x: "Povědomí o platformě" },
            { t: "p", h: `Co AI umí (přepis, struktura, varianty, vysvětlení) a co ne (přesná fakta bez zdroje, tvůj vkus, odpovědnost)? Který nástroj: chat, Research, Cowork, konektor?` },
            { t: "h", x: "Rozdělení práce" },
            { t: "table", head: ["Udělám sám/sama", "S AI", "Nechám AI"], rows: [
              ["Rozhodnutí, vztahy, věci, kde ručím osobně", "Přemýšlení, návrhy, ladění, učení", "Rutina s jasným zadáním a snadnou kontrolou"],
              ["Např. závěrečné slovo v e-mailu klientovi", "Např. struktura prezentace", "Např. přepis tabulky do jiného formátu"]
            ] },
            { t: "ex", title: "Ukázka: delegace jednoho úkolu", turns: [
              { who: "user", label: "Úkol", text: `Připravit čtvrtletní report pro vedení.` },
              { who: "user", label: "Rozdělení", text: `Sám: rozhodnu, co je hlavní sdělení a doporučení.\nS AI: nechám si vysvětlit odchylky v číslech a navrhnout strukturu.\nAI: přepíše tabulky do grafů a zkontroluje pravopis.` }
            ], note: `Všimni si, že AI nedostává „udělej report“. Dostává konkrétní části, u kterých je jasné, jak výsledek zkontrolovat.` },
            { t: "warn", h: `Nejčastější chyba delegace: svěřit AI to, co neumíš sám/sama zkontrolovat. Pokud nedokážeš posoudit výsledek, nemůžeš nést odpovědnost.` }
          ],
          quiz: [
            { q: "Co by mělo rozhodování o delegaci předcházet psaní promptu?", o: ["Výběr barvy rozhraní", "Ujasnění cíle, toho, co AI umí, a rozdělení práce", "Nastavení hesla"], a: 1, why: "Delegace = povědomí o problému + povědomí o platformě + rozdělení práce." },
            { q: "Který úkol je nejvhodnější nechat AI celý?", o: ["Rozhodnutí o propuštění zaměstnance", "Přepis tabulky do jiného formátu", "Omluva klientovi za velkou chybu"], a: 1, why: "Rutina s jasným zadáním a snadnou kontrolou. Rozhodnutí a vztahy zůstávají člověku." }
          ],
          cards: [
            { f: "Pravidlo delegace", b: "Nesvěřuj AI to, co neumíš zkontrolovat. Bez kontroly nemůžeš ručit." },
            { f: "Tři sloupce rozdělení práce", b: "Sám (rozhodnutí, vztahy), s AI (myšlení, návrhy), AI (rutina s jasnou kontrolou)." }
          ],
          terms: [
            { t: "Povědomí o problému", d: "Jasná představa o cíli, kritériích hotovosti a o tom, které části úkolu vyžadují lidský úsudek." },
            { t: "Povědomí o platformě", d: "Znalost toho, co konkrétní AI nástroj umí, neumí a který se na úkol hodí." }
          ]
        },
        {
          id: "fl-07",
          title: "Plánování projektu a delegace",
          minutes: 5,
          lead: `U větších projektů se delegace dělá po částech. AI ti přitom může pomoci i s plánováním samotným.`,
          blocks: [
            { t: "h", x: "Postup" },
            { t: "steps", items: [
              `<b>Rozlož projekt</b> na kroky. Klidně s pomocí AI: „Rozepiš přípravu firemního workshopu na konkrétní úkoly.“`,
              `<b>U každého kroku rozhodni</b>: sám / s AI / AI. Ptej se: Mám k tomu podklady? Umím zkontrolovat výsledek? Záleží na mém úsudku?`,
              `<b>Seřaď</b>: nejdřív kroky, které odemykají další (např. cíl workshopu je před programem).`,
              `<b>Vyhraď si kontrolní body</b>, kde se zastavíš a posoudíš, co vzniklo.`
            ] },
            { t: "ex", title: "Ukázka: plán s AI", turns: [
              { who: "user", text: `Organizuji půldenní workshop pro 15 lidí o zpětné vazbě v týmu. Rozepiš přípravu na úkoly a u každého navrhni, zda ho mám dělat sám, s tebou, nebo ho můžeš udělat ty. Zdůvodni jednou větou.` },
              { who: "ai", text: `1. Stanovit cíl a měřitelný výstup: TY (znáš tým a kontext).\n2. Program a časový plán: SPOLU (navrhnu varianty, ty vybereš).\n3. Materiály: prezentace, pracovní listy: JÁ podle schváleného programu, ty zkontroluješ.\n4. Pozvánka a logistika: JÁ napíšu text, ty odešleš.\n5. Facilitace v den D: TY (živá práce s lidmi).\n6. Vyhodnocení: dotazník a shrnutí, SPOLU.` }
            ], note: `AI navrhla dělení podle stejných kritérií: kontext, úsudek, kontrolovatelnost. Ty máš poslední slovo.` },
            { t: "tip", h: `Ulož si plán do projektu (viz kurz Claude 101). Každý další chat pak ví, kde jste.` }
          ],
          quiz: [
            { q: "Co je smyslem kontrolních bodů v projektu s AI?", o: ["Zpomalit práci", "Zastavit se a posoudit, co vzniklo, než se jde dál", "Uložit chat"], a: 1, why: "Kontrolní body chrání před tím, aby se chyba z jednoho kroku protáhla celým projektem." },
            { q: "Může AI pomoci i s rozhodováním o delegaci?", o: ["Ne, to musí člověk sám", "Ano, může navrhnout rozdělení, ale rozhodnutí je na tobě", "Ano, a rozhodne za tebe"], a: 1, why: "AI dobře navrhne dělení podle kritérií, konečné rozhodnutí a odpovědnost zůstávají tobě." }
          ],
          cards: [
            { f: "Delegace u projektu", b: "Rozlož na kroky, u každého rozhodni sám/s AI/AI, seřaď a vyhraď kontrolní body." }
          ],
          terms: [
            { t: "Kontrolní bod", d: "Předem určený okamžik v projektu, kdy se zastavíš a posoudíš dosavadní výsledky AI." }
          ]
        }
      ]
    },
    {
      title: "Popis",
      lessons: [
        {
          id: "fl-08",
          title: "Popis zblízka",
          minutes: 5,
          lead: `Popis je víc než prompt. Zahrnuje tři věci: jaký má být výsledek, jak se k němu dostat a jak se má AI chovat.`,
          blocks: [
            { t: "h", x: "Popis produktu" },
            { t: "p", h: `Co má vzniknout: typ, délka, formát, publikum, jazyk, tón, co musí obsahovat a co ne. Nejlepší popis produktu často obsahuje <b>příklad</b>.` },
            { t: "h", x: "Popis procesu" },
            { t: "p", h: `Jak postupovat: „Nejdřív mi polož otázky“, „Postupuj po krocích a po každém se zastav“, „Začni osnovou, text až po schválení“, „Uvažuj nahlas, než odpovíš“.` },
            { t: "h", x: "Popis chování" },
            { t: "p", h: `Jak se má AI chovat: role („jsi zkušená editorka“), míra iniciativy („navrhuj alternativy“ vs. „drž se přesně zadání“), upřímnost („řekni mi, když je něco špatný nápad“), formát komunikace („stručně, bez omluv“).` },
            { t: "ex", title: "Ukázka: všechny tři popisy v jednom zadání", turns: [
              { who: "user", text: `PRODUKT: Popis pozice „Projektový manažer“ pro inzerát, max 250 slov, česky, tykání, bez korporátních klišé, s odstavci: O nás, Co budeš dělat, Co hledáme, Co nabízíme.\nPROCES: Nejdřív mi polož 3 otázky o pozici, pak napiš návrh. Po mé zpětné vazbě uprav.\nCHOVÁNÍ: Jsi zkušený HR copywriter. Pokud mi navrhneš něco lepšího než moje zadání, řekni to a zdůvodni.` },
              { who: "ai", text: `Díky, tři otázky:\n1. Jaké je odvětví a velikost firmy?\n2. Je pozice na plný úvazek a je možná práce z domova?\n3. Jaké jsou 2 věci, kterými se firma odlišuje od konkurence (pro sekci „Co nabízíme“)?` }
            ], note: `Nemusíš psát nadpisy PRODUKT/PROCES/CHOVÁNÍ, ale pomáhají nezapomenout na žádnou část. Pro krátké úkoly stačí věta u každé.` },
            { t: "key", h: `Většina lidí popisuje jen produkt. Přidání procesu a chování je nejrychlejší způsob, jak dostat lepší výsledky.` }
          ],
          quiz: [
            { q: "Věta „Než odpovíš, polož mi tři otázky“ je popis…", o: ["produktu", "procesu", "chování"], a: 1, why: "Popisuje, jak má AI postupovat, tedy proces." },
            { q: "Věta „Řekni mi, když je můj nápad špatný“ je popis…", o: ["produktu", "procesu", "chování"], a: 2, why: "Určuje, jak se má AI chovat: být upřímná a oponovat." }
          ],
          cards: [
            { f: "Tři druhy popisu", b: "Produkt (co má vzniknout), proces (jak postupovat), chování (role, iniciativa, upřímnost)." }
          ],
          terms: [
            { t: "Popis produktu", d: "Zadání toho, jak má vypadat výsledek: typ, délka, formát, publikum, tón, obsah." },
            { t: "Popis procesu", d: "Zadání toho, jak má AI postupovat: kroky, otázky, zastávky, pořadí." },
            { t: "Popis chování", d: "Zadání toho, jak se má AI chovat: role, míra iniciativy, upřímnost, styl komunikace." }
          ]
        },
        {
          id: "fl-09",
          title: "Techniky efektivního promptování",
          minutes: 6,
          lead: `Konkrétní techniky, které opakovaně fungují. Každou si ukážeme na příkladu.`,
          blocks: [
            { t: "h", x: "1. Buď konkrétní a přímý" },
            { t: "cmp", bad: { lbl: "Vágní", h: `Vylepši tenhle text.` }, good: { lbl: "Konkrétní", h: `Zkrať text na polovinu, zachovej všechna čísla, odstraň pasivní věty a nahraď odborné výrazy běžnými slovy.` } },
            { t: "h", x: "2. Dej příklady" },
            { t: "p", h: `„Tady jsou dva popisky produktů, které se mi líbí. Napiš stejným stylem popisek pro …“ Jeden až tři příklady jsou často lepší než odstavec pravidel.` },
            { t: "h", x: "3. Přiděl roli a publikum" },
            { t: "p", h: `„Jsi lékař, který vysvětluje výsledky krevních testů pacientovi bez medicínského vzdělání.“ Role určuje úroveň, publikum určuje jazyk.` },
            { t: "h", x: "4. Rozlož složité na kroky" },
            { t: "p", h: `Místo „udělej analýzu a doporučení“: „Krok 1: shrň data. Krok 2: najdi 3 hlavní trendy. Krok 3: ke každému navrhni doporučení. Po každém kroku se zastav.“` },
            { t: "h", x: "5. Nech AI přemýšlet nahlas" },
            { t: "p", h: `„Než odpovíš, projdi si možné varianty a zvaž jejich rizika.“ U složitějších úloh to zlepšuje kvalitu. U jednoduchých to jen prodlužuje odpověď.` },
            { t: "h", x: "6. Urči formát výstupu" },
            { t: "p", h: `Tabulka, odrážky, JSON, e-mail, číslované kroky, „max 5 vět“. Formát usnadní tvou kontrolu i další použití.` },
            { t: "h", x: "7. Řekni, co nechceš" },
            { t: "p", h: `„Bez úvodu a závěru.“ „Nepoužívej slovo ‚inovativní‘.“ „Nevymýšlej čísla, pokud nejsou v podkladu, napiš ‚chybí‘.“` },
            { t: "ex", title: "Ukázka: kombinace technik", turns: [
              { who: "user", text: `Jsi zkušený učitel fyziky (role). Vysvětli žákovi 8. třídy (publikum), proč lodě plavou. Postupuj takto: 1) jednoduchá analogie, 2) fyzikální vysvětlení, 3) jedna otázka k zamyšlení (kroky). Max 150 slov, bez vzorců (formát a omezení). Příklad tónu, který chci: „Představ si, že…“ (příklad).` },
              { who: "ai", text: `Představ si, že se posadíš do vany plné vody: voda se vylije, protože tvé tělo zabralo její místo. Loď dělá totéž, ale je tvarovaná tak, aby „zabrala“ hodně vody, přestože sama je dutá a lehká. Voda, kterou loď vytlačí, ji tlačí zpět nahoru silou rovnou váze té vytlačené vody. Když je tahle síla stejná jako váha lodi, loď plave. Proto i ocelová loď plave, zatímco ocelová kulička klesne: kulička vytlačí jen málo vody.\nOtázka: Co se stane, když loď naložíš tolik, že vytlačená voda už její váhu neunese?` }
            ], note: `Každá technika je v zadání v závorce, aby bylo vidět, co dělá. V reálu závorky nepíšeš.` }
          ],
          quiz: [
            { q: "Který prompt je konkrétnější?", o: ["Udělej to lepší", "Zkrať na 100 slov, zachovej čísla, odstraň pasivum", "Prosím vylepšit"], a: 1, why: "Konkrétní zadání říká, co přesně změnit a co zachovat." },
            { q: "Kdy pomáhá „přemýšlej nahlas, než odpovíš“?", o: ["U jednoduchých otázek na fakta", "U složitějších úloh s více variantami a riziky", "Nikdy"], a: 1, why: "Uvažování před odpovědí zlepšuje kvalitu u složitých úloh; u jednoduchých jen prodlužuje odpověď." },
            { q: "Proč říkat, co nechceš?", o: ["Aby byl prompt delší", "Aby AI nedělala typické nežádoucí věci (klišé, vymyšlená čísla, zbytečné úvody)", "Není to k ničemu"], a: 1, why: "Negativní omezení odstraňují opakující se nešvary výstupu." }
          ],
          cards: [
            { f: "Sedm technik promptování", b: "Konkrétnost, příklady, role a publikum, kroky, přemýšlení nahlas, formát výstupu, co nechceš." },
            { f: "Příklad vs. pravidla", b: "Jeden až tři příklady stylu často fungují lépe než odstavec pravidel." }
          ],
          terms: [
            { t: "Few-shot (učení z příkladů)", d: "Technika, kdy do zadání vložíš pár ukázek požadovaného výstupu a AI je napodobí." },
            { t: "Uvažování krok za krokem", d: "Pokyn, aby AI před odpovědí prošla varianty nebo mezikroky; zlepšuje výsledky u složitých úloh." }
          ]
        }
      ]
    },
    {
      title: "Rozlišování",
      lessons: [
        {
          id: "fl-10",
          title: "Rozlišování zblízka",
          minutes: 5,
          lead: `Rozlišování je kritické čtení výstupu AI. Ne s nedůvěrou ke všemu, ale s otázkou: „Je to správně, úplně a vhodné pro můj účel?“`,
          blocks: [
            { t: "h", x: "Rozlišování produktu" },
            { t: "ul", items: [
              `<b>Správnost</b>: fakta, čísla, jména, odkazy. Ověř klíčové.`,
              `<b>Úplnost</b>: nechybí něco, co jsem chtěl/a? Neodpověděla AI na jinou otázku?`,
              `<b>Vhodnost</b>: sedí tón, délka, publikum? Nezní to jako robot?`
            ] },
            { t: "h", x: "Rozlišování procesu" },
            { t: "p", h: `Dává postup smysl? Nepřeskočila AI krok? Pokud „přemýšlela nahlas“, drží úvahy pohromadě? Když AI použila nástroje (vyhledávání, dokumenty), použila ty správné?` },
            { t: "h", x: "Rozlišování chování" },
            { t: "p", h: `Nebyla AI přehnaně jistá? Nesouhlasila jen proto, že jsem to chtěl/a slyšet? Nevymyslela zdroj? Nepřeháněla tvou pochvalu?` },
            { t: "ex", title: "Ukázka: odhalení chyby v procesu", turns: [
              { who: "user", text: `Spočítej, kolik zaplatím za 3 roky, když platím 890 Kč měsíčně a od druhého roku se cena zvýší o 10 %.` },
              { who: "bad", text: `890 × 36 = 32 040 Kč, s 10% navýšením celkem 35 244 Kč.` },
              { who: "user", label: "Rozlišování", text: `Počkat. Navýšení platí jen od druhého roku, ne na všechny tři. Přepočítej po rocích.` },
              { who: "ai", text: `Máš pravdu. Rok 1: 890 × 12 = 10 680. Rok 2 a 3: 979 × 24 = 23 496. Celkem 34 176 Kč.` }
            ], note: `Chyba nebyla v matematice, ale v <b>procesu</b>: AI aplikovala navýšení na špatné období. Odhalíš ji jen tím, že sleduješ postup, ne jen výsledek.` },
            { t: "tip", h: `Požádej AI, ať výsledek zkontroluje sama: „Projdi svou odpověď jako přísný oponent a najdi chyby.“ Není to náhrada tvé kontroly, ale odhalí to hodně.` }
          ],
          quiz: [
            { q: "AI ti dala hladce znějící citaci studie. Co je správné rozlišování?", o: ["Použít ji, zní důvěryhodně", "Ověřit, že studie existuje a říká to, co AI tvrdí", "Požádat o další citace"], a: 1, why: "Citace a odkazy patří k nejčastějším halucinacím. Klíčové ověřuj." },
            { q: "Co znamená rozlišování procesu?", o: ["Kontrola pravopisu", "Posouzení, zda postup AI dává smysl a nepřeskočila krok", "Měření rychlosti odpovědi"], a: 1, why: "Nejen co vyšlo, ale jak k tomu AI došla." }
          ],
          cards: [
            { f: "Tři otázky rozlišování produktu", b: "Je to správně? Je to úplné? Je to vhodné pro můj účel a publikum?" },
            { f: "Samokontrola AI", b: "„Projdi svou odpověď jako přísný oponent.“ Doplňuje, nenahrazuje tvou kontrolu." }
          ],
          terms: [
            { t: "Rozlišování produktu", d: "Posouzení výstupu AI z hlediska správnosti, úplnosti a vhodnosti." },
            { t: "Rozlišování procesu", d: "Posouzení toho, jak AI postupovala: pořadí kroků, použité nástroje, logika úvah." }
          ]
        },
        {
          id: "fl-11",
          title: "Smyčka Popis a Rozlišování",
          minutes: 4,
          lead: `Popis a rozlišování se střídají. Každé posouzení výstupu ti řekne, co v popisu upřesnit. Tomu se říká smyčka.`,
          blocks: [
            { t: "steps", items: [
              `<b>Popiš</b> úkol (produkt, proces, chování).`,
              `<b>Rozliš</b>: co je dobře, co špatně, co chybí.`,
              `<b>Uprav popis</b>: přidej omezení, příklad, upřesni krok, změň chování.`,
              `Opakuj, dokud výsledek neodpovídá. Obvykle 2 až 4 kola.`
            ] },
            { t: "ex", title: "Ukázka: tři kola smyčky", turns: [
              { who: "user", label: "Kolo 1", text: `Napiš popis našeho kurzu keramiky pro web.` },
              { who: "ai", text: `(Obecný text s klišé: „jedinečný zážitek“, „odhalte svou kreativitu“…)` },
              { who: "user", label: "Kolo 2 (po rozlišení: klišé, chybí fakta)", text: `Vynech klišé jako „jedinečný zážitek“. Přidej fakta: 6 lekcí po 2 hodinách, max 8 lidí, materiál v ceně, vhodné pro úplné začátečníky. Tón: přátelský, věcný.` },
              { who: "ai", text: `(Věcný text s fakty, ale příliš dlouhý a bez výzvy k akci.)` },
              { who: "user", label: "Kolo 3", text: `Zkrať na 90 slov a zakonči větou, která vyzývá k rezervaci s odkazem.` },
              { who: "ai", text: `(Hotový text: krátký, věcný, s fakty a výzvou k akci.)` }
            ], note: `Každé kolo řeší <b>konkrétní nedostatek</b> zjištěný rozlišováním. To je efektivnější než psát od začátku dokonalý prompt.` },
            { t: "key", h: `Nemusíš napsat dokonalé zadání napoprvé. Zběhlost je umět rychle iterovat: vidět, co chybí, a pojmenovat to.` },
            { t: "tip", h: `Když se ti nějaké zadání osvědčí po několika kolech, ulož si finální verzi (do projektu nebo jako skill). Příště začneš rovnou z ní.` }
          ],
          quiz: [
            { q: "Co je smyčka Popis a Rozlišování?", o: ["Psát stále delší prompty", "Střídání zadání a kritického posouzení, kde každé posouzení upřesní další zadání", "Opakování stejné otázky"], a: 1, why: "Rozlišování ti řekne, co v popisu chybí. Upravený popis vede k lepšímu výsledku." },
            { q: "Co dělat s promptem, který se po několika kolech osvědčil?", o: ["Zapomenout ho", "Uložit finální verzi pro příště (projekt, skill)", "Poslat ho výrobci"], a: 1, why: "Osvědčené zadání je cenné, ušetří kola iterace příště." }
          ],
          cards: [
            { f: "Smyčka Popis a Rozlišování", b: "Popiš, posuď, uprav popis podle zjištěného nedostatku, opakuj. Obvykle 2 až 4 kola." }
          ],
          terms: [
            { t: "Smyčka Popis a Rozlišování", d: "Iterativní postup: zadání, posouzení výsledku, upřesnění zadání, znovu." }
          ]
        }
      ]
    },
    {
      title: "Zodpovědnost",
      lessons: [
        {
          id: "fl-12",
          title: "Zodpovědnost zblízka",
          minutes: 5,
          lead: `Poslední D: používat AI tak, abys za výsledek mohl/a ručit, a být o tom otevřený/á.`,
          blocks: [
            { t: "h", x: "Zodpovědnost při tvorbě" },
            { t: "ul", items: [
              `Volím nástroj, kterému rozumím a který je pro data vhodný (firemní data do firemního účtu, ne do soukromého).`,
              `Nezadávám do AI osobní údaje jiných lidí, hesla, důvěrné smlouvy, pokud k tomu nemám oprávnění a nastavení.`,
              `Respektuji autorská práva: AI není omluva pro kopírování cizí práce.`
            ] },
            { t: "h", x: "Transparentnost" },
            { t: "p", h: `Řekni, kde jsi AI použil/a, když na tom záleží: ve škole, u odborných textů, ve firemních dokumentech podle pravidel firmy, u klientů. Nejde o přiznání viny, ale o důvěru.` },
            { t: "h", x: "Zodpovědnost při nasazení" },
            { t: "p", h: `Cokoli s výstupem AI uděláš (odešleš, publikuješ, rozhodneš podle toho), je tvoje. „To napsala AI“ není obhajoba. Proto rozlišování před nasazením, ne po něm.` },
            { t: "ex", title: "Ukázka: transparentní věta", turns: [
              { who: "user", label: "V dokumentu", text: `Tento report vznikl s pomocí AI (Claude) pro analýzu dat a první návrh textu. Závěry a doporučení jsem ověřil/a a nesu za ně odpovědnost., Jana N.` }
            ], note: `Jedna věta. Říká, k čemu byla AI použita, a kdo ručí. Tohle je zodpovědnost v praxi.` },
            { t: "h", x: "Kontrolní seznam před odesláním" },
            { t: "ol", items: [
              `Ověřil/a jsem klíčová fakta a čísla?`,
              `Nejsou ve výstupu cizí osobní údaje nebo důvěrné informace, které tam nepatří?`,
              `Umím výstup obhájit vlastními slovy?`,
              `Je jasné (kde to je potřeba), že jsem použil/a AI?`
            ] }
          ],
          quiz: [
            { q: "AI napsala e-mail, ty jsi ho odeslal/a a byla v něm chyba. Kdo za ni odpovídá?", o: ["AI", "Ty", "Nikdo"], a: 1, why: "Zodpovědnost při nasazení: co s výstupem uděláš, je tvoje." },
            { q: "Co patří do zodpovědnosti při tvorbě?", o: ["Vždy použít nejdražší model", "Volit vhodný nástroj a nezadávat data, ke kterým nemám oprávnění", "Psát co nejkratší prompty"], a: 1, why: "Volba nástroje a ochrana dat jsou základ zodpovědné tvorby." }
          ],
          cards: [
            { f: "Tři složky zodpovědnosti", b: "Při tvorbě (vhodný nástroj a data), transparentnost (přiznat AI), při nasazení (ručím za výsledek)." },
            { f: "Před odesláním výstupu AI", b: "Ověřená fakta, žádná cizí citlivá data, umím to obhájit, je jasné, že byla použita AI." }
          ],
          terms: [
            { t: "Transparentnost (4D)", d: "Otevřenost o tom, že a jak byla AI použita, tam kde na tom záleží." }
          ]
        }
      ]
    },
    {
      title: "Závěr",
      lessons: [
        {
          id: "fl-13",
          title: "Shrnutí kurzu",
          minutes: 3,
          lead: `Rámec 4D na jedné stránce a jak ho začít používat od zítřka.`,
          blocks: [
            { t: "table", head: ["D", "Otázka, kterou si kladu"], rows: [
              ["<b>Delegace</b>", "Co dělám sám, co s AI, co nechám AI? Umím výsledek zkontrolovat?"],
              ["<b>Popis</b>", "Řekl/a jsem, jaký má být výsledek, jak postupovat a jak se AI má chovat?"],
              ["<b>Rozlišování</b>", "Je to správně, úplné a vhodné? Dává postup smysl? Nebyla AI přehnaně jistá?"],
              ["<b>Zodpovědnost</b>", "Použil/a jsem správný nástroj a data? Jsem transparentní? Ručím za to?"]
            ] },
            { t: "h", x: "Jak začít" },
            { t: "ul", items: [
              `Vyber si <b>jeden opakující se úkol</b> a projdi ho čtyřmi D.`,
              `Piš zadání se třemi částmi: produkt, proces, chování.`,
              `Po každé odpovědi věnuj 30 sekund rozlišování, než ji použiješ.`,
              `Ulož si, co fungovalo.`
            ] },
            { t: "key", h: `AI zběhlost je zvyk, ne znalost. Vzniká opakováním na malých skutečných úkolech.` }
          ],
          quiz: [
            { q: "Které D odpovídá otázce „Umím výsledek zkontrolovat?“", o: ["Popis", "Delegace", "Zodpovědnost"], a: 1, why: "Delegace: neměl/a bys AI svěřit to, co neumíš zkontrolovat." }
          ],
          cards: [
            { f: "4D jednou větou", b: "Rozhodni, co delegovat; popiš produkt, proces a chování; kriticky posuď; ruč za výsledek." }
          ],
          terms: []
        },
        {
          id: "fl-14",
          title: "Závěrečný test kurzu",
          minutes: 4,
          lead: `Krátký test z celého kurzu. V originálu za něj dostaneš odznak; tady ho dostaneš dokončením všech lekcí.`,
          blocks: [
            { t: "p", h: `Odpověz na otázky níže. U každé je vysvětlení, takže je to zároveň opakování. Klidně se vrať k lekcím, na které narazíš.` }
          ],
          quiz: [
            { q: "Který způsob spolupráce popisuje „AI vede proces, ale obsah je můj“?", o: ["Automatizace", "Augmentace", "Agentnost"], a: 1, why: "Augmentace: AI rozšiřuje tvé myšlení, nevykonává úkol místo tebe." },
            { q: "Nejčastější chyba delegace je…", o: ["delegovat příliš málo", "svěřit AI to, co neumím zkontrolovat", "psát dlouhé prompty"], a: 1, why: "Bez schopnosti kontroly nemůžeš nést odpovědnost za výsledek." },
            { q: "Popis chování zahrnuje…", o: ["délku a formát výstupu", "roli, míru iniciativy a upřímnost AI", "pořadí kroků"], a: 1, why: "Chování = jak se AI má chovat. Formát je produkt, pořadí kroků proces." },
            { q: "Které tvrzení o rozlišování je správné?", o: ["Stačí zkontrolovat výsledek, postup je nedůležitý", "Posuzuji produkt, proces i chování AI", "Rozlišování dělá AI sama"], a: 1, why: "Chyba se často skrývá v postupu nebo v přehnané jistotě, ne jen ve výsledku." },
            { q: "Transparentnost znamená…", o: ["zveřejnit všechny své prompty", "být otevřený/á o použití AI tam, kde na tom záleží", "nepoužívat AI na důležité věci"], a: 1, why: "Transparentnost buduje důvěru; nejde o přiznání viny." },
            { q: "Smyčka Popis a Rozlišování obvykle trvá…", o: ["jedno kolo, prompt musí být dokonalý", "2 až 4 kola upřesňování", "nekonečně"], a: 1, why: "Několik krátkých kol je efektivnější než snaha o dokonalé první zadání." }
          ],
          cards: [],
          terms: []
        }
      ]
    }
  ]
});
