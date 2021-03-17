import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USER_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false).set("serverErrors", fromJS([]));

    case actions.ACCEPT_CODE_OF_CONDUCT_STARTED:
      return state.set("updatingCodeOfConduct", true);
    case actions.ACCEPT_CODE_OF_CONDUCT_SUCCESS:
      return state.set("updatingCodeOfConduct", false);
    // case actions.ACCEPT_CODE_OF_CONDUCT_FAILURE:
    //   return state.setIn(["codeOfCondunct", "updating"], false);
    // case actions.ACCEPT_CODE_OF_CONDUCT_FINISHED:
    //   return state.setIn(["codeOfCondunct", "updating"], false);
    default:
      return state;
  }
};
