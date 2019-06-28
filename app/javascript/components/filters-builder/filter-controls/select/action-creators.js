import * as Actions from "./actions";

export const setupSelect = payload => {
  return {
    type: Actions.SET_UP_SELECT,
    payload
  };
};

export const setSelectValue = payload => {
  return {
    type: Actions.ADD_SELECT,
    payload
  };
};
