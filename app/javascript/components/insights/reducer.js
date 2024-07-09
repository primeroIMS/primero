// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = Map({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.EXPORT_INSIGHTS_STARTED:
      return state.setIn(["export", "loading"], true);
    case actions.EXPORT_INSIGHTS_FINISHED:
      return state.setIn(["export", "loading"], false);
    case actions.EXPORT_INSIGHTS_SUCCESS:
      return state.set("export", fromJS(payload.data));
    case actions.EXPORT_INSIGHTS_FAILURE:
      return state.setIn(["export", "errors"], fromJS(payload.errors));
    case actions.CLEAR_EXPORTED_INSIGHT:
      return state.set("export", fromJS({}));
    default:
      return state;
  }
};
