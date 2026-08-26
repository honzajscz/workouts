/* =========================================================
   Tréninkový plán – přepis z Google Sheets (verze od dubna 2026)
   https://docs.google.com/spreadsheets/d/1y8HHn25sJHpsbvg2Cuizpy0VugFoDhrHJK5yf5AcW7Y/edit
   =========================================================
   Jak číst data:
   - weeks: 12 hodnot (Týden 1–12) přesně tak, jak jsou v tabulce.
     Formáty, kterým aplikace rozumí:
       "6-5-5-5-5"          → opakování po sériích
       "8-8-8"              → u cviku s unit:"kg" jde o kg po sériích
       "2+2 50 cm sit"      → 2+2 (L+P) v každé sérii, poznámka "50 cm sit"
       "5+5; 10 sérií 16kg" → 10 sérií po 5+5, poznámka "16kg"
       "8x 2,5 stopy"       → 8 opakování v každé sérii, poznámka
       "5"                  → 5 opakování v každé sérii
       "5 - pomalejší negativ" → 5 opakování + poznámka
   - sets: výchozí počet sérií (přepíše se, pokud jde spočítat z buňky)
   - ss:   číslo supersérie v rámci dne (stejné číslo = cviky jedou spolu)
   - pause: pauza mezi sériemi (z tabulky), používá ji odpočet
   ========================================================= */

const PLAN = {
  title: "Tréninkový plán",
  subtitle: "Pořadí tréninků v týdnu: A1 – B – A2",
  weeks: 12,
  order: ["A1", "B", "A2"],
  source: "https://docs.google.com/spreadsheets/d/1y8HHn25sJHpsbvg2Cuizpy0VugFoDhrHJK5yf5AcW7Y/edit",

  // Datumy zapsané v původní tabulce (jen pro informaci)
  sheetDates: { A1: { 1: "17. 4. 2026" }, B: { 1: "21. 4. 2026" } },

  warmup: [
    { name: "Svatozář" },
    { name: "Střecha / kobra" },
    { name: "Žába" },
    { name: "Streč ramen v sedě", note: "20–30 s" },
    { name: "Rozhýbání zápěstí na 6", note: "prsty od sebe, k sobě, do stran, na hřbety" },
    { name: "Cedulka na předloktí", note: "5+5" },
    { name: "Mosty u stěny", note: "3+3" },
    { name: "Křížový streč", note: "3+3" },
    { name: "Prkno na hrazdě", note: "10 s" }
  ],

  legend: [
    "SS – supersérie: oba cviky odjet za sebou a pauza až potom.",
    "Supersérie shybů a pistolí lze odjet i tak, že po jedné sérii shybů odjedeš pistole jen na jednu nohu – pistolí je 5 sérií, shybů 10.",
    "BW – bodyweight (vlastní váha).",
    "Pomalejší negativ – více brzdit cestu dolů.",
    "Zhušťovací série – začíná se na 10 sériích za 10 minut, končí se na 5 sériích za 5 minut.",
    "TGU: 1 TGU = 4× press, lze použít i jednoručku.",
    "Čísla s hvězdičkou (*) se v průběhu programu mění."
  ],

  days: [
    {
      id: "A1",
      name: "Trénink A1",
      exercises: [
        {
          id: "tgu",
          name: "TGU + press",
          sets: 3,
          unit: "kg",
          block: "6 min",
          note: "1 TGU = 4× press · lze použít i jednoručku",
          weeks: ["8-8-8", "12-8-8", "12-12-8", "12-12-12", "14-12-12", "14-14-12",
                  "14-14-14", "16-14-14", "16-16-14", "16-16-16", "18-16-16", "18-18-16"]
        },
        {
          id: "shyby",
          name: "Shyby nadhmatem",
          sets: 10, ss: 1,
          note: "dopomoc: oranžový + tyrkysový expander · 2 série shybů + 1 série pistolí",
          weeks: ["3-3-3-3-3-3-3-3-3-3", "4-4-3-3-3-3-3-3-3-3", "4-4-4-4-3-3-3-3-3-3",
                  "4-4-4-4-4-4-3-3-3-3", "4-4-4-4-4-4-4-4-3-3", "4-4-4-4-4-4-4-4-4-4",
                  "5-5-4-4-4-4-4-4-4-4", "5-5-5-5-4-4-4-4-4-4", "5-5-5-5-5-5-4-4-4-4",
                  "5-5-5-5-5-5-5-5-4-4", "5-5-5-5-5-5-5-5-5-5", "6-6-5-5-5-5-5-5-5-5"]
        },
        {
          id: "pistole",
          name: "Pistole s podložením",
          sets: 5, ss: 1,
          block: "za 15–20 min",
          weeks: ["2+2 50 cm sit", "4+4 50 cm sit", "2+2 50 cm touch", "4+4 50 cm touch",
                  "2+2 45 cm touch", "4+4 45 cm touch", "2+2 40 cm touch", "4+4 40 cm touch",
                  "2+2 35 cm touch", "4+4 35 cm touch", "2+2 30 cm touch", "4+4 30 cm touch"]
        },
        {
          id: "kliky-bradla",
          name: "Kliky na bradlech",
          sets: 5, ss: 2, pause: "1:30",
          note: "BW",
          weeks: ["6-5-5-5-5", "6-6-6-5-5", "6-6-6-6-6", "7-7-6-6-6", "7-7-7-7-6", "8-7-7-7-7",
                  "8-8-8-7-7", "8-8-8-8-8", "8-8-8-8-8", "9-9-8-8-8", "9-9-9-9-8", "10-9-9-9-9"]
        },
        {
          id: "bulharske",
          name: "Bulharské dřepy",
          sets: 5, ss: 2, pause: "1:30",
          weeks: ["2+2 2x10 kg", "4+4 2x10 kg", "6+6 2x10 kg", "3+3 2x12 kg", "5+5 2x12 kg",
                  "2+2 2x14 kg", "4+4 2x14 kg", "6+6 2x14 kg", "3+3 2x16 kg", "5+5 2x16 kg",
                  "2+2 2x18 kg", "4+4 2x18 kg"]
        },
        {
          id: "swing",
          name: "Jednoruční swing",
          sets: 10,
          block: "zhušťovací série · obě ruce v minutě",
          weeks: ["5+5; 10 sérií 16kg", "7+7; 8 sérií 16kg", "9+9; 6 sérií 16kg",
                  "5+5; 10 sérií 20kg", "7+7; 8 sérií 20kg", "9+9; 6 sérií 20kg",
                  "5+5; 10 sérií 22kg", "7+7; 8 sérií 22kg", "9+9; 6 sérií 22kg",
                  "5+5; 10 sérií 24kg", "7+7; 8 sérií 24kg", "9+9; 6 sérií 24kg"]
        }
      ]
    },

    {
      id: "B",
      name: "Trénink B",
      exercises: [
        {
          id: "pike",
          name: "Pike push up",
          sets: 5, ss: 1, pause: "1:30",
          note: "nohy na lavici",
          weeks: ["5", "5 - pomalejší negativ", "6", "6 - pomalejší negativ", "7", "7 - pomalejší negativ",
                  "8", "8 - pomalejší negativ", "9", "9 - pomalejší negativ", "10", "10 - pomalejší negativ"]
        },
        {
          id: "facepull",
          name: "1/2 Facepull na kruzích",
          sets: 4, ss: 1, pause: "1:30",
          weeks: ["8x 2,5 stopy", "9x 2,5 stopy", "10x 2,5 stopy", "5x 2 stopy", "6x 2 stopy",
                  "7x 2 stopy", "8x 2 stopy", "9x 2 stopy", "10x 2 stopy", "5x 1,5 stopy",
                  "6x 1,5 stopy", "7x 1,5 stopy"]
        },
        {
          id: "fsq",
          name: "FSQ (přední dřep)",
          sets: 5, ss: 2, pause: "1:30",
          weeks: ["6x 45 kg", "7x 45 kg", "8x 45 kg", "9x 45 kg", "10x 45 kg", "5x 50 kg",
                  "6x 50 kg", "7x 50 kg", "8x 50 kg", "9x 50 kg", "10x 50 kg", "5x 52,5 kg"]
        },
        {
          id: "kliky-kruhy",
          name: "Kliky na kruzích",
          sets: 5, ss: 2, pause: "1:30",
          note: "spodní hrana kruhu v půlce holeně · postupně posun špiček o 1 stopu dozadu",
          weeks: ["5", "6", "7", "8", "9", "10", "5x -1 stopa", "6x -1 stopa", "7x -1 stopa",
                  "8x -1 stopa", "9x -1 stopa", "10x -1 stopa"]
        },
        {
          id: "prit-kolen",
          name: "Přitahování kolen v pasivním visu",
          sets: 4, ss: 3, pause: "1:30",
          note: "BW · 15cm bedýnka",
          weeks: ["2", "3", "4", "5", "6", "6", "6", "7", "8",
                  "2x špičky k hrazdě", "3x špičky k hrazdě", "4x špičky k hrazdě"]
        },
        {
          id: "mt",
          name: "MT na jedné noze – křižné držení",
          sets: 5, ss: 3, pause: "1:30",
          note: "15cm bedýnka",
          weeks: ["2+2 16 kg", "3+3 16 kg", "4+4 16 kg", "5+5 16 kg", "2+2 20 kg", "3+3 20 kg",
                  "4+4 20 kg", "5+5 20 kg", "2+2 24 kg", "3+3 24 kg", "4+4 24 kg", "5+5 24 kg"]
        }
      ]
    },

    {
      id: "A2",
      name: "Trénink A2",
      exercises: [
        {
          id: "tgu",
          name: "TGU + press",
          sets: 3,
          unit: "kg",
          block: "6 min",
          note: "1 TGU = 4× press · lze použít i jednoručku",
          weeks: ["8-8-8", "12-8-8", "12-12-8", "12-12-12", "14-12-12", "14-14-12",
                  "14-14-14", "16-14-14", "16-16-14", "16-16-16", "18-16-16", "18-18-16"]
        },
        {
          id: "shyby",
          name: "Shyby nadhmatem",
          sets: 10, ss: 1,
          note: "dopomoc: oranžový + tyrkysový expander · 2 série shybů + 1 série pistolí",
          weeks: ["4-3-3-3-3-3-3-3-3-3", "4-4-4-3-3-3-3-3-3-3", "4-4-4-4-4-3-3-3-3-3",
                  "4-4-4-4-4-4-4-3-3-3", "4-4-4-4-4-4-4-4-4-3", "5-4-4-4-4-4-4-4-4-4",
                  "5-5-5-4-4-4-4-4-4-4", "5-5-5-5-5-4-4-4-4-4", "5-5-5-5-5-5-5-4-4-4",
                  "5-5-5-5-5-5-5-5-5-4", "6-5-5-5-5-5-5-5-5-5", "6-6-6-5-5-5-5-5-5-5"]
        },
        {
          id: "pistole",
          name: "Pistole s podložením",
          sets: 5, ss: 1,
          block: "za 15–20 min",
          weeks: ["3+3 50 cm sit", "5+5 50 cm sit", "3+3 50 cm touch", "5+5 50 cm touch",
                  "3+3 45 cm touch", "5+5 45 cm touch", "3+3 40 cm touch", "5+5 40 cm touch",
                  "3+3 35 cm touch", "5+5 35 cm touch", "3+3 30 cm touch", "5+5 30 cm touch"]
        },
        {
          id: "kliky-bradla",
          name: "Kliky na bradlech",
          sets: 5, ss: 2, pause: "1:30",
          note: "BW",
          weeks: ["6-6-5-5-5", "6-6-6-6-5", "7-6-6-6-6", "7-7-7-6-6", "7-7-7-7-7", "8-8-7-7-7",
                  "8-8-8-8-7", "8-8-8-8-8", "9-8-8-8-8", "9-9-9-8-8", "9-9-9-9-9", "10-10-9-9-9"]
        },
        {
          id: "bulharske",
          name: "Bulharské dřepy",
          sets: 5, ss: 2, pause: "1:30",
          weeks: ["3+3 2x10 kg", "5+5 2x10 kg", "2+2 2x12 kg", "4+4 2x12 kg", "6+6 2x12 kg",
                  "3+3 2x14 kg", "5+5 2x14 kg", "2+2 2x16 kg", "4+4 2x16 kg", "6+6 2x16 kg",
                  "3+3 2x18 kg", "5+5 2x18 kg"]
        },
        {
          id: "swing",
          name: "Jednoruční swing",
          sets: 9,
          block: "zhušťovací série · obě ruce v minutě",
          weeks: ["6+6; 9 sérií 16kg", "8+8; 7 sérií 16kg", "10+10; 5 sérií 16kg",
                  "6+6; 9 sérií 20kg", "8+8; 7 sérií 20kg", "10+10; 5 sérií 20kg",
                  "6+6; 9 sérií 22kg", "8+8; 7 sérií 22kg", "10+10; 5 sérií 22kg",
                  "6+6; 9 sérií 24kg", "8+8; 7 sérií 24kg", "10+10; 5 sérií 24kg"]
        }
      ]
    }
  ]
};
