import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_UP_RANGE_BUTTON:
      return state.set(payload, "");
    case Actions.ADD_RANGE_BUTTON:
      return state.set(payload.id, payload.data);
    case Actions.RESET_RANGE_BUTTON:
      return state.set(payload, "");
    default:
      return state;
  }
};

export const rangeButtonReducer = { [NAMESPACE]: reducer };
