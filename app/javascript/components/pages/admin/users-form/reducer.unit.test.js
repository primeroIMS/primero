// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("<UsersForm /> - Reducers", () => {
  it("should handle FETCH_USER_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_USER_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_FAILURE", () => {
    const expected = fromJS({ errors: true, saving: false, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_USER_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_SUCCESS", () => {
    const expected = fromJS({
      selectedUser: { id: 3 },
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_USER_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducer(fromJS({ selectedUser: {} }), action);

    expect(newState).toEqual(expected);
  });

  it("should handle FETCH_USER_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_USER_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_SELECTED_USER", () => {
    const expected = fromJS({
      selectedUser: {},
      errors: false,
      serverErrors: [],
      userSaved: false
    });
    const action = {
      type: actions.CLEAR_SELECTED_USER,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle CLEAR_RECORDS_UPDATE", () => {
    const expected = fromJS({});
    const action = {
      type: actions.CLEAR_RECORDS_UPDATE
    };
    const newState = reducer(fromJS({ recordsUpdate: true }), action);

    expect(newState).toEqual(expected);
  });

  it("should handle RECORDS_UPDATE", () => {
    const expected = fromJS({
      recordsUpdate: true
    });
    const action = {
      type: actions.RECORDS_UPDATE,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_USER_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_USER_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_USER_SUCCESS", () => {
    const expected = fromJS({
      saving: false,
      metadata: {
        total_enabled: 50
      },
      userSaved: true
    });
    const action = {
      type: actions.SAVE_USER_SUCCESS,
      payload: {
        metadata: {
          total_enabled: 50
        }
      }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle SAVE_USER_FAILURE", () => {
    const expected = fromJS({ errors: true, saving: false, serverErrors: ["some error"] });
    const action = {
      type: actions.SAVE_USER_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle NEW_PASSWORD_RESET_REQUEST_STARTED", () => {
    const expected = fromJS({ newPasswordReset: { saving: true } });
    const action = { type: actions.NEW_PASSWORD_RESET_REQUEST_STARTED };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle NEW_PASSWORD_RESET_REQUEST_SUCCESS", () => {
    const expected = fromJS({ newPasswordReset: { saving: false } });
    const action = { type: actions.NEW_PASSWORD_RESET_REQUEST_SUCCESS };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle NEW_PASSWORD_RESET_REQUEST_FAILURE", () => {
    const expected = fromJS({ newPasswordReset: { saving: false } });
    const action = { type: actions.NEW_PASSWORD_RESET_REQUEST_FAILURE };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle NEW_PASSWORD_RESET_REQUEST_FINISHED", () => {
    const expected = fromJS({ newPasswordReset: { saving: false } });
    const action = { type: actions.NEW_PASSWORD_RESET_REQUEST_FINISHED };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle PASSWORD_RESET_REQUEST_STARTED", () => {
    const expected = fromJS({ passwordResetRequest: { loading: true } });
    const action = {
      type: actions.PASSWORD_RESET_REQUEST_STARTED
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle PASSWORD_RESET_REQUEST_SUCCESS", () => {
    const expected = fromJS({ passwordResetRequest: { loading: false } });
    const action = {
      type: actions.PASSWORD_RESET_REQUEST_SUCCESS
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle PASSWORD_RESET_REQUEST_FAILURE", () => {
    const expected = fromJS({ passwordResetRequest: { loading: false } });
    const action = {
      type: actions.PASSWORD_RESET_REQUEST_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });

  it("should handle PASSWORD_RESET_REQUEST_FINISHED", () => {
    const expected = fromJS({ passwordResetRequest: { loading: false } });
    const action = {
      type: actions.PASSWORD_RESET_REQUEST_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).toEqual(expected);
  });
});
