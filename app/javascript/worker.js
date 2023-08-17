/* eslint-disable no-restricted-globals */

import { precacheAndRoute, getCacheKeyForURL, cleanupOutdatedCaches } from "workbox-precaching";
import { setCatchHandler, registerRoute } from "workbox-routing";
import { NetworkOnly, CacheFirst, NetworkFirst } from "workbox-strategies";
import { clientsClaim, skipWaiting, cacheNames } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

clientsClaim();
skipWaiting();
cleanupOutdatedCaches();

const METHODS = {
  GET: "GET",
  PATCH: "PATCH",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
};

const ACTIONS = {
  GOTO: "goto"
};

const isNav = event => event.request.mode === "navigate";

// TODO: This pr would allow passing strategies to workbox way of handling navigation routes
// https://github.com/GoogleChrome/workbox/pull/2459
registerRoute(
  ({ event }) => isNav(event),
  new NetworkFirst({
    cacheName: cacheNames.precache,
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);

// Images
registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Location Json
registerRoute(
  /\/options\/locations-.*.json$/,
  new CacheFirst({
    cacheName: "locations",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1
      })
    ]
  }),
  METHODS.GET
);

// Api Endpoints
Object.values(METHODS).forEach(method => {
  registerRoute(/\/api\/.*/, new NetworkOnly(), method);
});

const manifest = self.__WB_MANIFEST.map(entry => {
  const { url } = entry;

  if (/\b[A-Fa-f0-9]{32}|[A-Fa-f0-9]{20}\b/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    entry.revision = null;
  }

  return entry;
});

precacheAndRoute(manifest);

setCatchHandler(({ event }) => {
  if (isNav(event)) return caches.match(getCacheKeyForURL("/"));

  return Response.error();
});

self.addEventListener("push", event => {
  const message = event.data.json();
  const image = `${self.location.origin}/primero-pictorial-144.png`;

  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      image,
      icon: image,
      data: { url: message.link },
      actions: [{ action: ACTIONS.GOTO, title: message.action_label }]
    })
  );
});

self.addEventListener(
  "notificationclick",
  async event => {
    event.notification.close();

    if (event.action === ACTIONS.GOTO) {
      event.waitUntil(
        self.clients
          .matchAll({
            type: "window"
          })
          .then(clientList => {
            for (let clientCounter = 0; clientCounter < clientList.length; clientCounter += 1) {
              const client = clientList[clientCounter];

              // If so, just focus it.
              if (client.url === event.notification.data.url && "focus" in client) {
                return client.focus();
              }
            }

            return self.clients.openWindow(event.notification.data.url);
          })
      );
    }
  },
  false
);
