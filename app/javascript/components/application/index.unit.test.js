import * as index from "./index";

describe("<Application /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "fetchRoles",
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "fetchUserGroups",
      "getEnabledAgencies",
      "getEnabledUserGroups",
      "getResourceActions",
      "getSystemPermissions",
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
      "ApplicationProvider"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
