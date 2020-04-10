import * as index from "./index";

describe("User - index", () => {
  const indexValues = { ...index };

  it("should have known exported properties", () => {
    [
      "Actions",
      "attemptSignout",
      "checkUserAuthentication",
      "currentUser",
      "fetchAuthenticatedUserData",
      "getPermissions",
      "getPermissionsByRecord",
      "hasUserPermissions",
      "reducer",
      "refreshToken",
      "setAuthenticatedUser",
      "setUser",
      "usePermissions",
      "getIsAuthenticated",
      "getListHeaders"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
