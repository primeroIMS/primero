import { fromJS } from "immutable";

import { SET_DIALOG, SET_DIALOG_PENDING } from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case SET_DIALOG:
      return state.set(payload.dialog, fromJS(payload.open));
    case SET_DIALOG_PENDING:
      return state.set("pending", fromJS(payload.pending));
    default:
      return state;
  }
};

export const reducers = { [NAMESPACE]: reducer };
