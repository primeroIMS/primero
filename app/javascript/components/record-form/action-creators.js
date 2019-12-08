import { DB } from "../../config";

import Actions from "./actions";
import { URL_LOCATIONS, URL_LOOKUPS } from "./constants"

export const setSelectedForm = payload => {
  return {
    type: Actions.SET_SELECTED_FORM,
    payload
  };
};

export const fetchForms = () => async dispatch => {
  dispatch({
    type: Actions.RECORD_FORMS,
    api: {
      path: "forms",
      normalizeFunc: "normalizeFormData",
      db: {
        collection: DB.FORMS
      }
    }
  });
};

const fetchLookups = () => ({
  type: Actions.SET_OPTIONS,
  api: {
    path: URL_LOOKUPS,
    params: { per: 999, page: 1 }
  }
});

const fetchLocations = () => ({
  type: Actions.SET_LOCATIONS,
  api: {
    path: URL_LOCATIONS
  }
});

export const fetchOptions = () => async dispatch => {
  dispatch(fetchLookups());
  dispatch(fetchLocations());
};
