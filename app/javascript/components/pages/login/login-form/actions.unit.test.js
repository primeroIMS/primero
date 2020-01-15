import { expect } from "chai";

import * as actions from "./actions";

describe("<LoginForm /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "LOGIN",
      "LOGIN_STARTED",
      "LOGIN_SUCCESS",
      "LOGIN_FINISHED",
      "LOGIN_FAILURE",
      "LOGIN_SUCCESS_CALLBACK"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
