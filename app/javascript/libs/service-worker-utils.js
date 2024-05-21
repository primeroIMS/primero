// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { API_BASE_PATH, METHODS, NOTIFICATION_PERMISSIONS, POST_MESSAGES, ROUTES } from "../config/constants";
import { DEFAULT_FETCH_OPTIONS } from "../middleware/constants";
import DB, { DB_STORES } from "../db";
import { getIDPToken } from "../components/login/components/idp-selection/auth-provider";

const SERVICE_WORKER_PATH = `${window.location.origin}/worker.js`;
const MAX_ATTEMPTS = 3;
let attempts = 1;

async function getServiceWorker() {
  return navigator.serviceWorker.ready;
}

async function getSubscriptionFromDb() {
  const subscription = await DB.getRecord(DB_STORES.PUSH_NOTIFICATION_SUBSCRIPTION, 1);

  return Promise.resolve(subscription?.endpoint);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function sendSubscriptionStatusToServer(isSubscribing = true, data = {}) {
  const token = await getIDPToken();
  const subscriptionData = JSON.parse(JSON.stringify(data));
  const path = [API_BASE_PATH, isSubscribing ? ROUTES.subscriptions : ROUTES.subscriptions_current].join("");

  const response = await fetch(path, {
    ...DEFAULT_FETCH_OPTIONS,
    method: isSubscribing ? METHODS.POST : METHODS.PATCH,
    headers: new Headers(
      Object.assign(
        DEFAULT_FETCH_OPTIONS.headers,
        token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}
      )
    ),
    body: JSON.stringify({
      data: {
        notification_url: subscriptionData.endpoint,
        disabled: !isSubscribing,
        ...(isSubscribing && { auth: subscriptionData.keys.auth, p256dh: subscriptionData.keys.p256dh })
      }
    })
  });

  if ((!isSubscribing && response.status === 200) || response.status === 404) {
    DB.delete(DB_STORES.PUSH_NOTIFICATION_SUBSCRIPTION, 1);

    postMessage(
      {
        type: POST_MESSAGES.DISPATCH_REMOVE_SUBSCRIPTION
      },
      window.origin
    );
  }

  if (isSubscribing && response.status === 404) {
    if (attempts % MAX_ATTEMPTS !== 0) {
      postMessage(
        {
          type: POST_MESSAGES.SUBSCRIBE_NOTIFICATIONS
        },
        window.origin
      );
    }

    if (attempts % MAX_ATTEMPTS === 0) {
      postMessage(
        {
          type: POST_MESSAGES.ATTEMPTS_SUBSCRIPTION_FAILED
        },
        window.origin
      );
    }
    attempts += 1;
  }
}

async function subscribe() {
  const serviceWorker = await getServiceWorker();

  const subscription = await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(window.vpubID)
  });

  sendSubscriptionStatusToServer(true, subscription);

  await DB.put({
    store: DB_STORES.PUSH_NOTIFICATION_SUBSCRIPTION,
    data: { endpoint: subscription.endpoint },
    key: { id: 1 }
  });

  postMessage(
    {
      type: POST_MESSAGES.DISPATCH_SAVE_SUBSCRIPTION,
      endpoint: subscription.endpoint
    },
    window.origin
  );
}

async function subscribeToNotifications() {
  if (Notification.permission !== NOTIFICATION_PERMISSIONS.DENIED) {
    subscribe();
  }
}

async function unsubscribeToNotifications() {
  const serviceWorker = await getServiceWorker();
  const subscriptionFromDB = await getSubscriptionFromDb();

  serviceWorker.pushManager.getSubscription().then(subscription => {
    if (subscription) {
      subscription
        .unsubscribe()
        .then(() => {
          sendSubscriptionStatusToServer(false, subscription);
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.info("No notification subscription");
        });
    } else if (subscriptionFromDB) {
      sendSubscriptionStatusToServer(false, { endpoint: subscriptionFromDB });
    }
  });
}

async function cleanupSubscriptions(callback) {
  const subscriptionFromDB = await getSubscriptionFromDb();

  if (Notification.permission === NOTIFICATION_PERMISSIONS.DEFAULT && subscriptionFromDB) {
    await unsubscribeToNotifications().then(() => {
      callback();
    });
  }
}

export {
  SERVICE_WORKER_PATH,
  getServiceWorker,
  urlBase64ToUint8Array,
  unsubscribeToNotifications,
  subscribeToNotifications,
  cleanupSubscriptions,
  getSubscriptionFromDb
};
