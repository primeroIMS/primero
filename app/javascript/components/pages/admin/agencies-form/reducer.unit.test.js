// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<AgenciesForm /> - Reducers", () => {
  it("should handle FETCH_AGENCY_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_AGENCY_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_AGENCY_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_AGENCY_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_AGENCY_SUCCESS", () => {
    const expected = fromJS({
      selectedAgency: { id: 3 },
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_AGENCY_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducer(fromJS({ selectedAgency: {} }), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_AGENCY_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_AGENCY_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_SELECTED_AGENCY", () => {
    const expected = fromJS({
      selectedAgency: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_SELECTED_AGENCY,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_AGENCY_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_AGENCY_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_AGENCY_FINISHED", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.SAVE_AGENCY_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });
});
