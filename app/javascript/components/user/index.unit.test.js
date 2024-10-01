// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
      "getCurrentUserUserGroups",
      "getIsAuthenticated",
      "getIsManagedReportScopeAll",
      "getManagedReportScope",
      "getPermissions",
      "getPermittedFormsIds",
      "getPermittedRoleUniqueIds",
      "getReportingLocationConfig",
      "getSavingPassword",
      "getServerErrors",
      "getUser",
      "getUserSavingRecord",
      "getUserProperty",
      "hasPrimeroModule",
      "hasUserPermissions",
      "reducer",
      "refreshToken",
      "resetPassword",
      "setAuthenticatedUser",
      "setUser",
      "showLoginDialog",
      "useRefreshUserToken",
      "saveNotificationSubscription",
      "removeNotificationSubscription",
      "getNotificationSubscription"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
