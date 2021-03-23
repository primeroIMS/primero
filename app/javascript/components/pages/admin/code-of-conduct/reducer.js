import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_CODE_OF_CONDUCT_STARTED:
    case actions.SAVE_CODE_OF_CONDUCT_STARTED:
      return state.set("loading", true);
    case actions.FETCH_CODE_OF_CONDUCT_SUCCESS:
    case actions.SAVE_CODE_OF_CONDUCT_SUCCESS:
      return state.set("data", fromJS(payload.data));
    case actions.FETCH_CODE_OF_CONDUCT_FINISHED:
    case actions.SAVE_CODE_OF_CONDUCT_FINISHED:
      return state.set("loading", false);
    default:
      return state;
  }
};
