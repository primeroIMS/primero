import { RECORD_PATH, SAVE_METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";

import actions from "./actions";

export const fetchConfiguration = id => {
  return {
    type: actions.FETCH_CONFIGURATION,
    api: {
      path: `${RECORD_PATH.configurations}/${id}`
    }
  };
};

export const saveConfiguration = ({ id, body, saveMethod, message }) => {
  const path = saveMethod === SAVE_METHODS.update ? `${RECORD_PATH.configurations}/${id}` : RECORD_PATH.configurations;

  return {
    type: actions.SAVE_CONFIGURATION,
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
            key: generate.messageKey(message)
          }
        },
        redirectWithIdFromResponse: true,
        redirect: `/admin/${path}`
      }
    }
  };
};

export const clearSelectedConfiguration = () => {
  return {
    type: actions.CLEAR_SELECTED_CONFIGURATION
  };
};
