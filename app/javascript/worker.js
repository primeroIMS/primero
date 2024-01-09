// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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

const isNav = event => event.request.mode === "navigate";

function registerNetworkFirstRoute(url, cacheName) {
  registerRoute(
    url,
    new NetworkFirst({
      cacheName,
      networkTimeoutSeconds: 5,
      plugins: [
        new CacheableResponsePlugin({
          statuses: [200]
        })
      ]
    })
  );
}

// TODO: This pr would allow passing strategies to workbox way of handling navigation routes
// https://github.com/GoogleChrome/workbox/pull/2459
registerNetworkFirstRoute(({ event }) => isNav(event), cacheNames.precache);

const ADDITIONAL_PRECACHE_FILES = [
  {
    url: `${self.location.origin}/theme`,
    revision: "287dc07e50a71051143046fb05416cfc23d214ca8de1070d2047d830fc2ed776"
  },
  {
    url: `${self.location.origin}/manifest.json`,
    revision: "287dc07e50a71051143046fb05416cfc23d214ca8de1070d2047d830fc2ed776"
  }
];

// registerNetworkFirstRoute(`${self.location.origin}/manifest.json`, "manifest");
// registerNetworkFirstRoute(`${self.location.origin}/theme`, "theme");

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

console.log(manifest);
precacheAndRoute([...manifest, ...ADDITIONAL_PRECACHE_FILES]);

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
      data: { url: message.link }
    })
  );
});

self.addEventListener(
  "notificationclick",
  event => {
    event.notification.close();

    event.waitUntil(
      self.clients.matchAll().then(clientList => {
        const link = `${self.location.protocol}//${event.notification.data.url}`;

        for (let clientCounter = 0; clientCounter < clientList.length; clientCounter += 1) {
          const client = clientList[clientCounter];

          if (client.url === link && "focus" in client) {
            return client.focus();
          }
        }

        return self.clients.openWindow(link);
      })
    );
  },
  false
);
