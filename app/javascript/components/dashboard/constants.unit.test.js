import { expect } from "chai";

import * as dashboardConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...dashboardConstants };

    ["FROM_DASHBOARD_PARAMS"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
