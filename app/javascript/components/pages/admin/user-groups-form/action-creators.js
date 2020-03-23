import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchUserGroup = id => {
  return {
    type: actions.FETCH_USER_GROUP,
    api: {
      path: `${RECORD_PATH.user_groups}/${id}`
    }
  };
};

export const saveUserGroup = ({ id, body, saveMethod, message }) => {
  return {
    type: actions.SAVE_USER_GROUP,
    api: {
      path:
        saveMethod === "update"
          ? `${RECORD_PATH.user_groups}/${id}`
          : RECORD_PATH.user_groups,
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
            ? `${RECORD_PATH.user_groups}/${id}`
            : RECORD_PATH.user_groups
        }`
      }
    }
  };
};

export const clearSelectedUserGroup = () => {
  return {
    type: actions.CLEAR_SELECTED_USER_GROUP
  };
};
