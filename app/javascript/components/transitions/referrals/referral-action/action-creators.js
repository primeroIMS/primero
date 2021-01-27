/* eslint-disable import/prefer-default-export */

import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import actions from "./actions";

export const referralDone = ({ data, message, failureMessage, recordId, recordType, transistionId }) => {
  return {
    type: actions.REFERRAL_DONE,
    api: {
      path: `${recordType}/${recordId}/referrals/${transistionId}`,
      body: { data },
      method: "DELETE",
      successCallback: [
        {
          action: ENQUEUE_SNACKBAR,
          payload: {
            message,
            options: {
              variant: "success",
              key: generate.messageKey(message)
            }
          },
          redirectWithIdFromResponse: false,
          redirect: `/${RECORD_PATH.cases}`
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
