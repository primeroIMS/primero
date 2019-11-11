import { ENQUEUE_SNACKBAR } from "../notifier";

import { FETCH_FLAGS, UNFLAG, ADD_FLAG } from "./actions";

export const fetchFlags = (recordType, record) => async dispatch => {
  dispatch({
    type: FETCH_FLAGS,
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
    type: UNFLAG,
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
    type: ADD_FLAG,
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
