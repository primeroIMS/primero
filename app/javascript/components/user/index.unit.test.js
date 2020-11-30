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
      "getIsAuthenticated",
      "getListHeaders",
      "getPermissions",
      "getPermissionsByRecord",
      "getPermittedFormsIds",
      "getReportingLocationConfig",
      "getServerErrors",
      "getUser",
      "getUserSavingRecord",
      "hasUserPermissions",
      "reducer",
      "refreshToken",
      "setAuthenticatedUser",
      "setUser",
      "usePermissions"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
