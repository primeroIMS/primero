import { fromJS } from "immutable";

import { TransitionRecord } from "../../../transitions/records";

import actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [], error: false, message: [] });

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.TRANSFER_REQUEST_FAILURE:
      return state
        .setIn(["transferRequest", "errors"], true)
        .setIn(
          ["transferRequest", "message"],
          fromJS(payload.errors.map(e => e.message).flat())
        );
    case actions.TRANSFER_REQUEST_STARTED:
      return state.setIn(["transferRequest", "errors"], false);
    case actions.TRANSFER_REQUEST_SUCCESS:
      return state
        .setIn(["transferRequest", "errors"], false)
        .setIn(["transferRequest", "message"], fromJS([]))
        .update("data", data => {
          return data.push(TransitionRecord(payload.data));
        });
    default:
      return state;
  }
};

export const reducers = reducer;
