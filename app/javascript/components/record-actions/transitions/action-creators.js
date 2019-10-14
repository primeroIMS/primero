import { ENQUEUE_SNACKBAR } from "components/notifier";
import { batch } from "react-redux";
import * as actions from "./actions";

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

export const fetchTransferUsers = recordType => async dispatch => {
  dispatch({
    type: actions.TRANSFER_USERS_FETCH,
    api: {
      path: "users/transfer-to",
      params: {
        record_type: recordType
      }
    }
  });
};

export const fetchTransitionData = recordType => async dispatch => {
  batch(() => {
    dispatch(fetchAssignUsers(recordType));
    dispatch(fetchTransferUsers(recordType));
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
