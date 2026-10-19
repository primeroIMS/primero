/* eslint-disable import/prefer-default-export */

import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { SET_DIALOG_PENDING } from "../../../action-dialog";
import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const saveTransferRequest = (recordId, body, message, failureMessage) => ({
  type: actions.TRANSFER_REQUEST,
  api: {
    path: `${RECORD_PATH.cases}/${recordId}/${actions.TRANSFER_REQUEST_URL}`,
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey(message)
        }
      }
    },
    failureCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message: failureMessage,
          options: {
            variant: "error",
            key: generate.messageKey(failureMessage)
          }
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
