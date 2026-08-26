# 🏋️ Trénink – tréninkový deník

Webová aplikace pro trackování [tréninkového plánu](https://docs.google.com/spreadsheets/d/1y8HHn25sJHpsbvg2Cuizpy0VugFoDhrHJK5yf5AcW7Y/edit) (A1 – B – A2, 12 týdnů).
Běží na GitHub Pages, je dělaná primárně na mobil a funguje i offline (PWA).

**Adresa aplikace:** https://honzajscz.github.io/workouts/

## Co umí

- 📋 **Plán po dnech** – tréninky A1, B, A2 s cíli pro každý z 12 týdnů, supersérie, pauzy a poznámky z tabulky
- ✅ **Trackování** – odškrtávání sérií jedním ťuknutím, úprava skutečných hodnot (opakování/kg), poznámky ke cviku i tréninku
- ▶️ **Řízený trénink (autopilot)** – časovač tě sám provede sériemi i pauzami jako Tabata timer: píská, česky hlásí cviky a série odškrtává za tebe; displej nezhasíná (wake lock); délky sérií jsou v `data.js` (`guided: {work, rest}`)
- 🤸 **Rozcvička** – checklist před tréninkem
- ⏱ **Odpočet pauzy** – po odškrtnuté sérii v ručním režimu (lze vypnout ve „Více“)
- 🗓️ **Historie** – všechny dokončené tréninky, možnost je zpětně upravit, smazat, zopakovat nebo změnit datum
- 📈 **Statistiky** – přehled programu (mřížka 12 týdnů × 3 dny), počty tréninků/sérií/opakování, graf progresu vybraného cviku
- 📦 **Export / import** – záloha do JSON souboru (nebo přes schránku), přenos dat mezi mobilem a počítačem
- 📴 **Offline režim** – po prvním načtení funguje i bez signálu v posilovně

## Kde jsou data

Veškerý progres se ukládá **jen do prohlížeče** (localStorage) – nikam se neposílá.
Z toho plyne:

- mobil a počítač mají každý svá data → přenos řeš **exportem/importem** ve „Více“,
- před promazáním dat prohlížeče si stáhni zálohu,
- na mobilu doporučuji **Přidat na plochu** (appka pak běží jako nativní a prohlížeč jí data jen tak nesmaže).

## Zprovoznění GitHub Pages

Repozitář obsahuje workflow `.github/workflows/pages.yml`, který stránku nasadí automaticky.

1. V repozitáři otevři **Settings → Pages** a v **Build and deployment → Source** vyber **GitHub Actions** (pokud už není).
2. Pushni do větve `main` (nebo spusť workflow ručně v záložce **Actions**).
3. Aplikace poběží na `https://honzajscz.github.io/workouts/`.

Workflow se pokusí Pages zapnout i sám – pokud první běh projde, není potřeba nic nastavovat.

## Úprava tréninkového plánu

Celý plán (cviky, série, hodnoty pro týdny W1–W12, rozcvička, legenda) je v souboru **`data.js`** –
stačí upravit text a pushnout. Formáty buněk jsou popsané v komentáři na začátku souboru.
Struktura odpovídá původní Google tabulce, takže změny v tabulce lze snadno přepsat sem.

Po změně souborů zvyš verzi cache v `sw.js` (`const CACHE = "trenink-v2"` …), ať se aktualizace
rychle dostane i do už nainstalovaných offline verzí.

## Lokální spuštění

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

(Stačí jakýkoli statický server; kvůli service workeru nefunguje otevření přes `file://`.)

## Technika

Čistý HTML + CSS + JavaScript bez buildu a bez závislostí. Soubory:

| Soubor | Účel |
| --- | --- |
| `index.html` | kostra aplikace |
| `data.js` | tréninkový plán (přepis Google tabulky) |
| `app.js` | logika – routing, trackování, statistiky, export/import |
| `styles.css` | vzhled (tmavý/světlý režim) |
| `sw.js` + `manifest.webmanifest` | offline režim a instalace na plochu |
