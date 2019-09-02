import { ENQUEUE_SNACKBAR } from "components/notifier";
import * as Actions from "./actions";

export const fetchFlags = url => async dispatch => {
  dispatch({
    type: Actions.FETCH_FLAGS,
    api: {
      path: `${url.substr(1)}/flags`
    }
  });
};

export const unFlag = (url, id, body, message) => async dispatch => {
  await dispatch({
    type: Actions.UNFLAG,
    api: {
      path: `${url.substr(1)}/flags/${id}`,
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

export const addFlag = (url, body, message) => async dispatch => {
  await dispatch({
    type: Actions.ADD_FLAG,
    api: {
      path: `${url.substr(1)}/flags`,
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
