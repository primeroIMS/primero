import { ENQUEUE_SNACKBAR } from "components/notifier";
import { CASES_ASSIGNS, CASES_TRANSFERS, CASES_REFERRALS } from "config";
import actions from "./actions";

export const fetchAssignUsers = recordType => ({
  type: actions.ASSIGN_USERS_FETCH,
  api: {
    path: "users/assign-to",
    params: {
      record_type: recordType
    }
  }
});

export const fetchTransferUsers = params => ({
  type: actions.TRANSFER_USERS_FETCH,
  api: {
    path: "users/transfer-to",
    params
  }
});

export const fetchReferralUsers = params => ({
  type: actions.REFERRAL_USERS_FETCH,
  api: {
    path: "users/refer-to",
    params
  }
});

export const removeFormErrors = payload => {
  return {
    type: actions.CLEAR_ERRORS,
    payload
  };
};

const generatePath = (constant, recordId) => {
  const [recordType, transitionType] = constant.split("/");
  return [recordType, recordId, transitionType].join("/");
};

export const saveAssignedUser = (recordId, body, message) => ({
  type: actions.ASSIGN_USER_SAVE,
  api: {
    path: generatePath(CASES_ASSIGNS, recordId),
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: new Date().getTime() + Math.random()
        }
      }
    }
  }
});

export const saveTransferUser = (recordId, body, message) => ({
  type: actions.TRANSFER_USER,
  api: {
    path: generatePath(CASES_TRANSFERS, recordId),
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: new Date().getTime() + Math.random()
        }
      }
    }
  }
});

export const saveReferral = (recordId, body, message) => ({
  type: actions.REFER_USER,
  api: {
    path: generatePath(CASES_REFERRALS, recordId),
    method: "POST",
    body,
    successCallback: {
      action: ENQUEUE_SNACKBAR,
      payload: {
        message,
        options: {
          variant: "success",
          key: new Date().getTime() + Math.random()
        }
      }
    }
  }
});
