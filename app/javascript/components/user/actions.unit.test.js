import { expect } from "chai";

import { Actions } from "./actions";

describe("User - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...Actions };

    [
      "SET_AUTHENTICATED_USER",
      "FETCH_USER_DATA",
      "FETCH_USER_DATA_SUCCESS",
      "LOGOUT",
      "LOGOUT_STARTED",
      "LOGOUT_SUCCESS",
      "LOGOUT_FINISHED",
      "LOGOUT_FAILURE",
      "LOGOUT_SUCCESS_CALLBACK",
      "REFRESH_USER_TOKEN"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
