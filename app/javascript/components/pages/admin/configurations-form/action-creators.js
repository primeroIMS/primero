import { RECORD_PATH, SAVE_METHODS, METHODS, ROUTES } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../../../notifier";

import actions from "./actions";

const successCallback = (message, idFromResponse, redirect) => ({
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
      successCallback: successCallback(message, true, `/admin/${path}`)
    }
  };
};

export const deleteConfiguration = ({ id, message }) => ({
  type: actions.DELETE_CONFIGURATION,
  api: {
    path: `${RECORD_PATH.configurations}/${id}`,
    method: METHODS.DELETE,
    successCallback: successCallback(message, false, `/admin/${RECORD_PATH.configurations}`)
  }
});

export const checkConfiguration = () => ({
  type: actions.CHECK_CONFIGURATION,
  api: {
    external: true,
    path: ROUTES.check_health
  }
});

export const applyingConfigMessage = () => ({
  action: ENQUEUE_SNACKBAR,
  payload: {
    messageKey: "configurations.unavailable_server",
    noDismiss: true,
    options: {
      variant: SNACKBAR_VARIANTS.info,
      key: generate.messageKey(99999)
    }
  }
});

export const appliedConfigMessage = () => ({
  action: ENQUEUE_SNACKBAR,
  payload: {
    messageKey: "configurations.messages.applied",
    options: {
      variant: SNACKBAR_VARIANTS.success,
      key: generate.messageKey(4321)
    }
  }
});

export const applyConfiguration = ({ id }) => ({
  type: actions.APPLY_CONFIGURATION,
  api: {
    path: `${RECORD_PATH.configurations}/${id}`,
    method: METHODS.PATCH,
    body: {
      data: {
        apply_now: true
      }
    },
    configurationCallback: checkConfiguration()
  }
});

export const clearSelectedConfiguration = () => {
  return {
    type: actions.CLEAR_SELECTED_CONFIGURATION
  };
};

export const sentToProduction = (id, message) => ({
  type: actions.SEND_TO_PRODUCTION,
  api: {
    path: `${RECORD_PATH.configurations}/${id}`,
    method: METHODS.PATCH,
    body: {
      data: {
        promote: true
      }
    },
    successCallback: successCallback(message, false, "")
  }
});
