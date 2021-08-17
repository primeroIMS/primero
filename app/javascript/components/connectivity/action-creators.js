/* eslint-disable import/prefer-default-export */
import { ROUTES } from "../../config";
import { SNACKBAR_VARIANTS, closeSnackbar, ENQUEUE_SNACKBAR } from "../notifier";

import actions from "./actions";
import { CONNECTION_LOST, CONNECTED } from "./constants";

const onlineSnackbar = (isOnline, forMiddleware = false) => {
  const snackbarType = isOnline ? SNACKBAR_VARIANTS.success : SNACKBAR_VARIANTS.warning;
  const messageKey = isOnline ? CONNECTED : CONNECTION_LOST;
  const options = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center"
    }
  };

  return forMiddleware
    ? {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey,
          options: {
            variant: snackbarType,
            key: messageKey,
            ...options
          }
        }
      }
    : {
        ...options,
        type: snackbarType,
        messageKey
      };
};

export const setNetworkStatus = payload => ({
  type: actions.NETWORK_STATUS,
  payload
});

export const setQueueStatus = payload => ({
  type: actions.QUEUE_STATUS,
  payload
});

export const setPendingUserLogin = payload => ({
  type: actions.PENDING_USER_LOGIN,
  payload
});

export const getServerStatus = () => ({
  type: actions.SERVER_STATUS,
  api: {
    path: ROUTES.check_server_health,
    external: true,
    successCallback: [{ action: actions.SERVER_STATUS, payload: true }, onlineSnackbar(true, true)],
    failureCallback: [{ action: actions.SERVER_STATUS, payload: false }, onlineSnackbar(false, true)]
  }
});

export const checkServerStatus = isOnline => dispatch => {
  dispatch(closeSnackbar(isOnline ? CONNECTION_LOST : CONNECTED));
  dispatch(setNetworkStatus(isOnline));
  if (isOnline) {
    dispatch(getServerStatus(isOnline));
  } else {
    dispatch({ type: ENQUEUE_SNACKBAR, ...onlineSnackbar(isOnline, true) });
  }
};
