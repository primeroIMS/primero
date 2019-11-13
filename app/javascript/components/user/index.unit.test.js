import { expect } from "chai";

import * as index from "./index";

describe("User - index", () => {
  const indexValues = { ...index };

  it("should have known exported properties", () => {
    [
      "setUser",
      "fetchAuthenticatedUserData",
      "setAuthenticatedUser",
      "attemptSignout",
      "checkUserAuthentication",
      "refreshToken",
      "reducers",
      "Actions",
      "currentUser",
      "getPermissionsByRecord",
      "hasUserPermissions",
      "getPermissions"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
