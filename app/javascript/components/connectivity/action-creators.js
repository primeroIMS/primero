/* eslint-disable import/prefer-default-export */
import { ROUTES } from "../../config";
import { SNACKBAR_VARIANTS, closeSnackbar, ENQUEUE_SNACKBAR } from "../notifier";

import actions from "./actions";
import { CONNECTION_LOST, CONNECTED, FIELD_MODE_OFFLINE } from "./constants";

function getMessageKey(isOnline, message) {
  if (message === FIELD_MODE_OFFLINE) {
    return FIELD_MODE_OFFLINE;
  }

  if (isOnline) {
    return CONNECTED;
  }

  return CONNECTION_LOST;
}

const onlineSnackbar = (isOnline, opts = { forMiddleware: false, message: undefined }) => {
  const { forMiddleware, message } = opts;
  const snackbarType = isOnline ? SNACKBAR_VARIANTS.success : SNACKBAR_VARIANTS.warning;
  const messageKey = getMessageKey(isOnline, message);

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
    successCallback: [{ action: actions.SERVER_STATUS, payload: true }, onlineSnackbar(true, { forMiddleware: true })],
    failureCallback: [{ action: actions.SERVER_STATUS, payload: false }, onlineSnackbar(false, { forMiddleware: true })]
  }
});

export function setFieldMode(dispatch) {
  dispatch(setNetworkStatus(false));
}

export const checkServerStatus = isOnline => (dispatch, getState) => {
  const userToggledOffline = getState().getIn(["connectivity", "fieldMode"]);

  if (userToggledOffline) {
    setFieldMode(dispatch);
  } else {
    dispatch(closeSnackbar(isOnline ? CONNECTION_LOST : CONNECTED));

    dispatch(setNetworkStatus(isOnline));
    if (isOnline) {
      dispatch(getServerStatus(isOnline));
    } else {
      dispatch({ type: ENQUEUE_SNACKBAR, ...onlineSnackbar(isOnline, { forMiddleware: true }) });
    }
  }
};

export const setUserToggleOffline = payload => dispatch => {
  dispatch(closeSnackbar(FIELD_MODE_OFFLINE));
  dispatch(closeSnackbar(CONNECTED));

  dispatch({
    type: ENQUEUE_SNACKBAR,
    ...onlineSnackbar(false, { forMiddleware: true, message: FIELD_MODE_OFFLINE })
  });

  dispatch({
    type: actions.USER_TOGGLE_OFFLINE,
    payload
  });

  dispatch(checkServerStatus(!payload, payload));
};
