import { fromJS } from "immutable";

import { Actions } from "../user";

import { SET_DIALOG, SET_DIALOG_PENDING, CLEAR_DIALOG } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_DIALOG:
      return state.merge(fromJS(payload));
    case SET_DIALOG_PENDING:
      return state.set("pending", fromJS(payload));
    case Actions.LOGOUT_SUCCESS:
    case CLEAR_DIALOG:
      return state.clear();
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
