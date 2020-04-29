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
      alwaysCache: true,
      manifest: window.locationManifest
    }
  }
});

export const fetchLookups = () => {
  return {
    type: Actions.SET_OPTIONS,
    api: {
      path: URL_LOOKUPS,
      params: { per: 999, page: 1 }
    }
  };
};

export const setSelectedForm = payload => ({
  type: Actions.SET_SELECTED_FORM,
  payload
});

export const setSelectedRecord = payload => ({
  type: Actions.SET_SELECTED_RECORD,
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
    dispatch(fetchLocations());
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
