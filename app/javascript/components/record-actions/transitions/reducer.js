import { Map } from "immutable";
import * as Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.ASSIGN_USERS_FETCH_SUCCESS:
      return state.setIn(["reassign", "users"], payload.data);
    case Actions.ASSIGN_USER_SAVE_STARTED:
      return state
        .setIn(["reassign", "loading"], true)
        .setIn(["reassign", "errors"], false);
    case Actions.ASSIGN_USER_SAVE_FAILURE:
      return state
        .setIn(["reassign", "errors"], true)
        .setIn(["reassign", "message"], payload.errors[0].message);
    case Actions.ASSIGN_USER_SAVE_SUCCESS:
      return state
        .setIn(["reassign", "errors"], false)
        .setIn(["reassign", "message"], []);
    case Actions.ASSIGN_USER_SAVE_FINISHED:
      return state.setIn(["reassign", "loading"], false);
    case Actions.CLEAR_ERRORS:
      return state
        .setIn([payload, "errors"], false)
        .setIn([payload, "message"], []);
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
