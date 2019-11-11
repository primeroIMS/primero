import { expect } from "chai";
import { Map } from "immutable";

import { reducers } from "./reducers";

describe("<Login /> - Reducers", () => {

  const default_state = Map({
    module: "primero",
    agency: "unicef",
    isAuthenticated: false
  });

  it("should handle LOGIN_STARTED", () => {
    const expected = Map({
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
    const newState = reducers.user(default_state, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOGIN_FAILURE", () => {
    const expected = Map({
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
    const newState = reducers.user(default_state, action);
    expect(newState).to.deep.equal(expected);
  });
});
