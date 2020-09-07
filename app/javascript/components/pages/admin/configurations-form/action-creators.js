import { RECORD_PATH, SAVE_METHODS, METHODS } from "../../../../config";
import { ENQUEUE_SNACKBAR, SNACKBAR_VARIANTS, generate } from "../../../notifier";

import actions from "./actions";

const getSuccessCallback = (message, idFromResponse, redirect) => ({
  action: ENQUEUE_SNACKBAR,
  payload: {
    message,
    options: {
      variant: "success",
      key: generate.messageKey(message)
    }
  },
  redirectWithIdFromResponse: idFromResponse,
  redirect
});

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
      method: saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST,
      body,
      successCallback: getSuccessCallback(message, true, `/admin/${path}`)
    }
  };
};

export const deleteConfiguration = ({ id, message }) => ({
  type: actions.DELETE_CONFIGURATION,
  api: {
    path: `${RECORD_PATH.configurations}/${id}`,
    method: METHODS.DELETE,
    successCallback: getSuccessCallback(message, false, `/admin/${RECORD_PATH.configurations}`)
  }
});

export const applyConfiguration = ({ id, message }) => ({
  type: actions.APPLY_CONFIGURATION,
  api: {
    path: `${RECORD_PATH.configurations}/${id}`,
    method: METHODS.PATCH,
    body: {
      data: {
        apply_now: true
      }
    },
    successCallback: getSuccessCallback(message, false, false)
  }
});

export const clearSelectedConfiguration = () => {
  return {
    type: actions.CLEAR_SELECTED_CONFIGURATION
  };
};
