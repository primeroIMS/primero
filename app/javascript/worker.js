/* eslint-disable no-restricted-globals */

workbox.setConfig({
  clientsClaim: true
});

workbox.core.clientsClaim();
workbox.core.skipWaiting();
workbox.precaching.cleanupOutdatedCaches();

self.__precacheManifest = []
  .concat(self.__precacheManifest || [])
  .map(entry => {
    const { url } = entry;

    if (/\b[A-Fa-f0-9]{32}|[A-Fa-f0-9]{20}\b/.test(url)) {
      // eslint-disable-next-line no-param-reassign
      delete entry.revision;
    }

    return entry;
  });

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
          return caches.match(workbox.precaching.getCacheKeyForURL("/"));
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

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/"),
  {
    whitelist: [/^(\/)$/, /^\/v2\//]
  }
);
