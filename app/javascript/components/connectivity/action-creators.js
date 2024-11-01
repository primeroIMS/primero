// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { ROUTES } from "../../config";
import { ENQUEUE_SNACKBAR } from "../notifier/actions";
import { SNACKBAR_VARIANTS } from "../notifier/constants";
import { closeSnackbar } from "../notifier/action-creators";

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

export const getServerStatus = ({ showSnackbars = true, successCallback = [] }) => ({
  type: actions.SERVER_STATUS,
  api: {
    path: ROUTES.check_server_health,
    external: true,
    successCallback: [
      { action: actions.SERVER_STATUS, payload: true },
      showSnackbars && onlineSnackbar(true, { forMiddleware: true }),
      ...successCallback
    ],
    failureCallback: [
      { action: actions.SERVER_STATUS, payload: false },
      showSnackbars && onlineSnackbar(false, { forMiddleware: true })
    ]
  }
});

export function setFieldMode(dispatch) {
  dispatch(setNetworkStatus(false));
}

export const checkServerStatus =
  (isOnline, showSnackbars, successCallback = []) =>
  (dispatch, getState) => {
    const userToggledOffline = getState().getIn(["connectivity", "fieldMode"]);

    dispatch(closeSnackbar(isOnline ? CONNECTION_LOST : CONNECTED));

    if (userToggledOffline) {
      setFieldMode(dispatch);
    } else {
      dispatch(closeSnackbar(FIELD_MODE_OFFLINE));
      dispatch(setNetworkStatus(isOnline));
      if (isOnline) {
        dispatch(getServerStatus({ showSnackbars, successCallback }));
      } else {
        dispatch({ type: ENQUEUE_SNACKBAR, ...onlineSnackbar(isOnline, { forMiddleware: true }) });
      }
    }
  };

export const setQueueData = payload => ({
  type: actions.SET_QUEUE_DATA,
  payload
});

export const setUserToggleOffline = payload => dispatch => {
  dispatch(closeSnackbar(FIELD_MODE_OFFLINE));

  dispatch({
    type: actions.USER_TOGGLE_OFFLINE,
    payload
  });

  if (payload) {
    dispatch({
      type: ENQUEUE_SNACKBAR,
      ...onlineSnackbar(false, { forMiddleware: true, message: FIELD_MODE_OFFLINE })
    });
  }

  dispatch(checkServerStatus(!payload));
};
