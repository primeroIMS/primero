import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { TRANSITIONS_TYPES } from "../../constants";
import { REJECTED } from "../../../../config";
import { SET_DIALOG, SET_DIALOG_PENDING } from "../../../record-actions";

import actions from "./actions";

export const revokeTransition = ({
  message,
  recordType,
  recordId,
  transitionType,
  transitionId,
  dialogName,
  failureMessage
}) => {
  const isReferral = transitionType === TRANSITIONS_TYPES.referral;
  const path = `${recordType}/${recordId}/${
    isReferral ? "referrals" : "transfers"
  }/${transitionId}`;
  const method = isReferral ? "DELETE" : "PATCH";
  const body = isReferral
    ? {}
    : {
        data: {
          status: REJECTED
        }
      };

  return {
    type: actions.REVOKE_TRANSITION,
    api: {
      path,
      method,
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

export default revokeTransition;
