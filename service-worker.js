// ════════════════════════════════════════════════════════════
// CHECK-A-PAW SERVICE WORKER  (service-worker.js)
//
// PURPOSE
//   Enables Check-A-Paw to be installed as a PWA and to work
//   offline once the core assets have been cached on first load.
//
// HOW IT WORKS
//   • install  – pre-caches the core local assets for the app.
//   • fetch    – serves cached assets (cache-first for local files,
//                network-with-cache-fallback for CDN assets).
//   • activate – removes any old caches from previous SW versions.
//
// IMPORTANT CAVEAT
//   Service workers only run over http(s) or localhost — NOT over
//   the file:// protocol used when you double-click index.html on
//   the desktop.  The registration in index.html guards against
//   this with an 'if (serviceWorker in navigator)' check, so the
//   app still works perfectly as a plain HTML file.  Full PWA
//   install / offline support requires HTTPS — e.g. GitHub Pages.
// ════════════════════════════════════════════════════════════

'use strict';

// Bump this version string whenever you ship a breaking change to
// cached assets.  The activate handler will delete all caches that
// don't match this name, ensuring users always get fresh content.
const CACHE_NAME = 'check-a-paw-v1';

// Core same-origin assets to pre-cache on install.
// These are the files that must be available for the app to open
// fully offline after the first visit.
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// External CDN origin for Tailwind CSS.
// We do NOT fail the install if the CDN is unreachable; instead we
// attempt to cache it opportunistically during the fetch handler.
const CDN_TAILWIND =
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';


// ────────────────────────────────────────────────────────────
// INSTALL  — pre-cache all core local assets.
// skipWaiting() makes the new SW activate without waiting for
// existing tabs to close (good for updates to a static app).
// ────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache local assets and swallow any individual fetch errors
      // so a missing icon never breaks the entire install.
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          cache.add(url).catch(err =>
            console.warn(`[SW] Pre-cache failed for ${url}:`, err)
          )
        )
      );
    }).then(() => {
      // Activate immediately — no need to wait for old tabs to close.
      return self.skipWaiting();
    })
  );
});


// ────────────────────────────────────────────────────────────
// ACTIVATE  — clean up caches from previous SW versions.
// claim() lets this SW control already-open pages right away.
// ────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)  // delete anything not matching current version
          .map(name => {
            console.log(`[SW] Deleting stale cache: ${name}`);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())  // take control of all pages without a reload
  );
});


// ────────────────────────────────────────────────────────────
// FETCH  — intercept network requests and apply the right
//          caching strategy.
//
//   Same-origin requests  → Cache-First:
//     Serve the cached response instantly; if missing, fetch from
//     network and add to cache for next time.
//
//   CDN (Tailwind) request → Network-First with cache fallback:
//     Try the network so the user always gets the latest CSS;
//     on failure (offline) return the cached copy.
//
//   All other cross-origin → Pass through to network only.
// ────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests — never intercept POST, PUT, etc.
  if (request.method !== 'GET') return;

  // ── CDN assets: network-first, cache fallback ──────────
  // Use exact hostname comparison (not startsWith) to avoid substring-
  // sanitization bypass: e.g. 'https://cdn.jsdelivr.net.evil.com'.
  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Cache a fresh copy of the CDN response for offline use
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))  // offline? serve cached CSS
    );
    return;
  }

  // ── Same-origin assets: cache-first, network fallback ──
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;  // fast path — serve from cache

        // Not in cache: fetch from network and cache the result
        return fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
  }
  // All other cross-origin requests fall through to the browser's
  // default handling (no interception needed).
});
