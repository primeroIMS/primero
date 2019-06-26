import { List, Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_UP_CHIPS:
      return state.set(payload, List([]));
    case Actions.ADD_CHIP:
      return state.set(
        payload.component_id,
        state.get(payload.component_id).push(payload.data)
      );
    case Actions.DELETE_CHIP:
      return state.set(
        payload.component_id,
        state.get(payload.component_id).filter(item => item !== payload.data)
      );
    case Actions.RESET_CHIPS:
      return [];
    default:
      return state;
  }
};

export const chipsReducer = { [NAMESPACE]: reducer };
