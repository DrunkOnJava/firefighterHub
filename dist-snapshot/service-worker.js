// IMPORTANT: Increment this version number whenever you deploy updates
// This forces all clients to download fresh content
const CACHE_VERSION = "v7";
const CACHE_NAME = `hold-manager-${CACHE_VERSION}`;

// Static assets that rarely change (icons, manifest)
const STATIC_CACHE = `static-${CACHE_VERSION}`;

// Cache for dynamic content (HTML, JS, CSS) - use network-first strategy
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// Assets to pre-cache on install
const urlsToCache = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  console.log(`[SW] Installing new service worker ${CACHE_VERSION}`);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log(`[SW] Activating new service worker ${CACHE_VERSION}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE
          ) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Listen for skip waiting message from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-http(s) schemes
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  // Skip Supabase API requests - always fetch fresh
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // NETWORK-FIRST strategy for HTML, JS, CSS (dynamic content)
  // This ensures users get the latest code updates
  if (
    event.request.destination === "document" ||
    event.request.destination === "script" ||
    event.request.destination === "style" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname === "/" ||
    url.pathname === "/index.html"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // CACHE-FIRST strategy for static assets (images, icons, fonts)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
