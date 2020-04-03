import { fromJS } from "immutable";

import { TransitionRecord } from "../../transitions/records";

import Actions from "./actions";

const DEFAULT_STATE = fromJS({ data: [] });

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.ASSIGN_USERS_FETCH_SUCCESS:
      return state.setIn(["reassign", "users"], fromJS(payload.data));
    case Actions.ASSIGN_USER_SAVE_FAILURE:
      return state
        .setIn(["reassign", "errors"], true)
        .setIn(
          ["reassign", "message"],
          fromJS(payload.errors.map(e => e.message).flat())
        );
    case Actions.ASSIGN_USER_SAVE_FINISHED:
      return state.setIn(["reassign", "loading"], false);
    case Actions.ASSIGN_USER_SAVE_STARTED:
      return state
        .setIn(["reassign", "loading"], true)
        .setIn(["reassign", "errors"], false);
    case Actions.ASSIGN_USER_SAVE_SUCCESS:
      return state
        .setIn(["reassign", "errors"], false)
        .setIn(["reassign", "message"], fromJS([]))
        .update("data", data => {
          return data.push(TransitionRecord(payload.data));
        });
    case Actions.CLEAR_ERRORS:
      return state
        .setIn([payload, "errors"], false)
        .setIn([payload, "message"], fromJS([]));
    case Actions.TRANSFER_USERS_FETCH_SUCCESS:
      return state.setIn(["transfer", "users"], fromJS(payload.data));
    case Actions.TRANSFER_USER_FAILURE:
      return state
        .setIn(["transfer", "errors"], true)
        .setIn(
          ["transfer", "message"],
          fromJS(payload.errors.map(e => e.message).flat())
        );
    case Actions.TRANSFER_USER_STARTED:
      return state.setIn(["transfer", "errors"], false);
    case Actions.TRANSFER_USER_SUCCESS:
      return state
        .setIn(["transfer", "errors"], false)
        .setIn(["transfer", "message"], fromJS([]))
        .update("data", data => {
          return data.push(TransitionRecord(payload.data));
        });
    case Actions.REFERRAL_USERS_FETCH_STARTED:
      return state
        .setIn(["referral", "loading"], true)
        .setIn(["referral", "errors"], false);
    case Actions.REFERRAL_USERS_FETCH_SUCCESS:
      return state.setIn(["referral", "users"], fromJS(payload.data));
    case Actions.REFERRAL_USERS_FETCH_FINISHED:
      return state
        .setIn(["referral", "loading"], false)
        .setIn(["referral", "errors"], false);
    case Actions.REFERRAL_USERS_FETCH_FAILURE:
      return state
        .setIn(["referral", "loading"], false)
        .setIn(["referral", "errors"], true);
    case Actions.REFER_USER_FAILURE:
      return state
        .setIn(["referral", "errors"], true)
        .setIn(
          ["referral", "message"],
          fromJS(payload.errors.map(e => e.message).flat())
        );
    case Actions.REFER_USER_STARTED:
      return state.setIn(["referral", "errors"], false);
    case Actions.REFER_USER_SUCCESS:
      return state
        .setIn(["referral", "errors"], false)
        .setIn(["referral", "message"], fromJS([]))
        .update("data", data => {
          return data.push(TransitionRecord(payload.data));
        });
    default:
      return state;
  }
};
