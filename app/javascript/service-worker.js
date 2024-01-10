// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { POST_MESSAGES } from "./config/constants";
import {
  SERVICE_WORKER_PATH,
  getSubscriptionFromDb,
  subscribeToNotifications,
  unsubscribeToNotifications
} from "./libs/service-worker-utils";

export default () => {
  window.addEventListener("message", event => {
    if (event?.data?.type === POST_MESSAGES.SUBSCRIBE_NOTIFICATIONS) {
      const subscription = getSubscriptionFromDb().then(() => {
        if (subscription) {
          unsubscribeToNotifications().then(() => {
            subscribeToNotifications();
          });
        } else {
          subscribeToNotifications();
        }
      });
    }

    if (event?.data?.type === POST_MESSAGES.UNSUBSCRIBE_NOTIFICATIONS) {
      unsubscribeToNotifications();
    }
  });

  function callback() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(SERVICE_WORKER_PATH)
        .then(registration => {
          // eslint-disable-next-line no-console
          console.info("Registration successful, scope is:", registration.scope);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error("Service worker registration failed, error:", error);
        });
    }
  }

  if (document.readyState === "complete") {
    callback();
  } else {
    window.addEventListener("load", callback);
  }
};
