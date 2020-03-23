import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchUser = id => {
  return {
    type: actions.FETCH_USER,
    api: {
      path: `${RECORD_PATH.users}/${id}`
    }
  };
};

export const saveUser = ({ id, body, saveMethod, message }) => {
  return {
    type: actions.SAVE_USER,
    api: {
      path:
        saveMethod === "update"
          ? `${RECORD_PATH.users}/${id}`
          : RECORD_PATH.users,
      method: saveMethod === "update" ? "PATCH" : "POST",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey()
          }
        },
        redirectWithIdFromResponse: saveMethod !== "update",
        redirect: `/admin/${
          saveMethod === "update"
            ? `${RECORD_PATH.users}/${id}`
            : RECORD_PATH.users
        }`
      }
    }
  };
};

export const clearSelectedUser = () => {
  return {
    type: actions.CLEAR_SELECTED_USER
  };
};
