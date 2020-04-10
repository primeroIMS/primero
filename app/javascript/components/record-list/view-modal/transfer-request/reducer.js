import { fromJS } from "immutable";

import { TransitionRecord } from "../../../transitions/records";

import actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = fromJS({ data: [] });

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.TRANSFER_REQUEST_FAILURE:
      return state
        .setIn([NAMESPACE, "errors"], true)
        .setIn(
          [NAMESPACE, "message"],
          fromJS(payload.errors.map(e => e.message).flat())
        );
    case actions.TRANSFER_REQUEST_STARTED:
      return state.setIn([NAMESPACE, "errors"], false);
    case actions.TRANSFER_REQUEST_SUCCESS:
      return state
        .setIn([NAMESPACE, "errors"], false)
        .setIn([NAMESPACE, "message"], fromJS([]))
        .update("data", data => {
          return data.push(TransitionRecord(payload.data));
        });
    default:
      return state;
  }
};
