import * as Actions from "./actions";

export const setUpCheckBoxes = payload => {
  return {
    type: Actions.SET_UP_CHECK_BOXES,
    payload
  };
};

export const setCheckBox = payload => {
  return {
    type: payload.included ? Actions.DELETE_CHECKBOX : Actions.ADD_CHECKBOX,
    payload
  };
};
