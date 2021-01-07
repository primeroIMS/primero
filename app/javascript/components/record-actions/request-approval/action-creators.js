/* eslint-disable import/prefer-default-export */
import { fetchRecordsAlerts } from "../../records";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../action-dialog";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import { APPROVAL_STATUS } from "./constants";
import { APPROVE_RECORD } from "./actions";

export const approvalRecord = ({
  recordType,
  recordId,
  approvalId,
  body,
  message,
  failureMessage,
  currentUser,
  messageFromQueue
}) => {
  return {
    type: `${recordType}/${APPROVE_RECORD}`,
    api: {
      path: `${recordType}/${recordId}/approvals/${approvalId}`,
      method: "PATCH",
      queueOffline: true,
      responseRecordKey: "approval_subforms",
      responseRecordArray: true,
      responseRecordID: recordId,
      id: recordId,
      responseRecordParams: {
        [`approval_status_${approvalId}`]: APPROVAL_STATUS.pending
      },
      responseRecordValues: {
        approval_date: new Date(),
        approval_requested_for: approvalId,
        requested_by: currentUser
      },
      db: {
        id: recordId,
        collection: DB_COLLECTIONS_NAMES.RECORDS,
        recordType
      },
      body,
      successCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message,
            messageFromQueue,
            options: {
              variant: "success",
              key: generate.messageKey(message)
            }
          }
        },
        {
          action: CLEAR_DIALOG
        },
        fetchRecordsAlerts(recordType, recordId, true)
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
