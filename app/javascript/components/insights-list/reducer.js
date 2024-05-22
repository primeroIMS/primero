// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../config";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_INSIGHTS_STARTED:
      return state.set("loading", true).set("errors", false);
    case actions.FETCH_INSIGHTS_SUCCESS:
      return state.set("data", fromJS(payload.data)).set("metadata", fromJS(payload.metadata)).set("errors", false);
    case actions.FETCH_INSIGHTS_FINISHED:
      return state.set("loading", false);
    case actions.FETCH_INSIGHTS_FAILURE:
      return state.set("errors", true);
    case actions.CLEAR_METADATA:
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    case actions.SET_INSIGHT_FILTERS:
      return state.set("filters", fromJS(payload));
    case actions.CLEAR_INSIGHT_FILTERS:
      return state.set("filters", fromJS({}));
    default:
      return state;
  }
};
