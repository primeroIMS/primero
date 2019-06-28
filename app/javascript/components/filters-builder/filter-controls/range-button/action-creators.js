import * as Actions from "./actions";

export const setupRangeButton = payload => {
  return {
    type: Actions.SET_UP_RANGE_BUTTON,
    payload
  };
};

export const setValue = payload => {
  return {
    type: Actions.ADD_RANGE_BUTTON,
    payload
  };
};
