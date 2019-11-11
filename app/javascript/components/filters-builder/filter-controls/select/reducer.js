import { Map, List } from "immutable";

import { SET_UP_SELECT, RESET_SELECT, ADD_SELECT } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_UP_SELECT:
    case RESET_SELECT:
      return state.set(payload, List([]));
    case ADD_SELECT:
      return state.set(payload.id, payload.data);
    default:
      return state;
  }
};

export const selectReducer = { [NAMESPACE]: reducer };
