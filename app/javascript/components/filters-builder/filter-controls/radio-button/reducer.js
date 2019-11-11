import { Map } from "immutable";

import { SET_UP_RADIO_BUTTON, RESET_RADIO_BUTTON } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_UP_RADIO_BUTTON:
    case RESET_RADIO_BUTTON:
      return state.set(payload, "");
    default:
      return state;
  }
};

export const radioButtonsReducer = { [NAMESPACE]: reducer };
