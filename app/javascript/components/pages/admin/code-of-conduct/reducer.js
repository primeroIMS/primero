// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";

const DEFAULT_STATE = fromJS({});

export default (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case actions.FETCH_CODE_OF_CONDUCT_STARTED:
    case actions.SAVE_CODE_OF_CONDUCT_STARTED:
      return state.set("loading", true).set("errors", false).set("fetchErrors", fromJS([]));
    case actions.FETCH_CODE_OF_CONDUCT_SUCCESS:
    case actions.SAVE_CODE_OF_CONDUCT_SUCCESS:
      return state.set("data", fromJS(payload.data));
    case actions.SAVE_CODE_OF_CONDUCT_FAILURE: {
      return state.set("loading", false).set("errors", true);
    }
    case actions.FETCH_CODE_OF_CONDUCT_FAILURE: {
      const failureState = state.set("loading", false).set("errors", true);

      if (payload.errors) {
        return failureState.set("fetchErrors", fromJS(payload.errors));
      }

      return failureState;
    }
    case actions.FETCH_CODE_OF_CONDUCT_FINISHED:
    case actions.SAVE_CODE_OF_CONDUCT_FINISHED:
      return state.set("loading", false);
    default:
      return state;
  }
};
