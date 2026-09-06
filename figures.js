/* =========================================================
   Ilustrace pozic hormonální jógy
   Překreslené podle fotek na cvičebním listu do čistých SVG:
   škálují se bez rozmazání, dědí barvu textu (fungují v tmavém
   i světlém režimu) a nepotřebují žádné stahování obrázků.
   Klíč = id položky v YOGA.sections.
   ========================================================= */

const YOGA_FIGS = {

  /* ---------- zahřívací cvičení ---------- */

  // ruce nad hlavu a zpět dolů
  w1: `<path class="gr" d="M10 90H110"/>
    <circle class="h" cx="60" cy="26" r="7.5"/>
    <path class="b" d="M60 34v26M60 60l-8 28M60 60l8 28M60 40 48 26l8-14M60 40l12-14-8-14"/>
    <path class="ar" d="M97 20v42M92 25l5-6 5 6M92 57l5 6 5-6"/>`,

  // úklon do strany, ruce u hlavy
  w2: `<path class="gr" d="M10 90H110"/>
    <circle class="h" cx="46" cy="30" r="7.5"/>
    <path class="b" d="M62 62c-3-16-6-22-12-28M52 38 38 26M54 43 40 32M62 62l-6 26M62 62l8 26"/>
    <path class="ar" d="M84 34h20M99 29l6 5-6 5"/>`,

  // samba – ruce za hlavou, boky do stran
  w3: `<path class="gr" d="M10 90H110"/>
    <circle class="h" cx="60" cy="24" r="7.5"/>
    <path class="b" d="M60 32v26M60 38 46 30l6-11M60 38l14-8-6-11M64 58l-8 30M64 58l8 30"/>
    <path class="ar" d="M28 62h16M33 57l-6 5 6 5M92 62H76M87 57l6 5-6 5"/>`,

  // protažení nohy v lehu
  w4: `<path class="gr" d="M8 82H112"/>
    <circle class="h" cx="24" cy="66" r="7.5"/>
    <path class="b" d="M32 68h30M62 68 70 38M68 40l6-4M62 68l34 6M44 68l22-22"/>`,

  // poletující vlasy – sed, ruce u hlavy, rotace
  w5: `<circle class="h" cx="60" cy="26" r="7.5"/>
    <path class="b" d="M60 34v24M60 38 46 32l6-12M60 38l14-6-6-12M40 74q20-10 40 0M44 74h32"/>
    <path class="ar" d="M32 40q-6 8 0 16M88 40q6 8 0 16"/>
    <path class="hr" d="M52 18l-6-6M60 15V7M68 18l6-6"/>`,

  // sedící kočka – prohnutí a vyhrbení
  w6: `<path class="gr" d="M20 84H100"/>
    <circle class="h" cx="40" cy="34" r="7.5"/>
    <path class="b" d="M46 40q16 6 30 16M50 44l4 20M76 56l10 14-22 6"/>
    <path class="ar" d="M62 22q10-6 18 2M76 20l4 6-7 1"/>`,

  // kyčle – padání nohou dovnitř a ven
  w7: `<path class="gr" d="M8 82H112"/>
    <circle class="h" cx="22" cy="62" r="7.5"/>
    <path class="b" d="M30 64h30M60 64l14-20 12 20M34 64l14 10"/>
    <path class="ar" d="M88 40h14M97 35l6 5-6 5M88 56h14M97 51l6 5-6 5"/>`,

  /* ---------- denní sestava ---------- */

  // 1. ardha supta virásana – leh s pokrčenou nohou
  y1: `<path class="gr" d="M8 80H112"/>
    <circle class="h" cx="24" cy="58" r="7.5"/>
    <path class="b" d="M32 61h34M66 61l14-8-4 18M66 61l38 6M40 62l14 12"/>`,

  // 2. mahásana – klek, ruce za hlavou
  y2: `<path class="gr" d="M20 84H100"/>
    <circle class="h" cx="52" cy="24" r="7.5"/>
    <path class="b" d="M52 32l4 28M52 38 40 30l6-12M52 38l14-6-4-12M56 60l14 12-24 6"/>
    <path class="ar" d="M78 26h14M87 21l6 5-6 5"/>`,

  // 3. mandukásana – klek, ruce v namaste
  y3: `<path class="gr" d="M14 84H106"/>
    <circle class="h" cx="60" cy="22" r="7.5"/>
    <path class="b" d="M60 30v22M60 36 48 46l10 6M60 36l12 10-10 6M60 52 36 74l-8 6M60 52l24 22 8 6"/>`,

  // 4. agnisahar – předklon, ruce na stehnech, podtlak břicha
  y4: `<path class="gr" d="M10 90H110"/>
    <circle class="h" cx="42" cy="24" r="7.5"/>
    <path class="b" d="M48 30l18 16M50 34l10 26M66 46l-2 42M66 46l6 42"/>
    <path class="dn" d="M54 44a7 7 0 1 0 .1 0"/>`,

  // 5. paršvottanásana – předklon nad přední nohou, ruce za zády
  y5: `<path class="gr" d="M10 90H110"/>
    <circle class="h" cx="34" cy="44" r="7.5"/>
    <path class="b" d="M41 46l24-12M48 44l20-20M65 34 46 88M65 34l22 54"/>`,

  // 6. energie – leh, zápěstí do podkolení
  y6: `<path class="gr" d="M8 84H112"/>
    <circle class="h" cx="24" cy="62" r="7.5"/>
    <path class="b" d="M32 65h26M58 65 66 40l18 8M40 66l24-18"/>`,

  // 7. kopání do hýždí
  y7: `<path class="gr" d="M8 84H112"/>
    <circle class="h" cx="22" cy="64" r="7.5"/>
    <path class="b" d="M30 66h28M58 66l16-22-6 26"/>
    <path class="dn" d="M58 66l20-10 4 20"/>
    <path class="ar" d="M92 46q8 8 0 18"/>`,

  // 8. čištění nádis – leh, dech nosními dírkami
  y8: `<path class="gr" d="M8 84H112"/>
    <circle class="h" cx="24" cy="64" r="7.5"/>
    <path class="b" d="M32 66h30M62 66l14-18 12 18M40 66l12 8"/>
    <path class="ar" d="M22 48q4-8 12-6M18 44l-4 6 7 1"/>`,

  // 9. dynamická vilomásana – most
  y9: `<path class="gr" d="M8 88H112"/>
    <circle class="h" cx="20" cy="72" r="7.5"/>
    <path class="b" d="M28 74q26-30 48-14l10 26M30 78l28 6"/>`,

  // 10. džánušíršásana – předklon k natažené noze
  y10: `<path class="gr" d="M12 84H108"/>
    <circle class="h" cx="38" cy="50" r="7.5"/>
    <path class="b" d="M45 54l22 10M67 64 26 74l-4-8M46 58 28 72M67 64l16 12-20 6"/>`,

  // 11. súrja bhédana – protažení s uddijána bandhou
  y11: `<path class="gr" d="M8 84H112"/>
    <circle class="h" cx="58" cy="62" r="7.5"/>
    <path class="b" d="M50 62H22M66 64h38M54 68l6 8"/>
    <path class="dn" d="M74 58a7 7 0 1 0 .1 0"/>`,

  // 12. tři bandhy – klek, tři zámky
  y12: `<path class="gr" d="M18 84H102"/>
    <circle class="h" cx="56" cy="22" r="7.5"/>
    <path class="b" d="M56 30l2 24M56 36 46 54M56 36l12 18M58 54l14 14-24 6"/>
    <path class="ar" d="M68 30h8M68 40h8M68 50h8"/>`,

  // 13. baddhakonásana – motýl
  y13: `<path class="gr" d="M14 82H106"/>
    <circle class="h" cx="60" cy="22" r="7.5"/>
    <path class="b" d="M60 30v22M60 36 44 58M60 36l16 22M60 54 36 70l24 6 24-6-24-16"/>`,

  // 14. dynamická viparita – svíčka
  y14: `<path class="gr" d="M8 88H112"/>
    <circle class="h" cx="24" cy="80" r="7.5"/>
    <path class="b" d="M32 80l20-38M52 42l4-28M52 42l14-24M34 82l12-22"/>`,

  // 15. harmonizace – leh, čištění nádis v nohách
  y15: `<path class="gr" d="M8 82H112"/>
    <circle class="h" cx="24" cy="60" r="7.5"/>
    <path class="b" d="M32 62h46M78 62l26 6M38 62 30 50"/>
    <path class="ar" d="M84 44q6 4 12 0M84 52q6 4 12 0"/>`,

  // 16. jóga nidrá – relaxace, sedm čaker
  y16: `<path class="gr" d="M8 82H112"/>
    <circle class="h" cx="22" cy="62" r="7.5"/>
    <path class="b" d="M30 64h46M76 64l24-6M76 64l24 10M38 66l8 12M38 62l8-12"/>
    <path class="ch" d="M32 62h0M40 62h0M48 62h0M56 62h0M64 62h0M72 62h0M22 52h0"/>`
};

/* Vrátí hotové SVG pro pozici (prázdný řetězec, pokud obrázek nemám). */
function figSvg(id, cls) {
  const g = YOGA_FIGS[id];
  if (!g) return "";
  return `<svg class="yfig ${cls || ""}" viewBox="0 0 120 96" aria-hidden="true">${g}</svg>`;
}
