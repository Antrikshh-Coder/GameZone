self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installed');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activated');
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response("Offline — no network connection.", {
          headers: { "Content-Type": "text/plain" }
        });
      })
    );
  });
  