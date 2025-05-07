// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Map, fromJS } from "immutable";

import reducer from "./reducer";
import { SET_FILTERS } from "./actions";

describe("<IndexFilters /> - Reducers", () => {
  const namespace = "Cases";

  const defaultState = Map({});

  it("should handle SET_FILTERS", () => {
    const payload = { filter1: true };
    const action = {
      type: `${namespace}/${SET_FILTERS}`,
      payload
    };
    const newState = reducer(namespace)(defaultState, action);

    expect(newState.get("filters")).toEqual(fromJS(payload));
  });
});
