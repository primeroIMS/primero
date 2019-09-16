import * as RecordListActions from "../../actions";

export const setupDatesRange = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.SET_FILTERS}`,
    payload
  };
};

export const setDate = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.ADD_DATES_RANGE}`,
    payload
  };
};
