/* eslint-disable no-restricted-globals */

const CACHE_VERSION = "v3";
const CACHE_NAME = `${CACHE_VERSION}:sw-cache-`;
const CACHE_ADDITIONAL = [
  "/",
  "/primero-pictorial-144.png",
  "javascripts/i18n.js"
];

const onInstall = event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function prefill(cache) {
      return cache.addAll(
        CACHE_ADDITIONAL.concat(self.__precacheManifest || [])
      );
    })
  );
};

const onActivate = event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.indexOf(CACHE_VERSION) !== 0;
          })
          .map(cacheName => {
            return caches.delete(cacheName);
          })
      );
    })
  );
};

const onFetch = event => {
  const request = event.request.clone();

  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then(response => {
        if (response) {
          return response;
        }

        if (
          request.mode === "navigate" ||
          (request.method === "GET" &&
            request.headers.get("accept").includes("text/html"))
        ) {
          return caches.match("/");
        }

        return true;
      });
    })
  );
};

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);
