/* eslint-disable import/prefer-default-export */

import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../action-dialog";

import { APPROVE_RECORD } from "./actions";

export const approvalRecord = ({ recordType, recordId, approvalId, body, message, failureMessage, currentUser }) => {
  return {
    type: `${recordType}/${APPROVE_RECORD}`,
    api: {
      path: `${recordType}/${recordId}/approvals/${approvalId}`,
      method: "PATCH",
      queueOffline: true,
      responseRecordKey: "approval_subforms",
      responseRecordArray: true,
      responseRecordID: recordId,
      responseExtraParams: {
        approval_date: new Date(),
        approval_requested_for: approvalId,
        requested_by: currentUser
      },
      db: {
        recordType: null
      },
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
        }
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
  };
};
