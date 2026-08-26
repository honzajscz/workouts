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
   - guided: časování pro řízený trénink (autopilot):
       work – kolik sekund trvá jedna série (výchozí 40 s)
       rest – pauza po sérii/kole v sekundách (výchozí = pause, jinak 60 s)
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

  /* Krátká jména cviků pro kompaktní zobrazení (řetězec supersérie apod.) */
  shortNames: {
    "tgu": "TGU", "shyby": "Shyby", "pistole": "Pistole", "kliky-bradla": "Kliky",
    "bulharske": "Bulhary", "swing": "Swing", "pike": "Pike", "facepull": "Facepull",
    "fsq": "FSQ", "kliky-kruhy": "Kliky", "prit-kolen": "Kolena", "mt": "MT"
  },

  /* Instrukce k technice a videa – klíčem je id cviku.
     howto: krátké body, jak cvik správně provést
     video: doporučený tutoriál na YouTube
     videoQuery: dotaz pro hledání dalších videí */
  exerciseInfo: {
    "tgu": {
      howto: [
        "Lehni na záda, kettlebell vytlač na napnutou paži – rameno zamknuté v jamce, oči sledují činku.",
        "Postupně: přetoč se na loket → na dlaň → zvedni pánev → protáhni nohu dozadu do kleku → postav se.",
        "1 TGU = 4× press (výtlak nad hlavu) – např. dole, v sedu, v kleku a ve stoji.",
        "Stejnou cestou kontrolovaně zpět dolů; celou dobu zpevněné břicho.",
        "Střídej levou a pravou ruku, pracuj v klidovém tempu (blok 6 minut)."
      ],
      video: "https://www.youtube.com/watch?v=lpltjWHd0ek",
      videoQuery: "kettlebell turkish get up tutorial"
    },
    "shyby": {
      howto: [
        "Hmat nadhmatem zhruba na šířku ramen, start z plného visu.",
        "Nejdřív stáhni lopatky dolů a pak přitahuj – brada nad hrazdu.",
        "Dolů kontrolovaně do plného natažení paží, bez kmitání.",
        "Dopomoc: oranžový + tyrkysový expander zavěs přes hrazdu a stoupni si do něj."
      ],
      video: "https://www.youtube.com/watch?v=rmdn5X_KLkY",
      videoQuery: "pull up proper form tutorial"
    },
    "pistole": {
      howto: [
        "Stoj na jedné noze zády k podložení, druhá noha natažená dopředu.",
        "Sedej dozadu: „sit“ = úplně dosednout a vstát, „touch“ = jen dotyk a hned nahoru.",
        "Koleno směřuje nad špičku, pata stojné nohy celou dobu na zemi.",
        "Paže natažené vpřed jako protiváha; nahoru bez švihu a opření rukou."
      ],
      video: "https://www.youtube.com/watch?v=T74bU2vNWG4",
      videoQuery: "pistol squat box progression tutorial"
    },
    "kliky-bradla": {
      howto: [
        "Ramena stáhni dolů od uší, lehký náklon trupu vpřed.",
        "Spouštěj se, dokud nejsou ramena u úrovně loktů (ohyb ~90°).",
        "Lokty vedou dozadu podél těla, ne do stran; nahoře paže propni.",
        "Nejdi přes bolest v ramenou – radši menší rozsah a čistě."
      ],
      video: "https://www.youtube.com/watch?v=85u_8mz5lBA",
      videoQuery: "parallel bar dips proper form"
    },
    "bulharske": {
      howto: [
        "Zadní nárt polož na lavici, přední noha zhruba krok před ní; v každé ruce kettlebell.",
        "Klesej svisle dolů – koleno zadní nohy míří k zemi, přední koleno nad špičkou.",
        "Váha na celém chodidle přední nohy, trup jen mírně nakloněný vpřed.",
        "Zápis X+X = opakování na každou nohu."
      ],
      video: "https://www.youtube.com/watch?v=VPhhE6bBzZE",
      videoQuery: "bulgarian split squat proper form"
    },
    "swing": {
      howto: [
        "Švih jde z kyčlí, ne z dřepu: náprah činky dozadu mezi stehna a prudké propnutí kyčlí.",
        "Záda pořád rovná, paže volná – činka letí sama do výšky hrudníku.",
        "Nahoře zpevni hýždě a břicho; dole hlídej rovná záda a činku vysoko v rozkroku.",
        "5+5 = 5 švihů levou + 5 pravou v rámci jedné minuty, zbytek minuty odpočívej."
      ],
      video: "https://www.youtube.com/watch?v=BXrXhyudA80",
      videoQuery: "one arm kettlebell swing hardstyle tutorial"
    },
    "pike": {
      howto: [
        "Nohy špičkami na lavici, pánev co nejvýš – tělo tvoří obrácené V, hlava mezi rameny.",
        "Ohýbej lokty a spouštěj temeno hlavy k zemi mezi dlaně.",
        "Lokty svírají s tělem ~45°, nevytáčej je do stran.",
        "Pomalejší negativ = cestu dolů brzdit 3–4 sekundy."
      ],
      video: "https://www.youtube.com/watch?v=5IcgscNCId8",
      videoQuery: "pike push up feet elevated tutorial"
    },
    "facepull": {
      howto: [
        "Kruhy zhruba ve výšce obličeje, zakloň se – tělo zpevněné v jedné linii jako prkno.",
        "Přitahuj kruhy k obličeji: lokty vysoko a do stran, lopatky stáhni k sobě.",
        "„Stopy“ = vzdálenost chodidel před tělem; menší číslo = tělo víc naležato = těžší.",
        "Tahají zadní ramena a horní záda, ne biceps."
      ],
      video: "https://www.youtube.com/watch?v=lm4Nt-N6qUk",
      videoQuery: "ring face pull tutorial"
    },
    "fsq": {
      howto: [
        "Osa leží na předních ramenech (přední rack), lokty drž vysoko před tělem.",
        "Trup vzpřímený, dřep do plné hloubky, kolena ven směrem nad špičky.",
        "Váha na celých chodidlech; z dolní pozice veď pohyb lokty vzhůru.",
        "Zpevni břicho, ať se trup nepřeklápí dopředu."
      ],
      video: "https://www.youtube.com/watch?v=npVgCT7NznU",
      videoQuery: "front squat technique tutorial"
    },
    "kliky-kruhy": {
      howto: [
        "Kruhy nízko (spodní hrana v půlce holeně), tělo v prkně od hlavy k patám.",
        "Klik do plné hloubky, kruhy drž stabilně u těla, žádné třesení do stran.",
        "Nahoře vytoč kruhy palci ven a propni lokty.",
        "„−1 stopa“ = posuň špičky o stopu dozadu; tělo je víc naležato a cvik těžší."
      ],
      video: "https://www.youtube.com/watch?v=gjPDz7PsZ3k",
      videoQuery: "ring push up tutorial"
    },
    "prit-kolen": {
      howto: [
        "Pasivní vis na hrazdě (ramena volně vytažená), tělo se nesmí rozhoupat.",
        "Podsaď pánev a přitáhni kolena k hrudníku – ne jen zvednout nohy.",
        "Dolů pomalu a kontrolovaně, další opakování bez švihu.",
        "Progrese: pokrčená kolena → špičky až k hrazdě. Start ze stoje na 15cm bedýnce."
      ],
      video: "https://www.youtube.com/watch?v=l7OroezzX9k",
      videoQuery: "hanging knee raise proper form"
    },
    "mt": {
      howto: [
        "Stoj na jedné noze, kettlebell v protilehlé ruce (křižné držení).",
        "Ohyb v kyčli: napnutá zadní noha jde dozadu, trup dopředu – záda rovná jako prkno.",
        "Boky drž rovnoběžně se zemí (nevytáčej pánev), stojná noha mírně pokrčená.",
        "Činka klesá k 15cm bedýnce, pak propni kyčel a vzpřim se."
      ],
      video: "https://www.youtube.com/watch?v=2ZSHv5YvINM",
      videoQuery: "single leg kettlebell deadlift tutorial"
    }
  },

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
          guided: { work: 120, rest: 15 },
          note: "1 TGU = 4× press · lze použít i jednoručku",
          weeks: ["8-8-8", "12-8-8", "12-12-8", "12-12-12", "14-12-12", "14-14-12",
                  "14-14-14", "16-14-14", "16-16-14", "16-16-16", "18-16-16", "18-18-16"]
        },
        {
          id: "shyby",
          name: "Shyby nadhmatem",
          sets: 10, ss: 1,
          guided: { rest: 45 },
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
          guided: { work: 45, rest: 45 },
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
          guided: { work: 50 },
          weeks: ["2+2 2x10 kg", "4+4 2x10 kg", "6+6 2x10 kg", "3+3 2x12 kg", "5+5 2x12 kg",
                  "2+2 2x14 kg", "4+4 2x14 kg", "6+6 2x14 kg", "3+3 2x16 kg", "5+5 2x16 kg",
                  "2+2 2x18 kg", "4+4 2x18 kg"]
        },
        {
          id: "swing",
          name: "Jednoruční swing",
          sets: 10,
          block: "zhušťovací série · obě ruce v minutě",
          guided: { work: 60, rest: 0 },
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
          guided: { work: 45 },
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
          guided: { work: 30 },
          note: "BW · 15cm bedýnka",
          weeks: ["2", "3", "4", "5", "6", "6", "6", "7", "8",
                  "2x špičky k hrazdě", "3x špičky k hrazdě", "4x špičky k hrazdě"]
        },
        {
          id: "mt",
          name: "MT na jedné noze – křižné držení",
          sets: 5, ss: 3, pause: "1:30",
          guided: { work: 50 },
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
          guided: { work: 120, rest: 15 },
          note: "1 TGU = 4× press · lze použít i jednoručku",
          weeks: ["8-8-8", "12-8-8", "12-12-8", "12-12-12", "14-12-12", "14-14-12",
                  "14-14-14", "16-14-14", "16-16-14", "16-16-16", "18-16-16", "18-18-16"]
        },
        {
          id: "shyby",
          name: "Shyby nadhmatem",
          sets: 10, ss: 1,
          guided: { rest: 45 },
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
          guided: { work: 45, rest: 45 },
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
          guided: { work: 50 },
          weeks: ["3+3 2x10 kg", "5+5 2x10 kg", "2+2 2x12 kg", "4+4 2x12 kg", "6+6 2x12 kg",
                  "3+3 2x14 kg", "5+5 2x14 kg", "2+2 2x16 kg", "4+4 2x16 kg", "6+6 2x16 kg",
                  "3+3 2x18 kg", "5+5 2x18 kg"]
        },
        {
          id: "swing",
          name: "Jednoruční swing",
          sets: 9,
          block: "zhušťovací série · obě ruce v minutě",
          guided: { work: 60, rest: 0 },
          weeks: ["6+6; 9 sérií 16kg", "8+8; 7 sérií 16kg", "10+10; 5 sérií 16kg",
                  "6+6; 9 sérií 20kg", "8+8; 7 sérií 20kg", "10+10; 5 sérií 20kg",
                  "6+6; 9 sérií 22kg", "8+8; 7 sérií 22kg", "10+10; 5 sérií 22kg",
                  "6+6; 9 sérií 24kg", "8+8; 7 sérií 24kg", "10+10; 5 sérií 24kg"]
        }
      ]
    }
  ]
};
