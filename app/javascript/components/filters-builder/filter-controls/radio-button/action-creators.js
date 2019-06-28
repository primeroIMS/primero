import * as Actions from "./actions";

export const setupRadioButtons = payload => {
  return {
    type: Actions.SET_UP_RADIO_BUTTON,
    payload
  };
};

export const setRadioButton = payload => {
  return {
    type: Actions.ADD_RADIO_BUTTON,
    payload
  };
};
