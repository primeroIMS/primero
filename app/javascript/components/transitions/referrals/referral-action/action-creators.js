/* eslint-disable import/prefer-default-export */

import { ACCEPTED, REJECTED } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, SET_DIALOG_PENDING } from "../../../action-dialog";
import { fetchRecordCallback } from "../../utils";

import actions from "./actions";

export const referralDone = ({ data, message, failureMessage, recordId, recordType, transistionId }) => {
  return {
    type: actions.REFERRAL_DONE,
    api: {
      path: `${recordType}/${recordId}/referrals/${transistionId}`,
      ...(data ? { body: { data } } : {}),
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
          }
        },
        {
          action: CLEAR_DIALOG
        },
        fetchRecordCallback({ recordId, recordType })
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

export const referralAccepted = ({ message, failureMessage, recordId, recordType, transistionId }) => ({
  type: actions.REFERRAL_ACCEPTED,
  api: {
    path: `${recordType}/${recordId}/referrals/${transistionId}`,
    method: "PATCH",
    body: { data: { status: ACCEPTED } },
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
});

export const referralRejected = ({ data, message, failureMessage, recordId, recordType, transistionId }) => {
  return {
    type: actions.REFERRAL_REJECTED,
    api: {
      path: `${recordType}/${recordId}/referrals/${transistionId}`,
      method: "PATCH",
      body: { data: { status: REJECTED, ...data } },
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
        fetchRecordCallback({ recordId, recordType })
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
