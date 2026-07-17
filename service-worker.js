// Kill switch for the CRA-era service worker previously registered at this
// URL. Clients still controlled by it pick this file up on their next update
// check; it clears the old /bus/ caches, unregisters itself, and reloads so
// the page fetches the current app (which registers /bus/sw.js).
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.includes("/bus/")).map((key) => caches.delete(key))
      );
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
