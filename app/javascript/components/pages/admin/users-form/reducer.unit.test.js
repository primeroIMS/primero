import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

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

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_USER_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
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

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_USER_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_USER", () => {
    const expected = fromJS({
      selectedUser: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_SELECTED_USER,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_USER_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.SAVE_USER_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SAVE_USER_SUCCESS", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.SAVE_USER_SUCCESS,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
