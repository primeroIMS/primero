/* eslint-disable import/prefer-default-export */

import { METHODS, ROUTES } from "../../config/constants";

import actions from "./actions";

function refreshNotificationSubscription(body) {
  return {
    type: actions.REFERESH_NOTIFICATION_SUBSCRIPTION,
    api: {
      path: ROUTES.subscriptions_current,
      method: METHODS.PATCH,
      body
    }
  };
}

export { refreshNotificationSubscription };
