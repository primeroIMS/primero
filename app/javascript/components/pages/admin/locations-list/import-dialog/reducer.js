import { fromJS } from "immutable";

import actions from "./actions";
import { IMPORT } from "./constants";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.CLEAR_IMPORT_ERRORS:
      return state.setIn([IMPORT, "errors"], fromJS([]));
    case actions.IMPORT_LOCATIONS_STARTED:
      return state.setIn([IMPORT, "loading"], fromJS(payload)).setIn([IMPORT, "errors"], false);
    case actions.IMPORT_LOCATIONS_SUCCESS:
      return state.setIn([IMPORT], fromJS(payload));
    case actions.IMPORT_LOCATIONS_FAILURE:
      return state.setIn([IMPORT, "errors"], true).setIn([IMPORT, "loading"], false);
    case actions.IMPORT_LOCATIONS_FINISHED:
      return state.setIn([IMPORT, "errors"], false).setIn([IMPORT, "loading"], false);
    default:
      return state;
  }
};
