import * as RecordListActions from "components/record-list/actions";

export const setUpChips = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.SET_FILTERS}`,
    payload
  };
};

export const setChip = (payload, included, namespace) => {
  return {
    type: included
      ? `${namespace}/${RecordListActions.DELETE_CHIP}`
      : `${namespace}/${RecordListActions.ADD_CHIP}`,
    payload
  };
};
