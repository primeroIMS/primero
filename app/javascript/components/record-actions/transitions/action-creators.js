import { ENQUEUE_SNACKBAR } from "../../notifier";
import {
  CASES_ASSIGNS,
  CASES_TRANSFERS,
  CASES_REFERRALS,
  USERS_ASSIGN_TO,
  USERS_TRANSFER_TO,
  USERS_REFER_TO
} from "../../../config";

import { generatePath } from "./parts";
import actions from "./actions";

export const fetchAssignUsers = recordType => ({
  type: actions.ASSIGN_USERS_FETCH,
  api: {
    path: USERS_ASSIGN_TO,
    params: {
      record_type: recordType
    }
  }
});

export const fetchTransferUsers = params => ({
  type: actions.TRANSFER_USERS_FETCH,
  api: {
    path: USERS_TRANSFER_TO,
    params
  }
});

export const fetchReferralUsers = params => ({
  type: actions.REFERRAL_USERS_FETCH,
  api: {
    path: USERS_REFER_TO,
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
