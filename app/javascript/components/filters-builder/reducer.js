import { List } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = List([]);

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_EXPANSION_PANEL:
      return [...state, payload];
    case Actions.REMOVE_EXPANDED_PANEL:
      return [...state.filter(item => item !== payload)];
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
