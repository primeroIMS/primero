import * as RecordListActions from "../../actions";

export const setSwitchButton = (payload, namespace) => {
  return {
    type: `${namespace}/${RecordListActions.SET_FILTERS}`,
    payload
  };
};

export const setSwitchValue = (payload, namespace) => {
  return {
    type: payload.included
      ? `${namespace}/${RecordListActions.DELETE_SWITCH_BUTTON}`
      : `${namespace}/${RecordListActions.ADD_SWITCH_BUTTON}`,
    payload
  };
};
