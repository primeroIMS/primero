import { ENQUEUE_SNACKBAR } from "components/notifier";
import * as Actions from "./actions";

export const fetchAssignUsers = recordType => async dispatch => {
  dispatch({
    type: Actions.ASSIGN_USERS_FETCH,
    api: {
      path: "users/assign-to",
      params: {
        record_type: recordType
      }
    }
  });
};

export const saveAssignedUser = (recordId, body, message) => async dispatch => {
  await dispatch({
    type: Actions.ASSIGN_USER_SAVE,
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
