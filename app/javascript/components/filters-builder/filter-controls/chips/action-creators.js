import * as Actions from "./actions";

export const setUpChips = payload => {
  return {
    type: Actions.SET_UP_CHIPS,
    payload
  };
};

export const setChip = (payload, included) => {
  return {
    type: included ? Actions.DELETE_CHIP : Actions.ADD_CHIP,
    payload
  };
};
