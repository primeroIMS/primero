import { DB } from "../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

import { APPROVE_RECORD } from "./actions";
import {
  SET_DIALOG,
  SET_DIALOG_PENDING
} from "../actions";

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
          },
          redirectWithIdFromResponse: false,
          redirect: false
        },
        {
          action: SET_DIALOG,
          payload: {
            dialog: "requestApproval",
            open: false
          },
          redirectWithIdFromResponse: false,
          redirect: false
        },
        {
          action: SET_DIALOG_PENDING,
          payload: {
            pending: false
          },
          redirectWithIdFromResponse: false,
          redirect: false
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
          },
          redirectWithIdFromResponse: false,
          redirect: false
        },
        {
          action: SET_DIALOG_PENDING,
          payload: {
            pending: false
          },
          redirectWithIdFromResponse: false,
          redirect: false
        }
      ]
    }
  };
};
