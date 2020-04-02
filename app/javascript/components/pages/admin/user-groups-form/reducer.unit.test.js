import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";
import reducer from "./reducer";

describe("<UserGroupsForm /> - Reducers", () => {
  it("should handle FETCH_USER_GROUP_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_USER_GROUP_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_GROUP_FAILURE", () => {
    const expected = fromJS({ errors: true, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_USER_GROUP_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_GROUP_SUCCESS", () => {
    const expected = fromJS({
      selectedUserGroup: { id: 3 },
      errors: false,
      serverErrors: []
    });

    const action = {
      type: actions.FETCH_USER_GROUP_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducer(fromJS({ selectedUserGroup: {} }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_GROUP_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_USER_GROUP_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_SELECTED_USER_GROUP", () => {
    const expected = fromJS({
      selectedUserGroup: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_SELECTED_USER_GROUP,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
