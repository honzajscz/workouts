/* =========================================================
   Claude Akademie, česká učebnice Claude po malých kouscích
   Čistý JavaScript bez závislostí. Pokrok žije v localStorage.
   ========================================================= */
"use strict";

const APP_VERSION = "1.0.0";
const STORAGE_KEY = "claude-akademie.v1";
const EXPORT_APP_ID = "claude-akademie";

/* ---------------- úložiště ---------------- */

const DEFAULT_SETTINGS = { theme: "auto", fs: "m", goal: 2, tts: true };

const store = {
  done: {},        // lessonId -> ISO datum dokončení
  quiz: {},        // lessonId -> { score, total, at }
  notes: {},       // lessonId -> text
  marks: [],       // záložky (lessonId)
  cards: {},       // cardId -> { n, iv, ef, due }
  days: {},        // "YYYY-MM-DD" -> počet dokončených lekcí
  tests: [],       // rychlé testy { at, score, total }
  last: null,      // naposledy otevřená lekce
  settings: Object.assign({}, DEFAULT_SETTINGS)
};

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    for (const k of ["done", "quiz", "notes", "cards", "days"]) {
      if (d[k] && typeof d[k] === "object") store[k] = d[k];
    }
    if (Array.isArray(d.marks)) store.marks = d.marks;
    if (Array.isArray(d.tests)) store.tests = d.tests;
    if (typeof d.last === "string") store.last = d.last;
    if (d.settings && typeof d.settings === "object") {
      store.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings);
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
    toast("⚠️ Uložení se nepovedlo (plné úložiště?)");
  }
}

/* ---------------- pomocné ---------------- */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function todayKey(d = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function addDays(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d + n));
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

function plural(n, one, few, many) {
  if (n === 1) return `${n} ${one}`;
  if (n >= 2 && n <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function openSheet(html) {
  const m = document.getElementById("modal");
  m.innerHTML = `<div class="sheet">${html}</div>`;
  m.onclick = e => { if (e.target === m) closeSheet(); };
}
function closeSheet() {
  document.getElementById("modal").innerHTML = "";
}

function confirmSheet(title, text, okLabel, onOk, danger) {
  openSheet(`
    <h2>${esc(title)}</h2>
    <p class="muted">${esc(text)}</p>
    <div class="btn-row">
      <button class="btn" id="c-no">Zrušit</button>
      <button class="btn ${danger ? "danger" : "primary"}" id="c-ok">${esc(okLabel)}</button>
    </div>`);
  document.getElementById("c-no").onclick = closeSheet;
  document.getElementById("c-ok").onclick = () => { closeSheet(); onOk(); };
}

/* ---------------- data kurzů ---------------- */

const COURSES = AKADEMIE.courses;
const CATEGORIES = [
  { id: "start", title: "Začni tady", desc: "Základy pro každého, bez technických znalostí." },
  { id: "fluency", title: "Staň se AI zběhlým", desc: "Jak přemýšlet o spolupráci s AI a jak jí důvěřovat správně." },
  { id: "produkty", title: "Poznej produkty", desc: "Koncepty Claude Code, Cowork, MCP, subagentů a skills." }
];

const LESSONS = [];       // ploché pořadí všech lekcí
const LESSON_BY_ID = {};
COURSES.forEach(c => {
  c.modules.forEach((m, mi) => {
    m.lessons.forEach((l, li) => {
      l.course = c;
      l.module = m;
      l.index = LESSONS.length;
      l.numInCourse = c.modules.slice(0, mi).reduce((s, x) => s + x.lessons.length, 0) + li + 1;
      LESSONS.push(l);
      LESSON_BY_ID[l.id] = l;
    });
  });
  c.lessons = c.modules.flatMap(m => m.lessons);
});

function courseLessons(c) { return c.lessons; }
function courseDone(c) { return c.lessons.filter(l => store.done[l.id]).length; }
function courseProgress(c) { return c.lessons.length ? courseDone(c) / c.lessons.length : 0; }
function isCourseDone(c) { return c.lessons.length > 0 && courseDone(c) === c.lessons.length; }
function nextLessonIn(c) { return c.lessons.find(l => !store.done[l.id]) || null; }
function nextAfter(l) { return l.course.lessons[l.course.lessons.indexOf(l) + 1] || null; }
function prevBefore(l) { return l.course.lessons[l.course.lessons.indexOf(l) - 1] || null; }

function suggestedLesson() {
  if (store.last && LESSON_BY_ID[store.last]) {
    const l = LESSON_BY_ID[store.last];
    if (!store.done[l.id]) return l;
    const n = nextLessonIn(l.course);
    if (n) return n;
  }
  for (const c of COURSES) {
    const n = nextLessonIn(c);
    if (n) return n;
  }
  return null;
}

function cardId(l, i) { return `${l.id}#${i}`; }

function allCards() {
  const out = [];
  LESSONS.forEach(l => (l.cards || []).forEach((c, i) => out.push({ id: cardId(l, i), f: c.f, b: c.b, lesson: l })));
  return out;
}

function dueCards() {
  const t = todayKey();
  return allCards().filter(c => {
    if (!store.done[c.lesson.id]) return false;
    const s = store.cards[c.id];
    return !s || s.due <= t;
  });
}

function allTerms() {
  const out = [];
  LESSONS.forEach(l => (l.terms || []).forEach(t => out.push({ t: t.t, d: t.d, lesson: l })));
  return out.sort((a, b) => a.t.localeCompare(b.t, "cs"));
}

/* ---------------- statistiky ---------------- */

function streakInfo() {
  const days = store.days;
  let cur = 0;
  let k = todayKey();
  if (!days[k]) k = addDays(k, -1);
  while (days[k] > 0) { cur++; k = addDays(k, -1); }
  const keys = Object.keys(days).filter(d => days[d] > 0).sort();
  let best = 0, run = 0, prev = null;
  keys.forEach(d => {
    run = (prev && addDays(prev, 1) === d) ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  });
  return { current: cur, best };
}

function minutesLearned() {
  return LESSONS.filter(l => store.done[l.id]).reduce((s, l) => s + (l.minutes || 3), 0);
}

function markDone(l) {
  if (store.done[l.id]) return;
  store.done[l.id] = new Date().toISOString();
  const k = todayKey();
  store.days[k] = (store.days[k] || 0) + 1;
  saveStore();
  updateTabBadges();
  const done = Object.keys(store.done).length;
  if (done === 1) toast("🎉 První lekce hotová!");
  else if (isCourseDone(l.course)) toast(`🏅 Kurz „${l.course.title}“ dokončen!`);
  else if (store.days[k] === store.settings.goal) toast("✅ Denní cíl splněn!");
  else toast("✔ Lekce hotová");
}

function unmarkDone(l) {
  if (!store.done[l.id]) return;
  const k = todayKey(new Date(store.done[l.id]));
  if (store.days[k] > 0) store.days[k]--;
  delete store.done[l.id];
  delete store.quiz[l.id];
  saveStore();
  updateTabBadges();
}

/* ---------------- routing ---------------- */

const routes = [
  { re: /^#\/?$/, view: viewToday, tab: "dnes" },
  { re: /^#\/kurzy$/, view: viewCourses, tab: "kurzy" },
  { re: /^#\/kurz\/([\w-]+)$/, view: viewCourse, tab: "kurzy" },
  { re: /^#\/lekce\/([\w-]+)$/, view: viewLesson, tab: "kurzy" },
  { re: /^#\/opakovani$/, view: viewReview, tab: "opakovani" },
  { re: /^#\/opakovani\/test$/, view: viewQuickTest, tab: "opakovani" },
  { re: /^#\/slovnik$/, view: viewGlossary, tab: "slovnik" },
  { re: /^#\/vice$/, view: viewMore, tab: "vice" }
];

function setHeader(title, sub, back, actions) {
  document.getElementById("h-title").textContent = title;
  document.getElementById("h-sub").textContent = sub || "";
  const b = document.getElementById("h-back");
  b.style.display = back ? "" : "none";
  if (back) b.setAttribute("href", back);
  document.getElementById("h-actions").innerHTML = actions || "";
}

function render() {
  stopSpeech();
  closeSheet();
  const hash = location.hash || "#/";
  const view = document.getElementById("view");
  for (const r of routes) {
    const m = hash.match(r.re);
    if (m) {
      document.querySelectorAll(".tabbar a").forEach(a => a.classList.toggle("active", a.dataset.tab === r.tab));
      view.innerHTML = "";
      r.view(view, ...m.slice(1));
      window.scrollTo(0, 0);
      return;
    }
  }
  location.hash = "#/";
}

function updateTabBadges() {
  const a = document.querySelector('.tabbar a[data-tab="opakovani"]');
  if (!a) return;
  let b = a.querySelector(".badge");
  const n = dueCards().length;
  if (!n) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement("span"); b.className = "badge"; a.appendChild(b); }
  b.textContent = n > 99 ? "99+" : n;
}

/* ---------------- Dnes ---------------- */

function ringHtml(val, max, label) {
  const r = 40, c = 2 * Math.PI * r;
  const p = Math.min(1, max ? val / max : 0);
  return `<div class="ring">
    <svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="${r}"/>
    <circle class="bar ${p >= 1 ? "done" : ""}" cx="50" cy="50" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/></svg>
    <div class="lbl">${val}/${max}<small>${esc(label)}</small></div></div>`;
}

function lessonItem(l, opts = {}) {
  const done = !!store.done[l.id];
  const q = store.quiz[l.id];
  const meta = [`${l.minutes || 3} min`];
  if (opts.course) meta.unshift(l.course.title);
  if (q) meta.push(`kvíz ${q.score}/${q.total}`);
  if (store.marks.includes(l.id)) meta.push("🔖");
  return `<a class="item ${done ? "done" : ""} ${opts.next ? "next" : ""}" href="#/lekce/${l.id}">
    <span class="num">${done ? "✓" : l.numInCourse}</span>
    <span class="grow"><span class="ttl">${esc(l.title)}</span><span class="meta">${esc(meta.join(" · "))}</span></span>
    <span class="arrow">›</span></a>`;
}

function viewToday(view) {
  setHeader("Claude Akademie", "Učení po malých kouscích");
  const goal = store.settings.goal;
  const today = store.days[todayKey()] || 0;
  const s = streakInfo();
  const next = suggestedLesson();
  const due = dueCards().length;
  const doneCount = Object.keys(store.done).length;
  const hour = new Date().getHours();
  const greet = hour < 10 ? "Dobré ráno" : hour < 18 ? "Dobrý den" : "Dobrý večer";

  let html = `<div class="card accent"><div class="hero">
    ${ringHtml(today, goal, "dnes")}
    <div>
      <h2>${greet}!</h2>
      <p class="muted small mb0">${today >= goal ? "Denní cíl máš splněný. Klidně pokračuj dál, nebo si dej opakování." :
        `Do denního cíle ${goal - today === 1 ? "zbývá" : goal - today <= 4 ? "zbývají" : "zbývá"} ${plural(goal - today, "lekce", "lekce", "lekcí")}. Jedna trvá jen pár minut.`}</p>
      <div class="row wrap mt"><span class="chip ${s.current ? "accent" : ""}">🔥 ${plural(s.current, "den", "dny", "dní")} v řadě</span>
      <span class="chip">${doneCount}/${LESSONS.length} lekcí</span></div>
    </div></div></div>`;

  if (next) {
    html += `<div class="section-title">${store.last && !store.done[store.last] ? "Pokračovat" : "Další lekce"}</div>
      <a class="item next" href="#/lekce/${next.id}">
        <span class="emoji">${next.course.emoji}</span>
        <span class="grow"><span class="ttl">${esc(next.title)}</span>
        <span class="meta">${esc(next.course.title)} · lekce ${next.numInCourse}/${next.course.lessons.length} · ${next.minutes || 3} min</span></span>
        <span class="arrow">›</span></a>`;
  } else {
    html += `<div class="card center"><div class="em" style="font-size:40px">🏆</div><h2>Všechny lekce hotové!</h2>
      <p class="muted small">Zbývá udržovat znalosti: opakuj kartičky a zkoušej rychlé testy.</p></div>`;
  }

  html += `<div class="section-title">Opakování</div><div class="list">`;
  html += `<a class="item" href="#/opakovani"><span class="emoji">🔁</span>
    <span class="grow"><span class="ttl">Kartičky</span><span class="meta">${due ? plural(due, "kartička čeká", "kartičky čekají", "kartiček čeká") + " na zopakování" : (doneCount ? "Dnes nic nečeká, vše zopakováno" : "Kartičky se odemknou dokončením lekcí")}</span></span>
    ${due ? `<span class="chip accent">${due}</span>` : ""}<span class="arrow">›</span></a>`;
  if (doneCount >= 2) {
    html += `<a class="item" href="#/opakovani/test"><span class="emoji">🎯</span>
      <span class="grow"><span class="ttl">Rychlý test</span><span class="meta">5 otázek z dokončených lekcí, cca 2 minuty</span></span><span class="arrow">›</span></a>`;
  }
  html += `</div>`;

  const terms = allTerms();
  if (terms.length) {
    const dayIdx = Math.floor(Date.now() / 86400000) % terms.length;
    const t = terms[dayIdx];
    html += `<div class="section-title">Pojem dne</div><div class="card"><h3>${esc(t.t)}</h3>
      <p class="small mb0">${esc(t.d)}</p><p class="tiny muted mb0 mt">Z lekce <a href="#/lekce/${t.lesson.id}">${esc(t.lesson.title)}</a></p></div>`;
  }

  html += `<div class="section-title">Kurzy</div><div class="list">`;
  COURSES.forEach(c => {
    const p = courseProgress(c);
    html += `<a class="item" href="#/kurz/${c.id}"><span class="emoji">${c.emoji}</span>
      <span class="grow"><span class="ttl">${esc(c.title)}</span>
      <div class="progress ${p >= 1 ? "ok" : ""}" style="margin-top:6px"><i style="width:${Math.round(p * 100)}%"></i></div></span>
      <span class="chip ${p >= 1 ? "ok" : ""}">${courseDone(c)}/${c.lessons.length}</span></a>`;
  });
  html += `</div>`;
  view.innerHTML = html;
}

/* ---------------- Kurzy ---------------- */

function viewCourses(view) {
  setHeader("Kurzy", `${COURSES.length} kurzů · ${LESSONS.length} lekcí · podle Claude Academy`);
  let html = "";
  CATEGORIES.forEach(cat => {
    const cs = COURSES.filter(c => c.category === cat.id);
    if (!cs.length) return;
    html += `<div class="section-title">${esc(cat.title)}</div><p class="muted small" style="margin:-4px 0 10px">${esc(cat.desc)}</p><div class="list">`;
    cs.forEach(c => {
      const p = courseProgress(c);
      const mins = c.lessons.reduce((s, l) => s + (l.minutes || 3), 0);
      html += `<a class="item" href="#/kurz/${c.id}"><span class="emoji">${c.emoji}</span>
        <span class="grow"><span class="ttl">${esc(c.title)}</span>
        <span class="meta">${esc(c.level)} · ${c.lessons.length} lekcí · ~${mins} min</span>
        <div class="progress ${p >= 1 ? "ok" : ""}" style="margin-top:6px"><i style="width:${Math.round(p * 100)}%"></i></div></span>
        <span class="chip ${p >= 1 ? "ok" : ""}">${p >= 1 ? "✓" : Math.round(p * 100) + " %"}</span></a>`;
    });
    html += `</div>`;
  });
  view.innerHTML = html;
}

function viewCourse(view, id) {
  const c = COURSES.find(x => x.id === id);
  if (!c) { location.hash = "#/kurzy"; return; }
  setHeader(c.title, `${courseDone(c)}/${c.lessons.length} lekcí`, "#/kurzy");
  const next = nextLessonIn(c);
  const p = courseProgress(c);
  let html = `<div class="card ${p >= 1 ? "" : "accent"}"><div class="row"><span style="font-size:36px">${c.emoji}</span>
    <div class="grow"><h2>${esc(c.title)}</h2><p class="muted small mb0">${esc(c.desc)}</p></div></div>
    <div class="row wrap mt"><span class="chip">${esc(c.level)}</span><span class="chip">${c.lessons.length} lekcí</span>
    <span class="chip">~${c.lessons.reduce((s, l) => s + (l.minutes || 3), 0)} min</span></div>
    <div class="progress ${p >= 1 ? "ok" : ""} mt"><i style="width:${Math.round(p * 100)}%"></i></div>
    ${next ? `<a class="btn primary block mt" href="#/lekce/${next.id}">${courseDone(c) ? "Pokračovat: " : "Začít: "}${esc(next.title)}</a>` :
      `<div class="done-banner"><div class="em">🏅</div><b>Kurz dokončen</b><p class="muted small mb0">Odznak najdeš ve „Více“. Lekce si můžeš kdykoli znovu projít.</p></div>`}
    ${c.source ? `<p class="tiny muted mt mb0">Zpracováno podle originálního kurzu: <a href="${esc(c.source)}" target="_blank" rel="noopener">academy.claude.com</a></p>` : ""}
  </div>`;
  c.modules.forEach(m => {
    html += `<div class="section-title">${esc(m.title)}</div><div class="list">`;
    m.lessons.forEach(l => { html += lessonItem(l, { next: next && next.id === l.id }); });
    html += `</div>`;
  });
  view.innerHTML = html;
}

/* ---------------- lekce ---------------- */

function renderBlock(b) {
  switch (b.t) {
    case "p": return `<p>${b.h}</p>`;
    case "h": return `<h2>${esc(b.x)}</h2>`;
    case "h3": return `<h3>${esc(b.x)}</h3>`;
    case "ul": return `<ul>${b.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    case "ol": return `<ol>${b.items.map(i => `<li>${i}</li>`).join("")}</ol>`;
    case "steps": return `<ol class="steps">${b.items.map(i => `<li>${i}</li>`).join("")}</ol>`;
    case "tip": case "warn": case "info": case "key": {
      const ttl = b.title || { tip: "💡 Tip", warn: "⚠️ Pozor", info: "ℹ️ Dobré vědět", key: "🔑 Klíčová myšlenka" }[b.t];
      return `<div class="callout ${b.t}"><span class="ttl">${esc(ttl)}</span><p>${b.h}</p></div>`;
    }
    case "ex": {
      const who = { user: "Ty", ai: "Claude", bad: "Slabší varianta", sys: "Systém / nastavení" };
      return `<div class="example"><div class="ex-head">💬 ${esc(b.title || "Ukázka")}</div>
        ${b.turns.map(t => `<div class="bubble ${t.who}"><div class="who">${esc(t.label || who[t.who] || t.who)}</div><pre class="${t.mono ? "mono" : ""}">${esc(t.text)}</pre></div>`).join("")}
        ${b.note ? `<div class="note">${b.note}</div>` : ""}</div>`;
    }
    case "table":
      return `<div class="tbl-wrap"><table class="tbl">${b.head ? `<tr>${b.head.map(h => `<th>${h}</th>`).join("")}</tr>` : ""}
        ${b.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
    case "cmp":
      return `<div class="compare"><div class="bad"><span class="lbl">${esc(b.bad.lbl || "Slabší")}</span>${b.bad.h}</div>
        <div class="good"><span class="lbl">${esc(b.good.lbl || "Lepší")}</span>${b.good.h}</div></div>`;
    default: return "";
  }
}

function viewLesson(view, id) {
  const l = LESSON_BY_ID[id];
  if (!l) { location.hash = "#/kurzy"; return; }
  store.last = l.id;
  saveStore();
  const marked = store.marks.includes(l.id);
  const ttsOk = store.settings.tts && "speechSynthesis" in window;
  setHeader(l.title, `${l.course.title} · lekce ${l.numInCourse}/${l.course.lessons.length}`, `#/kurz/${l.course.id}`,
    `${ttsOk ? `<button class="icon-btn" id="btn-tts" title="Přečíst nahlas">🔊</button>` : ""}
     <button class="icon-btn ${marked ? "on" : ""}" id="btn-mark" title="Záložka">🔖</button>`);

  const done = !!store.done[l.id];
  const prev = prevBefore(l), next = nextAfter(l);
  let html = `<div class="lesson">
    <div class="row wrap" style="margin-bottom:10px"><span class="chip">${esc(l.module.title)}</span><span class="chip">⏱ ${l.minutes || 3} min</span>
    ${done ? `<span class="chip ok">✓ hotovo ${fmtDate(store.done[l.id])}</span>` : ""}</div>
    ${l.lead ? `<p class="lesson-lead">${l.lead}</p>` : ""}
    ${(l.blocks || []).map(renderBlock).join("")}`;

  if (l.cards && l.cards.length) {
    html += `<div class="callout key"><span class="ttl">🧠 Co si odnést</span><ul style="margin:0;padding-left:18px">${l.cards.map(c => `<li><b>${esc(c.f)}</b>: ${esc(c.b)}</li>`).join("")}</ul></div>`;
  }

  html += `</div>`;

  // kvíz
  const quiz = l.quiz || [];
  if (quiz.length) {
    html += `<div class="quiz card"><h2>🎯 Rychlá kontrola</h2><p class="muted small">${plural(quiz.length, "otázka", "otázky", "otázek")}. Špatná odpověď nevadí, důležité je vysvětlení.</p>`;
    quiz.forEach((q, qi) => {
      html += `<div class="q" data-q="${qi}"><div class="qt">${qi + 1}. ${esc(q.q)}</div><div class="opts">
        ${q.o.map((o, oi) => `<button class="opt" data-q="${qi}" data-o="${oi}">${esc(o)}</button>`).join("")}</div>
        <div class="why" style="display:none">${esc(q.why)}</div></div>`;
    });
    html += `<div id="quiz-result"></div></div>`;
  }

  // poznámky
  html += `<div class="card"><h3>📝 Moje poznámka</h3>
    <textarea id="note" placeholder="Co tě zaujalo, co si chceš vyzkoušet, vlastní příklad…">${esc(store.notes[l.id] || "")}</textarea></div>`;

  // dokončení
  html += `<div id="finish">${finishHtml(l)}</div>`;
  html += `<div class="lesson-nav">
    ${prev ? `<a class="btn" href="#/lekce/${prev.id}">‹ Předchozí</a>` : `<a class="btn" href="#/kurz/${l.course.id}">‹ Kurz</a>`}
    ${next ? `<a class="btn" href="#/lekce/${next.id}">Další ›</a>` : `<a class="btn" href="#/kurzy">Kurzy ›</a>`}
  </div>`;
  view.innerHTML = html;

  // interakce kvízu
  const answered = {};
  view.querySelectorAll(".opt").forEach(btn => {
    btn.onclick = () => {
      const qi = +btn.dataset.q, oi = +btn.dataset.o;
      if (answered[qi] !== undefined) return;
      answered[qi] = oi;
      const q = quiz[qi];
      const wrap = view.querySelector(`.q[data-q="${qi}"]`);
      wrap.querySelectorAll(".opt").forEach(b => {
        b.disabled = true;
        const o = +b.dataset.o;
        if (o === q.a) b.classList.add("right");
        else if (o === oi) b.classList.add("wrong");
      });
      wrap.querySelector(".why").style.display = "";
      if (Object.keys(answered).length === quiz.length) {
        const score = quiz.filter((q2, i) => answered[i] === q2.a).length;
        store.quiz[l.id] = { score, total: quiz.length, at: new Date().toISOString() };
        markDone(l);
        document.getElementById("quiz-result").innerHTML = `<div class="callout ${score === quiz.length ? "tip" : "info"}" style="margin-top:8px"><span class="ttl">Výsledek: ${score}/${quiz.length}</span>
          <p>${score === quiz.length ? "Výborně, vše správně." : "Projdi si vysvětlení u otázek, kde jsi netrefil/a. Lekce je i tak označená jako hotová."}</p></div>`;
        document.getElementById("finish").innerHTML = finishHtml(l);
        bindFinish(l);
        setHeader(l.title, `${l.course.title} · lekce ${l.numInCourse}/${l.course.lessons.length}`, `#/kurz/${l.course.id}`, document.getElementById("h-actions").innerHTML);
        bindHeader(l);
      }
    };
  });

  const note = document.getElementById("note");
  let noteTimer = null;
  note.oninput = () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      if (note.value.trim()) store.notes[l.id] = note.value; else delete store.notes[l.id];
      saveStore();
    }, 400);
  };

  bindFinish(l);
  bindHeader(l);
}

function finishHtml(l) {
  const done = !!store.done[l.id];
  const next = nextAfter(l);
  if (done) {
    return `<div class="card done-banner"><div class="em">✅</div><b>Lekce hotová</b>
      <p class="muted small">Kartičky z této lekce se přidaly do opakování.</p>
      <div class="btn-row">${next ? `<a class="btn primary" href="#/lekce/${next.id}">Další lekce ›</a>` : `<a class="btn primary" href="#/kurz/${l.course.id}">Zpět na kurz</a>`}
      <button class="btn ghost sm" id="btn-undo">Zrušit dokončení</button></div></div>`;
  }
  return `<div class="card center"><p class="muted small">${(l.quiz || []).length ? "Lekce se označí jako hotová po zodpovězení kontrolních otázek. Nebo ji můžeš odškrtnout rovnou:" : "Přečteno? Označ lekci jako hotovou."}</p>
    <button class="btn ok block" id="btn-done">Označit jako hotovo</button></div>`;
}

function bindFinish(l) {
  const d = document.getElementById("btn-done");
  if (d) d.onclick = () => { markDone(l); document.getElementById("finish").innerHTML = finishHtml(l); bindFinish(l); };
  const u = document.getElementById("btn-undo");
  if (u) u.onclick = () => { unmarkDone(l); render(); };
}

function bindHeader(l) {
  const m = document.getElementById("btn-mark");
  if (m) m.onclick = () => {
    const i = store.marks.indexOf(l.id);
    if (i >= 0) { store.marks.splice(i, 1); toast("Záložka odebrána"); }
    else { store.marks.push(l.id); toast("🔖 Uloženo do záložek"); }
    saveStore();
    m.classList.toggle("on", store.marks.includes(l.id));
  };
  const t = document.getElementById("btn-tts");
  if (t) t.onclick = () => toggleSpeech(l, t);
}

/* ---------------- předčítání ---------------- */

let speaking = false;
function lessonPlainText(l) {
  const div = document.createElement("div");
  div.innerHTML = [l.title + ".", l.lead || "", ...(l.blocks || []).map(b => {
    if (b.t === "ex") return (b.title || "Ukázka") + ". " + b.turns.map(t => t.text).join(". ") + ". " + (b.note || "");
    if (b.t === "cmp") return b.bad.h + ". Lepší varianta: " + b.good.h;
    if (b.t === "table") return b.rows.map(r => r.join(", ")).join(". ");
    if (b.items) return b.items.join(". ");
    return b.h || b.x || "";
  })].join("\n");
  return div.textContent.replace(/\s+/g, " ");
}
function toggleSpeech(l, btn) {
  if (speaking) { stopSpeech(); return; }
  const u = new SpeechSynthesisUtterance(lessonPlainText(l));
  u.lang = "cs-CZ";
  const v = speechSynthesis.getVoices().find(x => x.lang && x.lang.toLowerCase().startsWith("cs"));
  if (v) u.voice = v;
  u.rate = 1;
  u.onend = u.onerror = () => { speaking = false; if (btn) btn.classList.remove("on"); };
  speaking = true;
  if (btn) btn.classList.add("on");
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  if (!v) toast("Český hlas nebyl nalezen, čtu dostupným hlasem");
}
function stopSpeech() {
  if ("speechSynthesis" in window && speaking) { speechSynthesis.cancel(); speaking = false; }
}

/* ---------------- opakování (kartičky) ---------------- */

function rateCard(id, rating) {
  const t = todayKey();
  const s = store.cards[id] || { n: 0, iv: 0, ef: 2.5, due: t };
  if (rating === 0) { s.n = 0; s.iv = 0; s.ef = Math.max(1.3, s.ef - 0.2); }
  else {
    if (rating === 1) { s.iv = Math.max(1, Math.round(s.iv * 1.2)); s.ef = Math.max(1.3, s.ef - 0.15); }
    else if (rating === 2) { s.iv = s.n === 0 ? 1 : s.n === 1 ? 3 : Math.round(s.iv * s.ef); }
    else { s.iv = s.n === 0 ? 3 : s.n === 1 ? 7 : Math.round(s.iv * s.ef * 1.3); s.ef += 0.15; }
    s.n++;
  }
  s.due = addDays(t, s.iv);
  store.cards[id] = s;
  saveStore();
}

let reviewQueue = null;
function viewReview(view) {
  const doneCount = Object.keys(store.done).length;
  const learned = Object.keys(store.cards).filter(id => store.cards[id].n > 0).length;
  setHeader("Opakování", `${learned} naučených kartiček`);
  const due = dueCards();
  if (!reviewQueue || !reviewQueue.length) reviewQueue = shuffle(due);

  let html = `<div class="pill-row"><a class="pill on" href="#/opakovani">Kartičky</a>
    <a class="pill" href="#/opakovani/test">Rychlý test</a><button class="pill" id="pill-marks">Záložky (${store.marks.length})</button></div>`;

  if (!doneCount) {
    html += `<div class="empty"><div style="font-size:40px">🔁</div><p>Kartičky se odemykají dokončením lekcí. Každá lekce přidá pár klíčových pojmů, které ti appka připomene ve správný čas (rozložené opakování).</p>
      <a class="btn primary" href="#/kurzy">Vybrat kurz</a></div>`;
    view.innerHTML = html;
    bindMarks(view);
    return;
  }

  if (!reviewQueue.length) {
    const total = allCards().filter(c => store.done[c.lesson.id]).length;
    const nextDue = Object.values(store.cards).map(s => s.due).filter(d => d > todayKey()).sort()[0];
    html += `<div class="empty"><div style="font-size:40px">🎉</div><p>Na dnešek nic nečeká. Máš odemčeno ${plural(total, "kartičku", "kartičky", "kartiček")}.
      ${nextDue ? `Další opakování: ${fmtDate(nextDue)}.` : ""}</p>
      <button class="btn" id="btn-all">Procvičit všechny kartičky mimo plán</button></div>`;
    view.innerHTML = html;
    bindMarks(view);
    document.getElementById("btn-all").onclick = () => {
      reviewQueue = shuffle(allCards().filter(c => store.done[c.lesson.id]));
      reviewQueue.extra = true;
      render();
    };
    return;
  }

  const c = reviewQueue[0];
  html += `<div class="row between small muted" style="margin-bottom:8px"><span>Zbývá ${reviewQueue.length}</span><span>${store.cards[c.id] ? "opakování" : "nová kartička"}</span></div>
    <div class="card flash" id="flash"><div class="side">Otázka · ťukni pro odpověď</div><div class="front">${esc(c.f)}</div>
    <div class="src">${esc(c.lesson.course.title)} · ${esc(c.lesson.title)}</div></div>
    <div id="rate"><p class="muted small center">Nejdřív si odpověz v duchu, pak otoč kartičku.</p></div>`;
  view.innerHTML = html;
  bindMarks(view);
  const flash = document.getElementById("flash");
  flash.onclick = () => {
    flash.innerHTML = `<div class="side">Odpověď</div><div class="front" style="font-size:1rem;font-weight:600;margin-bottom:8px">${esc(c.f)}</div><div class="backtxt">${esc(c.b)}</div>
      <div class="src"><a href="#/lekce/${c.lesson.id}">Otevřít lekci</a></div>`;
    flash.onclick = null;
    document.getElementById("rate").innerHTML = `<p class="muted small center">Jak dobře sis vzpomněl/a?</p><div class="rate">
      <button class="btn" data-r="0">Znovu<small>hned</small></button>
      <button class="btn" data-r="1">Těžké<small>brzy</small></button>
      <button class="btn primary" data-r="2">Dobré<small>za pár dní</small></button>
      <button class="btn ok" data-r="3">Snadné<small>za déle</small></button></div>`;
    document.querySelectorAll("#rate [data-r]").forEach(b => b.onclick = () => {
      const r = +b.dataset.r;
      if (!reviewQueue.extra) rateCard(c.id, r);
      reviewQueue.shift();
      if (r === 0) reviewQueue.push(c);
      updateTabBadges();
      render();
    });
  };
}

function bindMarks(view) {
  const b = document.getElementById("pill-marks");
  if (!b) return;
  b.onclick = () => {
    const ls = store.marks.map(id => LESSON_BY_ID[id]).filter(Boolean);
    openSheet(`<h2>🔖 Záložky</h2>${ls.length ? `<div class="list">${ls.map(l => lessonItem(l, { course: true })).join("")}</div>` :
      `<p class="muted">Zatím nic. Záložku přidáš ikonou 🔖 v hlavičce lekce.</p>`}`);
  };
}

/* ---------------- rychlý test ---------------- */

function viewQuickTest(view) {
  setHeader("Rychlý test", "5 otázek z dokončených lekcí", "#/opakovani");
  const pool = [];
  const doneLessons = LESSONS.filter(l => store.done[l.id] && (l.quiz || []).length);
  const src = doneLessons.length >= 2 ? doneLessons : LESSONS.filter(l => (l.quiz || []).length);
  src.forEach(l => l.quiz.forEach(q => pool.push({ q, lesson: l })));
  const qs = shuffle(pool).slice(0, 5);
  let i = 0, score = 0;
  const draw = () => {
    if (i >= qs.length) {
      store.tests.push({ at: new Date().toISOString(), score, total: qs.length });
      saveStore();
      view.innerHTML = `<div class="card done-banner"><div class="em">${score === qs.length ? "🏆" : score >= 3 ? "👍" : "📖"}</div>
        <h2>${score}/${qs.length}</h2><p class="muted small">${score === qs.length ? "Bez chyby!" : score >= 3 ? "Dobrá práce. Slabší místa si projdi znovu." : "Nevadí. Otevři si lekce, kde to zaskřípalo."}</p>
        <div class="btn-row"><a class="btn primary" href="#/opakovani/test" onclick="setTimeout(render,0)">Ještě jednou</a><a class="btn" href="#/">Domů</a></div></div>`;
      return;
    }
    const { q, lesson } = qs[i];
    view.innerHTML = `<div class="progress" style="margin-bottom:12px"><i style="width:${(i / qs.length) * 100}%"></i></div>
      <div class="card"><div class="tiny muted">${i + 1}/${qs.length} · ${esc(lesson.course.title)}</div>
      <div class="q"><div class="qt">${esc(q.q)}</div><div class="opts">${q.o.map((o, oi) => `<button class="opt" data-o="${oi}">${esc(o)}</button>`).join("")}</div>
      <div class="why" style="display:none">${esc(q.why)} <a href="#/lekce/${lesson.id}">Otevřít lekci</a></div></div>
      <div id="qnext"></div></div>`;
    view.querySelectorAll(".opt").forEach(b => b.onclick = () => {
      const oi = +b.dataset.o;
      if (oi === q.a) score++;
      view.querySelectorAll(".opt").forEach(x => { x.disabled = true; if (+x.dataset.o === q.a) x.classList.add("right"); else if (+x.dataset.o === oi) x.classList.add("wrong"); });
      view.querySelector(".why").style.display = "";
      document.getElementById("qnext").innerHTML = `<button class="btn primary block mt" id="btn-next">${i + 1 < qs.length ? "Další otázka" : "Vyhodnotit"}</button>`;
      document.getElementById("btn-next").onclick = () => { i++; draw(); };
    });
  };
  if (!qs.length) { view.innerHTML = `<div class="empty">Zatím nejsou žádné otázky.</div>`; return; }
  draw();
}

/* ---------------- slovníček ---------------- */

function viewGlossary(view) {
  const terms = allTerms();
  setHeader("Slovníček", `${terms.length} pojmů`);
  view.innerHTML = `<input class="search" type="search" id="q" placeholder="Hledat pojem…" autocomplete="off"><div id="terms"></div>`;
  const box = document.getElementById("terms");
  const draw = q => {
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const list = q ? terms.filter(t => norm(t.t + " " + t.d).includes(norm(q))) : terms;
    if (!list.length) { box.innerHTML = `<div class="empty">Nic nenalezeno.</div>`; return; }
    let html = "", letter = "";
    list.forEach(t => {
      const L = t.t[0].toUpperCase();
      if (!q && L !== letter) { letter = L; html += `<div class="letter">${esc(L)}</div>`; }
      const done = !!store.done[t.lesson.id];
      html += `<div class="term"><b>${esc(t.t)}</b><span class="small">${esc(t.d)}</span>
        <div class="src">${done ? "✓ " : ""}<a href="#/lekce/${t.lesson.id}">${esc(t.lesson.title)}</a> · ${esc(t.lesson.course.title)}</div></div>`;
    });
    box.innerHTML = html;
  };
  draw("");
  document.getElementById("q").oninput = e => draw(e.target.value.trim());
}

/* ---------------- Více ---------------- */

function heatmapHtml() {
  const cells = [];
  const start = addDays(todayKey(), -83);
  let k = start;
  for (let i = 0; i < 84; i++) {
    const n = store.days[k] || 0;
    const lvl = n === 0 ? "" : n === 1 ? "l1" : n <= 3 ? "l2" : "l3";
    cells.push(`<i class="${lvl}" title="${k}: ${n}"></i>`);
    k = addDays(k, 1);
  }
  return `<div class="heat">${cells.join("")}</div><p class="tiny muted mb0 mt">Posledních 12 týdnů, každý čtvereček jeden den.</p>`;
}

function viewMore(view) {
  setHeader("Více", `Claude Akademie ${APP_VERSION}`);
  const s = store.settings;
  const st = streakInfo();
  const doneCount = Object.keys(store.done).length;
  const learned = Object.keys(store.cards).filter(id => store.cards[id].n > 0).length;
  const quizzes = Object.values(store.quiz);
  const acc = quizzes.length ? Math.round(100 * quizzes.reduce((a, q) => a + q.score, 0) / quizzes.reduce((a, q) => a + q.total, 0)) : null;

  view.innerHTML = `
    <div class="section-title">Můj pokrok</div>
    <div class="stat-grid">
      <div class="stat"><b>${doneCount}</b><span>lekcí hotovo</span></div>
      <div class="stat"><b>${Math.round(100 * doneCount / LESSONS.length)} %</b><span>celkem</span></div>
      <div class="stat"><b>${minutesLearned()}</b><span>minut učení</span></div>
      <div class="stat"><b>${st.current}</b><span>dní v řadě</span></div>
      <div class="stat"><b>${st.best}</b><span>nejdelší série</span></div>
      <div class="stat"><b>${acc === null ? "-" : acc + " %"}</b><span>úspěšnost kvízů</span></div>
    </div>
    <div class="card mt">${heatmapHtml()}</div>

    <div class="section-title">Odznaky</div>
    <div class="badges">${COURSES.map(c => `<div class="badge-card ${isCourseDone(c) ? "" : "off"}"><span class="em">${c.emoji}</span>${esc(c.title)}</div>`).join("")}</div>
    <p class="tiny muted">Naučených kartiček: ${learned}. Rychlých testů: ${store.tests.length}.</p>

    <div class="section-title">Nastavení</div>
    <div class="card">
      <label class="lbl">Vzhled</label>
      <select id="set-theme"><option value="auto">Podle systému</option><option value="dark">Tmavý</option><option value="light">Světlý</option></select>
      <label class="lbl mt">Velikost písma</label>
      <select id="set-fs"><option value="s">Menší</option><option value="m">Normální</option><option value="l">Větší</option><option value="xl">Největší</option></select>
      <label class="lbl mt">Denní cíl (lekcí za den)</label>
      <select id="set-goal">${[1, 2, 3, 4, 5].map(n => `<option value="${n}">${n}</option>`).join("")}</select>
      <label class="lbl mt">Předčítání lekcí (🔊 v hlavičce lekce)</label>
      <select id="set-tts"><option value="1">Zapnuto</option><option value="0">Vypnuto</option></select>
    </div>

    <div class="section-title">Záloha dat</div>
    <div class="card">
      <p class="muted small">Pokrok je uložený jen v tomto prohlížeči. Pro přenos na jiné zařízení použij export a import.</p>
      <div class="btn-row"><button class="btn" id="btn-export">⬇️ Export do souboru</button><button class="btn" id="btn-copy">📋 Kopírovat</button></div>
      <div class="btn-row"><button class="btn" id="btn-import">⬆️ Import ze souboru</button><button class="btn" id="btn-paste">📥 Vložit ze schránky</button></div>
      <input type="file" id="file" accept="application/json,.json" style="display:none">
      <button class="btn danger block mt" id="btn-reset">Smazat veškerý pokrok</button>
    </div>

    <div class="section-title">O aplikaci</div>
    <div class="card small muted">
      <p>Česká učebnice Claude po malých kouscích, zpracovaná podle kurzů <a href="https://academy.claude.com/" target="_blank" rel="noopener">Claude Academy</a>. Původní kurzy jsou v angličtině a obsahují praktická cvičení. Zde jsou cvičení nahrazena podrobnými ukázkami, aby šlo vše projít jen čtením, třeba v tramvaji.</p>
      <p>Názvy tlačítek a umístění funkcí v aplikacích Claude se časem mění. Popisy odpovídají stavu v době psaní (září 2026). Podstata, tedy jak s Claude pracovat, aby to fungovalo, platí dál.</p>
      <p class="mb0">Verze ${APP_VERSION}. Data neopouštějí tvůj prohlížeč.</p>
    </div>`;

  const th = document.getElementById("set-theme"); th.value = s.theme;
  th.onchange = () => { s.theme = th.value; applySettings(); saveStore(); };
  const fs = document.getElementById("set-fs"); fs.value = s.fs;
  fs.onchange = () => { s.fs = fs.value; applySettings(); saveStore(); };
  const g = document.getElementById("set-goal"); g.value = String(s.goal);
  g.onchange = () => { s.goal = +g.value; saveStore(); toast("Denní cíl uložen"); };
  const t = document.getElementById("set-tts"); t.value = s.tts ? "1" : "0";
  t.onchange = () => { s.tts = t.value === "1"; saveStore(); };

  document.getElementById("btn-export").onclick = exportFile;
  document.getElementById("btn-copy").onclick = async () => {
    try { await navigator.clipboard.writeText(exportJson()); toast("Zkopírováno do schránky"); }
    catch { toast("Schránka není dostupná, použij export do souboru"); }
  };
  document.getElementById("btn-import").onclick = () => document.getElementById("file").click();
  document.getElementById("file").onchange = e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => importJson(r.result);
    r.readAsText(f);
  };
  document.getElementById("btn-paste").onclick = async () => {
    try { importJson(await navigator.clipboard.readText()); }
    catch { toast("Schránku se nepodařilo přečíst"); }
  };
  document.getElementById("btn-reset").onclick = () => confirmSheet("Smazat pokrok?", "Smaže se dokončení lekcí, kvízy, poznámky, záložky i kartičky. Nastavení zůstane. Nejde vrátit zpět.", "Smazat", () => {
    const settings = store.settings;
    Object.assign(store, { done: {}, quiz: {}, notes: {}, marks: [], cards: {}, days: {}, tests: [], last: null, settings });
    saveStore(); updateTabBadges(); render(); toast("Pokrok smazán");
  }, true);
}

function exportJson() {
  return JSON.stringify({ app: EXPORT_APP_ID, version: APP_VERSION, exportedAt: new Date().toISOString(), data: store }, null, 2);
}

function exportFile() {
  const blob = new Blob([exportJson()], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `claude-akademie-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  toast("Záloha stažena");
}

function importJson(text) {
  let d;
  try { d = JSON.parse(text); } catch { toast("To není platný JSON"); return; }
  if (!d || d.app !== EXPORT_APP_ID || !d.data) { toast("Soubor nepochází z Claude Akademie"); return; }
  const n = Object.keys(d.data.done || {}).length;
  confirmSheet("Nahradit data?", `Záloha z ${fmtDate(d.exportedAt)} obsahuje ${plural(n, "dokončenou lekci", "dokončené lekce", "dokončených lekcí")}. Aktuální pokrok v tomto prohlížeči se přepíše.`, "Importovat", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d.data));
    loadStore(); applySettings(); updateTabBadges(); render(); toast("Import hotov");
  });
}

/* ---------------- start ---------------- */

function applySettings() {
  document.documentElement.dataset.theme = store.settings.theme;
  document.documentElement.dataset.fs = store.settings.fs;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const light = store.settings.theme === "light" || (store.settings.theme === "auto" && matchMedia("(prefers-color-scheme: light)").matches);
    meta.content = light ? "#faf7f2" : "#1c1917";
  }
}

loadStore();
applySettings();
updateTabBadges();
window.addEventListener("hashchange", render);
window.addEventListener("hashchange", () => { if (!location.hash.startsWith("#/opakovani")) reviewQueue = null; });
document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); });
render();
