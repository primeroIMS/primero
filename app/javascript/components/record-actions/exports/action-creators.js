/* eslint-disable import/prefer-default-export */
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

import actions from "./actions";

import { SET_DIALOG, SET_DIALOG_PENDING } from "..";

export const saveExport = (body, message, actionLabel, dialogName) => ({
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
            key: generate.messageKey()
          },
          actionLabel,
          actionUrl: "/exports"
        }
      },
      {
        action: SET_DIALOG,
        payload: {
          dialog: dialogName,
          open: false
        }
      },
      {
        action: SET_DIALOG_PENDING,
        payload: {
          pending: false
        }
      }
    ]
  }
});
