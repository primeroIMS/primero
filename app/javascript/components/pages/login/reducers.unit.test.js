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

  it("should handle SET_STYLE", () => {
    const expected = Map({
      module: "gbv",
      agency: "unicef",
      isAuthenticated: false
    });
    const action = {
      type: "user/SET_STYLE",
      payload: {
        module: "gbv",
        agency: "unicef"
      }
    };
    const newState = r.reducers.user(default_state, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle SET_AUTH", () => {
    const expected = Map({
      module: "primero",
      agency: "unicef",
      isAuthenticated: undefined,
      username: undefined
    });
    const action = {
      type: "user/SET_AUTH",
      payload: true
    };
    const newState = r.reducers.user(default_state, action);
    expect(newState).to.deep.equal(expected);
  });

  it("should handle LOGIN_SUCCESS", () => {
    const expected = Map({
      module: "primero",
      agency: "unicef",
      isAuthenticated: true,
      username: "primero"
    });
    const action = {
      type: "user/LOGIN_SUCCESS",
      payload: {
        user_name: "primero"
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
      messages: Map({
        error: "Invalid User name or password."
      })
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

  it("should handle LOGOUT_SUCCESS", () => {
    const expected = Map({
      module: "primero",
      agency: "unicef",
      isAuthenticated: false,
      username: null
    });
    const action = {
      type: "user/LOGOUT_SUCCESS"
    };
    const newState = r.reducers.user(default_state, action);
    expect(newState).to.deep.equal(expected);
  });
});
