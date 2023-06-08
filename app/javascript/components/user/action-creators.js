import { push } from "connected-react-router";

import { RECORD_PATH, METHODS, ROUTES } from "../../config";
import { DB_COLLECTIONS_NAMES } from "../../db";
import { fetchSandboxUI, loadApplicationResources } from "../application/action-creators";
import { SET_USER_LOCALE } from "../i18n";
import { SET_DIALOG } from "../action-dialog/actions";
import { LOGIN_DIALOG } from "../login-dialog";
import { QUEUE_READY } from "../../libs/queue/constants";
import connectivityActions from "../connectivity/actions";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS, generate } from "../notifier";
import { loginSystemSettings } from "../login";

import actions from "./actions";

const queueReady = {
  action: connectivityActions.QUEUE_STATUS,
  payload: QUEUE_READY
};

export const setUser = payload => {
  return {
    type: actions.SET_AUTHENTICATED_USER,
    payload
  };
};

export const fetchAuthenticatedUserData = user => ({
  type: actions.FETCH_USER_DATA,
  api: {
    path: `users/${user.id}`,
    params: {
      extended: true
    },
    db: {
      collection: DB_COLLECTIONS_NAMES.USER,
      user: user.username
    },
    successCallback: [queueReady, SET_USER_LOCALE]
  }
});

export const setAuthenticatedUser =
  (user, fetchApplicationResources = true) =>
  async dispatch => {
    dispatch(setUser(user));
    dispatch(fetchAuthenticatedUserData(user)).then(
      () => {
        if (fetchApplicationResources) {
          dispatch(loadApplicationResources());
        }
      },
      error => {
        dispatch(push(ROUTES.logout));
        // eslint-disable-next-line no-console
        console.error(error);
      }
    );
  };

export const attemptSignout = () => ({
  type: actions.LOGOUT,
  api: {
    path: "tokens",
    method: "DELETE",
    successCallback: actions.LOGOUT_SUCCESS_CALLBACK
  }
});

export const showLoginDialog = () => ({
  type: SET_DIALOG,
  payload: { dialog: LOGIN_DIALOG, open: true, pending: false },
  dispatchIfStatus: 401
});

export const checkUserAuthentication = () => async dispatch => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    dispatch(setAuthenticatedUser(user));
  }
};

export const refreshToken = checkUserAuth => ({
  type: actions.REFRESH_USER_TOKEN,
  api: {
    path: "tokens",
    method: "POST",
    ...(checkUserAuth && {
      successCallback: [queueReady]
    })
  }
});

export const resetPassword = data => ({
  type: actions.RESET_PASSWORD,
  api: {
    path: `${RECORD_PATH.users}/password-reset`,
    method: METHODS.POST,
    body: data,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        messageKey: "user.password_reset.success",
        options: {
          variant: SNACKBAR_VARIANTS.success,
          key: generate.messageKey("user.password_reset.success")
        }
      },
      redirectWithIdFromResponse: false,
      redirect: ROUTES.dashboard
    }
  }
});

export async function getAppResources(dispatch) {
  dispatch(fetchSandboxUI());
  dispatch(checkUserAuthentication());
  dispatch(loginSystemSettings());
}
