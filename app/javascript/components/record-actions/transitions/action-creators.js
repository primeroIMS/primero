import { ENQUEUE_SNACKBAR, generate } from "../../notifier";

import { generatePath } from "./parts";
import actions from "./actions";

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
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});

export const saveTransferUser = (recordId, body, message) => ({
  type: actions.TRANSFER_USER,
  api: {
    path: generatePath(actions.CASES_TRANSFERS, recordId),
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: generate.messageKey()
        }
      }
    }
  }
});

export const saveReferral = (recordId, recordType, body, message) => {
  const successAction = {
    action: ENQUEUE_SNACKBAR,
    payload: {
      message,
      options: {
        variant: "success",
        key: generate.messageKey()
      }
    }
  };

  const successCallback =
    body.data && body.data.service_record_id
      ? [`${recordType}/${actions.SERVICE_REFERRED_SAVE}`, successAction]
      : successAction;

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
