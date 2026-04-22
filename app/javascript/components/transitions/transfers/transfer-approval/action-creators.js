/* eslint-disable import/prefer-default-export */

import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";
import { redirectCheckAccessDenied } from "../../utils";

import actions from "./actions";

export const approvalTransfer = ({ body, message, failureMessage, recordId, recordType, transferId }) => ({
  type: actions.APPROVE_TRANSFER,
  api: {
    path: `${recordType}/${recordId}/transfers/${transferId}`,
    method: "PATCH",
    body,
    successCallback: [
      {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: generate.messageKey(message)
          }
        }
      },
      {
        action: CLEAR_DIALOG
      },
      redirectCheckAccessDenied(recordType)
    ],
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
