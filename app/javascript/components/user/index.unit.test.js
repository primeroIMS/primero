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
      "getCodeOfConductAccepteOn",
      "getCodeOfConductId",
      "getIsAuthenticated",
      "getListHeaders",
      "getPermissions",
      "getPermissionsByRecord",
      "getPermittedFormsIds",
      "getReportingLocationConfig",
      "getSavingPassword",
      "getServerErrors",
      "getUser",
      "getUserLocationsByAdminLevel",
      "getUserSavingRecord",
      "hasUserPermissions",
      "reducer",
      "refreshToken",
      "resetPassword",
      "setAuthenticatedUser",
      "setUser",
      "usePermissions",
      "useRefreshUserToken",
      "getCurrentUserGroupPermission",
      "getCurrentUserGroupsUniqueIds",
      "getAssignedAgency"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
