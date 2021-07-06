import { fromJS } from "immutable";

import { DEFAULT_METADATA } from "../../../../config";

import actions from "./actions";
import reducer from "./reducer";

describe("<RolesList /> - Reducers", () => {
  it("should handle ROLES_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.ROLES_STARTED,
      payload: true
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ROLES_SUCCESS", () => {
    const expected = fromJS({
      data: [{ id: 3 }],
      metadata: { per: 20 }
    });

    const action = {
      type: actions.ROLES_SUCCESS,
      payload: { data: [{ id: 3 }], metadata: { per: 20 } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ROLES_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.ROLES_FAILURE
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle ROLES_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.ROLES_FINISHED
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle CLEAR_METADATA", () => {
    const expected = fromJS({
      metadata: DEFAULT_METADATA
    });

    const action = {
      type: actions.CLEAR_METADATA
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_ROLES_FILTER", () => {
    const expected = fromJS({
      filters: fromJS({ disabled: ["true", "false"] })
    });

    const action = {
      type: actions.SET_ROLES_FILTER,
      payload: { data: { disabled: ["true", "false"] } }
    };

    const newState = reducer(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
