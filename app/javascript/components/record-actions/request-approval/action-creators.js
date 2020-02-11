import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { REQUEST_APPROVAL_DIALOG } from "../constants";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../actions";

import { APPROVE_RECORD } from "./actions";

export const approvalRecord = ({
  recordType,
  recordId,
  approvalId,
  body,
  message,
  failureMessage
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
            dialog: REQUEST_APPROVAL_DIALOG,
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
