import { List, Map } from "immutable";
import * as Actions from "./actions";
import { cleanUpFilters } from "components/records";

export const setTab = payload => {
  return {
    type: Actions.SET_TAB,
    payload
  };
};

export const setInitialFilterValues = (recordType, payload) => {
  const values = Object.entries(payload).reduce((obj, item) => {
    const o = obj;
    const [key, value] = item;
    if (List.isList(value)) {
      o[key] = value.toJS();
    }
    return o;
  }, {});
  return {
    type: `${recordType}/CLEAR_FILTERS`,
    payload: values
  };
};

export const setInitialRecords = (path, namespace, initialFilterValues) => {
  const defaultFilters = cleanUpFilters(Map(initialFilterValues).toJS());

  return {
    type: `${namespace}/RECORDS`,
    api: {
      path: path,
      params: defaultFilters
    }
  };
};

