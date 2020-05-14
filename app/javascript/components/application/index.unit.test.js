import * as index from "./index";

describe("<Application /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "ApplicationProvider",
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "getEnabledAgencies",
      "getResourceActions",
      "getSystemPermissions",
      "loadApplicationResources",
      "PERMISSIONS",
      "reducer",
      "RESOURCES",
      "RESOURCE_ACTIONS",
      "selectAgencies",
      "selectLocales",
      "selectModule",
      "selectModules",
      "selectUserIdle",
      "selectUserModules",
      "setNetworkStatus",
      "setUserIdle",
      "useApp"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
