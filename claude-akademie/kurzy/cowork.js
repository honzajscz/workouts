/* Kurz: Úvod do Claude Cowork (podle academy.claude.com/courses/introduction-to-claude-cowork) */
AKADEMIE.add({
  id: "cowork",
  emoji: "🗂️",
  title: "Úvod do Claude Cowork",
  category: "produkty",
  level: "Začátečník",
  desc: "Jak Claude zadat delší úkol se soubory na počítači a nechat ho pracovat: úkolová smyčka, stálý kontext, skills a pluginy, Claude v Chrome a Microsoft 365, bezpečná práce a sdílení.",
  source: "https://academy.claude.com/courses/introduction-to-claude-cowork",
  modules: [
    {
      title: "Seznámení s Cowork",
      lessons: [
        {
          id: "cw-01",
          title: "Co je Claude Cowork",
          minutes: 4,
          lead: `Cowork je pracovní sezení: dáš Claude úkol a přístup ke složce, on si naplánuje kroky, pracuje se soubory a vrátí ti hotový výsledek. Chat odpovídá, Cowork vykonává.`,
          blocks: [
            { t: "cmp",
              bad: { lbl: "Chat", h: `Ty držíš soubory. Kopíruješ obsah dovnitř, výsledek ven. Jeden krok za druhým.` },
              good: { lbl: "Cowork", h: `Claude drží soubory. Otevírá je, vytváří nové, ukládá výsledky do složky. Ty sleduješ postup a schvaluješ.` } },
            { t: "h", x: "Typické úkoly" },
            { t: "ul", items: [
              `Roztřídit stovky souborů ve složce podle obsahu a přejmenovat je.`,
              `Z 30 PDF faktur udělat jednu tabulku s částkami, dodavateli a termíny.`,
              `Z poznámek a podkladů vytvořit prezentaci nebo dokument Word.`,
              `Porovnat dvě verze smlouvy a sepsat rozdíly.`,
              `Pravidelně (naplánovaně) připravit týdenní přehled z dat ve složce.`
            ] },
            { t: "ex", title: "Ukázka: první úkol v Cowork", turns: [
              { who: "user", text: `Ve složce Faktury/2026-08 je 27 PDF. Vytvoř tabulku faktury-srpen.xlsx se sloupci: dodavatel, číslo faktury, datum vystavení, splatnost, částka bez DPH, DPH, celkem. Na konci přidej řádek se součty. Pokud u některé faktury něco nepůjde přečíst, napiš to do sloupce Poznámka.` },
              { who: "ai", text: `Plán: 1) přečíst všech 27 PDF, 2) vytáhnout údaje, 3) vytvořit tabulku, 4) zkontrolovat součty. Začínám…\n(po 4 minutách) Hotovo: faktury-srpen.xlsx uložena ve složce. 25 faktur přečteno bez problémů, u 2 (skeny) je nejasná částka DPH, označeno v Poznámce. Součet celkem: 418 320 Kč. Chceš, abych ty dvě sporné zkontroloval znovu s vyšším zoomem?` }
            ], note: `Zadání má <b>vstup, výstup, strukturu a pravidlo pro nejistotu</b>. Claude Cowork pak pracuje sám a na konci hlásí, co se povedlo a co ne.` }
          ],
          quiz: [
            { q: "Hlavní rozdíl mezi Chatem a Cowork?", o: ["Cowork používá jiný jazyk", "V Cowork má Claude přístup ke složce a pracuje se soubory sám", "Cowork funguje jen offline"], a: 1, why: "Cowork drží soubory a vykonává; Chat odpovídá." },
            { q: "Co by dobré zadání pro Cowork mělo obsahovat?", o: ["Jen název složky", "Vstup, výstup, strukturu výsledku a co dělat při nejistotě", "Prosbu o rychlost"], a: 1, why: "Čím jasnější zadání, tím samostatněji Claude pracuje." }
          ],
          cards: [
            { f: "Claude Cowork", b: "Pracovní sezení: Claude dostane úkol a složku, naplánuje kroky, pracuje se soubory a vrátí výsledek." },
            { f: "Dobré zadání pro Cowork", b: "Vstup, výstup, struktura výsledku, pravidlo pro nejistotu." }
          ],
          terms: [
            { t: "Pracovní sezení (Cowork)", d: "Jedna úloha v Cowork: zadání, přístup ke složce, průběžný postup a výsledek." }
          ]
        },
        {
          id: "cw-02",
          title: "Nastavení Cowork",
          minutes: 3,
          lead: `Co je potřeba, než Cowork poprvé použiješ, a co při tom rozhoduješ.`,
          blocks: [
            { t: "steps", items: [
              `Nainstaluj <b>aplikaci Claude pro počítač</b> (Cowork je v ní záložka; ve webové verzi nebo na mobilu není).`,
              `Otevři <b>Cowork</b> a vyber <b>složku</b>, se kterou má Claude pracovat. Přístup má jen do ní (a podsložek), ne k celému disku.`,
              `Rozhodni, jaké <b>konektory</b> (Drive, kalendář, e-mail…) mají být v sezení dostupné.`,
              `Zadej úkol. Claude nejprve ukáže <b>plán</b>; můžeš ho upravit.`
            ] },
            { t: "h", x: "Dobré zvyky při výběru složky" },
            { t: "ul", items: [
              `Vytvoř si pracovní složku pro daný úkol a zkopíruj do ní vstupy. Originály zůstanou netknuté.`,
              `Nedávej Cowork přístup ke složce s věcmi, které tam nepatří (hesla, cizí osobní údaje).`,
              `Výstupy nech Claude ukládat do podsložky „vystup“, ať je poznáš.`
            ] },
            { t: "info", h: `Cowork může před změnou souborů žádat o schválení, podobně jako Claude Code. Míru dohledu nastavíš v předvolbách (viz lekce o bezpečné práci).` }
          ],
          quiz: [
            { q: "K čemu má Cowork přístup?", o: ["K celému disku", "Jen k vybrané složce a jejím podsložkám", "Jen ke schránce"], a: 1, why: "Rozsah přístupu určuješ výběrem složky." },
            { q: "Proč pracovat v kopii složky?", o: ["Je to rychlejší", "Originály zůstanou netknuté, i kdyby se něco pokazilo", "Cowork jinak nefunguje"], a: 1, why: "Bezpečný zvyk při práci s automatizací." }
          ],
          cards: [
            { f: "Nastavení Cowork", b: "Desktopová aplikace → záložka Cowork → vybrat složku → povolit konektory → zadat úkol a schválit plán." }
          ],
          terms: []
        },
        {
          id: "cw-03",
          title: "Co pro tebe Cowork může dělat",
          minutes: 4,
          lead: `Přehled schopností včetně naplánovaných úkolů, které Cowork provádí opakovaně bez tebe.`,
          blocks: [
            { t: "h", x: "Práce se soubory" },
            { t: "p", h: `Čte PDF, Word, Excel, PowerPoint, obrázky, textové a datové soubory. Vytváří nové dokumenty ve stejných formátech (pomocí vestavěných skills). Přejmenovává, třídí, slučuje.` },
            { t: "h", x: "Práce s daty" },
            { t: "p", h: `Pro výpočty a větší tabulky používá kód (nepočítá z hlavy). Umí vytvořit grafy a shrnutí. Výsledek uloží jako soubor.` },
            { t: "h", x: "Práce s připojenými službami" },
            { t: "p", h: `Přes konektory čte kalendář, e-maily, Drive nebo firemní nástroje a kombinuje je se soubory.` },
            { t: "h", x: "Naplánované úkoly" },
            { t: "p", h: `Úkol můžeš nechat běžet <b>opakovaně</b>: každé pondělí ráno, každý první den v měsíci. Claude ho provede a výsledek najdeš ve složce nebo v přehledu.` },
            { t: "ex", title: "Ukázka: naplánovaný týdenní přehled", turns: [
              { who: "user", text: `Každé pondělí v 7:00: ze složky Reporty/tyden vezmi nejnovější export prodejů, spočítej týdenní tržby podle kategorií, porovnej s předchozím týdnem a ulož prehled-YYYY-MM-DD.docx do Reporty/prehledy. Pokud export chybí, vytvoř soubor CHYBI-EXPORT.txt.` },
              { who: "ai", text: `Naplánováno: pondělí 7:00, opakovaně. Při dalším spuštění dostaneš shrnutí, co se vytvořilo.` }
            ], note: `Naplánovaný úkol musí mít <b>jasné vstupy, výstupy a chování při chybě</b>, protože u něj nebudeš. Přesně to zadání obsahuje.` }
          ],
          quiz: [
            { q: "Jak Cowork počítá v tabulce s tisíci řádky?", o: ["Z hlavy podle odhadu", "Pomocí kódu, který data spočítá", "Nepočítá"], a: 1, why: "Výpočty dělá nástrojem, ne predikcí tokenů." },
            { q: "Co je nutné u naplánovaného úkolu navíc?", o: ["Kratší zadání", "Jasné chování při chybě (co dělat, když vstup chybí)", "Nic"], a: 1, why: "U naplánovaného úkolu nejsi přítomen, aby ses rozhodl/a." }
          ],
          cards: [
            { f: "Naplánovaný úkol v Cowork", b: "Opakovaně běžící úloha; potřebuje jasné vstupy, výstupy a chování při chybě." }
          ],
          terms: [
            { t: "Naplánovaný úkol", d: "Úloha v Cowork, která se spouští automaticky podle rozvrhu (např. každé pondělí)." }
          ]
        },
        {
          id: "cw-04",
          title: "Předej Cowork první úkol: úkolová smyčka",
          minutes: 5,
          lead: `Jak probíhá jedno sezení od zadání po výsledek a jak do něj v každé fázi zasáhnout.`,
          blocks: [
            { t: "steps", items: [
              `<b>Zadání</b>: popíšeš úkol. Claude může položit upřesňující otázky.`,
              `<b>Plán</b>: Claude vypíše kroky. Tady je nejlevnější místo pro zásah: přidej krok, změň pořadí, něco zakaž.`,
              `<b>Provádění</b>: Claude pracuje, průběžně ukazuje, co dělá (které soubory otevřel, co vytvořil). Na změny se podle nastavení ptá.`,
              `<b>Výsledek a shrnutí</b>: co vzniklo, co se nepovedlo, co doporučuje dál.`,
              `<b>Doladění</b>: „přidej sloupec“, „udělej to i pro červenec“. Pokračuje se v kontextu sezení.`
            ] },
            { t: "ex", title: "Ukázka: zásah do plánu", turns: [
              { who: "user", text: `Přejmenuj fotky ve složce Dovolena podle data pořízení a místa.` },
              { who: "ai", label: "Plán", text: `1. Přečíst metadata (EXIF) všech fotek.\n2. U fotek s GPS zjistit název místa.\n3. Přejmenovat na YYYY-MM-DD_Misto_001.jpg.\n4. Fotky bez data nechat beze změny a vypsat je.\nMám začít?` },
              { who: "user", text: `Ano, ale nejdřív vytvoř kopie do podsložky Prejmenovane, originály neměň.` },
              { who: "ai", text: `Upravený plán: kopie do Dovolena/Prejmenovane, originály zůstávají. Začínám.` }
            ], note: `Jedna věta v plánovací fázi změnila celý průběh. Tohle je ta „smyčka“: zadání, plán, zásah, provedení, doladění.` },
            { t: "tip", h: `Když si nejsi jistý/á zadáním, začni větou: „Než začneš, řekni mi, jak tomu rozumíš, a zeptej se na cokoli nejasného.“` }
          ],
          quiz: [
            { q: "Kde je nejlevnější místo pro zásah do práce Cowork?", o: ["Po dokončení", "Ve fázi plánu, před prováděním", "Během ukládání"], a: 1, why: "Změna plánu nestojí nic; změna hotového výsledku znamená opakovat práci." },
            { q: "Co dělat, když si nejsi jistý/á zadáním?", o: ["Nechat Claude hádat", "Požádat, ať zopakuje, jak zadání chápe, a položí otázky", "Zadání zkrátit"], a: 1, why: "Ověření porozumění před prací šetří přepracování." }
          ],
          cards: [
            { f: "Úkolová smyčka Cowork", b: "Zadání → plán (zásah) → provádění → výsledek a shrnutí → doladění." }
          ],
          terms: []
        }
      ]
    },
    {
      title: "Přizpůsob si Cowork",
      lessons: [
        {
          id: "cw-05",
          title: "Lepší výsledky rychleji",
          minutes: 4,
          lead: `Cowork je silný v rešerši a analýze ve velkém. Pár zvyků, které z něj dostanou maximum.`,
          blocks: [
            { t: "ul", items: [
              `<b>Dávej celé úkoly, ne kroky.</b> Místo „otevři soubor A“ řekni cíl: „z A, B a C udělej srovnání“. Kroky si Claude naplánuje sám.`,
              `<b>Urči formát výstupu a název souboru.</b> „Ulož jako srovnani.docx s tabulkou a shrnutím na 1 stranu.“`,
              `<b>Řekni, co dělat při nejistotě.</b> „Když si nebudeš jistý, označ to a pokračuj“ vs. „zastav se a zeptej“.`,
              `<b>Chtěj shrnutí a odkazy na zdroje.</b> „U každého tvrzení uveď soubor a stranu.“`,
              `<b>Rozděl obří úkoly.</b> Sto smluv na tři dávky; každou zkontroluješ dřív, než jde další.`
            ] },
            { t: "ex", title: "Ukázka: analýza ve velkém", turns: [
              { who: "user", text: `Ve složce Dotaznik je 240 vyplněných dotazníků (PDF). Zjisti: 1) průměrné hodnocení každé otázky, 2) pět nejčastějších témat ve volných odpovědích s ukázkovými citacemi, 3) rozdíly mezi pobočkami. Výstup: analyza.docx (max 3 strany) + data.xlsx se všemi hodnotami. Pokud dotazník nejde přečíst, zapiš ho do seznamu na konci.` },
              { who: "ai", text: `(po 12 minutách) Hotovo. analyza.docx: průměry 3,2 až 4,6; hlavní témata volných odpovědí: čekací doba, přístup personálu, parkování, otevírací doba, ceny (s citacemi). Pobočka Brno je ve 4 z 6 otázek pod průměrem. data.xlsx obsahuje 240 řádků. 3 dotazníky nečitelné (seznam na konci).` }
            ], note: `Zadání, které by v chatu zabralo odpoledne kopírování, je tu jeden odstavec a dvanáct minut čekání.` }
          ],
          quiz: [
            { q: "Proč dávat Cowork celé úkoly místo kroků?", o: ["Kroky Cowork neumí", "Claude si kroky naplánuje sám; ty se soustředíš na cíl a kontrolu", "Aby zadání bylo delší"], a: 1, why: "Cíl místo mikrořízení je efektivnější a přenechává plánování agentovi." },
            { q: "Co pomůže s kontrolou výsledků analýzy?", o: ["Kratší výstup", "Požadavek na odkazy na zdroj (soubor, strana) u tvrzení", "Vypnutí shrnutí"], a: 1, why: "Odkazy umožní rychle ověřit klíčová tvrzení." }
          ],
          cards: [
            { f: "Pět zvyků pro Cowork", b: "Celé úkoly místo kroků; formát a název výstupu; pravidlo pro nejistotu; odkazy na zdroje; obří úkoly po dávkách." }
          ],
          terms: []
        },
        {
          id: "cw-06",
          title: "Stálý kontext: globální instrukce a projekty",
          minutes: 4,
          lead: `Co má Claude vědět pokaždé, nemusíš opakovat. Globální instrukce platí všude, projekt platí pro dané téma.`,
          blocks: [
            { t: "table", head: ["Úroveň", "Co tam patří", "Příklad"], rows: [
              ["<b>Globální instrukce</b>", "Tvoje trvalé preference napříč vším", "„Piš česky, tykej, výstupy stručně, čísla s mezerou jako oddělovačem tisíců.“"],
              ["<b>Projekt</b>", "Podklady a pravidla pro jedno téma", "Projekt „Fakturace“: reklamační řád, ceník, vzor faktury, pravidlo o DPH."],
              ["<b>Složka s CLAUDE.md</b>", "Pokyny pro konkrétní složku na disku (Cowork ho čte podobně jako Claude Code)", "„Soubory v této složce jsou skeny; při čtení používej OCR a označuj nejistá čísla.“"]
            ] },
            { t: "ex", title: "Ukázka: globální instrukce", turns: [
              { who: "sys", text: `Jsem účetní v malé firmě. Piš česky, vykat nemusíš. Když vytváříš tabulky, první řádek je hlavička a částky formátuj s mezerou (12 500 Kč). Když nevíš, řekni to, nehádej. Výstupy ukládej do podsložky vystup.` }
            ], note: `Tohle napíšeš jednou. Každé další sezení se podle toho chová.` },
            { t: "tip", h: `Když se přistihneš, že něco píšeš potřetí, patří to do instrukcí (globálních nebo projektových).` }
          ],
          quiz: [
            { q: "Kam patří pravidlo „vždy piš česky a tykej“?", o: ["Do každého zadání", "Do globálních instrukcí", "Do názvu složky"], a: 1, why: "Trvalé preference napříč vším = globální instrukce." },
            { q: "Kam patří reklamační řád a ceník?", o: ["Do globálních instrukcí", "Do projektu k danému tématu", "Do zadání pokaždé"], a: 1, why: "Podklady k jednomu tématu = projekt." }
          ],
          cards: [
            { f: "Tři úrovně stálého kontextu", b: "Globální instrukce (vše), projekt (téma), CLAUDE.md ve složce (konkrétní složka)." },
            { f: "Pravidlo „potřetí“", b: "Co píšeš potřetí, patří do instrukcí." }
          ],
          terms: [
            { t: "Globální instrukce", d: "Trvalé preference uživatele, které Claude uplatňuje ve všech sezeních a projektech." }
          ]
        },
        {
          id: "cw-07",
          title: "Skills: nauč Cowork svůj postup",
          minutes: 4,
          lead: `Skill v Cowork je uložený postup pro dokumentové úkoly: jak děláte nabídku, report, zápis. Claude ho použije, kdykoli se hodí.`,
          blocks: [
            { t: "p", h: `Princip je stejný jako v Chatu a Claude Code: složka se souborem <code>SKILL.md</code> (popis + postup) a případně šablony. V Cowork skills nejčastěji popisují, <b>jak má vypadat konkrétní typ dokumentu</b> ve tvé firmě.` },
            { t: "ex", title: "Ukázka: skill „cenová nabídka“", turns: [
              { who: "sys", mono: true, text: `---
name: cenova-nabidka
description: Vytvoří cenovou nabídku ve firemním formátu z poptávky zákazníka. Použij, když uživatel chce nabídku, kalkulaci nebo quote.
---
1. Z poptávky vytáhni: zákazník, položky, množství, termín.
2. Ceny ber z cenik.xlsx (stejná složka). Slevu 5 % nad 50 000 Kč.
3. Použij šablonu nabidka-sablona.docx: hlavička, tabulka položek, součet bez DPH, DPH 21 %, celkem.
4. Platnost nabídky 30 dní od data vytvoření.
5. Ulož jako Nabidka_ZAKAZNIK_YYYY-MM-DD.docx.
6. Pokud položka není v ceníku, nevymýšlej cenu; zapiš „DOPLNIT“ a upozorni.` },
              { who: "user", text: `Udělej nabídku z e-mailu v poptavka-kovar.txt.` },
              { who: "ai", text: `Používám skill „cenova-nabidka“. Zákazník Kovář s.r.o., 4 položky, 3 nalezeny v ceníku, 1 (montáž na místě) chybí → DOPLNIT. Sleva 5 % uplatněna (celkem 58 400 Kč bez DPH). Uloženo: Nabidka_Kovar_2026-09-14.docx.` }
            ], note: `Skill zaručuje, že nabídka vypadá vždy stejně, používá správný ceník a <b>nevymýšlí ceny</b>. To poslední je nejdůležitější řádek.` },
            { t: "tip", h: `Skill nemusíš psát ručně. Popiš Claude, jak nabídky děláš, a řekni: „Vytvoř z toho skill.“ Pak ho jen dolaď.` }
          ],
          quiz: [
            { q: "K čemu slouží skills v Cowork nejčastěji?", o: ["K přihlášení", "K popisu, jak má vypadat konkrétní typ dokumentu a jak ho vytvořit", "Ke změně jazyka"], a: 1, why: "Skills zachycují firemní postupy pro dokumentové úkoly." },
            { q: "Který řádek ve skillu chrání před fabulací?", o: ["Název skillu", "„Pokud položka není v ceníku, nevymýšlej cenu; zapiš DOPLNIT“", "Formát názvu souboru"], a: 1, why: "Explicitní pravidlo pro chybějící data brání vymýšlení." }
          ],
          cards: [
            { f: "Skill v Cowork", b: "Uložený postup pro typ dokumentu: odkud brát data, jaká šablona, jak pojmenovat, co dělat při chybějících údajích." },
            { f: "Skill nechat napsat", b: "Popiš Claude svůj postup a řekni „vytvoř z toho skill“." }
          ],
          terms: []
        },
        {
          id: "cw-08",
          title: "Pluginy: zabal odbornost týmu",
          minutes: 3,
          lead: `Plugin je balíček více skills (a případně konektorů a nastavení), který lze nainstalovat jedním krokem. Tak se sdílí odbornost v týmu.`,
          blocks: [
            { t: "p", h: `Představ si plugin „Obchod“: skills pro nabídku, smlouvu, zápis z jednání a follow-up e-mail, plus konektor na CRM. Nový kolega ho nainstaluje a od první minuty pracuje „po vašem“.` },
            { t: "h", x: "Skill vs. plugin" },
            { t: "table", head: ["", "Skill", "Plugin"], rows: [
              ["Rozsah", "Jeden postup", "Sada postupů a nastavení pro oblast"],
              ["Kdo tvoří", "Kdokoli pro sebe", "Obvykle tým nebo firma pro ostatní"],
              ["Instalace", "Složka ve tvém prostředí", "Z katalogu nebo interního zdroje jedním krokem"]
            ] },
            { t: "ex", title: "Ukázka: struktura pluginu", turns: [
              { who: "sys", mono: true, text: `obchod-plugin/
  skills/
    cenova-nabidka/SKILL.md
    zapis-z-jednani/SKILL.md
    follow-up-email/SKILL.md
  mcp/ (konektor na CRM)
  README.md (co plugin dělá, pro koho)` }
            ], note: `Plugin je jen uspořádaná složka. Podstata je v kvalitě jednotlivých skills.` }
          ],
          quiz: [
            { q: "Co je plugin?", o: ["Jeden skill", "Balíček více skills a nastavení pro určitou oblast, instalovatelný najednou", "Rozšíření prohlížeče"], a: 1, why: "Plugin sdružuje odbornost týmu do jednoho instalovatelného celku." }
          ],
          cards: [
            { f: "Plugin", b: "Balíček skills (a případně konektorů a nastavení) pro jednu oblast, sdílený v týmu a instalovaný najednou." }
          ],
          terms: [
            { t: "Plugin", d: "Instalovatelný balíček více skills, konektorů a nastavení, kterým tým sdílí své postupy." }
          ]
        }
      ]
    },
    {
      title: "Claude tam, kde pracuješ",
      lessons: [
        {
          id: "cw-09",
          title: "Claude v Chrome",
          minutes: 3,
          lead: `Rozšíření pro Chrome dá Claude oči na otevřenou stránku a ruce na formuláře. Web se stane dalším „souborem“, se kterým Claude pracuje.`,
          blocks: [
            { t: "ul", items: [
              `<b>Čtení stránky</b>: shrň článek, vytáhni ceny, porovnej produkty na stránce.`,
              `<b>Vyplňování a klikání</b>: vyplň formulář z podkladů, projdi několik stránek a sesbírej data.`,
              `<b>Propojení s Cowork</b>: data z webu do souboru na disku a naopak.`
            ] },
            { t: "ex", title: "Ukázka: sběr dat z webu", turns: [
              { who: "user", text: `Projdi tuto stránku s výsledky vyhledávání bytů, otevři prvních 10 inzerátů a udělej tabulku: lokalita, plocha, cena, poplatky, patro, odkaz.` },
              { who: "ai", text: `Otevírám inzeráty 1 až 10… Tabulka hotová (10 řádků). Dva inzeráty neuvádí poplatky, označeno „neuvedeno“. Chceš ji uložit jako byty.xlsx?` }
            ], note: `Claude v prohlížeči <b>skutečně kliká a čte</b>. Před akcemi jako odeslání formuláře nebo nákup se ptá.` },
            { t: "warn", h: `Na stránkách s platbami, bankovnictvím nebo citlivými účty rozšíření raději pozastav. A obsah cizích stránek je nedůvěryhodný: text na stránce může zkoušet dát Claude pokyny, Claude se tomu brání, ale ostražitost je na místě.` }
          ],
          quiz: [
            { q: "Co umí Claude v Chrome navíc oproti chatu?", o: ["Rychleji odpovídat", "Číst otevřenou stránku a provádět na ní úkony (formuláře, procházení)", "Měnit design webu"], a: 1, why: "Rozšíření pracuje přímo s prohlížečem." },
            { q: "Kde je vhodné rozšíření pozastavit?", o: ["Na zpravodajských webech", "V bankovnictví a při platbách", "Nikde"], a: 1, why: "Citlivé účty a platby vyžadují plnou kontrolu člověka." }
          ],
          cards: [
            { f: "Claude v Chrome", b: "Čte otevřenou stránku, vyplňuje formuláře, prochází stránky a sbírá data; před rizikovými akcemi se ptá." }
          ],
          terms: [
            { t: "Prompt injection", d: "Pokus o vložení pokynů pro AI do obsahu (např. webové stránky), aby AI jednala jinak, než uživatel chce." }
          ]
        },
        {
          id: "cw-10",
          title: "Claude pro Microsoft 365",
          minutes: 3,
          lead: `Doplňky do Wordu, Excelu, PowerPointu a Outlooku. Claude pracuje s otevřeným dokumentem, e-mailem nebo tabulkou přímo v aplikaci.`,
          blocks: [
            { t: "table", head: ["Aplikace", "Co Claude dělá"], rows: [
              ["Word", "Přepis, zkrácení, změna tónu vybraného textu; návrh struktury; kontrola konzistence"],
              ["Excel", "Vysvětlení vzorců, návrh vzorce podle popisu, analýza a shrnutí dat, tvorba přehledů"],
              ["PowerPoint", "Osnova prezentace z dokumentu, přepis odrážek, návrhy poznámek pro řečníka"],
              ["Outlook", "Shrnutí dlouhého vlákna, návrh odpovědi, vytažení úkolů a termínů"]
            ] },
            { t: "ex", title: "Ukázka: Excel", turns: [
              { who: "user", text: `Ve sloupci D jsou data splatnosti, v E stav (zaplaceno/nezaplaceno). Vytvoř v F vzorec, který u nezaplacených faktur po splatnosti napíše počet dní po splatnosti, jinak prázdno.` },
              { who: "ai", text: `Do F2 vlož: =KDYŽ(A(E2="nezaplaceno";D2<DNES());DNES()-D2;"") a zkopíruj dolů. Vzorec počítá dny po splatnosti jen u nezaplacených faktur po termínu.` }
            ], note: `S přístupem k listu Claude vidí názvy sloupců a formát dat, takže vzorec sedí na první pokus. Ověř ho na dvou řádcích, než ho použiješ na tisíc.` },
            { t: "info", h: `Dostupnost doplňků závisí na plánu a na tom, co povolil správce Microsoft 365 ve firmě.` }
          ],
          quiz: [
            { q: "Co je výhoda doplňku v Excelu proti kopírování tabulky do chatu?", o: ["Hezčí barvy", "Claude vidí skutečný list (sloupce, formáty) a pracuje přímo v něm", "Není žádná"], a: 1, why: "Práce v kontextu aplikace šetří kopírování a chyby." }
          ],
          cards: [
            { f: "Claude pro Microsoft 365", b: "Doplňky do Wordu, Excelu, PowerPointu a Outlooku: pracuje s otevřeným dokumentem přímo v aplikaci." }
          ],
          terms: []
        }
      ]
    },
    {
      title: "Sdílení a bezpečnost",
      lessons: [
        {
          id: "cw-11",
          title: "Bezpečná práce: režimy oprávnění a zvyky",
          minutes: 4,
          lead: `Cowork mění soubory na tvém počítači. Proto má režimy dohledu a proto se vyplatí pár zvyků.`,
          blocks: [
            { t: "h", x: "Režimy oprávnění" },
            { t: "table", head: ["Režim", "Chování"], rows: [
              ["Ptát se na změny", "Před každou změnou nebo smazáním souboru se Claude zeptá. Bezpečné, pomalejší."],
              ["Automatické úpravy ve vybrané složce", "Změny ve složce úkolu provádí sám, mimo ni se ptá. Dobrý kompromis."],
              ["Plánovat nejdřív", "Nejdřív jen plán a čtení; provádění až po schválení."]
            ] },
            { t: "h", x: "Zvyky" },
            { t: "ol", items: [
              `<b>Pracuj v kopii.</b> Originály zálohované nebo mimo pracovní složku.`,
              `<b>Malý rozsah přístupu.</b> Složka úkolu, ne Dokumenty.`,
              `<b>Konektory jen potřebné.</b> Kalendář na úkol s fakturami nepotřebuješ.`,
              `<b>Čti shrnutí.</b> Na konci Claude hlásí, co změnil. Projdi to.`,
              `<b>Citlivá data s rozmyslem.</b> Osobní údaje cizích lidí, zdravotní nebo finanční data jen tam, kde k tomu máš oprávnění a vhodný (firemní) účet.`
            ] },
            { t: "ex", title: "Ukázka: Claude se ptá před smazáním", turns: [
              { who: "ai", text: `Podle zadání mám odstranit 14 duplicitních souborů (seznam níže). Jde o nevratnou akci. Mám je smazat, nebo přesunout do podsložky Duplicity?` },
              { who: "user", text: `Přesuň do Duplicity.` }
            ], note: `Dobře nastavený Cowork nabízí <b>vratnou variantu</b> nevratné akce. Když ji nenabídne, chtěj ji.` }
          ],
          quiz: [
            { q: "Který režim je dobrý kompromis mezi rychlostí a bezpečím?", o: ["Automatické úpravy všude", "Automatické úpravy jen ve vybrané složce, mimo ni dotaz", "Nikdy nic neschvalovat"], a: 1, why: "Omezuje riziko na složku úkolu a nezdržuje u každé změny." },
            { q: "Co je vratná varianta smazání?", o: ["Smazání dvakrát", "Přesun do podsložky místo smazání", "Přejmenování na .bak a smazání"], a: 1, why: "Přesun se dá vrátit, smazání ne." }
          ],
          cards: [
            { f: "Bezpečné zvyky v Cowork", b: "Kopie místo originálů, malý rozsah přístupu, jen potřebné konektory, číst shrnutí, citlivá data s rozmyslem." },
            { f: "Vratná varianta", b: "Místo smazání přesun, místo přepsání nová verze. Když ji Claude nenabídne, chtěj ji." }
          ],
          terms: [
            { t: "Režim oprávnění (Cowork)", d: "Nastavení, jak často se Claude ptá před změnami souborů: vždy, jen mimo složku úkolu, nebo nejdřív plán." }
          ]
        },
        {
          id: "cw-12",
          title: "Ověřování skills pro pluginy",
          minutes: 3,
          lead: `Než skill sdílíš s týmem, ověř, že dělá to, co má, i na příkladech, které jsi nepsal/a ty.`,
          blocks: [
            { t: "steps", items: [
              `<b>Testovací sada</b>: 3 až 5 vstupů různé obtížnosti (typický, chybějící údaj, neobvyklý formát).`,
              `<b>Očekávaný výstup</b>: co má u každého vzniknout (soubor, struktura, chování při chybě).`,
              `<b>Spuštění</b>: nech Claude skill použít na každém vstupu, ideálně v novém sezení.`,
              `<b>Porovnání</b>: co sedí, co ne. Oprav skill, ne výsledek.`,
              `<b>Spouštění</b>: ověř, že se skill načte na správné formulace („udělej nabídku“, „quote pro Kováře“) a nenačte na nesouvisející.`
            ] },
            { t: "ex", title: "Ukázka: testovací případ", turns: [
              { who: "user", label: "Test 2: chybějící položka", text: `Vstup: poptávka se 3 položkami, z nichž „doprava“ není v ceníku.\nOčekávání: nabídka vznikne, položka doprava má cenu „DOPLNIT“, Claude na to upozorní, součet položku nezahrnuje.` },
              { who: "ai", label: "Výsledek", text: `Nabídka vytvořena, doprava = DOPLNIT, upozornění ano, součet bez dopravy. Sedí.` }
            ], note: `Nejcennější testy jsou ty s <b>chybějícími nebo divnými daty</b>. Na typickém vstupu funguje skoro každý skill.` }
          ],
          quiz: [
            { q: "Jaké testovací vstupy jsou pro skill nejcennější?", o: ["Typické, bez problémů", "S chybějícími nebo neobvyklými daty", "Prázdné"], a: 1, why: "Odhalí, jak se skill chová na okrajích, kde vznikají chyby." },
            { q: "Když test neprojde, co opravit?", o: ["Výsledný soubor ručně", "Skill (postup), aby příště fungoval", "Nic, je to náhoda"], a: 1, why: "Oprava skillu se projeví ve všech dalších použitích." }
          ],
          cards: [
            { f: "Ověření skillu", b: "Testovací sada (i okrajové případy), očekávaný výstup, spuštění, porovnání, oprava skillu, kontrola spouštění." }
          ],
          terms: []
        },
        {
          id: "cw-13",
          title: "Sdílej, co vytvoříš, s týmem",
          minutes: 3,
          lead: `Ověřené skills a pluginy mají hodnotu, až když je používá víc lidí. Jak je rozšířit.`,
          blocks: [
            { t: "ul", items: [
              `<b>Sdílená složka nebo repozitář</b>: plugin jako složka; kolegové ho nainstalují z ní.`,
              `<b>Firemní katalog</b>: správce může pluginy schvalovat a nabízet centrálně (podle plánu).`,
              `<b>Dokumentace</b>: README v pluginu: co dělá, jak ho spustit, ukázkové zadání, kdo je vlastník.`,
              `<b>Verze</b>: při změně skillu zvyš verzi a napiš, co se změnilo. Kolegové si upgradují vědomě.`
            ] },
            { t: "ex", title: "Ukázka: README pluginu", turns: [
              { who: "sys", mono: true, text: `# Plugin Obchod (v1.2)
Skills: cenova-nabidka, zapis-z-jednani, follow-up-email
Vyžaduje: cenik.xlsx v pracovní složce, konektor CRM (volitelné)
Ukázka: "Udělej nabídku z poptavka.txt"
Vlastník: Jana N. (obchod), dotazy v kanálu #obchod-ai
Změny v 1.2: sleva nad 50 000 Kč, nový formát názvu souboru` }
            ], note: `Krátké README je rozdíl mezi pluginem, který tým používá, a pluginem, který leží ve složce.` }
          ],
          quiz: [
            { q: "Co by mělo obsahovat README pluginu?", o: ["Jen název", "Co dělá, co vyžaduje, ukázkové zadání, vlastník, změny", "Zdrojový kód modelu"], a: 1, why: "Bez toho tým plugin nepoužije nebo použije špatně." }
          ],
          cards: [
            { f: "Sdílení pluginu", b: "Sdílená složka nebo katalog, README (co, jak, ukázka, vlastník), verze se změnami." }
          ],
          terms: []
        },
        {
          id: "cw-14",
          title: "Shrnutí a další kroky",
          minutes: 3,
          lead: `Co si z kurzu odnést a jak začít s Cowork.`,
          blocks: [
            { t: "ul", items: [
              `Cowork = <b>úkol + složka</b>, Claude plánuje, pracuje a hlásí.`,
              `Dobré zadání: vstup, výstup, struktura, pravidlo pro nejistotu.`,
              `Zásah v plánu je nejlevnější.`,
              `Stálý kontext: globální instrukce, projekty, CLAUDE.md ve složce.`,
              `Skills a pluginy = firemní postupy, které fungují pokaždé stejně. Ověřuj je na okrajových případech.`,
              `Bezpečnost: kopie, malý rozsah, jen potřebné konektory, vratné varianty.`
            ] },
            { t: "h", x: "První tři úkoly, které se vyplatí" },
            { t: "ol", items: [
              `Roztřídit jednu nepřehlednou složku.`,
              `Z hromady dokumentů jednoho typu udělat tabulku.`,
              `Popsat Claude jeden svůj opakovaný postup a nechat ho vytvořit skill.`
            ] }
          ],
          quiz: [
            { q: "Který z úkolů je nejlepší první úkol pro Cowork?", o: ["Migrace celé firemní databáze", "Roztřídění jedné složky nebo tabulka z dokumentů jednoho typu", "Odesílání e-mailů zákazníkům"], a: 1, why: "Malý, ohraničený, snadno kontrolovatelný úkol." }
          ],
          cards: [
            { f: "Cowork jednou větou", b: "Úkol + složka; Claude plánuje, pracuje a hlásí; ty zasahuješ v plánu a čteš shrnutí." }
          ],
          terms: []
        }
      ]
    }
  ]
});
