/* eslint-disable import/prefer-default-export */

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../actions";

import { APPROVE_RECORD } from "./actions";

export const approvalRecord = ({
  recordType,
  recordId,
  approvalId,
  body,
  message,
  failureMessage,
  dialogName
}) => {
  return {
    type: `${recordType}/${APPROVE_RECORD}`,
    api: {
      path: `${recordType}/${recordId}/approvals/${approvalId}`,
      method: "PATCH",
      body,
      successCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message,
            options: {
              variant: "success",
              key: generate.messageKey()
            }
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
      ],
      failureCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message: failureMessage,
            options: {
              variant: "error",
              key: generate.messageKey()
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
  };
};
