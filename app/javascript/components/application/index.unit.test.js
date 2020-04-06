import { expect } from "../../test";

import * as index from "./index";

describe("<Application /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "fetchSystemSettings",
      "fetchSystemPermissions",
      "loadApplicationResources",
      "setNetworkStatus",
      "setUserIdle",
      "ApplicationProvider",
      "useApp",
      "reducers",
      "selectAgencies",
      "getAgenciesWithService",
      "selectModules",
      "selectModule",
      "selectLocales",
      "selectUserIdle",
      "selectUserModules",
      "getSystemPermissions",
      "getResourceActions"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
