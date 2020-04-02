import { expect } from "chai";
import { fromJS } from "immutable";

import reducer from "./reducer";

describe("<LoginForm /> - Reducers", () => {
  const defaultState = fromJS({
    module: "primero",
    agency: "unicef",
    isAuthenticated: false
  });

  it("should handle LOGIN_STARTED", () => {
    const expected = fromJS({
      module: "primero",
      agency: "unicef",
      isAuthenticated: false,
      error: null
    });
    const action = {
      type: "user/LOGIN_STARTED",
      payload: {
        error: null
      }
    };
    const newState = reducer.user(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOGIN_FAILURE", () => {
    const expected = fromJS({
      module: "primero",
      agency: "unicef",
      isAuthenticated: false,
      error: "Invalid User name or password."
    });
    const action = {
      type: "user/LOGIN_FAILURE",
      payload: {
        error: "Invalid User name or password."
      }
    };
    const newState = reducer.user(defaultState, action);

    expect(newState).to.deep.equal(expected);
  });
});
