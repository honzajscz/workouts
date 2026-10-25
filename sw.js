/* Service worker – appka funguje i offline (třeba v posilovně bez signálu).
   Strategie network-first: když je připojení, vždy se načte nejnovější verze;
   bez připojení se použije poslední stažená kopie z cache.
   GitHub Pages posílá soubory s max-age=600, proto se mezipaměť prohlížeče
   obchází (jinak by se nová verze projevila až po 10 minutách).
   Při změně souborů zvyš číslo verze, ať se stará cache uklidí. */
const CACHE = "trenink-v19";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./figures.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./img/yoga/w1.jpg",
  "./img/yoga/w2.jpg",
  "./img/yoga/w3.jpg",
  "./img/yoga/w4.jpg",
  "./img/yoga/w5.jpg",
  "./img/yoga/w6.jpg",
  "./img/yoga/w7.jpg",
  "./img/yoga/y1.jpg",
  "./img/yoga/y2.jpg",
  "./img/yoga/y3.jpg",
  "./img/yoga/y4.jpg",
  "./img/yoga/y5.jpg",
  "./img/yoga/y6.jpg",
  "./img/yoga/y7.jpg",
  "./img/yoga/y8.jpg",
  "./img/yoga/y9.jpg",
  "./img/yoga/y10.jpg",
  "./img/yoga/y11.jpg",
  "./img/yoga/y12.jpg",
  "./img/yoga/y13.jpg",
  "./img/yoga/y14.jpg",
  "./img/yoga/y15.jpg",
  "./img/yoga/y16.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

// Při aktivaci se mažou jen vlastní staré cache ("trenink-*"). Na stejné doméně
// (honzajscz.github.io) můžou běžet i jiné appky s vlastní cache a té se nesmí sahat.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("trenink-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;

  // navigace se ukládá pod index.html, ať offline funguje i s #/... adresou
  const cacheKey = req.mode === "navigate" ? "./index.html" : req;

  event.respondWith(
    // navigaci nejde přepsat parametry; ostatní soubory se ověří u serveru (při shodě jen 304),
    // pokud si stránka sama neřekla o jiný režim (např. „reload“ z tlačítka Obnovit aplikaci)
    fetch(req.mode === "navigate" || req.cache !== "default" ? req : new Request(req, { cache: "no-cache" }))
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

/* Notifikace řízeného tréninku: tlačítka Pauza / Hotovo, dál se pošlou otevřené
   appce (ta zůstane na pozadí), ťuknutí na samotnou notifikaci appku otevře. */
self.addEventListener("notificationclick", event => {
  const n = event.notification;
  if (n.tag !== "guided") return;
  const action = event.action || "open";
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (!wins.length) {
      // appka mezitím skončila → notifikace je stará
      n.close();
      if (action === "open") await self.clients.openWindow("./");
      return;
    }
    wins.forEach(c => c.postMessage({ type: "guided-notif", action, sid: n.data && n.data.sid }));
    if (action === "open") {
      try { await wins[0].focus(); } catch { /* ignore */ }
    }
  })());
});

self.addEventListener("notificationclose", event => {
  if (event.notification.tag !== "guided") return;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(wins => wins.forEach(c => c.postMessage({ type: "guided-notif", action: "closed" })))
  );
});
