import { DB, RECORD_PATH } from "../../config";
import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import { cleanUpFilters } from "./helpers";
import * as Actions from "./actions";

/*
 * TODO: Deprecated. This will be removed in favor of the separated action
 * creators for each record type.
 */
export const setFilters = data => async dispatch => {
  const { recordType, options } = data;

  dispatch({
    type: `${recordType}/SET_FILTERS`,
    payload: options
  });
};

export const fetchCases = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: Actions.CASES_RECORDS,
    api: {
      path: RECORD_PATH.cases,
      params: cleanUpFilters(options),
      db: {
        collection: DB.RECORDS,
        recordType: RECORD_PATH.cases
      }
    }
  });
};

export const fetchIncidents = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: Actions.INCIDENTS_RECORDS,
    api: {
      path: RECORD_PATH.incidents,
      params: cleanUpFilters(options),
      db: {
        collection: DB.RECORDS,
        recordType: RECORD_PATH.incidents
      }
    }
  });
};

export const fetchTracingRequests = data => async dispatch => {
  const { options } = data;

  dispatch({
    type: Actions.TRACING_REQUESTS_RECORDS,
    api: {
      path: RECORD_PATH.tracing_requests,
      params: cleanUpFilters(options),
      db: {
        collection: DB.RECORDS,
        recordType: RECORD_PATH.tracing_requests
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
            key: generate.messageKey()
          }
        },
        redirectWithIdFromResponse: saveMethod !== "update",
        redirect: redirect === false ? false : redirect || `/${recordType}`
      },
      db: {
        collection: DB.RECORDS,
        recordType
      }
    }
  });
};
