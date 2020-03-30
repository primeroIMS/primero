import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import {
  SET_DIALOG,
  SET_DIALOG_PENDING
} from "../../../record-actions/actions";

import actions from "./actions";

export const approvalTransfer = ({
  body,
  dialogName,
  message,
  failureMessage,
  recordId,
  recordType,
  transferId
}) => {
  return {
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
              key: generate.messageKey()
            }
          },
          redirectWithIdFromResponse: false,
          redirect: false
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
