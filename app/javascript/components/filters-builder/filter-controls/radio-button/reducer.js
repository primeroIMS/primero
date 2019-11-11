import { Map } from "immutable";

import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_UP_RADIO_BUTTON:
    case Actions.RESET_RADIO_BUTTON:
      return state.set(payload, "");
    default:
      return state;
  }
};

export const radioButtonsReducer = { [NAMESPACE]: reducer };
