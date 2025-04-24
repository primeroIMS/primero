// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<ActivityLog /> - Reducers", () => {
  it("should handle FECTH_ACTIVITY_LOGS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FECTH_ACTIVITY_LOGS_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FECTH_ACTIVITY_LOGS_SUCCESS", () => {
    const expected = fromJS({
      data: [{ type: "transfer", record_id: "123", record_type: "recordType1" }],
      metadata: { total: 1 }
    });

    const action = {
      type: actions.FECTH_ACTIVITY_LOGS_SUCCESS,
      payload: { data: [{ type: "transfer", record_id: "123", record_type: "recordType1" }], metadata: { total: 1 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FECTH_ACTIVITY_LOGS_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.FECTH_ACTIVITY_LOGS_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FECTH_ACTIVITY_LOGS_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.FECTH_ACTIVITY_LOGS_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SET_ACTIVITY_LOGS_FILTER", () => {
    const expected = fromJS({
      filters: fromJS({ filter1: "value1" })
    });

    const action = {
      type: actions.SET_ACTIVITY_LOGS_FILTER,
      payload: { data: { filter1: "value1" } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });
});
