import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";
import { validateMetadata } from "../utils";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.ROLES_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.ROLES_SUCCESS: {
      const { data, metadata } = payload;

      return state.set("data", fromJS(data)).set("metadata", validateMetadata(fromJS(metadata), DEFAULT_METADATA));
    }
    case actions.ROLES_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.ROLES_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.SET_ROLES_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    default:
      return state;
  }
};
