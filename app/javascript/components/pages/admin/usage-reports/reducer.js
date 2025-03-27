// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_USAGE_REPORTS_STARTED:
      return state.set("loading", fromJS(payload)).set("errors", false);
    case actions.FETCH_USAGE_REPORTS_SUCCESS: {
      return state.set("export", fromJS(payload.data));
    }
    case actions.FETCH_USAGE_REPORTS_FAILURE:
      return state.set("errors", true).set("loading", false);
    case actions.FETCH_USAGE_REPORTS_FINISHED:
      return state.set("errors", false).set("loading", false);
    case actions.CLEAR_EXPORTED_USAGE_REPORT:
      return state.delete("export");
    default:
      return state;
  }
};
