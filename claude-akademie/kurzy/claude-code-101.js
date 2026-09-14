/* Kurz: Claude Code 101 (podle academy.claude.com/courses/claude-code-101)
   Koncepčně, bez nutnosti instalace. Příkazy jsou ukázané, ne vyžadované. */
AKADEMIE.add({
  id: "claude-code-101",
  emoji: "💻",
  title: "Claude Code 101",
  category: "produkty",
  level: "Základy pro vývojáře i zvědavé",
  desc: "Co je programovací agent, jak funguje agentní smyčka, režimy oprávnění, workflow Prozkoumat → Naplánovat → Kódovat → Commitnout a přizpůsobení: CLAUDE.md, subagenti, skills, MCP, hooks.",
  source: "https://academy.claude.com/courses/claude-code-101",
  modules: [
    {
      title: "Co je Claude Code",
      lessons: [
        {
          id: "cc-01",
          title: "Co je Claude Code?",
          minutes: 4,
          lead: `Claude Code není chat o kódu. Je to agent, který v tvém projektu sám čte soubory, dělá změny, spouští příkazy a ověřuje výsledek.`,
          blocks: [
            { t: "h", x: "Chatovací asistent vs. programovací agent" },
            { t: "cmp",
              bad: { lbl: "Chat o kódu", h: `Vložíš kus kódu, dostaneš návrh opravy, zkopíruješ ho zpět, spustíš testy, vrátíš se s chybou…` },
              good: { lbl: "Claude Code", h: `Řekneš „oprav chybu v přihlašování“. Claude Code najde relevantní soubory, upraví je, spustí testy, opraví, co selhalo, a ukáže ti diff.` } },
            { t: "p", h: `Klíčový rozdíl: agent má <b>nástroje</b> (čtení a zápis souborů, spouštění příkazů, hledání v kódu, git) a <b>smyčku</b>, ve které je používá, dokud úkol není hotový.` },
            { t: "h", x: "Kde běží" },
            { t: "ul", items: [
              `V <b>terminálu</b> (příkaz <code>claude</code> ve složce projektu).`,
              `V editorech <b>VS Code</b> a <b>JetBrains</b> jako rozšíření.`,
              `V <b>aplikaci Claude</b> pro počítač (režim Code) a na <b>webu</b> (běží v cloudu nad tvým repozitářem na GitHubu).`
            ] },
            { t: "ex", title: "Ukázka: typické zadání", turns: [
              { who: "user", text: `Uživatelé hlásí, že po odhlášení zůstane v aplikaci jejich jméno v hlavičce. Najdi příčinu, oprav ji a přidej test, který to pokryje.` },
              { who: "ai", text: `Prohledal jsem komponenty hlavičky a logiku odhlášení. Příčina: po odhlášení se maže token, ale ne uživatel v globálním stavu (store/user.js, řádek 42). Přidal jsem vyčištění stavu a test „header is empty after logout“. Testy prošly (14/14). Chceš vidět diff, nebo mám rovnou vytvořit commit?` }
            ], note: `Claude Code <b>hledal, četl, měnil a ověřoval</b>. Ty ses díval/a na výsledek a rozhodoval/a o dalším kroku.` },
            { t: "info", h: `Tento kurz nevyžaduje instalaci. Vše je vysvětlené na ukázkách, abys chápal/a, co se děje, až Claude Code uvidíš v akci.` }
          ],
          quiz: [
            { q: "V čem se Claude Code liší od chatu o kódu?", o: ["Používá jiný model", "Má nástroje (soubory, příkazy, git) a smyčku, ve které sám pracuje až k výsledku", "Umí jen Python"], a: 1, why: "Agent jedná v projektu sám, chat jen radí." },
            { q: "Kde Claude Code běží?", o: ["Jen v terminálu", "V terminálu, editorech, desktopové aplikaci i na webu", "Jen na webu"], a: 1, why: "Více rozhraní, stejný agent." }
          ],
          cards: [
            { f: "Claude Code", b: "Programovací agent s nástroji (soubory, příkazy, git), který v projektu sám pracuje až k ověřenému výsledku." }
          ],
          terms: [
            { t: "Agent (AI)", d: "AI, která má nástroje a opakovaně je používá (čte, mění, spouští, ověřuje), dokud úkol není hotový." }
          ]
        },
        {
          id: "cc-02",
          title: "Jak Claude Code funguje: agentní smyčka",
          minutes: 5,
          lead: `Sebrat kontext, provést akci, ověřit výsledek. Opakovat. To je agentní smyčka a vysvětluje skoro všechno chování Claude Code.`,
          blocks: [
            { t: "steps", items: [
              `<b>Sebrat kontext</b>: přečíst zadání, prohledat kód, otevřít relevantní soubory, přečíst CLAUDE.md.`,
              `<b>Provést akci</b>: upravit soubor, vytvořit nový, spustit příkaz (testy, build, lint).`,
              `<b>Ověřit výsledek</b>: podívat se, co příkaz vrátil. Prošly testy? Kompiluje to? Pokud ne, zpět na krok 1 s novou informací.`
            ] },
            { t: "h", x: "Nástroje" },
            { t: "table", head: ["Nástroj", "Co dělá"], rows: [
              ["Read / Write / Edit", "Čtení a úpravy souborů"],
              ["Glob / Grep", "Hledání souborů a textu v projektu"],
              ["Bash", "Spouštění příkazů (testy, git, build)"],
              ["Web / MCP", "Přístup k dokumentaci nebo externím systémům, pokud jsou povolené"]
            ] },
            { t: "h", x: "Oprávnění" },
            { t: "p", h: `Každý nástroj, který něco <b>mění</b> (zápis souboru, příkaz), vyžaduje tvé svolení, pokud jsi to nenastavil/a jinak. Čtení je bezpečné a povolené. Díky tomu vidíš každou změnu dřív, než se stane.` },
            { t: "ex", title: "Ukázka: smyčka v akci", turns: [
              { who: "ai", label: "Krok 1: kontext", text: `Hledám, kde se generuje PDF faktura… Nalezeno: services/invoice.py. Čtu soubor a související test.` },
              { who: "ai", label: "Krok 2: akce", text: `Upravuji invoice.py: přidávám sloupec DPH. Mohu zapsat změnu do souboru? [Ano / Ne]` },
              { who: "ai", label: "Krok 3: ověření", text: `Spouštím pytest tests/test_invoice.py … 1 test selhal: očekávaný součet 1 210, dostal 1 000. Chybí DPH v součtu. Opravuji a spouštím znovu … 5/5 prošlo.` }
            ], note: `Agent si <b>sám všiml chyby</b> díky ověření a opravil ji. Bez kroku 3 by ti předal nefunkční kód. Proto je ověřování (testy, build) tak důležité: dává smyčce zpětnou vazbu.` },
            { t: "key", h: `Čím lepší ověření má projekt (testy, typová kontrola, lint), tím samostatnější a spolehlivější Claude Code je.` }
          ],
          quiz: [
            { q: "Jaké jsou tři fáze agentní smyčky?", o: ["Napsat, odeslat, čekat", "Sebrat kontext, provést akci, ověřit výsledek", "Plánovat, kódovat, odejít"], a: 1, why: "Smyčka se opakuje, dokud ověření neprojde." },
            { q: "Proč jsou testy pro Claude Code důležité?", o: ["Kvůli rychlosti", "Dávají smyčce zpětnou vazbu: agent si sám všimne chyby a opraví ji", "Nejsou důležité"], a: 1, why: "Ověření je to, co dělá agenta spolehlivým." }
          ],
          cards: [
            { f: "Agentní smyčka", b: "Sebrat kontext → provést akci → ověřit výsledek → opakovat." },
            { f: "Proč testy", b: "Ověření dává smyčce zpětnou vazbu; bez něj agent předá nefunkční kód." }
          ],
          terms: [
            { t: "Agentní smyčka", d: "Opakovaný cyklus: sebrat kontext, provést akci, ověřit výsledek." },
            { t: "Oprávnění (Claude Code)", d: "Souhlas uživatele s akcemi, které něco mění (zápis souborů, příkazy). Čtení je povolené vždy." }
          ]
        }
      ]
    },
    {
      title: "První zadání",
      lessons: [
        {
          id: "cc-03",
          title: "Instalace a spuštění (přehled)",
          minutes: 3,
          lead: `Jak se Claude Code dostane do projektu. Jen přehled, ať víš, co očekávat; nic nemusíš instalovat.`,
          blocks: [
            { t: "table", head: ["Kde", "Jak"], rows: [
              ["Terminál", "Nainstaluješ balíček Claude Code, ve složce projektu napíšeš <code>claude</code>, přihlásíš se účtem Claude."],
              ["VS Code / JetBrains", "Rozšíření z marketplace; Claude Code se otevře v panelu editoru a vidí otevřené soubory."],
              ["Aplikace Claude (desktop)", "Záložka Code: vybereš složku projektu a začneš zadávat."],
              ["Web (claude.ai/code)", "Připojíš repozitář z GitHubu; Claude Code běží v cloudu a výsledek pošle jako větev nebo pull request."]
            ] },
            { t: "h", x: "První spuštění" },
            { t: "ul", items: [
              `Claude Code se zeptá, zda složce důvěřuješ (bezpečnostní pojistka).`,
              `Pomůže vytvořit soubor <code>CLAUDE.md</code> příkazem <code>/init</code> (o něm později).`,
              `Pak čeká na zadání jako v chatu, jen se zprávy píší v terminálu nebo panelu.`
            ] },
            { t: "ex", title: "Ukázka: první minuta v terminálu", turns: [
              { who: "user", mono: true, text: `$ cd ~/projekty/eshop
$ claude
› Vysvětli mi, jak je tenhle projekt strukturovaný, a kde je logika košíku.` },
              { who: "ai", text: `Projekt je Next.js aplikace. Struktura: app/ (stránky), components/ (UI), lib/ (logika), prisma/ (databáze). Logika košíku je v lib/cart.ts (přidání, odebrání, přepočet) a stav drží components/CartProvider.tsx. Chceš schéma s hlavními závislostmi?` }
            ], note: `Dobrá první otázka je <b>„vysvětli mi projekt“</b>. Nic se nemění a hned vidíš, jak Claude Code hledá a čte.` }
          ],
          quiz: [
            { q: "Jaká je bezpečná první úloha pro Claude Code v novém projektu?", o: ["Přepiš celou aplikaci", "Vysvětli mi strukturu projektu", "Smaž staré soubory"], a: 1, why: "Čtení nic nemění a ukáže, jak agent pracuje." },
            { q: "Co dělá webová verze Claude Code?", o: ["Běží v prohlížeči nad tvým lokálním diskem", "Běží v cloudu nad repozitářem z GitHubu a výsledek pošle jako větev nebo PR", "Jen zobrazuje dokumentaci"], a: 1, why: "Cloudová verze pracuje nad repozitářem bez lokální instalace." }
          ],
          cards: [
            { f: "První otázka v novém projektu", b: "„Vysvětli mi, jak je projekt strukturovaný.“ Bezpečné a poučné." }
          ],
          terms: [
            { t: "/init", d: "Příkaz Claude Code, který prozkoumá projekt a vytvoří výchozí soubor CLAUDE.md." }
          ]
        },
        {
          id: "cc-04",
          title: "První zadání a režimy oprávnění",
          minutes: 5,
          lead: `Kolik dohledu chceš? Claude Code nabízí režimy od „ptej se na všechno“ přes „schvaluj úpravy automaticky“ po „nejdřív naplánuj, nic neměň“.`,
          blocks: [
            { t: "table", head: ["Režim", "Chování", "Kdy"], rows: [
              ["<b>Výchozí (schvalování)</b>", "Před každou změnou souboru nebo příkazem se zeptá", "Nový projekt, citlivý kód, učíš se"],
              ["<b>Auto-accept úprav</b>", "Úpravy souborů schválí sám, na příkazy se stále ptá", "Známý úkol, důvěřuješ směru, chceš rychlost"],
              ["<b>Plánovací režim (Plan)</b>", "Jen čte a přemýšlí; navrhne plán, nic nemění, dokud plán neschválíš", "Větší změny, nejasné zadání, chceš vidět záměr předem"]
            ] },
            { t: "p", h: `Režimy se přepínají klávesovou zkratkou (typicky Shift+Tab) nebo příkazem. Nemusíš si je pamatovat, Claude Code je zobrazí.` },
            { t: "ex", title: "Ukázka: plánovací režim", turns: [
              { who: "user", text: `(Plan mode) Chci přidat přihlášení přes Google. Navrhni, jak to udělat v tomto projektu.` },
              { who: "ai", text: `Plán:\n1. Přidat závislost next-auth a Google provider.\n2. Nová route app/api/auth/[...nextauth]/route.ts s konfigurací.\n3. Proměnné GOOGLE_CLIENT_ID a SECRET do .env.example (ne do repozitáře).\n4. Tlačítko „Přihlásit přes Google“ do components/Header.tsx.\n5. Test přihlašovacího toku.\nRizika: existující session logika v lib/session.ts bude potřeba sjednotit. Mám pokračovat podle plánu?` },
              { who: "user", text: `Ano, ale bod 5 udělej jako první (test nejdřív).` }
            ], note: `V plánovacím režimu <b>vidíš záměr dřív, než se cokoli změní</b>. Můžeš plán upravit. Pak režim přepneš a Claude Code plán provede.` },
            { t: "tip", h: `Zvyk, který se vyplatí: složité věci nejdřív v Plan režimu, jednoduché rovnou. Ušetří to zbytečné přepisování.` }
          ],
          quiz: [
            { q: "Co dělá plánovací režim?", o: ["Provede změny rychleji", "Jen čte a navrhne plán; nic nemění, dokud plán neschválíš", "Vypne testy"], a: 1, why: "Plan mode odděluje záměr od provedení." },
            { q: "Kdy je vhodný výchozí režim se schvalováním?", o: ["Když chceš maximální rychlost", "V novém nebo citlivém projektu, kde chceš vidět každou změnu", "Nikdy"], a: 1, why: "Dohled nad každou změnou je vhodný tam, kde se učíš nebo kde je kód citlivý." }
          ],
          cards: [
            { f: "Tři režimy oprávnění", b: "Výchozí (ptá se na změny), auto-accept úprav (schvaluje úpravy sám), plánovací (jen čte a navrhuje)." },
            { f: "Kdy Plan mode", b: "Větší nebo nejasné změny: nejdřív plán, pak provedení." }
          ],
          terms: [
            { t: "Plánovací režim (Plan mode)", d: "Režim Claude Code, ve kterém agent pouze čte a navrhne plán; změny provede až po schválení." },
            { t: "Auto-accept", d: "Režim, ve kterém Claude Code schvaluje úpravy souborů automaticky, na spouštění příkazů se dál ptá." }
          ]
        }
      ]
    },
    {
      title: "Každodenní práce",
      lessons: [
        {
          id: "cc-05",
          title: "Workflow: Prozkoumat → Naplánovat → Kódovat → Commitnout",
          minutes: 5,
          lead: `Opakovatelný rytmus pro každou úlohu. Dělí práci na fáze, ve kterých se dobře kontroluje.`,
          blocks: [
            { t: "steps", items: [
              `<b>Prozkoumat</b>: „Přečti soubory související s exportem do CSV a vysvětli, jak to funguje. Zatím nic neměň.“ Claude Code sebere kontext, ty pochopíš situaci.`,
              `<b>Naplánovat</b>: „Navrhni plán, jak přidat export do Excelu. Zvaž existující strukturu.“ Ideálně v Plan režimu. Plán upravíš.`,
              `<b>Kódovat</b>: „Proveď plán. Po každém kroku spusť testy.“ Claude Code mění a ověřuje.`,
              `<b>Commitnout</b>: „Vytvoř commit s popisem změn“ nebo „otevři pull request“. Claude Code napíše zprávu commitu z toho, co udělal.`
            ] },
            { t: "h", x: "Proč to funguje" },
            { t: "ul", items: [
              `Oddělení <b>porozumění</b> od <b>změn</b> zabraňuje tomu, aby agent začal měnit něco, čemu nerozumí.`,
              `Plán je <b>kontrolní bod</b>, kde levně opravíš směr.`,
              `Malé commity = snadná revize a snadný návrat.`
            ] },
            { t: "ex", title: "Ukázka: celý cyklus na malé úloze", turns: [
              { who: "user", label: "Prozkoumat", text: `Jak se teď v aplikaci validuje e-mail při registraci? Nic neměň.` },
              { who: "ai", text: `Validace je jen na frontendu (RegisterForm.tsx, regulární výraz). Backend (api/register.ts) e-mail nekontroluje.` },
              { who: "user", label: "Naplánovat", text: `Navrhni, jak přidat validaci i na backend a sjednotit ji s frontendem.` },
              { who: "ai", text: `Plán: 1) sdílená funkce isValidEmail v lib/validation.ts, 2) použít ji v obou místech, 3) backend vrátí 400 s hláškou, 4) testy pro obě strany.` },
              { who: "user", label: "Kódovat", text: `Proveď plán, po každém kroku spusť testy.` },
              { who: "ai", text: `Hotovo, 4 kroky, testy 22/22.` },
              { who: "user", label: "Commitnout", text: `Vytvoř commit.` },
              { who: "ai", text: `Commit „Sjednocení validace e-mailu mezi frontendem a backendem“ vytvořen (3 soubory).` }
            ], note: `Čtyři krátké zprávy, každá s jasnou fází. Přesně tohle je ten rytmus.` }
          ],
          quiz: [
            { q: "Proč oddělit fázi „prozkoumat“ od „kódovat“?", o: ["Kvůli formalitě", "Aby agent neměnil kód, kterému nerozumí, a ty jsi pochopil/a situaci", "Protože to vyžaduje git"], a: 1, why: "Porozumění před změnou snižuje chyby a přepisování." },
            { q: "Co je v tomto workflow hlavní kontrolní bod?", o: ["Commit", "Plán", "Instalace"], a: 1, why: "Plán je místo, kde levně opravíš směr před změnami." }
          ],
          cards: [
            { f: "Workflow Claude Code", b: "Prozkoumat (jen čti) → Naplánovat (plán, schválit) → Kódovat (proveď a ověřuj) → Commitnout." }
          ],
          terms: [
            { t: "Commit", d: "Uložený balíček změn v gitu s popisem. Claude Code ho umí vytvořit včetně popisu." }
          ]
        },
        {
          id: "cc-06",
          title: "Správa kontextu",
          minutes: 4,
          lead: `Claude Code má, stejně jako chat, omezenou pracovní paměť. Dlouhá sezení ji zaplní. Tři příkazy to řeší.`,
          blocks: [
            { t: "table", head: ["Příkaz", "Co dělá", "Kdy"], rows: [
              ["<code>/context</code>", "Ukáže, kolik kontextu je využito a čím", "Když chceš vědět, jak na tom jsi"],
              ["<code>/compact</code>", "Shrne dosavadní rozhovor a uvolní místo; podstatné zůstane", "Uprostřed delší úlohy, když se kontext plní"],
              ["<code>/clear</code>", "Vymaže rozhovor úplně, začíná se s čistým kontextem", "Nová, nesouvisející úloha"]
            ] },
            { t: "h", x: "Zásady" },
            { t: "ul", items: [
              `<b>Jedna úloha, jedno sezení.</b> Po dokončení a commitu <code>/clear</code>.`,
              `<b>Neplýtvej kontextem.</b> „Přečti všechny soubory v projektu“ zaplní paměť zbytečnostmi. Nech agenta hledat cíleně.`,
              `<b>Trvalé věci do CLAUDE.md.</b> Co má agent vědět vždy, nepatří do chatu, ale do souboru (další lekce).`
            ] },
            { t: "ex", title: "Ukázka: kompakce s pokynem", turns: [
              { who: "user", mono: true, text: `/compact Zachovej seznam změněných souborů a rozhodnutí o struktuře API.` },
              { who: "ai", text: `Kontext shrnut. Zachováno: 6 změněných souborů, rozhodnutí použít REST místo GraphQL, otevřený úkol: test pro endpoint /orders.` }
            ], note: `Za <code>/compact</code> můžeš napsat, co má shrnutí zachovat. Claude Code kompaktuje automaticky, když se blíží limitu, ale ruční kompakce v logickém bodě je kvalitnější.` }
          ],
          quiz: [
            { q: "Který příkaz použiješ, když začínáš úplně jinou úlohu?", o: ["/compact", "/clear", "/context"], a: 1, why: "/clear začne s čistým kontextem; /compact zachová shrnutí, což u nesouvisející úlohy není potřeba." },
            { q: "Proč nezadávat „přečti všechny soubory v projektu“?", o: ["Trvá to dlouho", "Zaplní to kontext zbytečnostmi a zhorší další práci", "Není to možné"], a: 1, why: "Kontext je omezený; cílené hledání je efektivnější." }
          ],
          cards: [
            { f: "/compact vs. /clear", b: "/compact shrne a uvolní místo (pokračuješ v úloze); /clear smaže vše (nová úloha)." }
          ],
          terms: [
            { t: "/compact", d: "Příkaz Claude Code, který shrne dosavadní rozhovor a uvolní kontext; lze upřesnit, co zachovat." },
            { t: "/clear", d: "Příkaz Claude Code, který vymaže rozhovor a začne s čistým kontextem." }
          ]
        },
        {
          id: "cc-07",
          title: "Revize kódu",
          minutes: 4,
          lead: `Claude Code ti dá kód rychle. Tvoje role se posouvá od psaní k revizi. Jak revidovat, abys nepřijímal/a chyby jen proto, že testy prošly.`,
          blocks: [
            { t: "h", x: "Co revidovat" },
            { t: "ol", items: [
              `<b>Diff</b>: projdi každou změnu. Odpovídá tomu, co jsi chtěl/a? Neudělal agent „vylepšení navíc“?`,
              `<b>Testy</b>: testují skutečně chování, nebo jen to, že funkce vrací něco? Nezměnil agent test tak, aby prošel?`,
              `<b>Okraje</b>: prázdný vstup, chyby sítě, oprávnění. Zeptej se: „Jaké okrajové případy jsi nepokryl?“`,
              `<b>Bezpečnost</b>: tajné klíče v kódu, SQL injekce, nevalidované vstupy.`
            ] },
            { t: "h", x: "Nech Claude Code revidovat sám sebe" },
            { t: "ex", title: "Ukázka: revize s odstupem", turns: [
              { who: "user", text: `Projdi svůj diff jako přísný reviewer. Hledej chyby, bezpečnostní problémy a nekonzistence se zbytkem projektu. Nic neopravuj, jen vypiš nálezy s řádky.` },
              { who: "ai", text: `Nálezy:\n1. api/orders.ts:31, chybí kontrola, že uživatel vlastní objednávku (jiný uživatel může číst cizí data). Závažné.\n2. lib/format.ts:12, funkce duplikuje existující formatPrice v utils/. Sjednotit.\n3. test_orders.ts, test „vrací objednávky“ nekontroluje obsah, jen délku pole. Slabý test.` },
              { who: "user", text: `Oprav 1 a 3, u 2 použij existující funkci.` }
            ], note: `Oddělení „najdi“ a „oprav“ do dvou kroků dává lepší revizi než „zkontroluj a oprav“ najednou. Samorevize nenahrazuje tvou, ale výrazně ji zrychlí.` },
            { t: "warn", h: `Testy prošly ≠ hotovo. Agent mohl test přizpůsobit kódu. Podívej se, co testy skutečně ověřují.` }
          ],
          quiz: [
            { q: "Proč nestačí, že testy prošly?", o: ["Testy nikdy nic neověřují", "Agent mohl test upravit nebo test ověřuje málo; obsah testu je třeba přečíst", "Testy jsou pomalé"], a: 1, why: "Revize obsahu testů je součást revize kódu." },
            { q: "Jak nejlépe využít Claude Code k revizi jeho vlastní práce?", o: ["„Zkontroluj a oprav vše“ najednou", "Nejdřív „najdi a vypiš nálezy“, pak zvlášť rozhodnout, co opravit", "Nepoužívat ho k revizi"], a: 1, why: "Oddělení hledání od oprav dává kvalitnější revizi a ponechává rozhodnutí tobě." }
          ],
          cards: [
            { f: "Čtyři body revize", b: "Diff (jen to, co jsem chtěl), testy (co skutečně ověřují), okraje, bezpečnost." },
            { f: "Samorevize agenta", b: "„Projdi svůj diff jako přísný reviewer, jen vypiš nálezy.“ Opravy až v druhém kroku." }
          ],
          terms: [
            { t: "Diff", d: "Přehled řádků, které se změnily (přidané, odebrané). Základ revize kódu." }
          ]
        }
      ]
    },
    {
      title: "Přizpůsobení Claude Code",
      lessons: [
        {
          id: "cc-08",
          title: "Soubor CLAUDE.md",
          minutes: 5,
          lead: `CLAUDE.md je paměť projektu. Claude Code ho načte na začátku každého sezení. Co je v něm, nemusíš opakovat.`,
          blocks: [
            { t: "h", x: "Co do něj patří" },
            { t: "ul", items: [
              `Jak projekt spustit a otestovat (příkazy).`,
              `Struktura a konvence: kde co je, jak pojmenováváte, jaký styl kódu.`,
              `Pravidla: „nikdy neměň soubory v migrations/“, „commity česky“, „před commitem spusť lint“.`,
              `Časté pasti: „testy vyžadují běžící databázi, spusť docker compose up“.`
            ] },
            { t: "h", x: "Co do něj nepatří" },
            { t: "ul", items: [
              `Dlouhé popisy všeho. Krátký a konkrétní soubor má větší váhu než román (viz řiditelnost).`,
              `Věci, které se mění každý den (ty patří do zadání).`,
              `Tajné klíče a hesla.`
            ] },
            { t: "ex", title: "Ukázka: dobrý CLAUDE.md", turns: [
              { who: "sys", mono: true, text: `# E-shop (Next.js + Prisma)

## Příkazy
- npm run dev, vývojový server
- npm test, testy (vyžaduje docker compose up -d db)
- npm run lint, před každým commitem

## Struktura
- app/ stránky, components/ UI, lib/ logika, prisma/ schéma

## Pravidla
- Nikdy neupravuj prisma/migrations ručně; použij prisma migrate.
- Ceny vždy v haléřích jako integer, formátuj přes lib/format.ts.
- Commit zprávy česky, v přítomném čase.
- Nové komponenty mají test v tests/components/.` }
            ], note: `Krátké, konkrétní, ověřitelné. Každý řádek šetří budoucí chybu nebo dotaz.` },
            { t: "h", x: "Úrovně" },
            { t: "p", h: `CLAUDE.md může být v kořeni projektu (sdílený v repozitáři), v podsložkách (pravidla pro část projektu) i v domovské složce uživatele (tvoje osobní preference pro všechny projekty).` },
            { t: "tip", h: `Když Claude Code něco udělá špatně a ty ho opravíš, zeptej se: „Mám to přidat do CLAUDE.md, aby se to neopakovalo?“ Soubor tak roste z reálných chyb.` }
          ],
          quiz: [
            { q: "Co je CLAUDE.md?", o: ["Log rozhovorů", "Soubor s trvalými pokyny a fakty o projektu, který Claude Code načte v každém sezení", "Konfigurace modelu"], a: 1, why: "Paměť projektu napříč sezeními." },
            { q: "Jaký CLAUDE.md funguje nejlépe?", o: ["Co nejdelší, popisující vše", "Krátký a konkrétní: příkazy, konvence, pravidla, pasti", "Prázdný"], a: 1, why: "Konkrétní a stručné pokyny mají větší váhu (řiditelnost)." }
          ],
          cards: [
            { f: "CLAUDE.md", b: "Paměť projektu: příkazy, struktura, pravidla a pasti. Krátký, konkrétní, načítá se každé sezení." },
            { f: "Jak CLAUDE.md růst", b: "Z reálných chyb: po každé opravě zvaž, zda pravidlo přidat." }
          ],
          terms: [
            { t: "CLAUDE.md", d: "Soubor s trvalými pokyny pro Claude Code (příkazy, konvence, pravidla), načítaný na začátku každého sezení." }
          ]
        },
        {
          id: "cc-09",
          title: "Subagenti",
          minutes: 4,
          lead: `Subagent je pomocník s vlastním čistým kontextem, kterému hlavní agent deleguje dílčí úkol. Výsledek se vrátí shrnutý, hlavní kontext zůstane čistý.`,
          blocks: [
            { t: "h", x: "Proč subagenti" },
            { t: "ul", items: [
              `<b>Čistý kontext</b>: průzkum 50 souborů zaplní paměť; subagent to udělá a vrátí jen závěr.`,
              `<b>Specializace</b>: subagent „reviewer“ s vlastními instrukcemi, subagent „tester“, subagent „dokumentátor“.`,
              `<b>Paralelnost</b>: více subagentů může pracovat najednou na nezávislých částech.`
            ] },
            { t: "ex", title: "Ukázka: delegace průzkumu", turns: [
              { who: "user", text: `Zjisti, kde všude v projektu pracujeme s datem a časem, a jestli konzistentně používáme časové pásmo. Použij subagenta pro průzkum.` },
              { who: "ai", text: `Spouštím subagenta Explore… Výsledek: 14 míst, z toho 11 používá UTC přes lib/time.ts, 3 místa (reports/monthly.ts, jobs/cleanup.ts, api/export.ts) používají lokální čas přes new Date() bez převodu. Doporučení: sjednotit přes lib/time.ts. Chceš, abych to opravil?` }
            ], note: `Subagent přečetl desítky souborů, ale do hlavního rozhovoru se vrátil jen tenhle odstavec. Hlavní kontext zůstal volný pro opravu.` },
            { t: "h", x: "Vlastní subagenti" },
            { t: "p", h: `Vytvoříš je příkazem <code>/agents</code> nebo souborem v <code>.claude/agents/</code>: název, popis (kdy ho použít), instrukce a povolené nástroje. Podrobně v kurzu „Úvod do subagentů“.` }
          ],
          quiz: [
            { q: "Hlavní přínos subagenta je…", o: ["rychlejší model", "dílčí úkol proběhne v odděleném kontextu a vrátí se jen shrnutí", "levnější provoz"], a: 1, why: "Čistý hlavní kontext a možnost specializace." },
            { q: "Který úkol se hodí na subagenta?", o: ["Krátká oprava překlepu", "Průzkum desítek souborů s otázkou, kde se něco používá", "Odpověď na otázku „co je git“"], a: 1, why: "Objemný průzkum by zaplnil hlavní kontext; subagent vrátí jen závěr." }
          ],
          cards: [
            { f: "Subagent", b: "Pomocný agent s vlastním čistým kontextem a instrukcemi; dostane dílčí úkol a vrátí shrnutí." }
          ],
          terms: [
            { t: "Subagent", d: "Samostatný agent s vlastním kontextem, kterému hlavní agent deleguje dílčí úkol; vrátí jen výsledek." }
          ]
        },
        {
          id: "cc-10",
          title: "Skills v Claude Code",
          minutes: 3,
          lead: `Skill je uložený postup, který Claude Code použije automaticky u odpovídajícího úkolu, nebo který spustíš příkazem s lomítkem.`,
          blocks: [
            { t: "p", h: `Skill žije ve složce <code>.claude/skills/nazev/SKILL.md</code>. Má hlavičku (název, popis) a tělo (postup, případně odkazy na šablony či skripty ve stejné složce). Claude Code popis porovná se zadáním a skill si sám načte. Můžeš ho i vyvolat přímo: <code>/nazev</code>.` },
            { t: "ex", title: "Ukázka: skill pro vydání verze", turns: [
              { who: "sys", mono: true, text: `---
name: vydani
description: Připraví novou verzi aplikace: changelog, verze v package.json, tag. Použij, když uživatel chce vydat/releasnout verzi.
---
1. Přečti commity od posledního tagu (git log).
2. Sepiš CHANGELOG.md: Přidáno / Změněno / Opraveno, česky.
3. Zvyš verzi v package.json (patch, pokud uživatel neřekne jinak).
4. Vytvoř commit "Verze X.Y.Z" a tag vX.Y.Z.
5. Nepushuj bez výslovného souhlasu.` },
              { who: "user", text: `Vydej novou verzi.` },
              { who: "ai", text: `Používám skill „vydani“. Od tagu v1.4.2 je 9 commitů. Changelog připraven, verze 1.4.3, commit a tag vytvořeny. Push neprovádím, řekni, až budu mít.` }
            ], note: `Postup, který by jinak vyžadoval pět zpráv a pokaždé trochu jiný výsledek, je teď jedna věta a stejný výsledek.` },
            { t: "info", h: `Skills vs. CLAUDE.md: CLAUDE.md platí vždy (pravidla projektu), skill se načte jen když se hodí (postupy). Podrobně v kurzu „Úvod do agent skills“.` }
          ],
          quiz: [
            { q: "Kdy se skill načte?", o: ["Vždy, v každém sezení", "Když jeho popis odpovídá zadání, nebo když ho vyvoláš příkazem", "Jen po restartu"], a: 1, why: "Skills jsou na vyžádání, CLAUDE.md platí vždy." }
          ],
          cards: [
            { f: "Skill vs. CLAUDE.md", b: "CLAUDE.md platí vždy (pravidla); skill se načte, jen když se hodí (postup)." }
          ],
          terms: []
        },
        {
          id: "cc-11",
          title: "MCP v Claude Code",
          minutes: 4,
          lead: `MCP (Model Context Protocol) připojí Claude Code k externím systémům: databázi, GitHubu, Jira, Slacku, dokumentaci. Agent tak nevidí jen soubory, ale i svět kolem projektu.`,
          blocks: [
            { t: "h", x: "Jak to vypadá" },
            { t: "ul", items: [
              `<b>MCP server</b> je malý program, který zpřístupňuje nástroje (např. „vyhledej issue“, „spusť SQL dotaz“).`,
              `Claude Code je <b>MCP klient</b>: servery připojíš příkazem <code>claude mcp add</code> nebo v konfiguraci projektu.`,
              `Připojené nástroje se objeví vedle vestavěných. Agent je používá, když se hodí, se stejným systémem oprávnění.`
            ] },
            { t: "ex", title: "Ukázka: GitHub přes MCP", turns: [
              { who: "user", text: `Podívej se na issue #142 na GitHubu, oprav ji a otevři pull request, který na ni odkazuje.` },
              { who: "ai", text: `Issue #142: „Filtr podle data ignoruje časové pásmo“. Reprodukoval jsem chybu v lib/filters.ts, opravil převod na UTC a přidal test. Pull request #143 otevřen s odkazem „Fixes #142“.` }
            ], note: `Bez MCP bys musel/a issue zkopírovat a PR založit ručně. S MCP je to jedna zpráva.` },
            { t: "warn", h: `MCP server může číst i měnit data v připojeném systému. Připojuj jen důvěryhodné servery a rozumným oprávněním. Podrobně v kurzu „Úvod do MCP“.` }
          ],
          quiz: [
            { q: "Co MCP umožní Claude Code?", o: ["Rychlejší psaní kódu", "Používat nástroje externích systémů (GitHub, databáze, Jira) přímo z agenta", "Změnit model"], a: 1, why: "MCP rozšiřuje sadu nástrojů o externí systémy." }
          ],
          cards: [
            { f: "MCP v Claude Code", b: "Připojení externích systémů jako nástrojů agenta; Claude Code je klient, server nástroje poskytuje." }
          ],
          terms: [
            { t: "MCP server", d: "Program, který přes Model Context Protocol zpřístupňuje nástroje, data nebo prompty klientovi (např. Claude Code)." }
          ]
        },
        {
          id: "cc-12",
          title: "Hooks: deterministické pojistky",
          minutes: 4,
          lead: `Hook je příkaz, který se spustí automaticky při určité události (před nástrojem, po nástroji, při ukončení). Na rozdíl od instrukcí v CLAUDE.md se provede vždy, bez ohledu na to, co si agent myslí.`,
          blocks: [
            { t: "h", x: "Instrukce vs. hook" },
            { t: "cmp",
              bad: { lbl: "Instrukce (pravděpodobnostní)", h: `V CLAUDE.md: „Před každým commitem spusť lint.“ Agent to většinou udělá. Většinou.` },
              good: { lbl: "Hook (deterministický)", h: `Hook před nástrojem Bash s příkazem git commit spustí lint a při chybě commit zablokuje. Vždy.` } },
            { t: "h", x: "Typické použití" },
            { t: "ul", items: [
              `Automatické formátování souboru po každé úpravě.`,
              `Blokování nebezpečných příkazů (např. mazání mimo projekt).`,
              `Notifikace, když agent čeká na tvé schválení.`,
              `Logování všech spuštěných příkazů pro audit.`
            ] },
            { t: "ex", title: "Ukázka: hook na formátování", turns: [
              { who: "sys", mono: true, text: `// .claude/settings.json (zjednodušeno)
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "npx prettier --write \"$FILE\"" }]
    }]
  }
}` }
            ], note: `Po každé úpravě souboru se spustí formátovač. Agent nemusí na formát myslet a výsledek je vždy konzistentní. Přesná syntaxe se může lišit podle verze; smysl je stejný.` },
            { t: "key", h: `Pravidlo palce: co <b>musí</b> platit vždy, dej do hooku. Co <b>má</b> platit obvykle, dej do CLAUDE.md.` }
          ],
          quiz: [
            { q: "V čem se hook liší od instrukce v CLAUDE.md?", o: ["Je napsaný česky", "Provede se vždy, deterministicky, nezávisle na rozhodnutí agenta", "Je rychlejší"], a: 1, why: "Instrukce jsou pravděpodobnostní, hook je jistý." },
            { q: "Co patří do hooku?", o: ["Preferovaný styl komentářů", "Formátování po každé úpravě a blokování nebezpečných příkazů", "Popis struktury projektu"], a: 1, why: "Věci, které musí platit vždy." }
          ],
          cards: [
            { f: "Hook", b: "Příkaz spuštěný automaticky při události (před/po nástroji). Deterministický: provede se vždy." },
            { f: "Hook vs. CLAUDE.md", b: "Musí platit vždy → hook. Má platit obvykle → CLAUDE.md." }
          ],
          terms: [
            { t: "Hook (Claude Code)", d: "Automaticky spouštěný příkaz při určité události v Claude Code, například po úpravě souboru." }
          ]
        }
      ]
    }
  ]
});
