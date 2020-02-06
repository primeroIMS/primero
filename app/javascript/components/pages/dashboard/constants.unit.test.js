import { expect } from "chai";

import * as constants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    [
      "DASHBOARD_NAMES",
      "INDICATOR_NAMES",
      "WORKFLOW_ORDER_NAMES",
      "PROTECTION_CONCERNS_ORDER_NAMES"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });

  it("should have correct constant value", () => {
    const clone = { ...constants };

    expect(clone.DASHBOARD_NAMES).to.have.all.keys(
      "CASE_RISK",
      "WORKFLOW",
      "APPROVALS_ASSESSMENT",
      "APPROVALS_ASSESSMENT_PENDING",
      "APPROVALS_CASE_PLAN",
      "APPROVALS_CASE_PLAN_PENDING",
      "APPROVALS_CLOSURE",
      "APPROVALS_CLOSURE_PENDING",
      "REPORTING_LOCATION",
      "WORKFLOW_TEAM",
      "PROTECTION_CONCERNS",
      "CASES_BY_TASK_OVERDUE_ASSESSMENT",
      "CASES_BY_TASK_OVERDUE_CASE_PLAN",
      "CASES_BY_TASK_OVERDUE_SERVICES",
      "CASES_BY_TASK_OVERDUE_FOLLOWUPS"
    );

    expect(clone.INDICATOR_NAMES).to.have.all.keys(
      "RISK_LEVEL",
      "WORKFLOW",
      "WORKFLOW_TEAM",
      "REPORTING_LOCATION_OPEN",
      "REPORTING_LOCATION_OPEN_LAST_WEEK",
      "REPORTING_LOCATION_OPEN_THIS_WEEK",
      "REPORTING_LOCATION_ClOSED_LAST_WEEK",
      "REPORTING_LOCATION_ClOSED_THIS_WEEK",
      "PROTECTION_CONCERNS_ALL_CASES",
      "PROTECTION_CONCERNS_NEW_THIS_WEEK",
      "PROTECTION_CONCERNS_CLOSED_THIS_WEEK",
      "PROTECTION_CONCERNS_OPEN_CASES"
    );

    expect(clone.PROTECTION_CONCERNS_ORDER_NAMES).to.be.an("array");
  });
});
