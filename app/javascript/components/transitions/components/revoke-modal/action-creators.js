/* eslint-disable import/prefer-default-export */

import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { TRANSITIONS_TYPES } from "../../constants";
import { REJECTED } from "../../../../config";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";

import actions from "./actions";

export const revokeTransition = ({ message, recordType, recordId, transitionType, transitionId, failureMessage }) => {
  const isReferral = transitionType === TRANSITIONS_TYPES.referral;
  const path = `${recordType}/${recordId}/${isReferral ? "referrals" : "transfers"}/${transitionId}`;
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
