import { Map } from "immutable";

import {
  SET_UP_RANGE_BUTTON,
  ADD_RANGE_BUTTON,
  RESET_RANGE_BUTTON
} from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_UP_RANGE_BUTTON:
      return state.set(payload, "");
    case ADD_RANGE_BUTTON:
      return state.set(payload.id, payload.data);
    case RESET_RANGE_BUTTON:
      return state.set(payload, "");
    default:
      return state;
  }
};

export const rangeButtonReducer = { [NAMESPACE]: reducer };
