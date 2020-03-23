import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchRole = id => {
  return {
    type: actions.FETCH_ROLE,
    api: {
      path: `${RECORD_PATH.roles}/${id}`
    }
  };
};

export const saveRole = ({ id, body, saveMethod, message }) => {
  return {
    type: actions.SAVE_ROLE,
    api: {
      path:
        saveMethod === "update"
          ? `${RECORD_PATH.roles}/${id}`
          : RECORD_PATH.roles,
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
            ? `${RECORD_PATH.roles}/${id}`
            : RECORD_PATH.roles
        }`
      }
    }
  };
};

export const clearSelectedRole = () => {
  return {
    type: actions.CLEAR_SELECTED_ROLE
  };
};
