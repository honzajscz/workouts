/* Přechodný service worker po přesunu Tréninku do repozitáře learning-apps.
   Nahradí starý worker na této cestě, uklidí jeho cache a sám se odregistruje,
   aby nainstalovaná stará verze dostala přesměrovací stránku a ne starý obsah. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("trenink-")).map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach(c => c.navigate(c.url));
  })());
});
