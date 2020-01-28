const CACHE_VERSION = "v1";
const CACHE_NAME = `${CACHE_VERSION}:sw-cache-`;
const CACHE_ADDITIONAL = ["/", "/primero-pictorial-144.png"];

function onInstall(event) {
  console.log("[Serviceworker]", "Installing!", event);

  event.waitUntil(
    caches.open(CACHE_NAME).then(function prefill(cache) {
      return cache.addAll(
        CACHE_ADDITIONAL.concat(
          (self.__precacheManifest || []).map(function(item) {
            return item.url;
          })
        )
      );
    })
  );
}

function onActivate(event) {
  console.log("[Serviceworker]", "Activating!", event);

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return cacheName.indexOf(CACHE_VERSION) !== 0;
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
}

function onFetch(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }

        if (
          event.request.mode === "navigate" ||
          (event.request.method === "GET" &&
            event.request.headers.get("accept").includes("text/html"))
        ) {
          return caches.match("/");
        }
      });
    })
  );
}

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);
