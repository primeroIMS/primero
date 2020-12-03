import { ENQUEUE_SNACKBAR, generate } from "../../notifier";
import { SERVICE_REFERRED_SAVE } from "../../records";
import { CLEAR_DIALOG } from "../../action-dialog";

import { generatePath } from "./components/utils";
import actions from "./actions";

const successMessage = message => ({
  action: ENQUEUE_SNACKBAR,
  payload: {
    message,
    options: {
      variant: "success",
      key: generate.messageKey(message)
    }
  }
});

const closeDialog = () => [
  {
    action: CLEAR_DIALOG
  }
];

const successCallbackActions = (message, isRemote = false) => [
  successMessage(message),
  ...(!isRemote ? closeDialog() : [])
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
    successCallback: successCallbackActions(message)
  }
});

export const saveTransferUser = (recordId, body, message) => ({
  type: actions.TRANSFER_USER,
  api: {
    path: generatePath(actions.CASES_TRANSFERS, recordId),
    method: "POST",
    body,
    successCallback: successCallbackActions(message)
  }
});

export const saveReferral = (recordId, recordType, body, message) => {
  const successActions = successCallbackActions(message, body?.data?.remote);

  const successCallback =
    body.data && body.data.service_record_id
      ? [`${recordType}/${SERVICE_REFERRED_SAVE}`, successActions].flat()
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
