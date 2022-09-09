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
      "getAppResources",
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
      "hasPrimeroModule",
      "hasUserPermissions",
      "reducer",
      "refreshToken",
      "resetPassword",
      "setAuthenticatedUser",
      "setUser",
      "showLoginDialog",
      "useRefreshUserToken"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
