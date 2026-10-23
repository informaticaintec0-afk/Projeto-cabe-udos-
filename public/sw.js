/**
 * Service Worker — Futebol Retrô
 * Compatível tanto com a raiz '/' quanto com subcaminhos do GitHub Pages ('/Projeto-cabe-udos-/')
 */

const CACHE_NAME = 'futebol-retro-v3';

self.addEventListener('install', (event) => {
  const scope = self.registration.scope;
  const appShell = [
    scope,
    new URL('manifest.json', scope).href,
    new URL('icon-192.png', scope).href,
    new URL('icon-512.png', scope).href
  ];

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(appShell))
      .catch((err) => {
        console.warn('Aviso no cache inicial do service worker:', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
