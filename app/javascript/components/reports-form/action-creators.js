import { RECORD_PATH, SAVE_METHODS, METHODS } from "../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../notifier";

import actions from "./actions";

export const saveReport = ({ id, body, saveMethod, message }) => {
  const path =
    saveMethod === SAVE_METHODS.update
      ? `${RECORD_PATH.reports}/${id}`
      : RECORD_PATH.reports;

  return {
    type: actions.SAVE_REPORT,
    api: {
      path,
      method: saveMethod === SAVE_METHODS.update ? METHODS.PATCH : METHODS.POST,
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: SNACKBAR_VARIANTS.success,
            key: generate.messageKey()
          }
        },
        redirectWithIdFromResponse: false,
        redirect: `/${path}`
      }
    }
  };
};

export const clearSelectedReport = () => ({
  type: actions.CLEAR_SELECTED_REPORT
});
