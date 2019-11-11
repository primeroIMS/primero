import { Map, List } from "immutable";

import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_UP_SELECT:
    case Actions.RESET_SELECT:
      return state.set(payload, List([]));
    case Actions.ADD_SELECT:
      return state.set(payload.id, payload.data);
    default:
      return state;
  }
};

export const selectReducer = { [NAMESPACE]: reducer };
