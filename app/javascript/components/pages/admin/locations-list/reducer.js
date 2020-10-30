import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.LOCATIONS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.LOCATIONS_SUCCESS:
      return state.set("data", fromJS(payload.data)).set("metadata", fromJS(payload.metadata));
    case actions.LOCATIONS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.LOCATIONS_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.CLEAR_METADATA:
      return state.set(
        "metadata",
        fromJS({
          page: 1,
          per: 100
        })
      );
    default:
      return state;
  }
};
