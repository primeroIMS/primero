import { expect } from "chai";

import actions from "./actions";

describe("Application - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = { ...actions };

    [
      "FETCH_SYSTEM_PERMISSIONS",
      "FETCH_SYSTEM_PERMISSIONS_FAILURE",
      "FETCH_SYSTEM_PERMISSIONS_FINISHED",
      "FETCH_SYSTEM_PERMISSIONS_STARTED",
      "FETCH_SYSTEM_PERMISSIONS_SUCCESS",
      "FETCH_SYSTEM_SETTINGS",
      "FETCH_SYSTEM_SETTINGS_SUCCESS",
      "NETWORK_STATUS",
      "SET_USER_IDLE"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      expect(cloneActions[property]).to.be.a("string");
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
