/* Kurz: Úvod do agent skills (podle academy.claude.com/courses/introduction-to-agent-skills) */
AKADEMIE.add({
  id: "skills",
  emoji: "🧩",
  title: "Úvod do agent skills",
  category: "produkty",
  level: "Mírně pokročilý",
  desc: "Skills jako opakovaně použitelné instrukce v Markdownu: jak je psát, konfigurovat, sdílet a ladit. A jak se liší od CLAUDE.md, subagentů, hooks a MCP.",
  source: "https://academy.claude.com/courses/introduction-to-agent-skills",
  modules: [
    {
      title: "Skills",
      lessons: [
        {
          id: "sk-01",
          title: "Co jsou skills",
          minutes: 4,
          lead: `Skill je složka s Markdown souborem instrukcí, kterou Claude automaticky použije, když zadání odpovídá jejímu popisu. Jednou napíšeš, pokaždé stejně.`,
          blocks: [
            { t: "h", x: "Kde skills žijí" },
            { t: "table", head: ["Umístění", "Platí pro"], rows: [
              ["<code>.claude/skills/nazev/SKILL.md</code> v projektu", "Tento projekt; sdílené přes repozitář"],
              ["<code>~/.claude/skills/nazev/SKILL.md</code>", "Všechny tvoje projekty (osobní)"],
              ["Plugin", "Kdo plugin nainstaluje"],
              ["Vestavěné", "Všichni (např. tvorba dokumentů Word, Excel, PDF)"]
            ] },
            { t: "h", x: "Jak Claude pozná, že skill použít" },
            { t: "p", h: `Při startu Claude načte jen <b>názvy a popisy</b> všech skills (levné, málo kontextu). Když přijde zadání, porovná ho s popisy. Když se shodují, načte celé tělo skillu a řídí se jím. Tomu se říká <b>postupné odkrývání</b> (progressive disclosure): detail se načte, až když je potřeba.` },
            { t: "ex", title: "Ukázka: minimální skill", turns: [
              { who: "sys", mono: true, text: `.claude/skills/commit-cesky/SKILL.md
---
name: commit-cesky
description: Píše zprávy commitů česky v pevném formátu. Použij při vytváření commitu v tomto projektu.
---
Formát zprávy commitu:
- první řádek: sloveso v přítomném čase + co (max 60 znaků), např. "Přidává export do CSV"
- prázdný řádek
- 1 až 3 odrážky: proč a co se mění pro uživatele
Nepiš "WIP", "fix", "update".` },
              { who: "user", text: `Vytvoř commit.` },
              { who: "ai", text: `(načte skill commit-cesky)\nCommit: „Sjednocuje validaci e-mailu“\n• Backend nově vrací 400 při neplatném e-mailu\n• Frontend používá stejnou funkci jako backend` }
            ], note: `Uživatel nic o formátu neřekl. Popis skillu se shodoval se zadáním „vytvoř commit“, tělo skillu určilo formát.` }
          ],
          quiz: [
            { q: "Co Claude načte při startu ze všech skills?", o: ["Celé texty", "Jen názvy a popisy; tělo až při shodě se zadáním", "Nic"], a: 1, why: "Postupné odkrývání šetří kontext." },
            { q: "Co rozhoduje o tom, zda se skill použije?", o: ["Délka těla", "Shoda popisu skillu se zadáním", "Datum vytvoření"], a: 1, why: "Popis je spouštěč." }
          ],
          cards: [
            { f: "Skill", b: "Složka se SKILL.md (název, popis, instrukce), kterou Claude načte a použije, když zadání odpovídá popisu." },
            { f: "Postupné odkrývání", b: "Při startu jen názvy a popisy; celé tělo skillu až při shodě se zadáním." }
          ],
          terms: [
            { t: "Postupné odkrývání (progressive disclosure)", d: "Princip, kdy Claude načte detail (tělo skillu, další soubory) až ve chvíli, kdy je potřeba, aby šetřil kontext." }
          ]
        },
        {
          id: "sk-02",
          title: "Tvorba prvního skillu",
          minutes: 5,
          lead: `Struktura souboru SKILL.md, co patří do hlavičky a jak ověřit, že skill funguje.`,
          blocks: [
            { t: "h", x: "Hlavička (frontmatter)" },
            { t: "ul", items: [
              `<code>name</code>: krátký identifikátor, malá písmena a pomlčky. Stejný jako název složky.`,
              `<code>description</code>: jedna až dvě věty: <b>co skill dělá a kdy ho použít</b>. Nejdůležitější řádek celého skillu.`,
              `Volitelně další pole (povolené nástroje, argumenty), o nich v další lekci.`
            ] },
            { t: "h", x: "Tělo" },
            { t: "ul", items: [
              `Postup v krocích. Konkrétní, ověřitelný.`,
              `Formát výstupu (šablona, příklad).`,
              `Co dělat při chybějících datech nebo chybě.`,
              `Čemu se vyhnout.`
            ] },
            { t: "ex", title: "Ukázka: skill „týdenní report“ krok za krokem", turns: [
              { who: "sys", mono: true, text: `---
name: tydenni-report
description: Sestaví týdenní report z commitů a uzavřených issues. Použij, když uživatel chce týdenní report, shrnutí týdne nebo weekly.
---
## Postup
1. Získej commity za posledních 7 dní: git log --since="7 days ago" --oneline
2. Získej uzavřené issues za 7 dní (nástroj GitHub, pokud je k dispozici; jinak přeskoč a poznamenej).
3. Roztřiď do sekcí: Nové funkce / Opravy / Ostatní.
4. Napiš report podle šablony níže. Česky, max 200 slov.

## Šablona
# Týdenní report (DATUM OD, DATUM DO)
## Nové funkce
- ...
## Opravy
- ...
## Ostatní
- ...
## Příští týden
- (doplní uživatel)

## Pravidla
- Nevymýšlej položky; pokud commit není jasný, uveď ho v Ostatní s otazníkem.
- Report ulož jako reports/tyden-YYYY-MM-DD.md.` }
            ], note: `Postup, šablona, pravidla. Když skill takhle strukturuješ, Claude ho čte stejně snadno jako člověk.` },
            { t: "h", x: "Ověření" },
            { t: "steps", items: [
              `Zeptej se Claude: „Jaké skills máš k dispozici?“ Nový skill by měl být v seznamu s popisem.`,
              `Zadej úkol formulací z popisu („udělej týdenní report“). Claude by měl skill ohlásit nebo se podle něj zjevně chovat.`,
              `Zadej úkol jinou formulací („shrň, co se stalo tenhle týden“). Ověř, že se skill načte i tak; pokud ne, rozšiř popis.`,
              `Zkontroluj výstup proti šabloně.`
            ] },
            { t: "tip", h: `Nejrychlejší cesta: „Claude, vytvoř skill, který dělá X. Tady je, jak to dělám ručně: …“ Pak jen dolaď popis a pravidla.` }
          ],
          quiz: [
            { q: "Který řádek skillu je nejdůležitější pro to, aby se vůbec použil?", o: ["name", "description", "šablona výstupu"], a: 1, why: "Podle popisu Claude pozná, kdy skill patří k zadání." },
            { q: "Jak ověřit, že se skill spouští na různé formulace?", o: ["Přečíst si ho znovu", "Zadat úkol několika různými formulacemi a sledovat, zda se skill načte", "Restartovat počítač"], a: 1, why: "Testování spouštění na varianty zadání odhalí příliš úzký popis." }
          ],
          cards: [
            { f: "Struktura SKILL.md", b: "Hlavička (name, description), tělo: postup, šablona výstupu, pravidla pro chyby a čemu se vyhnout." },
            { f: "Ověření skillu", b: "Je v seznamu? Spustí se na formulaci z popisu? I na jinou? Sedí výstup se šablonou?" }
          ],
          terms: [
            { t: "Frontmatter", d: "Hlavička souboru Markdown mezi řádky ---, kde jsou metadata jako name a description." }
          ]
        },
        {
          id: "sk-03",
          title: "Konfigurace a vícesouborové skills",
          minutes: 5,
          lead: `Jak psát popisy, které spouští správně, jak omezit nástroje a jak větší skill rozdělit do více souborů a skriptů.`,
          blocks: [
            { t: "h", x: "Popis, který spouští správně" },
            { t: "cmp",
              bad: { lbl: "Příliš obecný", h: `description: Pomáhá s dokumenty.` },
              good: { lbl: "Konkrétní se spouštěči", h: `description: Vytvoří cenovou nabídku ve firemním formátu z poptávky. Použij při slovech nabídka, kalkulace, quote, cenový návrh. Nepoužívej pro faktury.` } },
            { t: "p", h: `Dobrý popis obsahuje: co skill dělá, <b>klíčová slova</b>, na která má reagovat, a případně <b>kdy ne</b>. Příliš obecný popis se spouští na všechno, příliš úzký na nic.` },
            { t: "h", x: "Omezení nástrojů" },
            { t: "p", h: `V hlavičce lze uvést, které nástroje skill smí použít (např. jen čtení a git log). Skill, který má jen generovat report, nepotřebuje zapisovat do všech souborů. Méně práv = menší riziko.` },
            { t: "h", x: "Více souborů: postupné odkrývání uvnitř skillu" },
            { t: "p", h: `Když je skill velký, SKILL.md drží jen jádro a odkazuje na další soubory ve složce: šablony, referenční dokumenty, skripty. Claude je otevře, až když je potřebuje.` },
            { t: "ex", title: "Ukázka: struktura většího skillu", turns: [
              { who: "sys", mono: true, text: `.claude/skills/cenova-nabidka/
  SKILL.md            (postup, kdy použít, odkazy níže)
  sablona.docx        (firemní šablona nabídky)
  pravidla-slev.md    (podrobná pravidla slev, načte se jen když jsou slevy)
  scripts/
    over_cenik.py     (ověří, že všechny položky jsou v ceníku)` },
              { who: "sys", label: "Úryvek SKILL.md", mono: true, text: `3. Použij šablonu sablona.docx.
4. Pokud zákazník žádá slevu, řiď se pravidla-slev.md.
5. Před uložením spusť scripts/over_cenik.py NABIDKA.docx a oprav, co nahlásí.` }
            ], note: `Skript je deterministický: ověření ceníku neudělá model odhadem, ale program. Kombinace <b>instrukce + skript</b> je nejspolehlivější vzor.` }
          ],
          quiz: [
            { q: "Jaký je problém příliš obecného popisu?", o: ["Skill se nikdy nespustí", "Skill se spouští i na nesouvisející úkoly", "Soubor je delší"], a: 1, why: "Obecný popis matchuje všechno; přidej klíčová slova a případně „kdy ne“." },
            { q: "Proč do skillu přidat skript?", o: ["Kvůli délce", "Deterministické kroky (ověření, výpočet) udělá program spolehlivěji než model", "Skripty jsou povinné"], a: 1, why: "Instrukce + skript je nejspolehlivější vzor." }
          ],
          cards: [
            { f: "Dobrý popis skillu", b: "Co dělá + klíčová slova, na která reagovat + kdy nepoužít." },
            { f: "Vícesouborový skill", b: "SKILL.md drží jádro a odkazuje na šablony, reference a skripty; načtou se až při potřebě." }
          ],
          terms: []
        },
        {
          id: "sk-04",
          title: "Skills vs. ostatní funkce Claude Code",
          minutes: 5,
          lead: `CLAUDE.md, skills, subagenti, hooks, MCP: každý řeší něco jiného. Jak vybrat.`,
          blocks: [
            { t: "table", head: ["Funkce", "Co to je", "Použij, když…"], rows: [
              ["<b>CLAUDE.md</b>", "Trvalý kontext projektu, platí vždy", "…má Claude něco vědět v každém sezení (příkazy, konvence, pravidla)"],
              ["<b>Skill</b>", "Postup na vyžádání, načte se při shodě", "…máš opakovaný úkol s ustáleným postupem a výstupem"],
              ["<b>Subagent</b>", "Samostatný agent s vlastním kontextem a nástroji", "…je úkol objemný, paralelní nebo vyžaduje jinou roli s omezenými právy"],
              ["<b>Hook</b>", "Příkaz spouštěný automaticky při události", "…něco musí platit vždy, deterministicky (formátování, blokování, audit)"],
              ["<b>MCP server</b>", "Připojení externího systému jako nástrojů", "…Claude potřebuje číst nebo měnit data mimo repozitář (GitHub, DB, Jira)"]
            ] },
            { t: "h", x: "Rozhodovací otázky" },
            { t: "ol", items: [
              `Má to platit <b>vždy</b>? → CLAUDE.md (pravidlo) nebo hook (musí, deterministicky).`,
              `Je to <b>postup</b>, který se hodí jen někdy? → skill.`,
              `Potřebuje to <b>vlastní kontext</b> nebo <b>jiná práva</b>? → subagent.`,
              `Jde o <b>externí systém</b>? → MCP.`
            ] },
            { t: "ex", title: "Ukázka: čtyři požadavky, čtyři nástroje", turns: [
              { who: "user", label: "Požadavek", text: `1. „Commity pište česky.“\n2. „Před každým commitem musí proběhnout lint, jinak commit nepovolit.“\n3. „Když řeknu ‚udělej release‘, chci changelog, verzi a tag.“\n4. „Před merge chci nezávislou revizi, která nemůže nic měnit.“` },
              { who: "ai", label: "Volba", text: `1. CLAUDE.md (pravidlo, platí vždy).\n2. Hook (musí platit vždy, deterministicky).\n3. Skill (postup na vyžádání).\n4. Subagent reviewer s nástroji jen pro čtení.` }
            ], note: `Často se kombinují: skill „release“ může volat subagenta na revizi changelogu a hook zajistí, že se tag nevytvoří bez testů.` }
          ],
          quiz: [
            { q: "„Před každým commitem musí proběhnout lint, jinak commit nepovolit.“ Co použít?", o: ["Skill", "Hook", "MCP"], a: 1, why: "Musí platit vždy a deterministicky → hook." },
            { q: "„Když řeknu ‚udělej release‘, chci ustálený postup.“ Co použít?", o: ["CLAUDE.md", "Skill", "Subagent"], a: 1, why: "Postup na vyžádání → skill." },
            { q: "„Nezávislá revize, která nemůže nic měnit.“ Co použít?", o: ["Subagent s nástroji jen pro čtení", "Hook", "CLAUDE.md"], a: 0, why: "Vlastní kontext a omezená práva → subagent." }
          ],
          cards: [
            { f: "Vždy vs. na vyžádání", b: "Platí vždy: CLAUDE.md (má) nebo hook (musí). Na vyžádání: skill. Vlastní kontext/práva: subagent. Externí systém: MCP." }
          ],
          terms: []
        },
        {
          id: "sk-05",
          title: "Sdílení skills",
          minutes: 3,
          lead: `Skill má největší hodnotu, když ho používá tým. Čtyři cesty distribuce.`,
          blocks: [
            { t: "table", head: ["Cesta", "Jak", "Pro koho"], rows: [
              ["<b>Repozitář projektu</b>", "Složka .claude/skills/ commitnutá do repozitáře", "Všichni, kdo v projektu pracují"],
              ["<b>Plugin</b>", "Balíček skills (a dalšího) instalovaný z katalogu nebo interního zdroje", "Týmy napříč projekty"],
              ["<b>Firemní nastavení</b>", "Správce distribuuje skills centrálně (podle plánu)", "Celá organizace"],
              ["<b>Uvnitř subagenta</b>", "Subagent má skill ve svých instrukcích nebo si ho načítá", "Specializovaní agenti"]
            ] },
            { t: "h", x: "Než skill sdílíš" },
            { t: "ul", items: [
              `Odstraň cesty a hodnoty specifické pro tvůj počítač.`,
              `Popiš v README nebo v těle skillu, co vyžaduje (soubory, nástroje, konektory).`,
              `Přidej verzi a krátký changelog.`,
              `Ověř na čistém prostředí (nový klon repozitáře), že skill funguje.`
            ] },
            { t: "ex", title: "Ukázka: skill v repozitáři", turns: [
              { who: "sys", mono: true, text: `git add .claude/skills/tydenni-report
git commit -m "Přidává skill tydenni-report pro týdenní shrnutí"
git push
# Kolegové: git pull a skill je k dispozici, nic dalšího neinstalují.` }
            ], note: `Nejjednodušší sdílení: skill je obyčejný soubor v repozitáři. Verzování a revize zdarma díky gitu.` }
          ],
          quiz: [
            { q: "Nejjednodušší způsob sdílení skillu v jednom projektu?", o: ["Poslat e-mailem", "Commitnout složku .claude/skills/ do repozitáře", "Nahrát na web"], a: 1, why: "Skill je soubor; git ho rozšíří i verzuje." },
            { q: "Co udělat před sdílením?", o: ["Nic", "Odstranit lokální cesty, popsat požadavky, přidat verzi, ověřit na čistém prostředí", "Přejmenovat na skill.txt"], a: 1, why: "Skill, který funguje jen na tvém počítači, týmu nepomůže." }
          ],
          cards: [
            { f: "Čtyři cesty sdílení skillu", b: "Repozitář projektu, plugin, firemní nastavení, uvnitř subagenta." }
          ],
          terms: []
        },
        {
          id: "sk-06",
          title: "Ladění skills",
          minutes: 5,
          lead: `Skill se nespouští, načte se špatný, dva se hádají, nebo běží a selže. Diagnostika po typech problémů.`,
          blocks: [
            { t: "table", head: ["Příznak", "Pravděpodobná příčina", "Co zkusit"], rows: [
              ["Skill se nespouští", "Popis neodpovídá formulaci; chyba v hlavičce (chybí ---, špatný název); špatná složka", "„Jaké skills máš?“ Není-li v seznamu, zkontroluj hlavičku a cestu. Je-li, rozšiř popis o klíčová slova."],
              ["Spouští se špatný skill", "Dva skills s podobným popisem", "Zpřesni popisy, přidej „nepoužívej pro…“, případně sluč."],
              ["Skill se načte, ale výstup nesedí", "Nejasný postup, chybí šablona, instrukce si odporují", "Přidej příklad výstupu, rozděl kroky, odstraň konflikty."],
              ["Skript ve skillu selhává", "Chybí závislost, špatná cesta, jiné prostředí", "Spusť skript ručně mimo Claude; oprav; popiš požadavky."],
              ["Skill je dlouhý a ignorují se části", "Příliš dlouhé tělo, důležité uprostřed", "Zkrať, rozděl do souborů, důležité na začátek a konec."]
            ] },
            { t: "h", x: "Nástroje pro ladění" },
            { t: "ul", items: [
              `<b>Validátor</b>: kontrola hlavičky a struktury skillu (v Claude Code dostupný nástroj nebo příkaz; zkontroluje název, popis, formát).`,
              `<b>Otázka na Claude</b>: „Proč jsi nepoužil skill X?“ Claude vysvětlí, jak zadání porovnal s popisem.`,
              `<b>Explicitní spuštění</b>: <code>/nazev-skillu</code> obejde porovnávání popisu. Když takto funguje a automaticky ne, problém je v popisu.`
            ] },
            { t: "ex", title: "Ukázka: diagnostika nespouštění", turns: [
              { who: "user", text: `Shrň mi, co se stalo tenhle týden v projektu.` },
              { who: "ai", text: `(odpoví obecně, bez skillu tydenni-report)` },
              { who: "user", text: `Proč jsi nepoužil skill tydenni-report?` },
              { who: "ai", text: `Popis skillu zmiňuje „týdenní report, shrnutí týdne, weekly“. Tvoje zadání „co se stalo tenhle týden“ jsem vyhodnotil jako obecnou otázku, ne žádost o report. Pokud má skill reagovat i na takové formulace, doplň je do popisu.` },
              { who: "user", label: "Oprava popisu", text: `description: … Použij i při „co se stalo tenhle týden“, „přehled týdne“, „co jsme udělali“.` }
            ], note: `Claude sám řekne, proč skill nevybral. To je nejrychlejší ladicí nástroj, jaký máš.` }
          ],
          quiz: [
            { q: "Skill funguje přes /nazev, ale automaticky ne. Kde je problém?", o: ["V těle skillu", "V popisu (neodpovídá formulacím zadání)", "V modelu"], a: 1, why: "Explicitní spuštění obchází popis; když funguje, tělo je v pořádku." },
            { q: "Nejrychlejší způsob, jak zjistit, proč se skill nespustil?", o: ["Přečíst logy serveru", "Zeptat se Claude: „Proč jsi nepoužil skill X?“", "Smazat a vytvořit znovu"], a: 1, why: "Claude vysvětlí, jak zadání s popisem porovnal." }
          ],
          cards: [
            { f: "Ladění skillu: první kroky", b: "„Jaké skills máš?“ (je v seznamu?), „Proč jsi nepoužil X?“ (proč se nespustil), /nazev (funguje tělo?)." },
            { f: "Dva skills se hádají", b: "Zpřesni popisy, přidej „nepoužívej pro…“, nebo je sluč." }
          ],
          terms: [
            { t: "Validátor skillu", d: "Nástroj, který zkontroluje hlavičku a strukturu SKILL.md a upozorní na chyby v názvu, popisu nebo formátu." }
          ]
        }
      ]
    }
  ]
});
