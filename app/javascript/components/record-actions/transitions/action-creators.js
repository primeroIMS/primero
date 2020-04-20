import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { REFER_DIALOG, TRANSFER_DIALOG, ASSIGN_DIALOG } from "../constants";
import { SERVICE_REFERRED_SAVE } from "../../records";
import { RECORD_TYPES } from "../../../config"
import { SET_DIALOG, SET_DIALOG_PENDING } from "..";

import { generatePath } from "./components/utils";
import actions from "./actions";

const successCallbackActions = (modalName, message) => [
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
      dialog: modalName,
      open: false
    }
  },
  {
    action: SET_DIALOG_PENDING,
    payload: {
      pending: false
    }
  }
];

export const fetchAssignUsers = recordType => ({
  type: actions.ASSIGN_USERS_FETCH,
  api: {
    path: actions.USERS_ASSIGN_TO,
    params: {
      record_type: recordType
    }
  }
});

export const fetchTransferUsers = params => ({
  type: actions.TRANSFER_USERS_FETCH,
  api: {
    path: actions.USERS_TRANSFER_TO,
    params
  }
});

export const fetchReferralUsers = params => ({
  type: actions.REFERRAL_USERS_FETCH,
  api: {
    path: actions.USERS_REFER_TO,
    params
  }
});

export const removeFormErrors = payload => {
  return {
    type: actions.CLEAR_ERRORS,
    payload
  };
};

export const saveAssignedUser = (recordId, body, message) => ({
  type: actions.ASSIGN_USER_SAVE,
  api: {
    path: generatePath(actions.CASES_ASSIGNS, recordId),
    method: "POST",
    body,
    successCallback: successCallbackActions(ASSIGN_DIALOG, message)
  }
});

export const saveTransferUser = (recordId, body, message) => ({
  type: actions.TRANSFER_USER,
  api: {
    path: generatePath(actions.CASES_TRANSFERS, recordId),
    method: "POST",
    body,
    successCallback: successCallbackActions(TRANSFER_DIALOG, message)
  }
});

export const saveReferral = (recordId, recordType, body, message) => {
  const successActions = successCallbackActions(REFER_DIALOG, message);

  const successCallback =
    body.data && body.data.service_record_id
      ? [
          `${recordType}/${SERVICE_REFERRED_SAVE}`,
          successActions
        ].flat()
      : successActions;

  return {
    type: actions.REFER_USER,
    api: {
      path: generatePath(actions.CASES_REFERRALS, recordId),
      method: "POST",
      body,
      successCallback
    }
  };
};
