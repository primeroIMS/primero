import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespaces";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.ASSIGN_USERS_FETCH_SUCCESS:
      return state.setIn(["assign", "users"], payload.data);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
