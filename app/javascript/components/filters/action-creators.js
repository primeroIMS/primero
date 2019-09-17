import * as Actions from "./actions";

export const setTab = payload => {
  return {
    type: Actions.SET_TAB,
    payload
  };
};

export const setInitialFilterValues = (recordType, payload) => {
  return {
    type: `${recordType}/SET_FILTERS`,
    payload
  };
};
