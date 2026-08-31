// Offline support for the Al Yazi staff billing app.
//
// Safety rules this file follows on purpose:
// 1. Anything under /api/ is NEVER cached or intercepted — it always goes
//    straight to the network, exactly like it did before this file existed.
//    Orders, sales, sync, login, and payments must never be answered from a
//    stale cache; if there's no network for an /api/ call, it fails exactly
//    like it always has, and app.js already handles that gracefully
//    (local-first writes, best-effort sync).
// 2. The app shell (HTML/CSS/JS/images/fonts) is network-first: if the
//    network is up, the freshest copy always wins and is used to refresh
//    the cache. The cached copy is only ever served when the network
//    request genuinely fails (offline, or mid-outage) — never as a
//    performance shortcut that could serve stale code while online.
// 3. CACHE_VERSION must be bumped any time a cached file's content changes
//    (same discipline as app.js's own ?v= query param). Bumping it makes
//    the old cache get deleted on the next activate — nothing lingers.

const CACHE_VERSION = "v1";
const CACHE_NAME = `alyazi-billing-shell-${CACHE_VERSION}`;
const SCOPE = "/staff/billing/";

const SHELL_ASSETS = [
  "",
  "index.html",
  "billing.html",
  "kitchen.html",
  "styles.css",
  "app.js",
  "al-yazi-mandi-logo.png",
  "al-yazi-mandi-logo-inverted.png",
  "al-yazi-mandi-logo-white-transparent.png",
  "font 02.ttf",
  "BBQ chicken01.png",
  "BIgbucket 01.jpeg",
  "Chicken al faham.jpeg",
  "Extra Rice01.jpeg",
  "chicken morrocan mandi.jpeg",
  "extra mutton 01.png",
  "mayonnaise.jpeg",
  "mutton 02.jpeg",
].map((name) => SCOPE + name);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // addAll is all-or-nothing; if one asset 404s the whole install fails.
      // Cache each one independently instead, so a single missing/renamed
      // file can never block the rest of offline support from working.
      await Promise.all(
        SHELL_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "no-store" });
            if (response.ok) await cache.put(url, response);
          } catch (err) {
            // Offline during install, or a genuinely missing file — skip it,
            // the rest of the shell still caches fine.
          }
        })
      );
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("alyazi-billing-shell-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only ever handle same-origin GET requests inside this app's scope.
  // Everything else (POST/PUT/DELETE, cross-origin CDN scripts, other
  // parts of the site) passes straight through untouched.
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  // Rule 1: never touch API calls.
  if (url.pathname.startsWith("/api/")) return;

  // Only handle requests inside /staff/billing/.
  if (!url.pathname.startsWith(SCOPE)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const fresh = await fetch(event.request);
        // Only cache successful, cacheable responses.
        if (fresh && fresh.ok) cache.put(event.request, fresh.clone()).catch(() => {});
        return fresh;
      } catch (err) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        // Nothing cached and no network — for a page navigation, fall back
        // to the cached billing shell rather than the browser's blank
        // offline error page, so staff at least see a familiar screen.
        if (event.request.mode === "navigate") {
          const fallback = await cache.match(SCOPE + "billing.html");
          if (fallback) return fallback;
        }
        throw err;
      }
    })()
  );
});
