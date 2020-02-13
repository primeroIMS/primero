import { RECORD_PATH } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../../../record-actions/actions";

import actions from "./actions";

export const referralDone = ({
  dialogName,
  message,
  failureMessage,
  recordId,
  recordType,
  transistionId
}) => {
  return {
    type: actions.REFERRAL_DONE,
    api: {
      path: `${recordType}/${recordId}/referrals/${transistionId}`,
      method: "DELETE",
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
          redirect: `/${RECORD_PATH.cases}`
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
