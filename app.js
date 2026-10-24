/* =========================================================
   Trénink – jednoduchý tracker tréninkového plánu
   Čistý JavaScript bez závislostí. Data žijí v localStorage.
   ========================================================= */
"use strict";

const APP_VERSION = "1.10.0";
const STORAGE_KEY = "trenink-tracker.v1";
const EXPORT_APP_ID = "trenink-tracker";

/* ---------------- úložiště ---------------- */

const DEFAULT_SETTINGS = { theme: "auto", timer: true, sound: true, voice: true, duck: true, notif: true };

const store = {
  sessions: [],                       // všechny tréninky (aktivní i dokončené)
  settings: Object.assign({}, DEFAULT_SETTINGS),
  activeId: null,                     // id rozdělaného tréninku
  program: { restartWeek: null, restartAt: null },  // návrat v programu (nemoc/dovolená)
  yoga: []                            // záznamy hormonální jógy (vlastní historie)
};

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.sessions)) store.sessions = data.sessions;
    if (data.settings && typeof data.settings === "object") {
      store.settings = Object.assign({}, DEFAULT_SETTINGS, data.settings);
    }
    store.activeId = typeof data.activeId === "string" ? data.activeId : null;
    if (store.activeId && !store.sessions.some(s => s.id === store.activeId)) {
      store.activeId = null;
    }
    if (data.program && typeof data.program === "object") {
      store.program = Object.assign({ restartWeek: null, restartAt: null }, data.program);
    }
    if (Array.isArray(data.yoga)) store.yoga = data.yoga;
  } catch (err) {
    console.error("Nepodařilo se načíst uložená data:", err);
  }
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error(err);
    showToast("⚠️ Uložení se nepovedlo (plné úložiště?)");
  }
}

/* ---------------- pomocné ---------------- */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function pad2(n) { return String(n).padStart(2, "0"); }

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateFromISO(iso) {
  const [y, m, d] = String(iso || "").split("-").map(Number);
  return new Date(y || 2000, (m || 1) - 1, d || 1);
}

function fmtShort(iso) {
  if (!iso) return "";
  const d = dateFromISO(iso);
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

function fmtFull(iso) {
  if (!iso) return "";
  return dateFromISO(iso).toLocaleDateString("cs-CZ", {
    weekday: "short", day: "numeric", month: "numeric", year: "numeric"
  });
}

function mondayOf(d) {
  const x = new Date(d);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  x.setHours(0, 0, 0, 0);
  return x;
}

/* ---------------- plán ---------------- */

function getDay(dayId) {
  return PLAN.days.find(d => d.id === dayId) || null;
}

function getEx(dayId, exId) {
  const day = getDay(dayId);
  return day ? day.exercises.find(e => e.id === exId) || null : null;
}

/* Převod buňky z tabulky na jednotlivé série.
   Vrací { labels: [hodnota série…], note, kind } */
function parsePrescription(cell, defaultSets) {
  const c = String(cell || "").trim();
  const n = Math.max(1, defaultSets || 1);

  // "5+5; 10 sérií 16kg"
  let m = c.match(/^(\d+\+\d+);\s*(\d+)\s*séri[íie]\s*(.*)$/i);
  if (m) return { labels: Array(+m[2]).fill(m[1]), note: m[3].trim(), kind: "density" };

  // "6-5-5-5-5" nebo "8-8-8" (vše čísla)
  const tokens = c.split(/[\s-]+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every(t => /^\d+$/.test(t))) {
    return { labels: tokens, note: "", kind: "list" };
  }

  // "8x 2,5 stopy" / "6x 45 kg" / "2x špičky k hrazdě"
  m = c.match(/^(\d+)x\s*(.*)$/i);
  if (m) return { labels: Array(n).fill(m[1]), note: m[2].trim(), kind: "perset" };

  // "2+2 50 cm sit" / "2+2 2x10 kg"
  m = c.match(/^(\d+\+\d+)\s+(.*)$/);
  if (m) return { labels: Array(n).fill(m[1]), note: m[2].trim(), kind: "perset" };

  // "5" nebo "5+5"
  m = c.match(/^(\d+(?:\+\d+)?)$/);
  if (m) return { labels: Array(n).fill(m[1]), note: "", kind: "reps" };

  // "5 - pomalejší negativ"
  m = c.match(/^(\d+(?:\+\d+)?)\s*[-–]\s*(.+)$/);
  if (m) return { labels: Array(n).fill(m[1]), note: m[2].trim(), kind: "repsnote" };

  // nerozpoznaný formát – série bez předvyplněné hodnoty
  return { labels: Array(n).fill(""), note: c, kind: "raw" };
}

function targetsFor(dayId, week) {
  const day = getDay(dayId);
  if (!day) return {};
  const out = {};
  for (const ex of day.exercises) {
    const cell = ex.weeks[week - 1] || "";
    out[ex.id] = Object.assign({ cell }, parsePrescription(cell, ex.sets));
  }
  return out;
}

function decorate(ex, label) {
  if (!label) return "–";
  if (ex && ex.unit === "kg" && /^\d+(?:[.,]\d+)?$/.test(label)) return label + " kg";
  return label;
}

function targetSummary(ex, t) {
  let s = t.cell || "–";
  if (["perset", "reps", "repsnote", "raw"].includes(t.kind)) {
    s += ` · ${t.labels.length} sérií`;
  }
  return s;
}

function repsOf(label) {
  const nums = String(label || "").match(/\d+(?:[.,]\d+)?/g);
  if (!nums) return 0;
  return nums.reduce((a, b) => a + parseFloat(b.replace(",", ".")), 0);
}

function kgOf(label) {
  const m = String(label || "").match(/\d+(?:[.,]\d+)?/);
  return m ? parseFloat(m[0].replace(",", ".")) : 0;
}

/* ---------------- tréninky (sessions) ---------------- */

function getSession(id) {
  return store.sessions.find(s => s.id === id) || null;
}

function doneSessions() {
  return store.sessions
    .filter(s => s.status === "done")
    .sort((a, b) => (a.date === b.date)
      ? String(a.updatedAt).localeCompare(String(b.updatedAt))
      : String(a.date).localeCompare(String(b.date)));
}

function touch(sess) {
  sess.updatedAt = new Date().toISOString();
  saveStore();
}

function newSession(dayId, week) {
  const day = getDay(dayId);
  const targets = targetsFor(dayId, week);
  const sess = {
    id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    dayId, week,
    date: todayISO(),
    startedAt: new Date().toISOString(),
    finishedAt: null,
    status: "active",
    warmup: PLAN.warmup.map(() => false),
    exercises: {},
    note: "",
    updatedAt: new Date().toISOString()
  };
  for (const ex of day.exercises) {
    sess.exercises[ex.id] = {
      sets: targets[ex.id].labels.map(() => ({ done: false, actual: null })),
      note: ""
    };
  }
  return sess;
}

function startSession(dayId, week, guidedMode) {
  if (store.activeId) {
    const act = getSession(store.activeId);
    const label = act ? `${act.dayId} · Týden ${act.week}` : "";
    if (!confirm(`Máš rozdělaný trénink (${label}). Zahodit ho a začít nový?`)) return;
    store.sessions = store.sessions.filter(s => s.id !== store.activeId);
    store.activeId = null;
    if (guided) stopGuided();
  }
  const sess = newSession(dayId, week);
  store.sessions.push(sess);
  store.activeId = sess.id;
  saveStore();
  if (guidedMode) startGuided(sess.id);
  else location.hash = "#/workout/" + sess.id;
}

function setsDoneCount(sess) {
  let n = 0;
  for (const ex of Object.values(sess.exercises)) n += ex.sets.filter(s => s.done).length;
  return n;
}

function setsTotalCount(sess) {
  let n = 0;
  for (const ex of Object.values(sess.exercises)) n += ex.sets.length;
  return n;
}

function sessionsFor(dayId, week) {
  return doneSessions().filter(s => s.dayId === dayId && s.week === week);
}

function lastDoneFor(dayId) {
  const list = doneSessions().filter(s => s.dayId === dayId);
  return list.length ? list[list.length - 1] : null;
}

/* ---- návrat v programu (po nemoci/dovolené) ----
   Když je nastaven restartWeek, „na řadě“ se počítá jen ze záznamů
   dokončených PO nastavení návratu – dřívější historie zůstává,
   ale týdny od restartWeek se nabízejí znovu. */

function restartActive() {
  return !!(store.program && store.program.restartWeek);
}

function isAfterRestart(s) {
  if (!restartActive()) return true;
  return String(s.finishedAt || s.updatedAt || "") >= String(store.program.restartAt || "");
}

function effDone(dayId, week) {
  return sessionsFor(dayId, week).filter(isAfterRestart);
}

function programStartWeek() {
  return restartActive() ? store.program.restartWeek : 1;
}

function defaultWeekFor(dayId) {
  for (let w = programStartWeek(); w <= PLAN.weeks; w++) {
    if (!effDone(dayId, w).length) return w;
  }
  return PLAN.weeks;
}

function suggestion() {
  for (let w = programStartWeek(); w <= PLAN.weeks; w++) {
    for (const dayId of PLAN.order) {
      if (!effDone(dayId, w).length) return { dayId, week: w };
    }
  }
  return null;
}

function targetLabelsOf(sess, exId) {
  const t = targetsFor(sess.dayId, sess.week)[exId];
  return t ? t.labels : [];
}

/* Poslední odcvičený výkon daného cviku (napříč dny A1/A2). */
function lastPerformance(exId, excludeId) {
  const list = doneSessions();
  for (let i = list.length - 1; i >= 0; i--) {
    const s = list[i];
    if (s.id === excludeId) continue;
    const ex = s.exercises[exId];
    if (!ex || !ex.sets.some(x => x.done)) continue;
    const labels = targetLabelsOf(s, exId);
    const exDef = getEx(s.dayId, exId);
    const values = ex.sets
      .map((x, j) => x.done ? decorate(exDef, x.actual || labels[j] || "✓") : null)
      .filter(Boolean);
    return { session: s, values };
  }
  return null;
}

/* ---------------- akce v tréninku ---------------- */

function toggleSet(sid, exId, i) {
  const sess = getSession(sid);
  if (!sess) return;
  const set = sess.exercises[exId].sets[i];
  set.done = !set.done;
  if (!set.done) set.actual = null;
  touch(sess);
  const inGuided = guided && guided.sid === sid;
  if (set.done && sess.status === "active" && store.settings.timer && !inGuided) {
    const ex = getEx(sess.dayId, exId);
    if (ex && ex.pause) startRest(parsePause(ex.pause), ex.name);
  }
  render();
}

function setActual(sid, exId, i, value) {
  const sess = getSession(sid);
  if (!sess) return;
  const set = sess.exercises[exId].sets[i];
  const v = String(value || "").trim();
  set.actual = v || null;
  if (v) set.done = true;
  touch(sess);
  render();
}

function finishSession(sid) {
  const sess = getSession(sid);
  if (!sess) return;
  if (setsDoneCount(sess) === 0 &&
      !confirm("Nemáš odškrtnutou žádnou sérii. Opravdu trénink uložit?")) return;
  sess.status = "done";
  sess.finishedAt = new Date().toISOString();
  if (store.activeId === sid) store.activeId = null;
  touch(sess);
  stopRest();
  if (guided && guided.sid === sid) stopGuided();
  showToast("Trénink uložen 💪");
  location.hash = "#/session/" + sid;
}

function cancelSession(sid) {
  if (!confirm("Zrušit rozdělaný trénink a smazat jeho záznam?")) return;
  store.sessions = store.sessions.filter(s => s.id !== sid);
  if (store.activeId === sid) store.activeId = null;
  saveStore();
  stopRest();
  if (guided && guided.sid === sid) stopGuided();
  location.hash = "#/";
}

function deleteSession(sid) {
  if (!confirm("Opravdu smazat tento záznam tréninku?")) return;
  store.sessions = store.sessions.filter(s => s.id !== sid);
  if (store.activeId === sid) store.activeId = null;
  saveStore();
  if (guided && guided.sid === sid) stopGuided();
  showToast("Záznam smazán");
  location.hash = "#/history";
}

/* ---------------- odpočet pauzy ---------------- */

let restTimer = null;     // { until, label }
let restInterval = null;

function parsePause(p) {
  const m = String(p).match(/^(\d+):(\d+)$/);
  if (m) return (+m[1]) * 60 + (+m[2]);
  const n = parseInt(p, 10);
  return isNaN(n) ? 90 : n;
}

function startRest(seconds, label) {
  restTimer = { until: Date.now() + seconds * 1000, label };
  if (!restInterval) restInterval = setInterval(renderTimer, 250);
  renderTimer();
}

function stopRest() {
  restTimer = null;
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
  renderTimer();
}

function renderTimer() {
  const el = document.getElementById("timer");
  if (!el) return;
  // pilulka řízeného tréninku, když je uživatel na jiné obrazovce
  if (guided && !guided.finished && !(location.hash || "").startsWith("#/guided")) {
    const step = guided.steps[guided.idx];
    const remain = guided.paused ? guided.remainMs : Math.max(0, guided.endsAt - Date.now());
    const s = Math.max(0, Math.ceil(remain / 1000));
    const what = guided.phase === "rest" ? "pauza" : `S${step.setIdx + 1}`;
    el.innerHTML = `<div class="timerpill" data-act="nav" data-href="#/guided/${guided.sid}">
      ${guided.paused ? "⏸" : "▶"} <span class="lbl">${esc(step.name)} · ${esc(what)}</span>
      ${Math.floor(s / 60)}:${pad2(s % 60)}</div>`;
    return;
  }
  if (!restTimer) { el.innerHTML = ""; return; }
  const ms = restTimer.until - Date.now();
  if (ms <= -6000) { stopRest(); return; }
  if (ms <= 0) {
    if (!restTimer.buzzed) {
      restTimer.buzzed = true;
      if (navigator.vibrate) navigator.vibrate([180, 90, 180]);
    }
    el.innerHTML = `<div class="timerpill zero" data-act="timer-off">Pauza hotová – jedem! 💪</div>`;
    return;
  }
  const s = Math.ceil(ms / 1000);
  el.innerHTML = `<div class="timerpill" data-act="timer-off">
    <span class="lbl">pauza</span> ${Math.floor(s / 60)}:${pad2(s % 60)}
    <span class="lbl">✕</span></div>`;
}

/* ---------------- zvuky a hlas ---------------- */
/* Pípání jde přes Web Audio: mixuje se s hudbou (YouTube Music apod.) a nezastaví ji.
   Obdélníkový tón je přes hudbu slyšet výrazně líp než čistý sinus. */

const CUES = {                       // [frekvence Hz, délka s, posun s]
  work: [[1175, 0.14, 0], [1568, 0.2, 0.17]],
  rest: [[784, 0.16, 0], [392, 0.34, 0.19]],
  tick: [[880, 0.11, 0]],
  done: [[1047, 0.16, 0], [1319, 0.16, 0.19], [1568, 0.4, 0.38]]
};
const CUE_VIBES = { work: 120, rest: 60, done: [150, 80, 150, 80, 300] };
const CUE_VOL = 0.75;

let audioCtx = null;

function ensureAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  } catch { /* zařízení bez Web Audio */ }
  resumeAudio();
  prepareDuck();
}

// „suspended“ i iOS „interrupted“ (třeba když se rozehraje jiná appka)
function resumeAudio() {
  try {
    if (audioCtx && audioCtx.state !== "running") {
      const p = audioCtx.resume();
      if (p && p.catch) p.catch(() => {});
    }
  } catch { /* ignore */ }
}

function tone(freq, dur, at) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "square";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(CUE_VOL, at + 0.008);
  g.gain.setValueAtTime(CUE_VOL, at + dur - 0.03);
  g.gain.linearRampToValueAtTime(0, at + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(at);
  o.stop(at + dur + 0.02);
  return o;
}

/* Zahraje signál hned, nebo v čase `at` (hodiny audio kontextu).
   Vrací [{o, a}] – oscilátory a jejich start, ať jde naplánované pípání zrušit. */
function playCue(name, at) {
  if (!store.settings.sound || !audioCtx) return [];
  try {
    const t0 = at === undefined ? audioCtx.currentTime : at;
    return CUES[name].map(([f, d, off]) => ({ o: tone(f, d, t0 + off), a: t0 + off }));
  } catch { return []; }
}

function vibrate(pattern) { if (pattern && navigator.vibrate) navigator.vibrate(pattern); }

function soundWork() { playCue("work"); vibrate(CUE_VIBES.work); }
function soundTick() { playCue("tick"); }
function soundDone() { playCue("done"); vibrate(CUE_VIBES.done); }

/* Ztišení hudby (Android): krátký tichý zvuk přes <audio> si v Chrome řekne
   o „přechodný“ audio focus, takže YouTube Music apod. na chvíli ztiší
   (nezastaví). Chrome to dělá jen u médií se známou délkou do 5 s, proto má
   klip 4,5 s a při delším hlášení se přetáčí na začátek. Na iPhonu by <audio>
   hudbu zastavilo, tam se ztišení nepoužívá. */
const DUCK_SEC = 4.5;
const CAN_DUCK = /Android/.test(navigator.userAgent) && /Chrome\//.test(navigator.userAgent);
const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
let duckEl = null;

function silentWav(sec, rate = 8000) {
  const n = Math.round(sec * rate);
  const v = new DataView(new ArrayBuffer(44 + n * 2));   // 16bit mono PCM, samé nuly
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVE");
  str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, n * 2, true);
  return new Blob([v.buffer], { type: "audio/wav" });
}

function prepareDuck() {
  if (!CAN_DUCK || duckEl) return;
  try {
    duckEl = new Audio(URL.createObjectURL(silentWav(DUCK_SEC)));
    duckEl.preload = "auto";
    duckEl.addEventListener("timeupdate", () => {
      if (duckEl.currentTime > DUCK_SEC - 1 && speechBusy()) duckEl.currentTime = 0;
    });
    duckEl.load();
  } catch { duckEl = null; }
}

function duck() {
  if (!duckEl || !store.settings.duck) return;
  // bez známé délky by to Chrome bral jako hudbu a YouTube Music by zastavil
  if (duckEl.readyState < 1 || !(duckEl.duration <= 5)) return;
  try {
    duckEl.currentTime = 0;
    const p = duckEl.play();
    if (p && p.catch) p.catch(() => {});
  } catch { /* ignore */ }
}

function speechBusy() {
  try { return "speechSynthesis" in window && (speechSynthesis.speaking || speechSynthesis.pending); }
  catch { return false; }
}

function speak(text) {
  if (!store.settings.voice) return;
  try {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "cs-CZ";
    u.rate = 1.05;
    u.volume = 1;
    duck();
    speechSynthesis.speak(u);
  } catch { /* ignore */ }
}

function speakable(label) {
  return String(label || "").replace(/\+/g, " plus ").replace(/,/g, " celá ");
}

/* Udržovací tón: 25 Hz těsně nad prahem ticha – neslyšitelný, ale prohlížeč
   stránku bere jako „hrající zvuk“, takže ji na pozadí (zamčený displej,
   přepnutí do jiné appky) neuspí a nepřibrzdí jí časovače. */
let keepAlive = null;

function startKeepAlive() {
  if (keepAlive || !audioCtx) return;
  try {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = 25;
    g.gain.value = 0.003;
    o.connect(g).connect(audioCtx.destination);
    o.start();
    keepAlive = o;
  } catch { keepAlive = null; }
}

function stopKeepAlive() {
  try { if (keepAlive) { keepAlive.stop(); keepAlive.disconnect(); } } catch { /* ignore */ }
  keepAlive = null;
}

/* ---------------- řízený trénink (autopilot) ---------------- */
/* Vygeneruje z tréninku posloupnost kroků série/pauza, sám odpočítává,
   píská, hlásí cviky a odškrtává hotové série. */

const GUIDED_DEFAULTS = { work: 40, transition: 10, rest: 60 };

let guided = null;        // {sid, steps, idx, phase, endsAt, dur, paused, autoPaused, remainMs, lastBeep, finished}
let guidedInterval = null;

function exGuidedCfg(ex) {
  const g = (ex && ex.guided) || {};
  const rest = g.rest !== undefined ? g.rest
    : (ex && ex.pause ? parsePause(ex.pause) : GUIDED_DEFAULTS.rest);
  return { work: g.work !== undefined ? g.work : GUIDED_DEFAULTS.work, rest };
}

/* Kroky: supersérie se střídají po kolech („oba cviky a pak pauza“),
   u nestejného počtu sérií se kratší cvik rozprostře (10+5 → 2S+1S). */
function buildGuidedSteps(sess) {
  const day = getDay(sess.dayId);
  const targets = targetsFor(sess.dayId, sess.week);
  const steps = [];
  for (const g of groupBySS(day.exercises)) {
    const counts = g.items.map(ex => sess.exercises[ex.id].sets.length);
    const R = Math.max(...counts, 1);
    for (let r = 1; r <= R; r++) {
      const round = [];
      g.items.forEach((ex, gi) => {
        const c = counts[gi];
        const from = Math.floor((r - 1) * c / R);
        const to = Math.floor(r * c / R);
        for (let s = from; s < to; s++) round.push({ ex, setIdx: s });
      });
      round.forEach((it, i) => {
        const cfg = exGuidedCfg(it.ex);
        const t = targets[it.ex.id];
        steps.push({
          exId: it.ex.id,
          name: it.ex.name,
          setIdx: it.setIdx,
          setTotal: sess.exercises[it.ex.id].sets.length,
          label: t.labels[it.setIdx] ? decorate(it.ex, t.labels[it.setIdx]) : "",
          note: t.note || "",
          work: cfg.work,
          ss: g.ss || 0,
          roundEnd: i === round.length - 1,
          restAfter: i === round.length - 1 ? cfg.rest : GUIDED_DEFAULTS.transition
        });
      });
    }
  }
  return steps.filter(st => !sess.exercises[st.exId].sets[st.setIdx].done);
}

function guidedTotalSeconds(steps, fromIdx = 0) {
  let t = 0;
  for (let i = fromIdx; i < steps.length; i++) {
    t += steps[i].work;
    if (i < steps.length - 1) t += steps[i].restAfter;
  }
  return t;
}

/* Co přijde po fázi (idx, phase): {idx, phase, dur}, nebo null = konec tréninku. */
function guidedNextPhase(idx, phase) {
  const st = guided.steps[idx];
  if (phase === "work") {
    if (idx === guided.steps.length - 1) return null;
    if (st.restAfter > 0) return { idx, phase: "rest", dur: st.restAfter };
  }
  return { idx: idx + 1, phase: "work", dur: guided.steps[idx + 1].work };
}

/* Pípání se plánuje dopředu na hodinách audio kontextu, takže zazní přesně
   i ve chvíli, kdy prohlížeč na pozadí přibrzdí JavaScript. */
const CUE_AHEAD = 180000;   // ms dopředu
let cueNodes = [];          // naplánované oscilátory [{o, a}]
let cueCursor = null;       // první fáze, která ještě není naplánovaná {idx, phase, start, end}
let cueSync = null;         // {ctx, wall} – stav obou hodin při naplánování

function clearCues() {
  const now = audioCtx ? audioCtx.currentTime : 0;
  for (const n of cueNodes) {
    if (n.a <= now) continue;            // už hraje nebo dohrálo
    try { n.o.stop(); } catch { /* ignore */ }
    try { n.o.disconnect(); } catch { /* ignore */ }
  }
  cueNodes = [];
  cueCursor = null;
  cueSync = null;
}

// zruší naplánované pípání a naplánuje ho znovu podle aktuálního stavu
function resetCues() {
  clearCues();
  if (!guided || guided.paused || guided.finished || !store.settings.sound || !audioCtx) return;
  cueSync = { ctx: audioCtx.currentTime, wall: Date.now() };
  cueCursor = { idx: guided.idx, phase: guided.phase, start: guided.endsAt - guided.dur * 1000, end: guided.endsAt };
  topUpCues();
}

function topUpCues() {
  if (!cueSync) return;
  const now = Date.now();
  const at = wall => cueSync.ctx + (wall - cueSync.wall) / 1000;
  const add = (name, t) => { if (t >= now - 50) cueNodes.push(...playCue(name, at(t))); };
  cueNodes = cueNodes.filter(n => n.a > audioCtx.currentTime - 2);
  while (cueCursor && cueCursor.start < now + CUE_AHEAD) {
    const { idx, phase, start, end } = cueCursor;
    for (let k = 3; k >= 1; k--) if (end - k * 1000 > start + 500) add("tick", end - k * 1000);
    const nx = guidedNextPhase(idx, phase);
    add(nx ? nx.phase : "done", end);
    cueCursor = nx && { idx: nx.idx, phase: nx.phase, start: end, end: end + nx.dur * 1000 };
  }
}

function cueDrift() {
  return (audioCtx.currentTime - cueSync.ctx) - (Date.now() - cueSync.wall) / 1000;
}

// běží audio a naplánované pípání sedí s hodinami?
function cuesInSync() {
  return !!(cueSync && audioCtx && audioCtx.state === "running" && Math.abs(cueDrift()) < 0.25);
}

function startGuided(sid) {
  const sess = getSession(sid);
  if (!sess) return;
  const steps = buildGuidedSteps(sess);
  if (!steps.length) { showToast("Všechny série už máš hotové ✓"); return; }
  ensureAudio();
  stopRest();
  guided = {
    sid, steps, idx: 0, phase: "work",
    dur: steps[0].work,
    endsAt: Date.now() + steps[0].work * 1000,
    paused: false, autoPaused: false, remainMs: 0, lastBeep: null, finished: false
  };
  if (!guidedInterval) guidedInterval = setInterval(guidedTick, 250);
  requestWake();
  startKeepAlive();
  soundWork();
  resetCues();
  announceStep();
  askNotifPermission();
  updateGuidedNotif(true);
  location.hash = "#/guided/" + sid;
  render();
}

function stopGuided() {
  clearCues();
  stopKeepAlive();
  closeGuidedNotif();
  guided = null;
  if (guidedInterval) { clearInterval(guidedInterval); guidedInterval = null; }
  releaseWake();
  try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch { /* ignore */ }
  renderTimer();
}

function announceStep() {
  const st = guided.steps[guided.idx];
  let text = `${st.name}. Série ${st.setIdx + 1} z ${st.setTotal}.`;
  if (st.label) text += ` Cíl ${speakable(st.label)}.`;
  speak(text);
}

function announcePhase() {
  if (guided.phase === "rest") {
    const next = guided.steps[guided.idx + 1];
    speak(`Pauza. Potom ${next.name}, série ${next.setIdx + 1}.`);
  } else {
    announceStep();
  }
}

function guidedTick() {
  if (!guided || guided.paused || guided.finished) return;
  resumeAudio();
  if (wakeWanted && !wakeLock) requestWake();
  const now = Date.now();
  if (now >= guided.endsAt) {
    // po uspání na pozadí: když audio hrálo dál (pípání zaznělo včas), stav se dorovná
    // podle hodin; jinak (iOS uspí i zvuk) se naváže od teď
    advanceGuided(now - guided.endsAt < 3000 || cuesInSync());
    return;
  }
  if (cueSync && audioCtx.state === "running" && Math.abs(cueDrift()) >= 0.25) resetCues();
  else topUpCues();
  const remain = guided.endsAt - now;
  // před koncem fáze ztišit hudbu, ať je slyšet odpočet i hlášení
  if (remain <= 3000 && guided.lastBeep === null) {
    guided.lastBeep = Math.ceil(remain / 1000);
    if (store.settings.sound || store.settings.voice) duck();
  }
  if ((location.hash || "").startsWith("#/guided")) updateGuidedDom(remain);
  else renderTimer();
  updateGuidedNotif();
}

/* Přechod do další fáze. auto = doběhl odpočet: nová fáze navazuje přesně na konec
   staré (pípání je naplánované dopředu, po uspání se dožene i víc fází);
   jinak (ťuknutí, návrat po uspání bez zvuku) začíná nová fáze teď. */
function advanceGuided(auto) {
  if (!guided || guided.finished) return;
  const sess = getSession(guided.sid);
  if (!sess) { stopGuided(); return; }
  const now = Date.now();
  const scheduled = auto && cuesInSync();
  // „Hotovo, dál“ během pauzy: nová fáze se rozběhne (dřív zůstala stát)
  if (!auto) { guided.paused = false; guided.autoPaused = false; }
  let nx;
  do {
    if (guided.phase === "work") {
      const step = guided.steps[guided.idx];
      const set = sess.exercises[step.exId].sets[step.setIdx];
      if (!set.done) { set.done = true; touch(sess); }
    }
    nx = guidedNextPhase(guided.idx, guided.phase);
    if (!nx) break;
    guided.endsAt = (auto ? guided.endsAt : now) + nx.dur * 1000;
    guided.idx = nx.idx;
    guided.phase = nx.phase;
    guided.dur = nx.dur;
  } while (auto && guided.endsAt <= now);
  guided.lastBeep = null;

  if (!nx) {
    guided.finished = true;
    if (scheduled) { cueNodes = []; cueCursor = null; cueSync = null; }   // naplánovaná fanfára dohraje
    else { clearCues(); playCue("done"); }
    vibrate(CUE_VIBES.done);
    speak("Trénink hotový. Dobrá práce!");
    stopKeepAlive();
    releaseWake();
    updateGuidedNotif(true);
    render();
    return;
  }
  if (!scheduled) { playCue(guided.phase); resetCues(); }
  vibrate(CUE_VIBES[guided.phase]);
  announcePhase();
  updateGuidedNotif(true);
  render();
}

function setGuidedPaused(paused) {
  if (!guided || guided.finished || guided.paused === paused) return;
  if (paused) {
    guided.remainMs = Math.max(0, guided.endsAt - Date.now());
  } else {
    guided.endsAt = Date.now() + guided.remainMs;
  }
  guided.paused = paused;
  guided.autoPaused = false;
  resetCues();
  updateGuidedNotif();
}

function pauseGuided() {
  if (!guided || guided.finished) return;
  setGuidedPaused(!guided.paused);
  render();
}

/* Krok zpět jako u přehrávače: jedno ťuknutí spustí aktuální sérii/pauzu znovu
   od začátku, druhé hned po něm (do 3 s od začátku) skočí na předchozí sérii
   a zruší její odškrtnutí. */
const BACK_PREV_MS = 3000;

function backGuided() {
  if (!guided || guided.finished) return;
  const sess = getSession(guided.sid);
  if (!sess) return;
  const remain = guided.paused ? guided.remainMs : guided.endsAt - Date.now();
  const elapsed = guided.dur * 1000 - remain;
  if (elapsed < BACK_PREV_MS && (guided.phase === "rest" || guided.idx > 0)) {
    // v pauze zpět k právě dojeté sérii, při cvičení o sérii zpět
    const target = guided.phase === "rest" ? guided.idx : guided.idx - 1;
    const st = guided.steps[target];
    const set = sess.exercises[st.exId].sets[st.setIdx];
    if (set.done) { set.done = false; set.actual = null; touch(sess); }
    guided.idx = target;
    guided.phase = "work";
  }
  const st = guided.steps[guided.idx];
  guided.dur = guided.phase === "work" ? st.work : st.restAfter;
  guided.endsAt = Date.now() + guided.dur * 1000;
  guided.paused = false;
  guided.autoPaused = false;
  guided.lastBeep = null;
  playCue(guided.phase);
  vibrate(CUE_VIBES[guided.phase]);
  resetCues();
  announcePhase();
  updateGuidedNotif(true);
  render();
}

function extendGuided(sec) {
  if (!guided || guided.finished) return;
  if (guided.paused) guided.remainMs += sec * 1000;
  else guided.endsAt += sec * 1000;
  guided.dur += sec;
  guided.lastBeep = null;
  resetCues();
  updateGuidedNotif();
  render();
}

/* Displej nezhasíná (wake lock). Systém zámek uvolní při skrytí stránky
   (a někdy i sám, třeba při úspoře baterie) → po návratu se vyžádá znovu. */
let wakeLock = null;
let wakeWanted = false;
let wakeTry = 0;

async function requestWake() {
  wakeWanted = true;
  if (wakeLock || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
  if (Date.now() - wakeTry < 10000) return;
  wakeTry = Date.now();
  try {
    const lock = await navigator.wakeLock.request("screen");
    if (!wakeWanted || wakeLock) { lock.release(); return; }
    wakeLock = lock;
    lock.addEventListener("release", () => { if (wakeLock === lock) wakeLock = null; });
    wakeTry = 0;
  } catch { /* nepodporováno / odmítnuto */ }
}
function releaseWake() {
  wakeWanted = false;
  wakeTry = 0;
  const lock = wakeLock;
  wakeLock = null;
  try { if (lock) lock.release(); } catch { /* ignore */ }
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  if (wakeWanted) { wakeTry = 0; requestWake(); }
  resumeAudio();
  guidedTick();   // po návratu hned dorovnat odpočet
});

/* ---------------- průběh v notifikaci (Android) ---------------- */
/* Během řízeného tréninku visí v liště (i na zamčeném displeji) notifikace
   s odpočtem a tlačítky Pauza / Hotovo, dál – trénink je na očích i v jiné appce.
   Chrome aktualizaci se stejným tagem ukáže potichu (bez pípnutí a vibrace)
   a dovolí 2 vlastní tlačítka. Ťuknutí na tlačítko obslouží sw.js a pošle
   ho sem zprávou. iOS tlačítka v notifikacích webových appek neumí. */
const CAN_NOTIFY = /Android/.test(navigator.userAgent) &&
  "Notification" in window && "serviceWorker" in navigator;
const NOTIF_TAG = "guided";
let notifBusy = false;      // čeká se na předchozí showNotification
let notifHidden = false;    // notifikace odsunutá → znovu se ukáže při další fázi
let notifKey = "";          // naposledy zobrazený obsah
let notifGen = 0;           // zvyšuje se zavřením (zahodí rozpracované zobrazení)
let notifIcons = null;      // ikony jako data: URL, ať se každou sekundu nestahují

function notifAllowed() {
  return CAN_NOTIFY && store.settings.notif && Notification.permission === "granted";
}

// o povolení se dá požádat jen po ťuknutí
function askNotifPermission() {
  if (!CAN_NOTIFY || !store.settings.notif || Notification.permission !== "default") return;
  try {
    Promise.resolve(Notification.requestPermission())
      .then(() => { if (Notification.permission === "granted") updateGuidedNotif(true); else render(); })
      .catch(() => {});
  } catch { /* ignore */ }
}

function prepareNotifIcons() {
  if (notifIcons) return;
  notifIcons = { icon: "icons/icon-192.png", badge: undefined };
  try {
    // malá ikonka do stavové lišty: Android z ní bere jen tvar (bílý kettlebell)
    const c = document.createElement("canvas");
    c.width = c.height = 96;
    const g = c.getContext("2d");
    g.fillStyle = g.strokeStyle = "#fff";
    g.lineWidth = 10;
    g.lineCap = "round";
    g.beginPath(); g.arc(48, 38, 20, Math.PI, 0); g.stroke();
    g.beginPath(); g.arc(48, 64, 25, 0, Math.PI * 2); g.fill();
    notifIcons.badge = c.toDataURL("image/png");
  } catch { /* ignore */ }
  fetch("icons/icon-192.png")
    .then(r => r.blob())
    .then(b => new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); }))
    .then(url => { notifIcons.icon = url; })
    .catch(() => {});
}

function guidedNotifContent() {
  if (guided.finished) {
    return { title: "🎉 Trénink hotový!", body: "Ťukni a trénink ulož.", actions: [] };
  }
  const short = id => (PLAN.shortNames || {})[id];
  const st = guided.steps[guided.idx];
  const isWork = guided.phase === "work";
  const next = guided.steps[guided.idx + 1] || null;
  const remain = guided.paused ? guided.remainMs : Math.max(0, guided.endsAt - Date.now());
  const s = Math.ceil(remain / 1000);
  const time = `${Math.floor(s / 60)}:${pad2(s % 60)}`;
  const icon = guided.paused ? "⏸" : (isWork ? "💪" : "💤");
  const shown = isWork ? st : next;
  const title = isWork
    ? `${icon} ${time} · ${short(st.exId) || st.name} S${st.setIdx + 1}/${st.setTotal}`
    : `${icon} ${time} · Pauza → ${short(next.exId) || next.name} S${next.setIdx + 1}`;
  const parts = [isWork ? st.name : `Další: ${next.name}, série ${next.setIdx + 1} z ${next.setTotal}`];
  if (shown.label) parts.push(`cíl ${shown.label}`);
  if (isWork) parts.push(next ? `pak ${short(next.exId) || next.name} S${next.setIdx + 1}` : "poslední série 🔥");
  const ref = isWork ? guided.idx : guided.idx + 1;
  parts.push(`${ref}/${guided.steps.length} sérií · ≈ ${guidedLeftMin(remain)} min`);
  return {
    title,
    body: parts.join(" · "),
    actions: [
      { action: "pause", title: guided.paused ? "▶ Pokračovat" : "⏸ Pauza" },
      { action: "next", title: isWork ? "✓ Hotovo, dál" : "» Přeskočit pauzu" }
    ]
  };
}

/* Zobrazí/aktualizuje notifikaci. force = nová fáze: ukáže se i po odsunutí. */
function updateGuidedNotif(force) {
  if (!guided || !notifAllowed() || notifBusy) return;
  if (notifHidden && !force) return;
  const c = guidedNotifContent();
  const key = c.title + "|" + c.body + "|" + c.actions.map(a => a.title).join("|");
  if (key === notifKey && !force) return;
  prepareNotifIcons();
  const gen = notifGen;
  const sid = guided.sid;
  notifBusy = true;
  navigator.serviceWorker.ready
    .then(reg => reg.showNotification(c.title, {
      body: c.body,
      tag: NOTIF_TAG,
      renotify: false,
      silent: true,
      requireInteraction: true,
      icon: notifIcons.icon,
      badge: notifIcons.badge,
      actions: c.actions,
      data: { sid }
    }))
    .then(() => {
      if (gen !== notifGen) { closeNotifs(); return; }   // trénink mezitím skončil
      notifKey = key;
      notifHidden = false;
    })
    .catch(() => {})
    .then(() => { notifBusy = false; });
}

function closeNotifs() {
  if (!CAN_NOTIFY) return;
  navigator.serviceWorker.ready
    .then(reg => reg.getNotifications({ tag: NOTIF_TAG }))
    .then(list => list.forEach(n => n.close()))
    .catch(() => {});
}

function closeGuidedNotif() {
  notifGen++;
  notifKey = "";
  notifHidden = false;
  closeNotifs();
}

// tlačítka z notifikace (přeposílá sw.js)
if (CAN_NOTIFY) {
  navigator.serviceWorker.addEventListener("message", e => {
    const m = e.data || {};
    if (m.type !== "guided-notif") return;
    if (m.action === "closed") { notifHidden = true; notifKey = ""; return; }
    if (!guided || (m.sid && m.sid !== guided.sid)) return;
    if (m.action === "pause") pauseGuided();
    else if (m.action === "next") advanceGuided();
    else if (m.action === "open" && !(location.hash || "").startsWith("#/guided")) location.hash = "#/guided/" + guided.sid;
  });
  try { navigator.serviceWorker.startMessages(); } catch { /* ignore */ }
  closeNotifs();   // po znovuotevření appky je stará notifikace k ničemu
}

function updateGuidedDom(remainMs) {
  const t = document.getElementById("g-time");
  if (!t) return;
  const s = Math.max(0, Math.ceil(remainMs / 1000));
  t.textContent = `${Math.floor(s / 60)}:${pad2(s % 60)}`;
  const ring = document.getElementById("g-ringbar");
  if (ring && guided.dur > 0) {
    const C = 628.3;
    const frac = Math.min(1, Math.max(0, remainMs / (guided.dur * 1000)));
    ring.style.strokeDashoffset = String(C * (1 - frac));
  }
  const est = document.getElementById("g-est");
  if (est) est.textContent = `zbývá ≈ ${guidedLeftMin(remainMs)} min`;
}

// odhad minut do konce tréninku (remainMs = zbytek aktuální fáze)
function guidedLeftMin(remainMs) {
  const restAfter = guided.phase === "work" && guided.idx < guided.steps.length - 1
    ? guided.steps[guided.idx].restAfter : 0;
  const total = Math.round(remainMs / 1000) + restAfter + guidedTotalSeconds(guided.steps, guided.idx + 1);
  return Math.max(1, Math.round(total / 60));
}

/* ---------------- toast ---------------- */

let toastTmr = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = `<div class="toast">${esc(msg)}</div>`;
  clearTimeout(toastTmr);
  toastTmr = setTimeout(() => { el.innerHTML = ""; }, 2400);
}

/* ---------------- export / import ---------------- */

let pendingImport = null;   // { sessions, exportedAt, count }

function exportPayload() {
  return JSON.stringify({
    app: EXPORT_APP_ID,
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions: store.sessions,
    settings: store.settings,
    program: store.program,
    yoga: store.yoga
  }, null, 2);
}

function downloadExport() {
  const blob = new Blob([exportPayload()], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `trenink-zaloha-${todayISO()}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  showToast("Záloha stažena 📦");
}

async function copyExport() {
  try {
    await navigator.clipboard.writeText(exportPayload());
    showToast("Záloha zkopírována do schránky");
  } catch {
    showToast("⚠️ Kopírování se nepovedlo – použij stažení souboru");
  }
}

function stageImport(text) {
  try {
    const data = JSON.parse(text);
    if (!data || data.app !== EXPORT_APP_ID || !Array.isArray(data.sessions)) {
      throw new Error("bad format");
    }
    const sessions = data.sessions.filter(s =>
      s && typeof s.id === "string" && typeof s.dayId === "string" &&
      typeof s.week === "number" && s.exercises && typeof s.exercises === "object"
    );
    pendingImport = {
      sessions,
      program: (data.program && typeof data.program === "object") ? data.program : null,
      yoga: Array.isArray(data.yoga) ? data.yoga.filter(y => y && typeof y.id === "string") : [],
      exportedAt: data.exportedAt || null,
      count: sessions.length
    };
    render();
  } catch {
    pendingImport = null;
    showToast("⚠️ Tohle nevypadá jako platná záloha");
    render();
  }
}

function applyImport(mode) {
  if (!pendingImport) return;
  const incoming = pendingImport.sessions;
  const incP = pendingImport.program;
  const incY = pendingImport.yoga || [];
  if (mode === "replace") {
    store.sessions = incoming;
    store.program = Object.assign({ restartWeek: null, restartAt: null }, incP || {});
    store.yoga = incY;
  } else {
    // sloučení: návrat v programu vyhrává ten novější
    if (incP && String(incP.restartAt || "") > String((store.program || {}).restartAt || "")) {
      store.program = Object.assign({ restartWeek: null, restartAt: null }, incP);
    }
    const byId = new Map(store.sessions.map(s => [s.id, s]));
    for (const s of incoming) {
      const cur = byId.get(s.id);
      if (!cur || String(s.updatedAt || "") > String(cur.updatedAt || "")) byId.set(s.id, s);
    }
    store.sessions = [...byId.values()];
    const byYid = new Map(store.yoga.map(y => [y.id, y]));
    for (const y of incY) {
      const cur = byYid.get(y.id);
      if (!cur || String(y.updatedAt || "") > String(cur.updatedAt || "")) byYid.set(y.id, y);
    }
    store.yoga = [...byYid.values()];
  }
  const active = store.sessions.find(s => s.status === "active");
  store.activeId = active ? active.id : null;
  saveStore();
  const n = pendingImport.count;
  pendingImport = null;
  showToast(`Import hotový – ${n} tréninků ✓`);
  render();
}

function wipeAll() {
  if (!confirm("Smazat úplně všechna data (historii i nastavení)?")) return;
  if (!confirm("Určitě? Tohle nejde vrátit. Doporučuji si nejdřív stáhnout zálohu.")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.hash = "#/";
  location.reload();
}

/* ---------------- router ---------------- */

let lastRoute = "";
let editOpen = new Set();     // rozbalené editory sérií v aktuálním tréninku
let warmOpen = null;          // ruční stav rozbalení rozcvičky
let statsEx = null;           // vybraný cvik ve statistikách
let modalEx = null;           // otevřený cvik v okně „jak na to“
let modalPhoto = null;      // fotka pozice otevřená přes celou obrazovku
let modalReturn = false;      // otevřené okno „návrat v programu“
let yogaListOpen = false;     // rozbalený seznam všech pozic při cvičení

function parseHash() {
  const h = (location.hash || "#/").replace(/^#/, "");
  const [path, queryStr] = h.split("?");
  const parts = path.split("/").filter(Boolean);
  const query = {};
  if (queryStr) for (const kv of queryStr.split("&")) {
    const [k, v] = kv.split("=");
    query[decodeURIComponent(k)] = decodeURIComponent(v || "");
  }
  return { parts, query, path };
}

function render() {
  const { parts, query, path } = parseHash();
  const route = parts[0] || "home";
  const sameRoute = path === lastRoute;
  const scrollY = sameRoute ? window.scrollY : 0;

  if (!sameRoute) {
    if (route !== "workout") editOpen = new Set();
    if (route !== "workout") warmOpen = null;
    modalEx = null;
    modalReturn = false;
    modalPhoto = null;
  }
  lastRoute = path;
  // technika zavřená (křížkem, mimo okno i odchodem jinam) → odpočet pokračuje
  if (!modalEx && guided && guided.autoPaused) setGuidedPaused(false);

  let html = "";
  let header = { title: PLAN.title, sub: PLAN.subtitle, back: null };
  let tab = "";
  document.body.classList.remove("has-workfoot");

  if (route === "home") {
    tab = "home";
    html = vHome();
  } else if (route === "day" && getDay(parts[1])) {
    tab = "home";
    const day = getDay(parts[1]);
    const week = Math.min(PLAN.weeks, Math.max(1, parseInt(query.w, 10) || defaultWeekFor(day.id)));
    header = { title: day.name, sub: `Týden ${week} z ${PLAN.weeks}`, back: "#/" };
    html = vDay(day, week);
  } else if (route === "workout" && getSession(parts[1])) {
    const sess = getSession(parts[1]);
    const day = getDay(sess.dayId);
    tab = "home";
    header = {
      title: (sess.status === "active" ? "" : "Úprava · ") + day.name,
      sub: `Týden ${sess.week} · ${fmtFull(sess.date)}`,
      back: sess.status === "active" ? "#/" : "#/session/" + sess.id
    };
    html = vWorkout(sess);
    document.body.classList.add("has-workfoot");
  } else if (route === "guided" && getSession(parts[1])) {
    const sess = getSession(parts[1]);
    if (!guided || guided.sid !== sess.id) { location.replace("#/workout/" + sess.id); return; }
    tab = "home";
    header = {
      title: "Řízený trénink",
      sub: `${getDay(sess.dayId).name} · Týden ${sess.week}`,
      back: "#/workout/" + sess.id
    };
    html = vGuided(sess);
  } else if (route === "history") {
    tab = "history";
    header = { title: "Historie", sub: "Dokončené tréninky", back: null };
    html = vHistory();
  } else if (route === "session" && getSession(parts[1])) {
    tab = "history";
    const sess = getSession(parts[1]);
    header = { title: `${getDay(sess.dayId).name}`, sub: `Týden ${sess.week} · ${fmtFull(sess.date)}`, back: "#/history" };
    html = vSession(sess);
  } else if (route === "yoga") {
    tab = "yoga";
    header = { title: YOGA.title, sub: YOGA.subtitle, back: null };
    html = vYoga();
  } else if (route === "yogarun" && getYoga(parts[1])) {
    const y = getYoga(parts[1]);
    tab = "yoga";
    header = {
      title: "Hormonální jóga",
      sub: `${yogaDoneCount(y)}/${yogaTotalCount()} pozic · ${fmtFull(y.date)}`,
      back: "#/yoga"
    };
    html = vYogaRun(y);
  } else if (route === "yogasess" && getYoga(parts[1])) {
    const y = getYoga(parts[1]);
    tab = "yoga";
    header = { title: "Záznam jógy", sub: fmtFull(y.date), back: "#/yoga" };
    html = vYogaSession(y);
  } else if (route === "stats") {
    tab = "stats";
    header = { title: "Statistiky", sub: "Tvůj progres v programu", back: null };
    html = vStats();
  } else if (route === "more") {
    tab = "more";
    header = { title: "Více", sub: "Záloha, nastavení a info", back: null };
    html = vMore();
  } else {
    location.hash = "#/";
    return;
  }

  // hlavička
  document.getElementById("h-title").textContent = header.title;
  document.getElementById("h-sub").textContent = header.sub;
  const back = document.getElementById("h-back");
  if (header.back) { back.style.display = ""; back.setAttribute("href", header.back); }
  else back.style.display = "none";

  // obsah + tabbar
  document.getElementById("view").innerHTML = html;
  document.querySelectorAll(".tabbar a").forEach(a => {
    a.classList.toggle("active", a.dataset.tab === tab);
  });

  const warmDet = document.getElementById("warmdet");
  if (warmDet) warmDet.addEventListener("toggle", e => { warmOpen = e.target.open; });

  const modal = document.getElementById("modal");
  if (modal) modal.innerHTML = modalEx ? vModal(modalEx)
    : (modalReturn ? vReturnModal() : (modalPhoto ? vPhotoModal(modalPhoto) : ""));

  window.scrollTo(0, sameRoute ? scrollY : 0);
  renderTimer();
}

/* ---------------- pohledy ---------------- */

function vModal(exId) {
  const info = (PLAN.exerciseInfo || {})[exId] || {};
  let name = exId;
  for (const day of PLAN.days) {
    const e = day.exercises.find(x => x.id === exId);
    if (e) { name = e.name; break; }
  }
  const items = (info.howto || []).map(h => `<li>${esc(h)}</li>`).join("");
  const search = "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(info.videoQuery || name + " tutorial");
  return `<div class="modal-back" data-act="exinfo-close">
    <div class="modal" data-act="noop">
      <div class="row" style="margin-bottom:6px">
        <h2 class="grow" style="margin:0;font-size:17.5px">${esc(name)}</h2>
        <button class="mclose" data-act="exinfo-close" aria-label="Zavřít">✕</button>
      </div>
      ${items ? `<ul class="howto">${items}</ul>` : `<p class="hint">K tomuhle cviku zatím nemám popis.</p>`}
      ${info.video ? `<a class="btn primary block" style="margin-top:14px" href="${esc(info.video)}" target="_blank" rel="noopener">▶ Video tutoriál</a>` : ""}
      <a class="btn block" style="margin-top:8px" href="${esc(search)}" target="_blank" rel="noopener">🔎 Další videa na YouTube</a>
    </div>
  </div>`;
}

function vPhotoModal(id) {
  const items = yogaItems();
  const it = items.find(x => x.id === id);
  return `<div class="modal-back photo" data-act="yphoto-close">
    <div class="modal photo" data-act="noop">
      <div class="row" style="margin-bottom:8px">
        <b class="grow">${it ? esc((it.n || it.no) + ". " + it.name) : ""}</b>
        <button class="mclose" data-act="yphoto-close" aria-label="Zavřít">✕</button>
      </div>
      ${poseImg(id, "full")}
      ${it && it.reps ? `<p class="hint center" style="margin:8px 0 0">${esc(it.reps)}${it.circ ? " · " + esc(circLabel(it.circ)) : ""}</p>` : ""}
    </div>
  </div>`;
}

function vReturnModal() {
  const p = store.program || {};
  let chips = "";
  for (let w = 1; w <= PLAN.weeks; w++) {
    chips += `<button class="wchip ${p.restartWeek === w ? "sel" : ""}" data-act="return-set" data-week="${w}">
      <span class="wk">T${w}</span></button>`;
  }
  const active = restartActive()
    ? `<p class="hint" style="margin-top:12px">✅ Aktivní: program pokračuje od týdne <b>T${p.restartWeek}</b>. Starší záznamy zůstávají v historii a statistikách.</p>
       <button class="btn danger block" style="margin-top:8px" data-act="return-cancel">Zrušit návrat (jet dál podle historie)</button>`
    : "";
  return `<div class="modal-back" data-act="return-close">
    <div class="modal" data-act="noop">
      <div class="row" style="margin-bottom:6px">
        <h2 class="grow" style="margin:0;font-size:17.5px">↩ Návrat v programu</h2>
        <button class="mclose" data-act="return-close" aria-label="Zavřít">✕</button>
      </div>
      <p class="hint">Po nemoci nebo dovolené se vyplatí vrátit o pár týdnů zpět. Vyber týden, od kterého chceš pokračovat – appka ti od něj začne tréninky nabízet znovu (A1 → B → A2), i když už byly jednou odcvičené.</p>
      <div class="weekchips" style="flex-wrap:wrap;overflow:visible;margin-top:10px">${chips}</div>
      ${active}
    </div>
  </div>`;
}

function activeBanner() {
  if (!store.activeId) return "";
  const s = getSession(store.activeId);
  if (!s) return "";
  const day = getDay(s.dayId);
  return `<div class="banner" data-act="nav" data-href="#/workout/${s.id}">
    <div class="grow">
      <div class="t">▶ Pokračovat v tréninku</div>
      <div class="s">${esc(day.name)} · Týden ${s.week} · hotovo ${setsDoneCount(s)}/${setsTotalCount(s)} sérií</div>
    </div>
    <span class="chev">›</span>
  </div>`;
}

function vHome() {
  const sug = suggestion();
  const startW = programStartWeek();

  let totalDone, totalAll, doneLine;
  if (restartActive()) {
    totalAll = (PLAN.weeks - startW + 1) * PLAN.order.length;
    totalDone = 0;
    for (let w = startW; w <= PLAN.weeks; w++) {
      for (const dayId of PLAN.order) if (effDone(dayId, w).length) totalDone++;
    }
    doneLine = `Dokončeno ${totalDone} z ${totalAll} · ↩ od návratu na T${startW}`;
  } else {
    totalDone = new Set(doneSessions().map(s => `${s.dayId}|${s.week}`)).size;
    totalAll = PLAN.weeks * PLAN.order.length;
    doneLine = `Dokončeno ${totalDone} z ${totalAll} tréninků programu`;
  }
  const returnLink = `<p class="center" style="margin:10px 0 0">
    <button class="linkbtn" data-act="return-open">↩ Vrátit se v programu (nemoc / dovolená)</button></p>`;

  let nextCard;
  if (sug) {
    const day = getDay(sug.dayId);
    nextCard = `<div class="card next-card">
      <div class="next-label">Na řadě</div>
      <p class="next-name">${esc(day.name)} · Týden ${sug.week}</p>
      <p class="hint" style="margin:0 0 12px">${esc(doneLine)}</p>
      <button class="btn primary block" style="margin-bottom:8px" data-act="start" data-day="${day.id}" data-week="${sug.week}">Začít trénink</button>
      <div class="row">
        <button class="btn guided grow" data-act="start-guided" data-day="${day.id}" data-week="${sug.week}">▶ Řízený trénink</button>
        <a class="btn" href="#/day/${day.id}?w=${sug.week}">Detail</a>
      </div>
      ${returnLink}
    </div>`;
  } else {
    nextCard = `<div class="card next-card center">
      <p class="next-name">🎉 Program dokončen!</p>
      <p class="hint">${restartActive() ? `Všechny tréninky od návratu na T${startW} máš za sebou.` : `Všech ${totalAll} tréninků máš za sebou.`} Přes návrat v programu můžeš jet znovu od libovolného týdne.</p>
      ${returnLink}
    </div>`;
  }

  const dayCards = PLAN.days.map(d => {
    const last = lastDoneFor(d.id);
    const meta = last
      ? `naposledy Týden ${last.week} · ${fmtShort(last.date)}`
      : "zatím neodcvičeno";
    return `<a class="daycard" href="#/day/${d.id}">
      <div class="dot" data-day="${d.id}">${d.id}</div>
      <div class="grow">
        <div class="name">${esc(d.name)}</div>
        <div class="meta">${d.exercises.length} cviků · ${esc(meta)}</div>
      </div>
      <span class="chev">›</span>
    </a>`;
  }).join("");

  const warm = `<details class="card" style="padding:0">
    <summary style="list-style:none;padding:13px 14px;font-weight:700;cursor:pointer">🤸 Rozcvička <span class="muted small">(před každým tréninkem)</span></summary>
    <div style="padding:0 14px 12px">
      ${PLAN.warmup.map(w => `<div class="witem" style="cursor:default">
          <div class="n grow">${esc(w.name)}</div>
          ${w.note ? `<div class="note">${esc(w.note)}</div>` : ""}
        </div>`).join("")}
    </div>
  </details>`;

  return activeBanner() + nextCard +
    `<div class="section-title">Tréninkové dny</div><div class="daylist">${dayCards}</div>
     <div class="section-title">Rozcvička</div>${warm}`;
}

function weekChips(day, selected) {
  let chips = "";
  for (let w = 1; w <= PLAN.weeks; w++) {
    const list = sessionsFor(day.id, w);
    const done = list.length > 0;
    const st = done
      ? fmtShort(list[list.length - 1].date) + (list.length > 1 ? ` ×${list.length}` : "")
      : "·";
    chips += `<button class="wchip ${w === selected ? "sel" : ""} ${done ? "done" : ""}"
        data-act="week" data-day="${day.id}" data-week="${w}">
        <span class="wk">T${w}</span><span class="st">${esc(st)}</span>
      </button>`;
  }
  return `<div class="weekchips">${chips}</div>`;
}

/* Seskupí cviky dne podle supersérií (po sobě jdoucí se stejným ss). */
function groupBySS(exercises) {
  const groups = [];
  for (const ex of exercises) {
    const prev = groups[groups.length - 1];
    if (ex.ss && prev && prev.ss === ex.ss) prev.items.push(ex);
    else groups.push({ ss: ex.ss || 0, items: [ex] });
  }
  return groups;
}

function vDay(day, week) {
  const targets = targetsFor(day.id, week);
  const sheetDate = (PLAN.sheetDates[day.id] || {})[week];

  const exHtml = groupBySS(day.exercises).map(g => {
    const cards = g.items.map(ex => {
      const t = targets[ex.id];
      const last = lastPerformance(ex.id);
      return `<div class="excard">
        <div class="exhead">
          <span class="exname">${esc(ex.name)}</span>
          <button class="infobtn" data-act="exinfo" data-ex="${ex.id}" aria-label="Jak cvičit">?</button>
          ${ex.pause ? `<span class="badge">⏱ ${esc(ex.pause)}</span>` : ""}
          ${ex.block ? `<span class="badge">${esc(ex.block)}</span>` : ""}
        </div>
        <div class="target">${esc(targetSummary(ex, t))}</div>
        ${ex.note ? `<div class="exnote">${esc(ex.note)}</div>` : ""}
        ${last ? `<div class="last">minule ${fmtShort(last.session.date)}: <b>${esc(last.values.join(" · "))}</b></div>` : ""}
      </div>`;
    }).join("");
    return g.ss
      ? `<div class="ss-group"><div class="ss-label">Supersérie</div>${cards}</div>`
      : cards;
  }).join("");

  const past = sessionsFor(day.id, week);
  const pastHtml = past.length
    ? `<div class="section-title">Odcvičeno v tomto týdnu</div>` + past.map(s =>
        `<div class="histitem" data-act="nav" data-href="#/session/${s.id}">
          <div class="grow">
            <div class="when">${esc(fmtFull(s.date))}</div>
            <div class="meta">${setsDoneCount(s)}/${setsTotalCount(s)} sérií</div>
          </div><span class="chev">›</span>
        </div>`).join("")
    : "";

  return `${activeBanner()}
    ${weekChips(day, week)}
    ${sheetDate && !past.length ? `<p class="muted small" style="margin:2px 4px 10px">📄 Podle původní tabulky odcvičeno ${esc(sheetDate)}</p>` : ""}
    <button class="btn primary block" style="margin-bottom:8px" data-act="start" data-day="${day.id}" data-week="${week}">
      Začít trénink · Týden ${week}
    </button>
    <button class="btn guided block" style="margin-bottom:14px" data-act="start-guided" data-day="${day.id}" data-week="${week}">
      ▶ Začít řízeně – časovač tě provede sám
    </button>
    ${exHtml}
    ${pastHtml}`;
}

function vWorkout(sess) {
  const day = getDay(sess.dayId);
  const targets = targetsFor(sess.dayId, sess.week);
  const isActive = sess.status === "active";

  const warmDone = sess.warmup.filter(Boolean).length;
  const openWarm = warmOpen ?? (isActive && setsDoneCount(sess) === 0);
  const warmHtml = `<details class="warm" id="warmdet" ${openWarm ? "open" : ""}>
    <summary>🤸 Rozcvička <span class="cnt">${warmDone}/${PLAN.warmup.length}</span></summary>
    <div class="witems">
      ${PLAN.warmup.map((w, i) => `
        <div class="witem ${sess.warmup[i] ? "done" : ""}" data-act="warm" data-sid="${sess.id}" data-i="${i}">
          <div class="chk">✓</div>
          <div class="grow"><div class="n">${esc(w.name)}</div></div>
          ${w.note ? `<div class="note">${esc(w.note)}</div>` : ""}
        </div>`).join("")}
    </div>
  </details>`;

  const exHtml = groupBySS(day.exercises).map(g => {
    const cards = g.items.map(ex => {
      const t = targets[ex.id];
      const st = sess.exercises[ex.id];
      const last = lastPerformance(ex.id, sess.id);
      const isOpen = editOpen.has(ex.id);

      const chips = st.sets.map((s, i) => {
        const label = s.done ? (s.actual || t.labels[i] || "✓") : (t.labels[i] || "•");
        return `<button class="setbtn ${s.done ? "done" : ""}" data-act="set" data-sid="${sess.id}" data-ex="${ex.id}" data-i="${i}">
          <span class="idx">S${i + 1}</span>
          <span class="val">${esc(decorate(ex, label))}</span>
        </button>`;
      }).join("");

      const editor = isOpen ? `<div class="editrows">
          ${st.sets.map((s, i) => `<div class="editrow">
            <label>Série ${i + 1}</label>
            <input type="text" inputmode="text" value="${esc(s.actual ?? "")}"
              placeholder="${esc(decorate(ex, t.labels[i] || ""))}"
              data-in="actual" data-sid="${sess.id}" data-ex="${ex.id}" data-i="${i}">
          </div>`).join("")}
          <div class="editrow">
            <label>Pozn.</label>
            <input type="text" value="${esc(st.note)}" placeholder="poznámka ke cviku…"
              data-in="exnote" data-sid="${sess.id}" data-ex="${ex.id}">
          </div>
        </div>` : (st.note ? `<div class="exnote" style="margin-top:7px">📝 ${esc(st.note)}</div>` : "");

      return `<div class="excard">
        <div class="exhead">
          <span class="exname">${esc(ex.name)}</span>
          <button class="infobtn" data-act="exinfo" data-ex="${ex.id}" aria-label="Jak cvičit">?</button>
          ${ex.pause ? `<span class="badge">⏱ ${esc(ex.pause)}</span>` : ""}
          ${ex.block ? `<span class="badge">${esc(ex.block)}</span>` : ""}
        </div>
        <div class="target">${esc(targetSummary(ex, t))}</div>
        ${ex.note ? `<div class="exnote">${esc(ex.note)}</div>` : ""}
        ${last ? `<div class="last">minule ${fmtShort(last.session.date)}: <b>${esc(last.values.join(" · "))}</b></div>` : ""}
        <div class="setgrid">${chips}</div>
        <div class="exfoot">
          <button class="linkbtn" data-act="edit" data-ex="${ex.id}">${isOpen ? "Skrýt úpravy" : "Upravit hodnoty / poznámku"}</button>
        </div>
        ${editor}
      </div>`;
    }).join("");
    return g.ss
      ? `<div class="ss-group"><div class="ss-label">Supersérie – cviky střídat, pauza až po obou</div>${cards}</div>`
      : cards;
  }).join("");

  const done = setsDoneCount(sess);
  const total = setsTotalCount(sess);

  let guidedBtn = "";
  if (isActive) {
    if (guided && guided.sid === sess.id && !guided.finished) {
      guidedBtn = `<a class="btn guided block" style="margin-bottom:12px" href="#/guided/${sess.id}">▶ Pokračovat v řízeném tréninku</a>`;
    } else {
      const remSteps = buildGuidedSteps(sess);
      if (remSteps.length) {
        const est = Math.round(guidedTotalSeconds(remSteps) / 60);
        guidedBtn = `<button class="btn guided block" style="margin-bottom:4px" data-act="guided" data-sid="${sess.id}">▶ Řízený trénink · ≈ ${est} min</button>
        <p class="muted small" style="margin:0 4px 12px">Časovač tě sám provede sériemi i pauzami, píská, hlásí cviky a série odškrtává za tebe. Rozcvičku si dej před startem.</p>`;
      }
    }
  }

  return `
    <div class="card">
      <div class="row">
        <label class="muted small" style="flex:0 0 auto">Datum</label>
        <input type="date" value="${esc(sess.date)}" data-in="date" data-sid="${sess.id}" style="flex:1">
      </div>
    </div>
    ${guidedBtn}
    ${warmHtml}
    ${exHtml}
    <div class="card">
      <label class="muted small">Poznámka k tréninku</label>
      <textarea data-in="note" data-sid="${sess.id}" placeholder="jak to šlo, co příště…">${esc(sess.note)}</textarea>
    </div>
    ${isActive ? `<p class="center" style="margin:16px 0 6px">
      <button class="linkbtn" style="color:var(--danger)" data-act="cancel" data-sid="${sess.id}">Zrušit trénink a smazat záznam</button>
    </p>` : ""}
    <div class="workfoot"><div class="inner">
      <div class="prog grow">Série<br><b>${done} / ${total}</b></div>
      ${isActive
        ? `<button class="btn primary" style="flex:2" data-act="finish" data-sid="${sess.id}">✓ Dokončit trénink</button>`
        : `<a class="btn primary" style="flex:2" href="#/session/${sess.id}">✓ Hotovo</a>`}
    </div></div>`;
}

function vGuided(sess) {
  if (guided.finished) {
    const done = setsDoneCount(sess);
    const total = setsTotalCount(sess);
    return `<div class="guided">
      <div class="g-done-emoji">🎉</div>
      <h2 class="g-ex">Trénink hotový!</h2>
      <p class="hint" style="margin:4px 0 20px">${done} z ${total} sérií odškrtnuto</p>
      <button class="btn primary block" style="margin-bottom:10px" data-act="finish" data-sid="${sess.id}">✓ Uložit a dokončit trénink</button>
      <button class="btn block" data-act="g-exit" data-sid="${sess.id}">Zpět na záznam (doplnit poznámky)</button>
    </div>`;
  }

  const st = guided.steps[guided.idx];
  const isWork = guided.phase === "work";
  const next = guided.steps[guided.idx + 1] || null;
  const shown = isWork ? st : (next || st);   // v pauze ukazujeme, co přijde
  const remain = guided.paused ? guided.remainMs : Math.max(0, guided.endsAt - Date.now());
  const s = Math.max(0, Math.ceil(remain / 1000));
  const C = 628.3;
  const frac = guided.dur > 0 ? Math.min(1, Math.max(0, remain / (guided.dur * 1000))) : 0;

  const nextPill = isWork
    ? (next
        ? `<div class="g-next">Pak: ${esc(next.name)} · S${next.setIdx + 1}${next.label ? ` (${esc(next.label)})` : ""}</div>`
        : `<div class="g-next">Poslední série! 🔥</div>`)
    : `<div class="g-next">Odpočiň si a připrav se ☝️</div>`;

  // referenční krok: při práci aktuální série, v pauze ta nadcházející
  const ref = isWork ? guided.idx : Math.min(guided.idx + 1, guided.steps.length - 1);

  // řetězec aktuálního kola supersérie (co jedu teď → co hned potom → pauza)
  let roundChain = "";
  const refStep = guided.steps[ref];
  if (refStep.ss) {
    let start = ref;
    while (start > 0 && !guided.steps[start - 1].roundEnd) start--;
    let end = ref;
    while (end < guided.steps.length - 1 && !guided.steps[end].roundEnd) end++;
    if (end > start) {
      const parts = [];
      for (let i = start; i <= end; i++) {
        const s2 = guided.steps[i];
        const nm = `${esc((PLAN.shortNames || {})[s2.exId] || s2.name)} S${s2.setIdx + 1}`;
        if (i < ref) parts.push(`<span class="rc-done">${nm} ✓</span>`);
        else if (i === ref) parts.push(`<b>${nm}</b>`);
        else parts.push(nm);
      }
      roundChain = `<div class="g-round"><span class="ss-tag">SUPERSÉRIE</span>${parts.join(" <span class=\"rc-arr\">→</span> ")} <span class="rc-arr">→</span> 💤</div>`;
    }
  }

  // segmentový průběh celého tréninku (jeden dílek = jedna série)
  const segs = guided.steps.map((s2, i) =>
    `<i class="seg${i < ref ? " done" : ""}${i === ref ? " cur" : ""}${s2.roundEnd ? " rend" : ""}"></i>`
  ).join("");
  const estMin = guidedLeftMin(remain);

  return `<div class="guided">
    <div class="g-phase ${isWork ? "work" : "rest"}">${isWork ? "CVIČÍŠ" : "PAUZA"}</div>
    <div class="g-ring">
      <svg viewBox="0 0 240 240">
        <circle class="g-ring-bg" cx="120" cy="120" r="100"></circle>
        <circle id="g-ringbar" class="g-ring-bar ${isWork ? "work" : "rest"}" cx="120" cy="120" r="100"
          stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - frac)}"></circle>
      </svg>
      <div class="g-ring-inner">
        <div class="g-time" id="g-time">${Math.floor(s / 60)}:${pad2(s % 60)}</div>
        ${shown.label ? `<div class="g-target">${esc(shown.label)}</div>` : ""}
      </div>
    </div>
    <h2 class="g-ex">${isWork ? "" : "Připrav se: "}${esc(shown.name)}</h2>
    <div class="g-set">Série ${shown.setIdx + 1} z ${shown.setTotal}${shown.note ? ` · ${esc(shown.note)}` : ""}
      <button class="infobtn" data-act="exinfo" data-ex="${shown.exId}" aria-label="Jak cvičit">?</button></div>
    ${roundChain || nextPill}
    <div class="g-progwrap">
      <div class="g-prog">${segs}</div>
      <div class="g-progtxt muted small">${ref}/${guided.steps.length} sérií hotovo · <span id="g-est">zbývá ≈ ${estMin} min</span></div>
    </div>
    <div class="g-controls">
      <button class="gbtn" data-act="g-back" title="Znovu od začátku, 2× = předchozí série">◀</button>
      <button class="gbtn" data-act="g-pause">${guided.paused ? "▶" : "⏸"}</button>
      <button class="gbtn main" data-act="g-next">${isWork ? "✓ Hotovo, dál" : "» Přeskočit pauzu"}</button>
      <button class="gbtn" data-act="g-plus">+15 s</button>
    </div>
    <div class="g-meta">
      <button class="linkbtn" data-act="toggle-voice">${store.settings.voice ? "🔊 hlas" : "🔇 hlas"}</button>
      <button class="linkbtn" data-act="toggle-sound">${store.settings.sound ? "🔔 zvuk" : "🔕 zvuk"}</button>
    </div>
    <p class="center" style="margin-top:18px">
      <button class="linkbtn" data-act="g-exit" data-sid="${sess.id}">Ukončit řízený režim (zpět na ruční odškrtávání)</button>
    </p>
  </div>`;
}

function vHistory() {
  const list = doneSessions().slice().reverse();
  if (!list.length) {
    return `${activeBanner()}<div class="empty"><div class="big">🗓️</div>
      Zatím tu nic není.<br>Dokončené tréninky se objeví tady.</div>`;
  }
  return activeBanner() + list.map(s => {
    const day = getDay(s.dayId);
    return `<div class="histitem" data-act="nav" data-href="#/session/${s.id}">
      <span class="badge day" data-day="${s.dayId}">${s.dayId}</span>
      <div class="grow">
        <div class="when">${esc(fmtFull(s.date))}</div>
        <div class="meta">${esc(day.name)} · Týden ${s.week}${s.note ? " · 📝" : ""}</div>
      </div>
      <div class="right">
        <div class="sets">${setsDoneCount(s)}/${setsTotalCount(s)}</div>
        <div class="meta">sérií</div>
      </div>
      <span class="chev">›</span>
    </div>`;
  }).join("");
}

function vSession(sess) {
  const day = getDay(sess.dayId);
  const targets = targetsFor(sess.dayId, sess.week);

  const rows = day.exercises.map(ex => {
    const st = sess.exercises[ex.id];
    if (!st) return "";
    const t = targets[ex.id];
    const doneVals = st.sets.map((s, i) => s.done ? decorate(ex, s.actual || t.labels[i] || "✓") : null);
    const doneCnt = doneVals.filter(Boolean).length;
    const shown = doneCnt
      ? doneVals.map(v => v === null ? "✗" : v).join(" · ")
      : "— vynecháno —";
    return `<div class="sess-ex">
      <div class="row"><div class="n grow">${esc(ex.name)}</div>
        <span class="badge">${doneCnt}/${st.sets.length} sérií</span></div>
      <div class="vals">${esc(shown)}</div>
      <div class="tg">cíl: ${esc(targetSummary(ex, t))}</div>
      ${st.note ? `<div class="nt">📝 ${esc(st.note)}</div>` : ""}
    </div>`;
  }).join("");

  const warmDone = sess.warmup ? sess.warmup.filter(Boolean).length : 0;

  return `
    <div class="card">
      <div class="row" style="margin-bottom:8px">
        <span class="badge day" data-day="${sess.dayId}">${sess.dayId}</span>
        <b>${esc(day.name)} · Týden ${sess.week}</b>
      </div>
      <div class="hint">🤸 Rozcvička: ${warmDone}/${PLAN.warmup.length} · Série: ${setsDoneCount(sess)}/${setsTotalCount(sess)}</div>
      ${sess.note ? `<hr class="sep"><div>📝 ${esc(sess.note)}</div>` : ""}
    </div>
    <div class="card">${rows}</div>
    <div class="row" style="margin-bottom:10px">
      <a class="btn grow" href="#/workout/${sess.id}">✎ Upravit</a>
      <button class="btn grow" data-act="repeat" data-day="${sess.dayId}" data-week="${sess.week}">↻ Opakovat</button>
    </div>
    <button class="btn danger block" data-act="del" data-sid="${sess.id}">Smazat záznam</button>`;
}

function vStats() {
  const list = doneSessions();
  if (!list.length) {
    return `<div class="empty"><div class="big">📈</div>
      Statistiky se ukážou po prvním dokončeném tréninku.</div>`;
  }

  // souhrn
  const monday = mondayOf(new Date());
  const weekCount = list.filter(s => dateFromISO(s.date) >= monday).length;
  let totalSets = 0, totalReps = 0;
  for (const s of list) {
    for (const [exId, ex] of Object.entries(s.exercises)) {
      const exDef = getEx(s.dayId, exId);
      const labels = targetLabelsOf(s, exId);
      ex.sets.forEach((set, i) => {
        if (!set.done) return;
        totalSets++;
        if (!exDef || exDef.unit !== "kg") totalReps += repsOf(set.actual || labels[i]);
      });
    }
  }

  const cards = `<div class="statgrid">
    <div class="stat"><div class="v">${list.length}</div><div class="l">tréninků celkem</div></div>
    <div class="stat"><div class="v">${weekCount}</div><div class="l">tento týden</div></div>
    <div class="stat"><div class="v">${totalSets}</div><div class="l">sérií hotovo</div></div>
    <div class="stat"><div class="v">${Math.round(totalReps)}</div><div class="l">opakování (odhad)</div></div>
  </div>`;

  // mřížka programu
  let gridRows = "";
  for (let w = 1; w <= PLAN.weeks; w++) {
    const cells = PLAN.order.map(dayId => {
      const ss = sessionsFor(dayId, w);
      if (!ss.length) {
        return `<td><a class="progcell" href="#/day/${dayId}?w=${w}">·</a></td>`;
      }
      const latest = ss[ss.length - 1];
      return `<td><a class="progcell done" data-day="${dayId}" href="#/session/${latest.id}">
        ${esc(fmtShort(latest.date))}${ss.length > 1 ? ` ×${ss.length}` : ""}</a></td>`;
    }).join("");
    gridRows += `<tr><td class="wk">T${w}</td>${cells}</tr>`;
  }
  const grid = `<div class="card"><h2>Přehled programu</h2>
    ${restartActive() ? `<p class="hint small" style="margin:0 0 8px">↩ Program vrácen na týden T${store.program.restartWeek} – starší záznamy v mřížce zůstávají.</p>` : ""}
    <table class="progtable">
      <tr><th></th>${PLAN.order.map(d => `<th>${d}</th>`).join("")}</tr>
      ${gridRows}
    </table></div>`;

  // progres cviku
  const uniq = [];
  const seen = new Set();
  for (const d of PLAN.days) for (const ex of d.exercises) {
    if (!seen.has(ex.id)) { seen.add(ex.id); uniq.push(ex); }
  }
  if (!statsEx || !seen.has(statsEx)) statsEx = uniq[0].id;
  const exDef = uniq.find(e => e.id === statsEx);

  const points = [];
  for (const s of list) {
    const ex = s.exercises[statsEx];
    if (!ex || !ex.sets.some(x => x.done)) continue;
    const labels = targetLabelsOf(s, statsEx);
    let value = 0;
    ex.sets.forEach((set, i) => {
      if (!set.done) return;
      const lab = set.actual || labels[i];
      if (exDef.unit === "kg") value = Math.max(value, kgOf(lab));
      else value += repsOf(lab);
    });
    points.push({ label: fmtShort(s.date), value: Math.round(value * 10) / 10, sid: s.id, week: s.week, dayId: s.dayId });
  }

  const select = `<select data-in="stats-ex">
    ${uniq.map(e => `<option value="${e.id}" ${e.id === statsEx ? "selected" : ""}>${esc(e.name)}</option>`).join("")}
  </select>`;

  const unitLabel = exDef.unit === "kg" ? "max kg v tréninku" : "opakování celkem v tréninku";
  const chart = points.length
    ? `<div class="chartwrap">${barChart(points.slice(-15))}</div>
       <p class="hint center" style="margin:4px 0 0">${esc(unitLabel)}</p>`
    : `<p class="hint">Tenhle cvik zatím nemá žádný záznam.</p>`;

  const recent = points.slice(-6).reverse().map(p => {
    return `<div class="row small" style="padding:5px 0;border-top:1px solid var(--line)">
      <span class="badge day" data-day="${p.dayId}">${p.dayId}</span>
      <a class="grow" style="text-decoration:none" href="#/session/${p.sid}">${esc(p.label)} · Týden ${p.week}</a>
      <b>${p.value}${exDef.unit === "kg" ? " kg" : ""}</b>
    </div>`;
  }).join("");

  const exCard = `<div class="card"><h2>Progres cviku</h2>
    ${select}
    <div style="margin-top:12px">${chart}</div>
    ${recent ? `<div style="margin-top:10px">${recent}</div>` : ""}
  </div>`;

  return cards + grid + exCard;
}

function barChart(points) {
  const bw = 34, gap = 10, padL = 6, padR = 6, h = 150, top = 22, bottom = 20;
  const w = padL + points.length * (bw + gap) + padR;
  const max = Math.max(...points.map(p => p.value), 1);
  let bars = "";
  points.forEach((p, i) => {
    const x = padL + i * (bw + gap);
    const bh = Math.max(3, (h - top - bottom) * (p.value / max));
    const y = h - bottom - bh;
    bars += `<rect class="bar" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6"></rect>
      <text class="bar-val" x="${x + bw / 2}" y="${y - 6}" text-anchor="middle">${p.value}</text>
      <text class="bar-label" x="${x + bw / 2}" y="${h - 6}" text-anchor="middle">${esc(p.label)}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">${bars}</svg>`;
}

function vMore() {
  const t = store.settings.theme;
  const importPanel = pendingImport ? `
    <div class="card" style="border-color:color-mix(in srgb, var(--accent) 50%, transparent)">
      <h2>Nalezena záloha</h2>
      <p class="hint">${pendingImport.count} tréninků${pendingImport.exportedAt ? ` · exportováno ${esc(new Date(pendingImport.exportedAt).toLocaleDateString("cs-CZ"))}` : ""}</p>
      <div class="row" style="margin-top:10px">
        <button class="btn primary grow" data-act="import-merge">Sloučit</button>
        <button class="btn grow" data-act="import-replace">Nahradit vše</button>
        <button class="btn ghost" data-act="import-cancel">✕</button>
      </div>
      <p class="hint small" style="margin:8px 0 0">„Sloučit“ přidá tréninky ze zálohy k současným (stejné záznamy nezdvojí). „Nahradit vše“ smaže současná data a použije jen zálohu.</p>
    </div>` : "";

  return `
    ${importPanel}
    <div class="card">
      <h2>📦 Záloha dat</h2>
      <p class="hint">Progres se ukládá jen v tomhle prohlížeči. Pravidelně si stáhni zálohu – přeneseš s ní data třeba do počítače.</p>
      <div class="row" style="margin-top:10px">
        <button class="btn primary grow" data-act="export">⬇ Stáhnout zálohu</button>
        <button class="btn grow" data-act="copy">Kopírovat</button>
      </div>
      <hr class="sep">
      <label class="btn block" style="cursor:pointer">
        ⬆ Nahrát zálohu (soubor)
        <input type="file" accept=".json,application/json" data-in="import-file" style="display:none">
      </label>
      <details style="margin-top:10px">
        <summary class="muted small" style="cursor:pointer">…nebo vložit text zálohy</summary>
        <textarea id="import-text" placeholder='{"app":"trenink-tracker", …}' style="margin-top:8px"></textarea>
        <button class="btn small" style="margin-top:8px" data-act="import-text">Načíst z textu</button>
      </details>
    </div>

    <div class="card">
      <h2>↩ Návrat v programu</h2>
      <p class="hint">Po nemoci či dovolené se můžeš vrátit na dřívější týden – tréninky se od něj začnou nabízet znovu, historie zůstane.</p>
      ${restartActive() ? `<p class="hint">✅ Aktivní: pokračuješ od týdne <b>T${store.program.restartWeek}</b>.</p>` : ""}
      <button class="btn block" style="margin-top:10px" data-act="return-open">Vybrat týden návratu</button>
    </div>

    <div class="card">
      <h2>🎨 Vzhled</h2>
      <div class="seg">
        <button class="${t === "auto" ? "sel" : ""}" data-act="theme" data-v="auto">Auto</button>
        <button class="${t === "dark" ? "sel" : ""}" data-act="theme" data-v="dark">Tmavý</button>
        <button class="${t === "light" ? "sel" : ""}" data-act="theme" data-v="light">Světlý</button>
      </div>
      <hr class="sep">
      <div class="switchrow" data-act="timer-set">
        <div class="lbl">⏱ Odpočet pauzy po odškrtnuté sérii</div>
        <div class="switch ${store.settings.timer ? "on" : ""}"></div>
      </div>
      <div class="switchrow" data-act="toggle-sound">
        <div class="lbl">🔔 Zvuky časovače (pípání)</div>
        <div class="switch ${store.settings.sound ? "on" : ""}"></div>
      </div>
      <div class="switchrow" data-act="toggle-voice">
        <div class="lbl">🔊 Hlasové pokyny v řízeném tréninku</div>
        <div class="switch ${store.settings.voice ? "on" : ""}"></div>
      </div>
      ${CAN_DUCK ? `<div class="switchrow" data-act="toggle-duck">
        <div class="lbl">🎵 Ztišit hudbu při pípání a hlášení</div>
        <div class="switch ${store.settings.duck ? "on" : ""}"></div>
      </div>` : ""}
      ${CAN_NOTIFY ? `<div class="switchrow" data-act="toggle-notif">
        <div class="lbl">📲 Průběh tréninku v notifikaci (odpočet a tlačítka)</div>
        <div class="switch ${store.settings.notif ? "on" : ""}"></div>
      </div>
      ${store.settings.notif && Notification.permission === "denied" ? `<p class="hint small" style="margin:8px 0 0">⚠️ Notifikace má prohlížeč pro tuhle stránku zakázané. Povol je v nastavení webu (ikonka vedle adresy) nebo v nastavení Androidu u Chromu.</p>` : ""}` : ""}
      ${IS_IOS ? `<p class="hint small" style="margin:8px 0 0">📱 iPhone: pípání ztlumí přepínač tichého režimu a se zamčeným displejem iOS webové appky uspí – během řízeného tréninku nech appku otevřenou a displej zapnutý.</p>` : ""}
    </div>

    <div class="card">
      <h2>ℹ️ Legenda plánu</h2>
      <ul class="legend">${PLAN.legend.map(l => `<li>${esc(l)}</li>`).join("")}</ul>
    </div>

    <div class="card">
      <h2>🔄 Aktualizace</h2>
      <p class="hint">Verze aplikace: <b>${APP_VERSION}</b>. Novinky se stahují samy při otevření s připojením. Kdyby appka vypadala zastarale, ťukni sem:</p>
      <button class="btn block" style="margin-top:10px" data-act="refresh-app">Obnovit aplikaci</button>
      <p class="hint small" style="margin:8px 0 0">Obnovení nemaže žádný progres – jen znovu stáhne soubory aplikace.</p>
    </div>

    <div class="card">
      <h2>O aplikaci</h2>
      <p class="hint">Tréninkový plán převzatý z <a href="${esc(PLAN.source)}" target="_blank" rel="noopener">Google tabulky</a>. Aplikace běží na GitHub Pages, funguje i offline a data má jen ve tvém prohlížeči (nikam se neposílají).</p>
      <p class="hint">💡 Tip pro mobil: v prohlížeči zvol „Přidat na plochu“ – appka se pak chová jako nativní a data v ní vydrží spolehlivěji.</p>
      <hr class="sep">
      <button class="btn danger block" data-act="wipe">🗑 Smazat všechna data</button>
    </div>`;
}

/* ---------------- události ---------------- */

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const d = el.dataset;
  switch (d.act) {
    case "nav": location.hash = d.href.replace(/^#/, "").startsWith("/") ? d.href : "#/" + d.href; break;
    case "start": startSession(d.day, +d.week); break;
    case "start-guided": ensureAudio(); startSession(d.day, +d.week, true); break;
    case "repeat": startSession(d.day, +d.week); break;
    case "week": {
      location.replace(`#/day/${d.day}?w=${d.week}`);
      break;
    }
    case "set": toggleSet(d.sid, d.ex, +d.i); break;
    case "warm": {
      const sess = getSession(d.sid);
      if (sess) { sess.warmup[+d.i] = !sess.warmup[+d.i]; touch(sess); render(); }
      break;
    }
    case "edit": {
      if (editOpen.has(d.ex)) editOpen.delete(d.ex); else editOpen.add(d.ex);
      render();
      break;
    }
    case "finish": finishSession(d.sid); break;
    case "cancel": cancelSession(d.sid); break;
    case "del": deleteSession(d.sid); break;
    case "timer-off": stopRest(); break;
    case "noop": break;
    case "exinfo": {
      modalEx = d.ex;
      // v řízeném tréninku čtení techniky pozastaví odpočet (po zavření se zase rozjede)
      if (guided && !guided.finished && !guided.paused &&
          (location.hash || "").startsWith("#/guided")) {
        setGuidedPaused(true);
        guided.autoPaused = true;
      }
      render();
      break;
    }
    case "exinfo-close": modalEx = null; render(); break;
    case "yoga-start": startYoga(); break;
    case "yoga-step": setYogaStep(d.sid, +d.i); break;
    case "yoga-toggle": toggleYogaItem(d.sid, d.item); break;
    case "yoga-next": yogaNext(d.sid); break;
    case "yoga-back": yogaBack(d.sid); break;
    case "yoga-finish": finishYoga(d.sid); break;
    case "yoga-cancel": cancelYoga(d.sid); break;
    case "yoga-del": deleteYoga(d.sid); break;
    case "yoga-list": yogaListOpen = !yogaListOpen; render(); break;
    case "yphoto": modalPhoto = d.ex; render(); break;
    case "yphoto-close": modalPhoto = null; render(); break;
    case "return-open": modalReturn = true; render(); break;
    case "return-close": modalReturn = false; render(); break;
    case "return-set": {
      const w = +d.week;
      if (confirm(`Vrátit program na týden ${w}? Tréninky se budou znovu nabízet od T${w} (historie zůstává).`)) {
        store.program = { restartWeek: w, restartAt: new Date().toISOString() };
        saveStore();
        modalReturn = false;
        showToast(`↩ Pokračuješ od týdne ${w}`);
        render();
      }
      break;
    }
    case "return-cancel": {
      store.program = { restartWeek: null, restartAt: null };
      saveStore();
      modalReturn = false;
      showToast("Návrat zrušen – jede se dál podle historie");
      render();
      break;
    }
    case "guided": startGuided(d.sid); break;
    case "g-next": ensureAudio(); advanceGuided(); break;
    case "g-back": ensureAudio(); backGuided(); break;
    case "g-pause": pauseGuided(); break;
    case "g-plus": extendGuided(15); break;
    case "g-exit": stopGuided(); location.hash = "#/workout/" + d.sid; break;
    case "toggle-sound": {
      store.settings.sound = !store.settings.sound;
      if (store.settings.sound) { ensureAudio(); soundTick(); }
      resetCues();
      saveStore();
      render();
      break;
    }
    case "toggle-notif": {
      store.settings.notif = !store.settings.notif;
      saveStore();
      if (store.settings.notif) {
        askNotifPermission();
        updateGuidedNotif(true);
      } else {
        closeGuidedNotif();
      }
      render();
      break;
    }
    case "toggle-duck": {
      store.settings.duck = !store.settings.duck;
      saveStore();
      render();
      break;
    }
    case "toggle-voice": {
      store.settings.voice = !store.settings.voice;
      if (!store.settings.voice) { try { speechSynthesis.cancel(); } catch { /* ignore */ } }
      saveStore();
      render();
      break;
    }
    case "theme": {
      store.settings.theme = d.v;
      applyTheme();
      saveStore();
      render();
      break;
    }
    case "timer-set": {
      store.settings.timer = !store.settings.timer;
      saveStore();
      render();
      break;
    }
    case "export": downloadExport(); break;
    case "copy": copyExport(); break;
    case "import-text": {
      const ta = document.getElementById("import-text");
      if (ta && ta.value.trim()) stageImport(ta.value.trim());
      break;
    }
    case "import-merge": applyImport("merge"); break;
    case "import-replace": {
      if (confirm("Nahradit všechna současná data obsahem zálohy?")) applyImport("replace");
      break;
    }
    case "import-cancel": pendingImport = null; render(); break;
    case "wipe": wipeAll(); break;
    case "refresh-app": {
      showToast("Obnovuji aplikaci…");
      (async () => {
        try {
          if ("serviceWorker" in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) await reg.update();
          }
          if (window.caches) {
            // jen vlastní cache: na stejné doméně můžou běžet i jiné appky
            const keys = await caches.keys();
            for (const k of keys) if (k.startsWith("trenink-")) await caches.delete(k);
          }
        } catch { /* ignore */ }
        location.reload();
      })();
      break;
    }
  }
});

document.addEventListener("change", e => {
  const el = e.target.closest("[data-in]");
  if (!el) return;
  const d = el.dataset;
  switch (d.in) {
    case "actual": setActual(d.sid, d.ex, +d.i, el.value); break;
    case "exnote": {
      const sess = getSession(d.sid);
      if (sess) { sess.exercises[d.ex].note = el.value.trim(); touch(sess); }
      break;
    }
    case "note": {
      const sess = getSession(d.sid);
      if (sess) { sess.note = el.value.trim(); touch(sess); }
      break;
    }
    case "date": {
      const sess = getSession(d.sid);
      if (sess && el.value) { sess.date = el.value; touch(sess); render(); }
      break;
    }
    case "stats-ex": statsEx = el.value; render(); break;
    case "yoga-note": {
      const y = getYoga(d.sid);
      if (y) { y.note = el.value.trim(); touchYoga(y); }
      break;
    }
    case "yoga-date": {
      const y = getYoga(d.sid);
      if (y && el.value) { y.date = el.value; touchYoga(y); render(); }
      break;
    }
    case "import-file": {
      const f = el.files && el.files[0];
      if (!f) break;
      const reader = new FileReader();
      reader.onload = () => stageImport(String(reader.result));
      reader.readAsText(f);
      el.value = "";
      break;
    }
  }
});

/* ---------------- start ---------------- */

function applyTheme() {
  document.documentElement.dataset.theme = store.settings.theme || "auto";
}

loadStore();
applyTheme();
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}
window.addEventListener("hashchange", render);
if (!location.hash) location.replace("#/");
render();

/* =========================================================
   Hormonální jóga – vlastní záložka a vlastní historie
   Cvičí se vlastním tempem: aplikace nepočítá čas, po dokončení
   zadaného počtu dechů se ťukne na „Hotovo“ a jede se dál.
   ========================================================= */

function yogaItems() {
  const out = [];
  for (const sec of YOGA.sections) {
    sec.items.forEach((it, i) => out.push(Object.assign({ section: sec, no: i + 1 }, it)));
  }
  return out;
}

function yogaTotalCount() { return yogaItems().length; }

function getYoga(id) { return store.yoga.find(y => y.id === id) || null; }

function touchYoga(y) { y.updatedAt = new Date().toISOString(); saveStore(); }

function yogaDoneCount(y) { return Object.values(y.done || {}).filter(Boolean).length; }

function doneYogaSessions() {
  return store.yoga
    .filter(y => y.status === "done")
    .sort((a, b) => (a.date === b.date)
      ? String(a.updatedAt).localeCompare(String(b.updatedAt))
      : String(a.date).localeCompare(String(b.date)));
}

function activeYoga() {
  return store.yoga.find(y => y.status === "active") || null;
}

function circLabel(c) {
  return { CV: "CV · varlata", CS: "CS · štítná žláza", CSH: "CSH · hypofýza + štítná žláza" }[c] || "";
}

function circSpeak(c) {
  return { CV: "cirkulace do varlat", CS: "cirkulace do štítné žlázy",
           CSH: "cirkulace do hypofýzy a štítné žlázy" }[c] || "";
}

function startYoga() {
  const act = activeYoga();
  if (act) { location.hash = "#/yogarun/" + act.id; return; }
  const y = {
    id: "y" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    date: todayISO(),
    startedAt: new Date().toISOString(),
    finishedAt: null,
    status: "active",
    step: 0,
    done: {},
    note: "",
    updatedAt: new Date().toISOString()
  };
  store.yoga.push(y);
  saveStore();
  ensureAudio();
  requestWake();
  announceYoga(y);
  location.hash = "#/yogarun/" + y.id;
}

function announceYoga(y) {
  const items = yogaItems();
  const it = items[y.step];
  if (!it) return;
  let text = it.name + ".";
  if (it.reps) text += ` ${it.reps.replace(/×/g, " krát ").replace(/B/g, "bhastriky")}.`;
  if (it.circ) text += ` Pak ${circSpeak(it.circ)}.`;
  speak(text);
}

function setYogaStep(sid, i) {
  const y = getYoga(sid);
  if (!y) return;
  y.step = Math.max(0, Math.min(yogaTotalCount() - 1, i));
  yogaListOpen = false;
  touchYoga(y);
  announceYoga(y);
  render();
}

function toggleYogaItem(sid, itemId) {
  const y = getYoga(sid);
  if (!y) return;
  y.done[itemId] = !y.done[itemId];
  touchYoga(y);
  render();
}

function yogaNext(sid) {
  const y = getYoga(sid);
  if (!y) return;
  const items = yogaItems();
  const it = items[y.step];
  if (it) y.done[it.id] = true;
  ensureAudio();
  if (y.step >= items.length - 1) {
    soundDone();
    speak("Sestava hotová. Namasté!");
    touchYoga(y);
    render();
    return;
  }
  y.step++;
  soundWork();
  touchYoga(y);
  announceYoga(y);
  render();
}

function yogaBack(sid) {
  const y = getYoga(sid);
  if (!y || y.step <= 0) return;
  y.step--;
  const it = yogaItems()[y.step];
  if (it) y.done[it.id] = false;
  ensureAudio();
  touchYoga(y);
  announceYoga(y);
  render();
}

function finishYoga(sid) {
  const y = getYoga(sid);
  if (!y) return;
  if (yogaDoneCount(y) === 0 && !confirm("Nemáš odškrtnutou žádnou pozici. Opravdu uložit?")) return;
  y.status = "done";
  y.finishedAt = new Date().toISOString();
  touchYoga(y);
  releaseWake();
  showToast("Jóga uložena 🧘");
  location.hash = "#/yogasess/" + y.id;
}

function cancelYoga(sid) {
  if (!confirm("Zrušit rozcvičenou sestavu a smazat záznam?")) return;
  store.yoga = store.yoga.filter(y => y.id !== sid);
  saveStore();
  releaseWake();
  location.hash = "#/yoga";
}

function deleteYoga(sid) {
  if (!confirm("Opravdu smazat tento záznam jógy?")) return;
  store.yoga = store.yoga.filter(y => y.id !== sid);
  saveStore();
  showToast("Záznam smazán");
  location.hash = "#/yoga";
}

/* ---- pohledy jógy ---- */

function yogaStreak() {
  const days = [...new Set(doneYogaSessions().map(y => y.date))].sort().reverse();
  if (!days.length) return 0;
  const d0 = dateFromISO(days[0]);
  const today = dateFromISO(todayISO());
  const diff = Math.round((today - d0) / 86400000);
  if (diff > 1) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = Math.round((dateFromISO(days[i - 1]) - dateFromISO(days[i])) / 86400000);
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}

function vYoga() {
  const list = doneYogaSessions();
  const act = activeYoga();
  const monday = mondayOf(new Date());
  const thisWeek = list.filter(y => dateFromISO(y.date) >= monday).length;
  const last = list.length ? list[list.length - 1] : null;
  const doneToday = list.some(y => y.date === todayISO());

  const banner = act ? `<div class="banner" data-act="nav" data-href="#/yogarun/${act.id}">
      <div class="grow">
        <div class="t">▶ Pokračovat v sestavě</div>
        <div class="s">Hotovo ${yogaDoneCount(act)}/${yogaTotalCount()} pozic</div>
      </div><span class="chev">›</span>
    </div>` : "";

  const startCard = `<div class="card next-card">
    <div class="next-label">${doneToday ? "Dnes hotovo ✓" : "Denní sestava"}</div>
    <p class="next-name">${esc(YOGA.title)}</p>
    <p class="hint" style="margin:0 0 12px">${yogaTotalCount()} pozic · ${esc(YOGA.subtitle)}</p>
    <button class="btn primary block" data-act="yoga-start">${act ? "▶ Pokračovat" : "▶ Začít sestavu"}</button>
  </div>`;

  const stats = `<div class="statgrid">
    <div class="stat"><div class="v">${list.length}</div><div class="l">sestav celkem</div></div>
    <div class="stat"><div class="v">${thisWeek}</div><div class="l">tento týden</div></div>
    <div class="stat"><div class="v">${yogaStreak()}</div><div class="l">dní v řadě</div></div>
    <div class="stat"><div class="v">${last ? esc(fmtShort(last.date)) : "–"}</div><div class="l">naposledy</div></div>
  </div>`;

  const sections = YOGA.sections.map(sec => `<details class="warm">
      <summary>${sec.icon} ${esc(sec.name)} <span class="cnt">${sec.items.length}</span></summary>
      <div class="witems">
        ${sec.items.map(it => `<div class="witem" style="cursor:default;align-items:center">
          ${poseImg(it.id, "thumb")}
          <div class="grow">
            <div class="n">${it.n ? it.n + ". " : ""}${esc(it.name)}</div>
            ${it.note ? `<div class="note">${esc(it.note)}</div>` : ""}
          </div>
          <div style="text-align:right;flex:0 0 auto">
            ${it.reps ? `<span class="badge">${esc(it.reps)}</span>` : ""}
            ${it.circ ? `<span class="badge ss">${esc(it.circ)}</span>` : ""}
          </div>
        </div>`).join("")}
      </div>
    </details>`).join("");

  const hist = list.length
    ? `<div class="section-title">Historie jógy</div>` + list.slice().reverse().slice(0, 20).map(y =>
        `<div class="histitem" data-act="nav" data-href="#/yogasess/${y.id}">
          <span class="badge day" data-day="A2">🧘</span>
          <div class="grow">
            <div class="when">${esc(fmtFull(y.date))}</div>
            <div class="meta">${yogaDoneCount(y)}/${yogaTotalCount()} pozic${y.note ? " · 📝" : ""}</div>
          </div><span class="chev">›</span>
        </div>`).join("")
    : `<p class="hint center" style="margin-top:16px">Zatím žádný záznam – po první sestavě se tu objeví historie.</p>`;

  const legend = `<div class="card"><h2>ℹ️ Zkratky a poznámky</h2>
    <ul class="legend">${YOGA.legend.map(l => `<li>${esc(l)}</li>`).join("")}</ul></div>`;

  return banner + startCard + stats +
    `<div class="section-title">Sestava</div>${sections}` + hist + `<div style="height:10px"></div>` + legend;
}

function vYogaRun(y) {
  const items = yogaItems();
  const total = items.length;
  const idx = Math.max(0, Math.min(total - 1, y.step));
  const it = items[idx];
  const next = items[idx + 1] || null;
  const done = yogaDoneCount(y);
  const allDone = done >= total;

  if (yogaListOpen) {
    return `<div class="card"><h2>Přeskočit na pozici</h2>
      ${items.map((x, i) => `<div class="witem ${y.done[x.id] ? "done" : ""}" data-act="yoga-step" data-sid="${y.id}" data-i="${i}">
          <div class="chk">✓</div>
          ${poseImg(x.id, "thumb")}
          <div class="grow"><div class="n">${x.n ? x.n + ". " : ""}${esc(x.name)}</div>
            <div class="note">${esc(x.section.name)}${x.reps ? " · " + esc(x.reps) : ""}</div></div>
          ${i === idx ? `<span class="badge ss">teď</span>` : ""}
        </div>`).join("")}
      <button class="btn block" style="margin-top:12px" data-act="yoga-list">Zavřít seznam</button>
    </div>`;
  }

  const segs = items.map((x, i) =>
    `<i class="seg${y.done[x.id] ? " done" : ""}${i === idx ? " cur" : ""}${x.section.id === "warm" && items[i + 1] && items[i + 1].section.id !== "warm" ? " rend" : ""}"></i>`
  ).join("");

  const finishCard = allDone
    ? `<div class="card center" style="margin-top:14px">
        <div style="font-size:44px">🙏</div>
        <p style="font-weight:800;margin:6px 0 2px">Sestava hotová</p>
        <p class="hint" style="margin:0 0 12px">Namasté – ${done} z ${total} pozic</p>
        <button class="btn primary block" data-act="yoga-finish" data-sid="${y.id}">✓ Uložit sestavu</button>
      </div>`
    : "";

  return `<div class="guided">
    <div class="g-phase work">${esc(it.section.icon + " " + it.section.name.toUpperCase())}</div>
    <div class="ypose">
      <div class="yfig-big" data-act="yphoto" data-ex="${it.id}">${poseImg(it.id)}<span class="ynum">${it.n || it.no}</span><span class="zoomhint">⤢</span></div>
      <h2 class="g-ex" style="margin-top:8px">${esc(it.name)}</h2>
      <div class="ybadges">
        ${it.reps ? `<span class="badge big">${esc(it.reps)}</span>` : ""}
        ${it.circ ? `<span class="badge big ss">${esc(circLabel(it.circ))}</span>` : ""}
      </div>
      ${it.note ? `<div class="g-set" style="margin-top:8px">${esc(it.note)}</div>` : ""}
      ${it.howto ? `<ul class="howto yhowto">${it.howto.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
    </div>
    ${next ? `<div class="g-next">Pak: ${next.n ? next.n + ". " : ""}${esc(next.name)}${next.reps ? ` · ${esc(next.reps)}` : ""}</div>`
           : `<div class="g-next">Poslední pozice 🙏</div>`}
    <div class="g-progwrap">
      <div class="g-prog">${segs}</div>
      <div class="g-progtxt muted small">${done}/${total} pozic hotovo</div>
    </div>
    <div class="g-controls">
      <button class="gbtn" data-act="yoga-back" data-sid="${y.id}" title="Zpět">◀</button>
      <button class="gbtn main" data-act="yoga-next" data-sid="${y.id}">${idx >= total - 1 ? "✓ Dokončit" : "✓ Hotovo, dál"}</button>
      <button class="gbtn" data-act="yoga-list" title="Seznam pozic">☰</button>
    </div>
    <div class="g-meta">
      <button class="linkbtn" data-act="toggle-voice">${store.settings.voice ? "🔊 hlas" : "🔇 hlas"}</button>
      <button class="linkbtn" data-act="toggle-sound">${store.settings.sound ? "🔔 zvuk" : "🔕 zvuk"}</button>
    </div>
    ${finishCard}
    <div class="card" style="margin-top:14px;text-align:left">
      <label class="muted small">Poznámka k sestavě</label>
      <textarea data-in="yoga-note" data-sid="${y.id}" placeholder="jak to šlo…">${esc(y.note)}</textarea>
      ${allDone ? "" : `<button class="btn primary block" style="margin-top:10px" data-act="yoga-finish" data-sid="${y.id}">✓ Uložit a ukončit</button>`}
      <p class="center" style="margin:10px 0 0">
        <button class="linkbtn" style="color:var(--danger)" data-act="yoga-cancel" data-sid="${y.id}">Zrušit a smazat záznam</button>
      </p>
    </div>
  </div>`;
}

function vYogaSession(y) {
  const items = yogaItems();
  const rows = YOGA.sections.map(sec => `<div class="sess-ex">
      <div class="n">${sec.icon} ${esc(sec.name)}</div>
      <div class="yfigrow">${sec.items.map(it =>
        `<span class="yfigcell ${y.done[it.id] ? "" : "skip"}" title="${esc(it.name)}">${poseImg(it.id, "thumb")}</span>`).join("")}</div>
    </div>`).join("");

  return `<div class="card">
      <div class="row" style="margin-bottom:8px">
        <span class="badge day" data-day="A2">🧘</span>
        <b class="grow">${esc(YOGA.title)}</b>
        <span class="badge">${yogaDoneCount(y)}/${items.length}</span>
      </div>
      <div class="row">
        <label class="muted small" style="flex:0 0 auto">Datum</label>
        <input type="date" value="${esc(y.date)}" data-in="yoga-date" data-sid="${y.id}" style="flex:1">
      </div>
      ${y.note ? `<hr class="sep"><div>📝 ${esc(y.note)}</div>` : ""}
    </div>
    <div class="card">${rows}</div>
    <button class="btn danger block" data-act="yoga-del" data-sid="${y.id}">Smazat záznam</button>`;
}
