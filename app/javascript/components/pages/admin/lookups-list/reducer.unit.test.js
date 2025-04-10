// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";
import reducer from "./reducer";

describe("<LookupsList /> - pages/admin/lookups-list/reducer", () => {
  it("should handle FETCH_LOOKUPS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FETCH_LOOKUPS_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_LOOKUPS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.FETCH_LOOKUPS_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_LOOKUPS_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.FETCH_LOOKUPS_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_LOOKUPS_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.FETCH_LOOKUPS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_METADATA", () => {
    const expected = fromJS({
      metadata: DEFAULT_METADATA
    });

    const action = {
      type: actions.CLEAR_METADATA
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });
});
