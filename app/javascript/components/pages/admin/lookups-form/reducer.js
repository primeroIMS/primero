import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_SELECTED_LOOKUP:
      return state.set("selectedLookup", fromJS({})).set("errors", false);
    case actions.FETCH_LOOKUP_FAILURE:
    case actions.SAVE_LOOKUP_FAILURE:
      return state.set("errors", true);
    case actions.FETCH_LOOKUP_FINISHED:
      return state.set("loading", fromJS(payload));
    case actions.FETCH_LOOKUP_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.FETCH_LOOKUP_SUCCESS:
      return state
        .set("selectedLookup", fromJS(payload.data))
        .set("errors", false);
    case actions.SAVE_LOOKUP_STARTED:
      return state.set("saving", true);
    case actions.SAVE_LOOKUP_FINISHED:
      return state.set("saving", false);
    default:
      return state;
  }
};

export const reducers = reducer;
