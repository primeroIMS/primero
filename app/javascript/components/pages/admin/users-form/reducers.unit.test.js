import { fromJS } from "immutable";

import { expect } from "../../../../test/unit-test-helpers";

import actions from "./actions";
import { reducers } from "./reducers";

describe("<UsersForm /> - Reducers", () => {
  it("should handle FETCH_USER_STARTED", () => {
    const expected = fromJS({ loading: true, errors: [] });
    const action = {
      type: actions.FETCH_USER_STARTED,
      payload: true
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_FAILURE", () => {
    const expected = fromJS({ errors: [] });
    const action = {
      type: actions.FETCH_USER_FAILURE,
      payload: ["some error"]
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_SUCCESS", () => {
    const expected = fromJS({
      selectedUser: { id: 3 },
      errors: []
    });

    const action = {
      type: actions.FETCH_USER_SUCCESS,
      payload: { data: { id: 3 } }
    };

    const newState = reducers(fromJS({ selectedUser: {} }), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_USER_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_USER_FINISHED,
      payload: false
    };
    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
