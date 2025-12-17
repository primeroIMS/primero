// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { Map, fromJS } from "immutable";

import Actions from "./actions";
import NAMESPACE from "./namespace";

const DEFAULT_STATE = Map({});

const reducer = (state = DEFAULT_STATE, { type, payload }) => {
  switch (type) {
    case Actions.FETCH_UNUSED_FIELDS_STARTED:
      return state.set("loading", true).set("errors", false);
    case Actions.FETCH_UNUSED_FIELDS_SUCCESS:
      return state.set("data", fromJS(payload.data));
    case Actions.FETCH_UNUSED_FIELDS_FAILURE:
      return state.set("loading", false).set("errors", true);
    case Actions.FETCH_UNUSED_FIELDS_FINISHED:
      return state.set("loading", false);
    default:
      return state;
  }
};

export default { [NAMESPACE]: reducer };
