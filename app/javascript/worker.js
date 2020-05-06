/* eslint-disable no-restricted-globals */

workbox.core.clientsClaim();
workbox.core.skipWaiting();
workbox.precaching.cleanupOutdatedCaches();

const METHODS = {
  GET: "GET",
  PATCH: "PATCH",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
};

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

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/"),
  {
    whitelist: [/^(\/)$/, /^\/v2\//]
  }
);

workbox.routing.registerRoute(
  /translations-*.js$/,
  new workbox.strategies.CacheFirst(),
  METHODS.GET
);

workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

workbox.routing.registerRoute(
  /\/options\/locations-.*.json$/,
  new workbox.strategies.CacheFirst({
    cacheName: "locations"
  }),
  METHODS.GET
);

Object.values(METHODS).forEach(method => {
  workbox.routing.registerRoute(
    /\/api\/.*/,
    new workbox.strategies.NetworkOnly(),
    method
  );
});
