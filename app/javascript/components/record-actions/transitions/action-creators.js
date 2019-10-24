import { ENQUEUE_SNACKBAR } from "components/notifier";
import actions from "./actions";

export const fetchAssignUsers = recordType => async dispatch => {
  dispatch({
    type: actions.ASSIGN_USERS_FETCH,
    api: {
      path: "users/assign-to",
      params: {
        record_type: recordType
      }
    }
  });
};

export const fetchTransferUsers = params => async dispatch => {
  dispatch({
    type: actions.TRANSFER_USERS_FETCH,
    api: {
      path: "users/transfer-to",
      params
    }
  });
};

export const fetchReferralUsers = params => async dispatch => {
  dispatch({
    type: actions.REFERRAL_USERS_FETCH,
    api: {
      path: "users/refer-to",
      params
    }
  });
};

export const removeFormErrors = payload => {
  return {
    type: actions.CLEAR_ERRORS,
    payload
  };
};

export const saveAssignedUser = (recordId, body, message) => dispatch => {
  dispatch({
    type: actions.ASSIGN_USER_SAVE,
    api: {
      path: `cases/${recordId}/assigns`,
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
};

export const saveTransferUser = (recordId, body, message) => dispatch => {
  dispatch({
    type: actions.TRANSFER_USER,
    api: {
      path: `cases/${recordId}/transfers`,
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
};

export const saveReferral = (recordId, body, message) => dispatch => {
  dispatch({
    type: actions.REFER_USER,
    api: {
      path: `cases/${recordId}/referrals`,
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
};
