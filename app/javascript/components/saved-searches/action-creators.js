import { ENQUEUE_SNACKBAR, generate } from "../notifier";

import {
  FETCH_SAVED_SEARCHES,
  SAVE_SEARCH,
  REMOVE_SAVED_SEARCH
} from "./actions";

export const fetchSavedSearches = () => async dispatch => {
  dispatch({
    type: FETCH_SAVED_SEARCHES,
    api: {
      path: "saved_searches"
    }
  });
};

export const saveSearch = (body, message) => async dispatch => {
  await dispatch({
    type: SAVE_SEARCH,
    api: {
      path: "saved_searches",
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

export const removeSavedSearch = (id, message) => dispatch => {
  dispatch({
    type: REMOVE_SAVED_SEARCH,
    api: {
      path: `saved_searches/${id}`,
      method: "DELETE",
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

export const setSavedSearch = (recordType, payload) => {
  return {
    type: `${recordType}/SET_SAVED_FILTERS`,
    payload
  };
};
