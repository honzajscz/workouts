/* =========================================================
   Trénink – jednoduchý tracker tréninkového plánu
   Čistý JavaScript bez závislostí. Data žijí v localStorage.
   ========================================================= */
"use strict";

const APP_VERSION = "1.0.0";
const STORAGE_KEY = "trenink-tracker.v1";
const EXPORT_APP_ID = "trenink-tracker";

/* ---------------- úložiště ---------------- */

const store = {
  sessions: [],                       // všechny tréninky (aktivní i dokončené)
  settings: { theme: "auto", timer: true },
  activeId: null                      // id rozdělaného tréninku
};

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (Array.isArray(data.sessions)) store.sessions = data.sessions;
    if (data.settings && typeof data.settings === "object") {
      store.settings = Object.assign({ theme: "auto", timer: true }, data.settings);
    }
    store.activeId = typeof data.activeId === "string" ? data.activeId : null;
    if (store.activeId && !store.sessions.some(s => s.id === store.activeId)) {
      store.activeId = null;
    }
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

function startSession(dayId, week) {
  if (store.activeId) {
    const act = getSession(store.activeId);
    const label = act ? `${act.dayId} · Týden ${act.week}` : "";
    if (!confirm(`Máš rozdělaný trénink (${label}). Zahodit ho a začít nový?`)) return;
    store.sessions = store.sessions.filter(s => s.id !== store.activeId);
    store.activeId = null;
  }
  const sess = newSession(dayId, week);
  store.sessions.push(sess);
  store.activeId = sess.id;
  saveStore();
  location.hash = "#/workout/" + sess.id;
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

function defaultWeekFor(dayId) {
  for (let w = 1; w <= PLAN.weeks; w++) {
    if (!sessionsFor(dayId, w).length) return w;
  }
  return PLAN.weeks;
}

function suggestion() {
  for (let w = 1; w <= PLAN.weeks; w++) {
    for (const dayId of PLAN.order) {
      if (!sessionsFor(dayId, w).length) return { dayId, week: w };
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
  if (set.done && sess.status === "active" && store.settings.timer) {
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
  showToast("Trénink uložen 💪");
  location.hash = "#/session/" + sid;
}

function cancelSession(sid) {
  if (!confirm("Zrušit rozdělaný trénink a smazat jeho záznam?")) return;
  store.sessions = store.sessions.filter(s => s.id !== sid);
  if (store.activeId === sid) store.activeId = null;
  saveStore();
  stopRest();
  location.hash = "#/";
}

function deleteSession(sid) {
  if (!confirm("Opravdu smazat tento záznam tréninku?")) return;
  store.sessions = store.sessions.filter(s => s.id !== sid);
  if (store.activeId === sid) store.activeId = null;
  saveStore();
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
    settings: store.settings
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
  if (mode === "replace") {
    store.sessions = incoming;
  } else {
    const byId = new Map(store.sessions.map(s => [s.id, s]));
    for (const s of incoming) {
      const cur = byId.get(s.id);
      if (!cur || String(s.updatedAt || "") > String(cur.updatedAt || "")) byId.set(s.id, s);
    }
    store.sessions = [...byId.values()];
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
  }
  lastRoute = path;

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
  } else if (route === "history") {
    tab = "history";
    header = { title: "Historie", sub: "Dokončené tréninky", back: null };
    html = vHistory();
  } else if (route === "session" && getSession(parts[1])) {
    tab = "history";
    const sess = getSession(parts[1]);
    header = { title: `${getDay(sess.dayId).name}`, sub: `Týden ${sess.week} · ${fmtFull(sess.date)}`, back: "#/history" };
    html = vSession(sess);
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

  window.scrollTo(0, sameRoute ? scrollY : 0);
  renderTimer();
}

/* ---------------- pohledy ---------------- */

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
  const totalDone = new Set(doneSessions().map(s => `${s.dayId}|${s.week}`)).size;
  const totalAll = PLAN.weeks * PLAN.order.length;

  let nextCard;
  if (sug) {
    const day = getDay(sug.dayId);
    nextCard = `<div class="card next-card">
      <div class="next-label">Na řadě</div>
      <p class="next-name">${esc(day.name)} · Týden ${sug.week}</p>
      <p class="hint" style="margin:0 0 12px">Dokončeno ${totalDone} z ${totalAll} tréninků programu</p>
      <div class="row">
        <button class="btn primary grow" data-act="start" data-day="${day.id}" data-week="${sug.week}">Začít trénink</button>
        <a class="btn" href="#/day/${day.id}?w=${sug.week}">Detail</a>
      </div>
    </div>`;
  } else {
    nextCard = `<div class="card next-card center">
      <p class="next-name">🎉 Program dokončen!</p>
      <p class="hint">Všech ${totalAll} tréninků máš za sebou. Můžeš jet kterýkoli den znovu.</p>
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
    <button class="btn primary block" style="margin-bottom:14px" data-act="start" data-day="${day.id}" data-week="${week}">
      Začít trénink · Týden ${week}
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

  return `
    <div class="card">
      <div class="row">
        <label class="muted small" style="flex:0 0 auto">Datum</label>
        <input type="date" value="${esc(sess.date)}" data-in="date" data-sid="${sess.id}" style="flex:1">
      </div>
    </div>
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
    </div>

    <div class="card">
      <h2>ℹ️ Legenda plánu</h2>
      <ul class="legend">${PLAN.legend.map(l => `<li>${esc(l)}</li>`).join("")}</ul>
    </div>

    <div class="card">
      <h2>O aplikaci</h2>
      <p class="hint">Tréninkový plán převzatý z <a href="${esc(PLAN.source)}" target="_blank" rel="noopener">Google tabulky</a>. Aplikace běží na GitHub Pages, funguje i offline a data má jen ve tvém prohlížeči (nikam se neposílají).</p>
      <p class="hint">💡 Tip pro mobil: v prohlížeči zvol „Přidat na plochu“ – appka se pak chová jako nativní a data v ní vydrží spolehlivěji.</p>
      <p class="hint">Verze ${APP_VERSION}</p>
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
