// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";
import reducer from "./reducer";

describe("<UsersList /> - Reducers", () => {
  it("should handle USERS_FINISHED", () => {
    const expected = fromJS({
      loading: false
    });

    const action = {
      type: actions.USERS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle USERS_STARTED", () => {
    const expected = fromJS({
      loading: true
    });

    const action = {
      type: actions.USERS_STARTED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle USERS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.USERS_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SET_USERS_FILTER", () => {
    const filters = { user_name: "test" };

    const expected = fromJS({
      filters
    });

    const action = {
      type: actions.SET_USERS_FILTER,
      payload: { data: filters }
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
