import * as RecordListActions from "components/record-list/actions";

export const setupRadioButtons = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.SET_FILTERS}`,
    payload
  };
};

export const setRadioButton = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.ADD_RADIO_BUTTON}`,
    payload
  };
};
