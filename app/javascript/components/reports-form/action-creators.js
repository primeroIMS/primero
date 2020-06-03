/* eslint-disable import/prefer-default-export */

import { RECORD_PATH, SAVE_METHODS, METHODS } from "../../config";
import { ENQUEUE_SNACKBAR, generate, SNACKBAR_VARIANTS } from "../notifier";

import actions from "./actions";

export const saveReport = ({ body, saveMethod, message }) => {
  return {
    type: actions.SAVE_REPORT,
    api: {
      path: RECORD_PATH.reports,
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
        redirect: `/${RECORD_PATH.reports}`
      }
    }
  };
};
