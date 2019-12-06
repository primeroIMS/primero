import { List, fromJS } from "immutable";
import merge from "lodash/merge";

import { cleanUpFilters } from "../records";

import { SET_TAB } from "./actions";

export const setTab = payload => {
  return {
    type: SET_TAB,
    payload
  };
};

export const setInitialFilterValues = (recordType, payload, fromDashboard) => {
  const values = Object.entries(payload).reduce((obj, item) => {
    const currentObject = obj;
    const [key, value] = item;

    if (List.isList(value)) {
      currentObject[key] = value.toJS();
    }

    return currentObject;
  }, {});

  const filters = Object.keys(fromDashboard).length
    ? merge(values, fromDashboard)
    : values;

  return {
    type: `${recordType}/CLEAR_FILTERS`,
    payload: filters
  };
};

export const setInitialRecords = (path, namespace, initialFilterValues) => {
  const defaultFilters = cleanUpFilters(fromJS(initialFilterValues));

  return {
    type: `${namespace}/RECORDS`,
    api: {
      path,
      params: defaultFilters
    }
  };
};
