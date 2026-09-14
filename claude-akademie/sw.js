/* Service worker Claude Akademie: po prvním načtení funguje appka i offline.
   Strategie network-first: s připojením se vždy načte nejnovější verze,
   bez připojení poslední stažená kopie. Při změně souborů zvyš verzi cache. */
const CACHE = "claude-akademie-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./kurzy/_index.js",
  "./kurzy/claude-101.js",
  "./kurzy/ai-fluency.js",
  "./kurzy/schopnosti-a-limity.js",
  "./kurzy/claude-code-101.js",
  "./kurzy/cowork.js",
  "./kurzy/mcp.js",
  "./kurzy/subagenti.js",
  "./kurzy/skills.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Mažou se jen vlastní staré cache ("claude-akademie-*"); tréninková appka na
// stejné doméně má "trenink-*" a její offline kopie musí zůstat netknutá.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("claude-akademie-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  // navigace se ukládá pod index.html, ať offline funguje i s #/... adresou
  const cacheKey = req.mode === "navigate" ? "./index.html" : req;

  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(cacheKey, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(cacheKey))
  );
});
