/* Kurz: Úvod do subagentů (podle academy.claude.com/courses/introduction-to-subagents) */
AKADEMIE.add({
  id: "subagenti",
  emoji: "🕸️",
  title: "Úvod do subagentů",
  category: "produkty",
  level: "Pokročilejší, koncepčně",
  desc: "Jak rozdělit složitý úkol mezi více agentů Claude s vlastním kontextem, jak je navrhnout spolehlivě a kdy se vyplatí.",
  source: "https://academy.claude.com/courses/introduction-to-subagents",
  modules: [
    {
      title: "Subagenti",
      lessons: [
        {
          id: "sa-01",
          title: "Co jsou subagenti",
          minutes: 5,
          lead: `Subagent je samostatná instance Claude s vlastním kontextovým oknem, které hlavní agent zadá dílčí úkol. Pracuje izolovaně a vrátí jen výsledek.`,
          blocks: [
            { t: "h", x: "Jak tečou data" },
            { t: "steps", items: [
              `Hlavní agent (orchestrátor) sestaví <b>zadání</b> pro subagenta: co má udělat, co má vrátit.`,
              `Subagent dostane <b>čisté kontextové okno</b>: jen svoje instrukce a zadání, ne celý dosavadní rozhovor.`,
              `Subagent pracuje (čte soubory, hledá, volá nástroje), klidně dlouho a s velkým objemem dat.`,
              `Vrátí <b>shrnutí</b>. Jen to se dostane do kontextu hlavního agenta.`
            ] },
            { t: "h", x: "Proč to dělat" },
            { t: "ul", items: [
              `<b>Čistý hlavní kontext.</b> Průzkum 80 souborů by ho zaplnil; subagent ho spotřebuje ve svém okně a vrátí odstavec.`,
              `<b>Specializace.</b> Subagent s vlastními instrukcemi a omezenou sadou nástrojů: reviewer, tester, badatel.`,
              `<b>Paralelnost.</b> Nezávislé části úkolu běží současně.`,
              `<b>Izolace chyb.</b> Když se subagent zamotá, hlavní agent to vidí jako jeden neúspěšný výsledek, ne jako zamořený rozhovor.`
            ] },
            { t: "ex", title: "Ukázka: orchestrátor a tři subagenti", turns: [
              { who: "user", text: `Zjisti, jestli je náš projekt připravený na přechod na novou verzi frameworku. Podívej se na závislosti, na použití zastaralých funkcí a na testy.` },
              { who: "ai", label: "Orchestrátor", text: `Spouštím 3 subagenty paralelně:\n• A: audit závislostí (package.json, lockfile, kompatibilita).\n• B: hledání zastaralých volání v src/.\n• C: stav testů a pokrytí.\n(čekám)\nVýsledky: A: 4 balíčky nekompatibilní. B: 23 míst se zastaralými voláními ve 9 souborech. C: testy 91 % pokrytí, 2 padají už teď.\nZávěr: přechod je možný, ale nejdřív opravit 2 padající testy a aktualizovat 4 balíčky. Chceš plán po krocích?` }
            ], note: `Každý subagent přečetl desítky souborů. Do hlavního rozhovoru se vrátily tři řádky. Hlavní agent má stále volný kontext na plán a provedení.` },
            { t: "info", h: `Subagenti jsou nejviditelnější v Claude Code, ale stejný princip používá Research (více paralelních vyhledávání) i Cowork u velkých úloh.` }
          ],
          quiz: [
            { q: "Co subagent dostane do svého kontextu?", o: ["Celý dosavadní rozhovor", "Jen svoje instrukce a konkrétní zadání", "Nic"], a: 1, why: "Čisté okno je smysl subagenta: izolace a úspora hlavního kontextu." },
            { q: "Co se z práce subagenta vrátí hlavnímu agentovi?", o: ["Všechny přečtené soubory", "Jen shrnutí / výsledek", "Nic, subagent pracuje sám pro sebe"], a: 1, why: "Do hlavního kontextu jde jen výsledek." }
          ],
          cards: [
            { f: "Subagent", b: "Samostatná instance Claude s čistým kontextem, vlastními instrukcemi a nástroji; dostane dílčí úkol, vrátí shrnutí." },
            { f: "Čtyři důvody pro subagenty", b: "Čistý hlavní kontext, specializace, paralelnost, izolace chyb." }
          ],
          terms: [
            { t: "Orchestrátor", d: "Hlavní agent, který rozděluje úkol mezi subagenty, zadává jim práci a skládá výsledky." }
          ]
        },
        {
          id: "sa-02",
          title: "Vytvoření subagenta",
          minutes: 4,
          lead: `V Claude Code subagenta vytvoříš příkazem /agents nebo souborem. Skládá se z názvu, popisu, instrukcí a povolených nástrojů.`,
          blocks: [
            { t: "p", h: `Příkaz <code>/agents</code> otevře průvodce: vybereš, zda je agent pro projekt (<code>.claude/agents/</code>, sdílený v repozitáři) nebo osobní (v domovské složce), zadáš název a popis a Claude ti pomůže napsat instrukce. Výsledkem je Markdown soubor s hlavičkou.` },
            { t: "ex", title: "Ukázka: subagent „reviewer“", turns: [
              { who: "sys", mono: true, text: `---
name: reviewer
description: Přísná revize změn v kódu. Použij po dokončení úprav, před commitem, nebo když uživatel chce code review.
tools: Read, Grep, Glob, Bash(git diff *)
---
Jsi přísný reviewer. Projdi diff (git diff) a soubory, kterých se týká.
Hledej: chyby, bezpečnostní problémy, nekonzistence s konvencemi
projektu (viz CLAUDE.md), slabé testy.
Nic neopravuj. Vrať seznam nálezů:
- [závažnost] soubor:řádek: popis, návrh opravy
Pokud nic nenajdeš, řekni to a uveď, co jsi zkontroloval.` }
            ], note: `Všimni si <b>omezení nástrojů</b>: reviewer smí jen číst a spouštět git diff. Nemůže nic změnit, i kdyby chtěl. To je bezpečnost návrhem.` },
            { t: "h", x: "Části definice" },
            { t: "table", head: ["Část", "K čemu"], rows: [
              ["name", "Jak se agent jmenuje; hlavní agent ho tak volá"],
              ["description", "Kdy ho použít; podle toho hlavní agent (nebo ty) pozná, že se hodí"],
              ["tools", "Které nástroje smí; méně = bezpečnější a soustředěnější"],
              ["tělo", "Instrukce: role, postup, formát výstupu, co dělat při problému"]
            ] },
            { t: "tip", h: `Popis piš jako větu pro kolegu: „Použij, když…“. Hlavní agent podle ní subagenta vybírá stejně, jako Claude vybírá skills.` }
          ],
          quiz: [
            { q: "Proč omezovat subagentovi nástroje?", o: ["Aby byl levnější", "Bezpečnost a soustředění: reviewer, který nemůže měnit kód, nic nerozbije", "Kvůli formátu souboru"], a: 1, why: "Omezení nástrojů je bezpečnost návrhem." },
            { q: "Kde je subagent sdílený s týmem?", o: ["V domovské složce uživatele", "V .claude/agents/ uvnitř projektu (repozitáře)", "Nikde, subagenti se nesdílí"], a: 1, why: "Projektoví subagenti jdou do repozitáře, osobní do domovské složky." }
          ],
          cards: [
            { f: "Definice subagenta", b: "name, description (kdy použít), tools (povolené nástroje), tělo (role, postup, formát výstupu)." }
          ],
          terms: [
            { t: "/agents", d: "Příkaz Claude Code pro vytvoření a správu subagentů." }
          ]
        },
        {
          id: "sa-03",
          title: "Návrh spolehlivých subagentů",
          minutes: 5,
          lead: `Subagent pracuje mimo tvůj dohled. Spolehlivost stojí na strukturovaném výstupu, jasném chování při překážce a omezení nástrojů.`,
          blocks: [
            { t: "h", x: "1. Strukturovaný výstup" },
            { t: "p", h: `Hlavní agent (nebo skript) musí výsledek subagenta zpracovat. Volný text se zpracovává špatně. Předepiš formát: seznam s pevnými poli, tabulku, nebo JSON.` },
            { t: "cmp",
              bad: { lbl: "Volný výstup", h: `„Našel jsem pár problémů, hlavně v souboru s platbami, a taky by stálo za to přepsat testy…“` },
              good: { lbl: "Strukturovaný výstup", h: `[VYSOKÁ] payments.ts:88: částka bez zaokrouhlení, použít roundMoney()<br>[NÍZKÁ] tests/pay.test.ts:12: test bez asserce, doplnit expect` } },
            { t: "h", x: "2. Chování při překážce" },
            { t: "p", h: `Řekni, co dělat, když něco chybí: „Pokud nenajdeš soubor, nevymýšlej; vrať PŘEKÁŽKA: popis.“ „Pokud si nejsi jistý, označ nález jako NEJISTÝ.“ Bez toho subagent překážku „vyřeší“ tichým odhadem.` },
            { t: "h", x: "3. Omezení nástrojů a rozsahu" },
            { t: "p", h: `Jen nástroje pro úkol. Jen složka, které se úkol týká. Jasný konec: „Prohledej maximálně src/, nezacházej do node_modules.“` },
            { t: "h", x: "4. Jedna odpovědnost" },
            { t: "p", h: `Subagent „udělej všechno“ je horší než tři subagenti s jasným úkolem. Jednoúčelový agent má kratší instrukce, menší kontext a předvídatelnější výstup.` },
            { t: "ex", title: "Ukázka: instrukce s pravidly pro překážky", turns: [
              { who: "sys", mono: true, text: `Úkol: najdi v src/ všechna místa, kde se ukládají osobní údaje bez šifrování.
Výstup: řádky ve formátu SOUBOR:ŘÁDEK | CO SE UKLÁDÁ | JISTOTA (vysoká/střední/nízká)
Pravidla:
- Pokud nevíš, zda jde o osobní údaj, uveď JISTOTA nízká, nevynechávej.
- Pokud narazíš na soubor, který nejde přečíst, vrať PŘEKÁŽKA: cesta.
- Nic neměň. Neprohledávej testy ani node_modules.
- Na konci uveď: PROHLEDÁNO: počet souborů.` }
            ], note: `Formát, pravidla nejistoty, pravidlo překážky, rozsah, kontrolní údaj na konci. Tenhle vzor jde použít pro většinu průzkumných subagentů.` }
          ],
          quiz: [
            { q: "Proč chtít od subagenta strukturovaný výstup?", o: ["Vypadá lépe", "Hlavní agent nebo skript ho musí spolehlivě zpracovat", "Je kratší"], a: 1, why: "Volný text se zpracovává nespolehlivě." },
            { q: "Co se stane bez pravidla pro překážky?", o: ["Subagent se zastaví", "Subagent překážku „vyřeší“ tichým odhadem", "Nic"], a: 1, why: "Bez explicitního pokynu model fabuluje místo hlášení problému." }
          ],
          cards: [
            { f: "Čtyři zásady spolehlivého subagenta", b: "Strukturovaný výstup, chování při překážce, omezení nástrojů a rozsahu, jedna odpovědnost." },
            { f: "Pravidlo překážky", b: "„Pokud něco chybí nebo nejde, nevymýšlej; vrať PŘEKÁŽKA: popis.“" }
          ],
          terms: [
            { t: "Strukturovaný výstup", d: "Výsledek subagenta v předepsaném formátu (pevná pole, tabulka, JSON), aby šel spolehlivě zpracovat." }
          ]
        },
        {
          id: "sa-04",
          title: "Kdy subagenty použít a čemu se vyhnout",
          minutes: 4,
          lead: `Subagenti nejsou vždy lepší. Přidávají režii a ztrácejí kontext. Kdy se vyplatí a jaké vzory selhávají.`,
          blocks: [
            { t: "h", x: "Vyplatí se" },
            { t: "ul", items: [
              `<b>Objemný průzkum</b>, jehož výsledek je krátký (hledání, audit, inventura).`,
              `<b>Nezávislé části</b>, které mohou běžet paralelně (tři moduly, tři jazyky, tři datové sady).`,
              `<b>Jiná role s jiným pohledem</b>: reviewer, který nezná záměr autora, najde víc.`,
              `<b>Ochrana hlavního kontextu</b> v dlouhých sezeních.`
            ] },
            { t: "h", x: "Nevyplatí se" },
            { t: "ul", items: [
              `<b>Malé úkoly.</b> Režie (zadání, spuštění, návrat) je větší než úkol.`,
              `<b>Úkoly závislé na celém kontextu rozhovoru.</b> Subagent ho nemá; musel/a bys ho celý předat.`,
              `<b>Sekvenční kroky, kde každý závisí na předchozím.</b> Paralelnost nepomůže, izolace škodí.`
            ] },
            { t: "h", x: "Vzory, kterým se vyhnout" },
            { t: "table", head: ["Vzor", "Proč selhává", "Lepší"], rows: [
              ["Subagent „všeuměl“", "Dlouhé instrukce, nepředvídatelný výstup", "Více jednoúčelových"],
              ["Řetěz subagentů předávajících si volný text", "Chyby se sčítají, informace se ztrácí", "Strukturované výstupy, kontrola mezi kroky"],
              ["Subagent s plnými právy „aby to bylo jednodušší“", "Může něco rozbít bez dohledu", "Nejmenší oprávnění"],
              ["Neomezené hledání „všeho zajímavého“", "Nikdy neskončí, vrátí vágní výsledek", "Jasná otázka, rozsah a formát"]
            ] },
            { t: "ex", title: "Ukázka: kdy subagenta nepoužít", turns: [
              { who: "user", text: `Přejmenuj proměnnou total na grandTotal v tomto souboru.` },
              { who: "ai", text: `(Provede přímo, bez subagenta: jeden soubor, jasná změna, výsledek okamžitě vidíš.)` }
            ], note: `Spuštění subagenta na tohle by trvalo déle než úkol sám a ztratilo by kontext souboru, který už je otevřený.` },
            { t: "key", h: `Subagenti řeší problém kontextu a paralelnosti. Pokud tenhle problém nemáš, nepotřebuješ je.` }
          ],
          quiz: [
            { q: "Který úkol je pro subagenta vhodný?", o: ["Přejmenování proměnné v jednom souboru", "Audit použití zastaralých funkcí v celém projektu", "Odpověď na otázku, co je proměnná"], a: 1, why: "Objemný průzkum s krátkým výsledkem = ideální subagent." },
            { q: "Proč selhává řetěz subagentů předávajících si volný text?", o: ["Je pomalý", "Chyby se sčítají a informace se ztrácí bez struktury a kontroly", "Subagenti se nemají rádi"], a: 1, why: "Strukturované výstupy a kontrolní body mezi kroky to řeší." }
          ],
          cards: [
            { f: "Kdy subagent", b: "Objemný průzkum s krátkým výsledkem, nezávislé paralelní části, jiná role, ochrana hlavního kontextu." },
            { f: "Kdy ne", b: "Malé úkoly, úkoly závislé na celém rozhovoru, přísně sekvenční kroky." }
          ],
          terms: []
        }
      ]
    }
  ]
});
