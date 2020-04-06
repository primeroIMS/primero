import { RECORD_PATH, SAVE_METHODS } from "../../../../config";
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
  const path =
    saveMethod === SAVE_METHODS.update
      ? `${RECORD_PATH.user_groups}/${id}`
      : RECORD_PATH.user_groups;

  return {
    type: actions.SAVE_USER_GROUP,
    api: {
      path,
      method: saveMethod === SAVE_METHODS.update ? "PATCH" : "POST",
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
        redirectWithIdFromResponse: saveMethod !== SAVE_METHODS.update,
        redirect: `/admin/${path}`
      }
    }
  };
};

export const clearSelectedUserGroup = () => {
  return {
    type: actions.CLEAR_SELECTED_USER_GROUP
  };
};
