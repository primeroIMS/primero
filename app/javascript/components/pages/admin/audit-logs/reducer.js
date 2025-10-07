// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import { DATA, ERRORS, LOADING, METADATA } from "./constants";
import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  const filtersPath = key => ["users", key];

  switch (type) {
    case actions.FETCH_AUDIT_LOGS_FAILURE:
      return state.set(ERRORS, true).set(LOADING, false);
    case actions.FETCH_AUDIT_LOGS_FINISHED:
      return state.set(ERRORS, false).set(LOADING, false);
    case actions.FETCH_AUDIT_LOGS_STARTED:
      return state.set(LOADING, fromJS(payload)).set(ERRORS, false);
    case actions.FETCH_AUDIT_LOGS_SUCCESS:
      return state.set(DATA, fromJS(payload.data)).set(METADATA, fromJS(payload.metadata));
    case actions.FETCH_PERFORMED_BY_FAILURE:
      return state.setIn(filtersPath(ERRORS), true).setIn(filtersPath(LOADING), false);
    case actions.FETCH_PERFORMED_BY_FINISHED:
      return state.setIn(filtersPath(ERRORS), false).setIn(filtersPath(LOADING), false);
    case actions.FETCH_PERFORMED_BY_SUCCESS:
      return state
        .setIn(filtersPath(DATA), fromJS(payload.data))
        .setIn(filtersPath(METADATA), fromJS(payload.metadata));
    case actions.SET_AUDIT_LOGS_FILTER:
      return state.set("filters", fromJS(payload.data));
    case actions.CLEAR_METADATA: {
      return state.set("metadata", fromJS(DEFAULT_METADATA));
    }
    default:
      return state;
  }
};
