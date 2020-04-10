import { expect } from "../../test";

import * as index from "./index";

describe("<Application /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "ApplicationProvider",
      "fetchSystemPermissions",
      "fetchSystemSettings",
      "getAgenciesWithService",
      "getResourceActions",
      "getSystemPermissions",
      "loadApplicationResources",
      "reducer",
      "PERMISSIONS",
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
