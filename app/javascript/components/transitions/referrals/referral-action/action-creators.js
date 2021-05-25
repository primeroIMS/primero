/* eslint-disable import/prefer-default-export */

import { ACCEPTED, REJECTED, DONE } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";
import { redirectCheckAccessDenied } from "../../utils";

import actions from "./actions";

const referralAction = (type, { data, message, failureMessage, recordId, recordType, transistionId }) => ({
  type,
  api: {
    path: `${recordType}/${recordId}/referrals/${transistionId}`,
    method: "PATCH",
    body: { data },
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
      },
      redirectCheckAccessDenied(recordType)
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
        payload: false
      }
    ]
  }
});

export const referralDone = ({ data, ...rest }) =>
  referralAction(actions.REFERRAL_DONE, { data: { status: DONE, ...data }, ...rest });

export const referralRejected = ({ data, ...rest }) =>
  referralAction(actions.REFERRAL_REJECTED, { data: { status: REJECTED, ...data }, ...rest });

export const referralAccepted = params =>
  referralAction(actions.REFERRAL_ACCEPTED, { data: { status: ACCEPTED }, ...params });
