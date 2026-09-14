/* Přechodný service worker po přesunu Tréninku do repozitáře learning-apps.
   Nahradí starý worker na této cestě, uklidí jeho cache a sám se odregistruje,
   aby nainstalovaná stará verze dostala přesměrovací stránku a ne starý obsah. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // jen cache staré appky (trenink-v1 až v14); nová appka v learning-apps má v15 a výš
    const isLegacy = k => { const m = /^trenink-v(\d+)$/.exec(k); return !!m && Number(m[1]) <= 14; };
    await Promise.all(keys.filter(isLegacy).map(k => caches.delete(k)));
    await self.clients.claim();
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach(c => c.navigate(c.url));
  })());
});
