// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducers from "./reducer";

describe("<RolesForm /> - Reducers", () => {
  it("should handle FETCH_ROLE_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_ROLE_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLE_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_ROLE_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLE_SUCCESS", () => {
    const expected = fromJS({
      selectedRole: { id: 3 },
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_ROLE_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducers(fromJS({ selectedRole: {} }), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_ROLE_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_ROLE_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_SELECTED_ROLE", () => {
    const expected = fromJS({
      selectedRole: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_SELECTED_ROLE,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_ROLE_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.SAVE_ROLE_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_ROLE_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_ROLE_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_ROLE_FINISHED", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.SAVE_ROLE_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should return the same state if action is unknown", () => {
    const expected = fromJS({});
    const action = {
      type: "roles/unknown",
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SET_COPY_ROLE", () => {
    const payload = {
      name: "Copy of Test Role"
    };
    const expected = fromJS({
      copiedRole: payload
    });
    const action = {
      type: actions.SET_COPY_ROLE,
      payload
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_COPY_ROLE", () => {
    const payload = {
      name: "Copy of Test Role"
    };

    const expected = fromJS({});
    const state = fromJS({
      copiedRole: payload
    });

    const action = {
      type: actions.CLEAR_COPY_ROLE
    };
    const newState = reducers(state, action);

    expect(newState).toEqual(expected);
  });
});
