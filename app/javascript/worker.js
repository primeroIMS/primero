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

let abortControllers = [];

class AbortableNetworkOnly extends NetworkOnly {
  constructor(options = {}) {
    super(options);
    this._networkTimeoutSeconds = options.networkTimeoutSeconds || 5;
  }

  async handle({ event, request }) {
    if (!(request instanceof Request)) {
      throw new Error("Expected 'request' to be an instance of Request.");
    }

    const isLogoutAction = request.method === "DELETE" && request.url.endsWith("/tokens");

    if (isLogoutAction) {
      abortControllers.forEach(abortController => {
        abortController.abort("logging_out");
      });
      abortControllers = [];
    }

    const controller = new AbortController();

    if (!isLogoutAction) abortControllers.push(controller);

    const timeoutId = setTimeout(() => controller.abort("timeout"), this._networkTimeoutSeconds * 1000);

    try {
      const modifiedRequest = new Request(request, { signal: controller.signal });
      const response = await super.handle({ event, request: modifiedRequest });

      clearTimeout(timeoutId);

      return response;
    } catch (error) {
      throw new Error("Request aborted or failed", { cause: "network" });
    }
  }
}

const METHODS = {
  GET: "GET",
  PATCH: "PATCH",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
};

const isNav = event => event.request.mode === "navigate";

// TODO: This pr would allow passing strategies to workbox way of handling navigation routes
// https://github.com/GoogleChrome/workbox/pull/2459
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

registerNetworkFirstRoute(({ event }) => isNav(event), cacheNames.precache);

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

registerRoute(
  /\/(?:theme|manifest).*$/,
  new CacheFirst({
    cacheName: "theme",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 2
      })
    ]
  }),
  METHODS.GET
);

// Api Endpoints
Object.values(METHODS).forEach(method => {
  registerRoute(
    /\/api\/.*/,
    new AbortableNetworkOnly({
      networkTimeoutSeconds: 50
    }),
    method
  );
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

  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      image: message.icon,
      icon: message.icon,
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
