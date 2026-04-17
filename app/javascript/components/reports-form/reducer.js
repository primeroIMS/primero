import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type }) => {
  switch (type) {
    case actions.CLEAR_SELECTED_REPORT:
      return state.set("selectedReport", fromJS({})).set("errors", false);
    default:
      return state;
  }
};
