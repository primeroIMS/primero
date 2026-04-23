import { fromJS } from "immutable";

import { DEFAULT_LOCATION_METADATA } from "./constants";
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
    case actions.DISABLE_LOCATIONS_STARTED:
      return state.setIn(["disableLocations", "loading"], true).setIn(["disableLocations", "errors"], false);
    case actions.DISABLE_LOCATIONS_FAILURE:
      return state.setIn(["disableLocations", "loading"], false).setIn(["disableLocations", "errors"], true);
    case actions.DISABLE_LOCATIONS_SUCCESS:
      return state.setIn(["disableLocations", "loading"], true).setIn(["disableLocations", "errors"], false);
    case actions.DISABLE_LOCATIONS_FINISHED:
      return state.setIn(["disableLocations", "loading"], false).setIn(["disableLocations", "errors"], false);
    case actions.SET_LOCATIONS_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_LOCATION_METADATA));
    default:
      return state;
  }
};
