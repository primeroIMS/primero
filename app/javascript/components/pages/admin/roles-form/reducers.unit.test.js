import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";
import { reducers } from "./reducers";

describe("<RolesForm /> - Reducers", () => {
  it("should handle FETCH_ROLE_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_ROLE_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_ROLE_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_ROLE_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
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

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_ROLE_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_ROLE_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
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

    expect(newState).to.deep.equal(expected);
  });
});
