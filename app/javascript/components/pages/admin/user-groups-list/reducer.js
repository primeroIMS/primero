import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";
import { validateMetadata } from "../utils";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.USER_GROUPS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.USER_GROUPS_SUCCESS: {
      const { data, metadata } = payload;

      return state.set("data", fromJS(data)).set("metadata", validateMetadata(fromJS(metadata), DEFAULT_METADATA));
    }
    case actions.USER_GROUPS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.USER_GROUPS_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.SET_USER_GROUPS_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    default:
      return state;
  }
};
