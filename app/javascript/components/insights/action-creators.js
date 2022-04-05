/* eslint-disable import/prefer-default-export */

import { METHODS } from "../../config";
import { CLEAR_DIALOG } from "../action-dialog";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import actions from "./actions";
import { EXPORT_INSIGHTS_PATH } from "./constants";

export const exportInsights = ({ params, message }) => ({
  type: actions.EXPORT_INSIGHTS,
  api: {
    path: EXPORT_INSIGHTS_PATH,
    method: METHODS.GET,
    params,
    successCallback: [
      {
        action: CLEAR_DIALOG
      },
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        },
        redirectWithIdFromResponse: false,
        redirect: false
      }
    ]
  }
});

export const clearExportedInsight = () => ({
  type: actions.CLEAR_EXPORTED_INSIGHT
});
