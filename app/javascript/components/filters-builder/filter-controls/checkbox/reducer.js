import { Map, List } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.SET_UP_CHECK_BOXES:
    case Actions.RESET_CHECKBOX:
      return state.set(payload, List([]));
    case Actions.ADD_CHECKBOX:
      return state.set(payload.id, [...state.get(payload.id), payload.data]);
    case Actions.DELETE_CHECKBOX:
      return state.set(
        payload.id,
        state.get(payload.id).filter(item => item !== payload.data)
      );
    default:
      return state;
  }
};

export const checkboxReducer = { [NAMESPACE]: reducer };
