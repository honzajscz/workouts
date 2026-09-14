/* =========================================================
   Claude Akademie, registr kurzů
   Každý soubor v kurzy/ zavolá AKADEMIE.add({...}) s jedním kurzem.

   Formát kurzu:
   { id, emoji, title, category ("start" | "produkty" | "fluency"),
     level, desc, source (odkaz na originál v Claude Academy),
     modules: [ { title, lessons: [ lekce ] } ] }

   Formát lekce:
   { id, title, minutes, lead, blocks: [...], quiz: [...], cards: [...], terms: [...] }

   Bloky obsahu (pole blocks):
     { t: "p",     h: "odstavec (HTML)" }
     { t: "h",     x: "mezinadpis" }
     { t: "ul" | "ol" | "steps", items: ["HTML", ...] }
     { t: "ex",    title: "Ukázka …", turns: [ { who: "user"|"ai"|"bad", text, mono? } ], note: "HTML" }
     { t: "tip" | "warn" | "info" | "key", title?: "…", h: "HTML" }
     { t: "table", head: ["…"], rows: [["…", "…"]] }
     { t: "cmp",   bad: { lbl, h }, good: { lbl, h } }

   Kvíz:      { q, o: ["možnost", ...], a: indexSprávné, why: "vysvětlení" }
   Kartičky:  { f: "přední strana", b: "zadní strana" }
   Slovníček: { t: "pojem", d: "definice" }
   ========================================================= */
window.AKADEMIE = {
  courses: [],
  add(course) { this.courses.push(course); }
};
