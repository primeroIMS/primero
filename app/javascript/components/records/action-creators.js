import { ENQUEUE_SNACKBAR } from "components/notifier";
import { DB } from "config";
import * as FiltersActions from "components/filters-builder/actions";
import { cleanUpFilters } from "./helpers";
import * as Actions from "./actions";

/*
 * TODO: Deprecated this will be removed in favor of the separated action
 * creators for each record type.
 */
export const setFilters = data => async dispatch => {
  const { recordType, options } = data;
  dispatch({
    type: `${recordType}/SET_FILTERS`,
    payload: options
  });
};

export const setCasesFilters = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: FiltersActions.CASES.SET_FILTERS,
    payload: options
  });
};

export const setIncidentsFilters = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: FiltersActions.INCIDENTS.SET_FILTERS,
    payload: options
  });
};

export const setTracingRequestFilters = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: FiltersActions.TRACING_REQUESTS.SET_FILTERS,
    payload: options
  });
};

export const fetchRecords = data => async dispatch => {
  const { recordType, options } = data;

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
