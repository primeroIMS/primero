import * as RecordListActions from "components/record-list/actions";

export const setUpCheckBoxes = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.SET_FILTERS}`,
    payload
  };
};

export const setCheckBox = (payload, namespace) => {
  return {
    type: payload.included
      ? `${namespace}/${RecordListActions.DELETE_CHECKBOX}`
      : `${namespace}/${RecordListActions.ADD_CHECKBOX}`,
    payload
  };
};
