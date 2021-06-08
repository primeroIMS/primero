import isEmpty from "lodash/isEmpty";
import { batch } from "react-redux";

import { DB_COLLECTIONS_NAMES } from "../../db";

import Actions from "./actions";
import { URL_LOOKUPS } from "./constants";

const fetchLocations = () => ({
  type: Actions.SET_LOCATIONS,
  api: {
    path: `${window.location.origin}${window.locationManifest}`,
    external: true,
    db: {
      collection: DB_COLLECTIONS_NAMES.LOCATIONS,
      alwaysCache: false,
      manifest: window.locationManifest
    }
  }
});

export const fetchLookups = () => {
  return {
    type: Actions.SET_OPTIONS,
    api: {
      path: URL_LOOKUPS,
      params: { per: 999, page: 1 },
      db: {
        collection: DB_COLLECTIONS_NAMES.OPTIONS
      }
    }
  };
};

export const setSelectedForm = payload => ({
  type: Actions.SET_SELECTED_FORM,
  payload
});

export const setServiceToRefer = payload => ({
  type: Actions.SET_SERVICE_TO_REFER,
  payload
});

export const fetchForms = () => ({
  type: Actions.RECORD_FORMS,
  api: {
    path: "forms",
    normalizeFunc: "normalizeFormData",
    db: {
      collection: DB_COLLECTIONS_NAMES.FORMS
    }
  }
});

export const fetchOptions = () => async dispatch => {
  batch(() => {
    dispatch(fetchLookups());

    if (!isEmpty(window.locationManifest)) {
      dispatch(fetchLocations());
    }
  });
};

export const fetchAgencies = params => ({
  type: Actions.FETCH_AGENCIES,
  api: {
    path: "agencies",
    method: "GET",
    params
  }
});

export const setValidationErrors = payload => ({
  type: Actions.SET_VALIDATION_ERRORS,
  payload
});

export const setPreviousRecord = payload => ({
  type: Actions.SET_PREVIOUS_RECORD,
  payload
});

export const clearPreviousRecord = () => ({
  type: Actions.CLEAR_PREVIOUS_RECORD
});

export const clearValidationErrors = () => ({
  type: Actions.CLEAR_VALIDATION_ERRORS
});

export const setDataProtectionInitialValues = payload => ({
  type: Actions.SET_DATA_PROTECTION_INITIAL_VALUES,
  payload
});

export const clearDataProtectionInitialValues = () => ({
  type: Actions.CLEAR_DATA_PROTECTION_INITIAL_VALUES
});
