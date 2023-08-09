import { API_BASE_PATH, METHODS, NOTIFICATION_PERMISSIONS } from "../config";
import { DEFAULT_FETCH_OPTIONS } from "../middleware/constants";
import getToken from "../middleware/utils/get-token";

const SERVICE_WORKER_PATH = `${window.location.origin}/worker.js`;

async function getServiceWorker() {
  return navigator.serviceWorker.ready;
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

async function sendSubscriptionStatusToServer(isSubscribing = true, data) {
  const token = await getToken();
  const subscriptionData = JSON.parse(JSON.stringify(data));
  const baseUrl = [`${API_BASE_PATH}/webpush/subscriptions`];

  if (!isSubscribing) {
    baseUrl.push("/current");
  }

  const response = await fetch(baseUrl.join(""), {
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
        notification_url: isSubscribing ? subscriptionData.endpoint : localStorage.getItem("pushEndpoint"),
        disabled: !isSubscribing,
        ...(isSubscribing && { auth: subscriptionData.keys.auth, p256dh: subscriptionData.keys.p256dh })
      }
    })
  });

  if (!isSubscribing && response.status === 200) {
    localStorage.removeItem("pushEndpoint");
  }
}

async function subscribe() {
  const serviceWorker = await getServiceWorker();

  serviceWorker.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(window.vpubID)
    })
    .then(subscription => {
      sendSubscriptionStatusToServer(true, subscription);
      localStorage.setItem("pushEndpoint", subscription.endpoint);
    });
}

async function subscribeToNotifications() {
  if (Notification.permission !== NOTIFICATION_PERMISSIONS.DENIED) {
    subscribe();
  }
}

async function unsubscribeToNotifications() {
  const serviceWorker = await getServiceWorker();

  serviceWorker.pushManager.getSubscription().then(subscription => {
    if (subscription) {
      subscription
        .unsubscribe()
        .then(() => {
          sendSubscriptionStatusToServer(false, subscription);
        })
        .catch(() => {
          console.info("No notification subscription");
        });
    } else if (localStorage.getItem("pushEndpoint")) {
      sendSubscriptionStatusToServer(false, subscription);
    }
  });
}

async function cleanupSubscriptions(callback) {
  if (Notification.permission === NOTIFICATION_PERMISSIONS.DEFAULT && localStorage.getItem("pushEndpoint")) {
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
  cleanupSubscriptions
};
