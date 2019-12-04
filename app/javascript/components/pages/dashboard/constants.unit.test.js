import { expect } from "chai";

import * as dashboardPagesConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...dashboardPagesConstants };

    ["DASHBOARD_NAMES"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
