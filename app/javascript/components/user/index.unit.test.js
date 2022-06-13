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
      "getAssignedAgency",
      "getCodeOfConductAccepteOn",
      "getCodeOfConductId",
      "getCurrentUserGroupPermission",
      "getCurrentUserGroupsUniqueIds",
      "getIsAuthenticated",
      "getListHeaders",
      "getPermissions",
      "getPermittedFormsIds",
      "getPermittedRoleUniqueIds",
      "getReportingLocationConfig",
      "getSavingPassword",
      "getServerErrors",
      "getUser",
      "getUserSavingRecord",
      "hasUserPermissions",
      "reducer",
      "refreshToken",
      "resetPassword",
      "setAuthenticatedUser",
      "setUser",
      "useRefreshUserToken",
      "showLoginDialog",
      "getAppResources"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
