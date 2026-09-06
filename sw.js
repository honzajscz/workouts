/* Service worker – appka funguje i offline (třeba v posilovně bez signálu).
   Strategie network-first: když je připojení, vždy se načte nejnovější verze;
   bez připojení se použije poslední stažená kopie z cache.
   Při změně souborů zvyš číslo verze, ať se stará cache uklidí. */
const CACHE = "trenink-v10";

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
