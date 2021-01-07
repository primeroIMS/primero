import { METHODS, RECORD_PATH, SAVE_METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../../../notifier";
import { CLEAR_DIALOG } from "../../../action-dialog";

import { PASSWORD_USER_OPTION } from "./constants";
import actions from "./actions";

export const fetchUser = id => {
  return {
    type: actions.FETCH_USER,
    api: {
      path: `${RECORD_PATH.users}/${id}`
    }
  };
};

export const newPasswordResetRequest = email => ({
  type: actions.NEW_PASSWORD_RESET_REQUEST,
  api: {
    path: "users/password-reset-request",
    method: METHODS.POST,
    body: { user: { email } },
    successCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "user.password_reset.request_submitted",
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: generate.messageKey("user.password_reset.request_submitted")
          }
        }
      },
      {
        action: CLEAR_DIALOG
      }
    ]
  }
});

export const saveUser = ({ id, body, saveMethod, message }) => {
  const path = saveMethod === SAVE_METHODS.update ? `${RECORD_PATH.users}/${id}` : RECORD_PATH.users;
  const passwordResetRequestCallback =
    body.password_setting === PASSWORD_USER_OPTION && saveMethod === SAVE_METHODS.new
      ? [newPasswordResetRequest(body.email)]
      : [];

  return {
    type: actions.SAVE_USER,
    api: {
      path,
      method: saveMethod === SAVE_METHODS.update ? "PATCH" : "POST",
      body,
      successCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message,
            options: {
              variant: "success",
              key: generate.messageKey(message)
            }
          },
          redirectWithIdFromResponse: saveMethod !== SAVE_METHODS.update,
          redirect: `/admin/${path}`
        },
        {
          action: CLEAR_DIALOG
        },
        ...passwordResetRequestCallback
      ]
    }
  };
};

export const clearSelectedUser = () => {
  return {
    type: actions.CLEAR_SELECTED_USER
  };
};

export const passwordResetRequest = userId => ({
  type: actions.PASSWORD_RESET_REQUEST,
  api: {
    path: `users/${userId}/password-reset-request`,
    method: METHODS.POST,
    body: { user: { password_reset: true } },
    successCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          messageKey: "user.password_reset.request_submitted",
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: generate.messageKey("user.password_reset.request_submitted")
          }
        }
      },
      {
        action: CLEAR_DIALOG
      }
    ]
  }
});
