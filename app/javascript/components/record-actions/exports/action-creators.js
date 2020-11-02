/* eslint-disable import/prefer-default-export */
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { CLEAR_DIALOG } from "../../action-dialog";

import actions from "./actions";

export const saveExport = (body, message, actionLabel) => ({
  type: actions.EXPORT,
  api: {
    path: "exports",
    method: "POST",
    body,
    successCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          },
          actionLabel,
          actionUrl: "/exports"
        }
      },
      {
        action: CLEAR_DIALOG
      }
    ]
  }
});
