import { ENQUEUE_SNACKBAR } from "components/notifier";
import { DB } from "config";
import { cleanUpFilters } from "./helpers";
import * as Actions from "./actions";

export const fetchRecords = data => async dispatch => {
  const { recordType, options } = data;

  dispatch({
    type: `${recordType}/SET_FILTERS`,
    payload: options
  });

  dispatch({
    type: `${recordType}/RECORDS`,
    api: {
      path: recordType,
      params: cleanUpFilters(options),
      db: {
        collection: DB.RECORDS,
        recordType
      }
    }
  });
};

export const fetchRecord = (recordType, id) => async dispatch => {
  dispatch({
    type: `${recordType}/${Actions.RECORD}`,
    api: {
      path: `${recordType}/${id}`,
      db: {
        collection: DB.RECORDS,
        recordType
      }
    }
  });
};

export const saveRecord = (
  recordType,
  saveMethod,
  body,
  id,
  message,
  redirect
) => async dispatch => {
  await dispatch({
    type: `${recordType}/${Actions.SAVE_RECORD}`,
    api: {
      path: saveMethod === "update" ? `${recordType}/${id}` : `${recordType}`,
      method: saveMethod === "update" ? "PATCH" : "POST",
      body,
      successCallback: {
        action: ENQUEUE_SNACKBAR,
        payload: {
          message,
          options: {
            variant: "success",
            key: new Date().getTime() + Math.random()
          }
        },
        redirect: redirect === false ? false : redirect || `/${recordType}`
      },
      db: {
        collection: DB.RECORDS,
        recordType
      }
    }
  });
};
