import * as RecordListActions from "components/record-list/actions";

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
