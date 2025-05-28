// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */
import { push } from "connected-react-router";

import { ACCEPTED, REJECTED, DONE, RECORD_TYPES_PLURAL } from "../../../../config";
import { ENQUEUE_SNACKBAR, generate } from "../../../notifier";
import { CLEAR_DIALOG, clearDialog, SET_DIALOG_PENDING } from "../../../action-dialog";
import { redirectCheckAccessDenied } from "../../utils";
import { setTempInitialValues } from "../../../record-form/action-creators";

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

export const referralCaseCreation = payload => async dispatch => {
  dispatch(setTempInitialValues(payload));
  dispatch(clearDialog());
  dispatch(push(`/${RECORD_TYPES_PLURAL.case}/${payload.module_id}/new`));
};
