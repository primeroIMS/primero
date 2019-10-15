import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducers";

chai.use(chaiImmutable);

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
    const newState = r.reducers.user(default_state, action);
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
    const newState = r.reducers.user(default_state, action);
    expect(newState).to.deep.equal(expected);
  });
});
