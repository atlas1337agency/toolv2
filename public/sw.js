self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We don't need to intercept anything, just having a fetch handler
  // satisfies the PWA installability requirements for most browsers.
  return;
});
