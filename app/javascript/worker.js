/* eslint-disable no-restricted-globals */

const CACHE_ADDITIONAL = [
  "/",
  "/primero-pictorial-144.png",
  "/primero-pictorial-192.png",
  "/primero-pictorial-512.png",
  "/javascripts/i18n.js",
  "/manifest.json"
].map(cache => ({ url: cache }));

self.__precacheManifest = []
  .concat(self.__precacheManifest || [])
  .concat(CACHE_ADDITIONAL);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

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

self.addEventListener("fetch", onFetch);

workbox.routing.registerRoute(
  /translations-*.js$/,
  new workbox.strategies.CacheFirst(),
  "GET"
);
