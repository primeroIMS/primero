import { ENQUEUE_SNACKBAR } from "components/notifier";
import * as Actions from "./actions";

export const fetchFlags = (recordType, records) => async dispatch => {
  dispatch({
    type: Actions.FETCH_FLAGS,
    api: {
      path: `${recordType}/${records}/flags`
    }
  });
};

export const unFlag = (
  id,
  body,
  message,
  recordType,
  records
) => async dispatch => {
  await dispatch({
    type: Actions.UNFLAG,
    api: {
      path: `${recordType}/${records}/flags/${id}`,
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
