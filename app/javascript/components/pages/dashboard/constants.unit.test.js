import { expect } from "chai";

import * as dashboardPagesConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...dashboardPagesConstants };

    ["DASHBOARD_NAMES"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    ["INDICATOR_NAMES"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });

  it("should have correct constant value", () => {
    const constants = { ...dashboardPagesConstants };

    expect(constants.DASHBOARD_NAMES).to.have.all.keys(
      "CASE_RISK",
      "WORKFLOW",
      "APPROVALS_ASSESSMENT",
      "APPROVALS_CASE_PLAN",
      "APPROVALS_CLOSURE",
      "REPORTING_LOCATION",
      "WORKFLOW_TEAM"
    );

    expect(constants.INDICATOR_NAMES).to.have.all.keys(
      "RISK_LEVEL",
      "WORKFLOW",
      "WORKFLOW_TEAM",
      "REPORTING_LOCATION_OPEN",
      "REPORTING_LOCATION_OPEN_LAST_WEEK",
      "REPORTING_LOCATION_OPEN_THIS_WEEK",
      "REPORTING_LOCATION_ClOSED_LAST_WEEK",
      "REPORTING_LOCATION_ClOSED_THIS_WEEK"
    );
  });
});
