import { fromJS } from "immutable";

import actions from "./actions";
import reducer from "./reducer";

describe("pages/account/reducer.js", () => {
  it("should handle FETCH_CURRENT_USER_STARTED", () => {
    const expected = fromJS({ loading: true, errors: false, serverErrors: [] });
    const action = {
      type: actions.FETCH_CURRENT_USER_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CURRENT_USER_FAILURE", () => {
    const expected = fromJS({ errors: true, saving: false, serverErrors: ["some error"] });
    const action = {
      type: actions.FETCH_CURRENT_USER_FAILURE,
      payload: { errors: ["some error"] }
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CURRENT_USER_SUCCESS", () => {
    const expected = fromJS({
      id: 3,
      errors: false,
      serverErrors: [],
      role_id: 1
    });

    const action = {
      type: actions.FETCH_CURRENT_USER_SUCCESS,
      payload: { data: { id: 3, role_id: 1 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_CURRENT_USER_FINISHED", () => {
    const expected = fromJS({ loading: false });
    const action = {
      type: actions.FETCH_CURRENT_USER_FINISHED,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_CURRENT_USER", () => {
    const expected = fromJS({
      user: {},
      errors: false,
      serverErrors: []
    });
    const action = {
      type: actions.CLEAR_CURRENT_USER,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle UPDATE_CURRENT_USER_STARTED", () => {
    const expected = fromJS({ saving: true });
    const action = {
      type: actions.UPDATE_CURRENT_USER_STARTED,
      payload: true
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle UPDATE_CURRENT_USER_SUCCESS", () => {
    const expected = fromJS({ saving: false });
    const action = {
      type: actions.UPDATE_CURRENT_USER_SUCCESS,
      payload: false
    };
    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
