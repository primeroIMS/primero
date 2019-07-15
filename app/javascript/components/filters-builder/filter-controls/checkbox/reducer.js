import { Map, List } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.RESET_CHECKBOX:
      return state.set(payload, List([]));
    default:
      return state;
  }
};

export const checkboxReducer = { [NAMESPACE]: reducer };
