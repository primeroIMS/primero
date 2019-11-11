import { ENQUEUE_SNACKBAR } from "../notifier";

import * as Actions from "./actions";

export const fetchFlags = (recordType, record) => async dispatch => {
  dispatch({
    type: Actions.FETCH_FLAGS,
    api: {
      path: `${recordType}/${record}/flags`
    }
  });
};

export const unFlag = (
  id,
  body,
  message,
  recordType,
  record
) => async dispatch => {
  await dispatch({
    type: Actions.UNFLAG,
    api: {
      path: `${recordType}/${record}/flags/${id}`,
      method: "PATCH",
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

export const addFlag = (body, message, path) => async dispatch => {
  await dispatch({
    type: Actions.ADD_FLAG,
    api: {
      path,
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
