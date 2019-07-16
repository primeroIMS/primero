import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({ current: 0 });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_TAB:
      return state.set("current", payload);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
