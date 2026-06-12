self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event.data?.json?.() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title || "Nueva notificación", {
      body: data.body || "",
      icon: "/favicon.png",
    })
  );
});
