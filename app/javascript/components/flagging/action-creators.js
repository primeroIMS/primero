import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import { FETCH_FLAGS, UNFLAG, ADD_FLAG, SET_SELECTED_FLAG } from "./actions";

export const fetchFlags = (recordType, record) => async dispatch => {
  dispatch({
    type: FETCH_FLAGS,
    api: {
      path: `${recordType}/${record}/flags`
    }
  });
};

export const unFlag = (id, body, message, recordType, record) => {
  return {
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
            key: generate.messageKey()
          }
        }
      }
    }
  };
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
            key: generate.messageKey()
          }
        }
      }
    }
  });
};

export const setSelectedFlag = id => ({
  type: SET_SELECTED_FLAG,
  payload: { id }
});
