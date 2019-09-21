import * as RecordListActions from "../../actions";

export const setupRangeButton = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.SET_FILTERS}`,
    payload
  };
};

export const setValue = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.ADD_RANGE_BUTTON}`,
    payload
  };
};
