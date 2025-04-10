// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Application /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
    [
      "fetchRoles",
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "fetchUserGroups",
      "getEnabledAgencies",
      "getEnabledUserGroups",
      "getResourceActions",
      "getSystemPermissions",
      "getWorkflowLabels",
      "loadApplicationResources",
      "PERMISSIONS",
      "reducer",
      "RESOURCES",
      "RESOURCE_ACTIONS",
      "selectAgencies",
      "getAgency",
      "getUserGroups",
      "selectLocales",
      "selectModule",
      "selectModules",
      "selectUserIdle",
      "selectUserModules",
      "setUserIdle",
      "useApp",
      "ApplicationProvider",
      "getAppData",
      "getWebpushConfig",
      "getListHeaders"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
