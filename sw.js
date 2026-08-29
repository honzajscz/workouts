/* Service worker – appka funguje i offline (třeba v posilovně bez signálu).
   Strategie network-first: když je připojení, vždy se načte nejnovější verze;
   bez připojení se použije poslední stažená kopie z cache.
   Při změně souborů zvyš číslo verze, ať se stará cache uklidí. */
const CACHE = "trenink-v7";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
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

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
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
