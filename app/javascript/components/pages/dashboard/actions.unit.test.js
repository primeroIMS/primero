import { expect } from "chai";
import clone from "lodash/clone";

import * as Actions from "./actions";

describe("<Dashboard /> - Actions", () => {
  const actions = clone(Actions);

  it("should have known properties", () => {
    expect(actions).to.be.an("object");
    [
      "DASHBOARD_FLAGS",
      "CASES_BY_CASE_WORKER",
      "CASES_BY_STATUS",
      "CASES_REGISTRATION",
      "CASES_OVERVIEW",
      "DASHBOARDS",
      "DASHBOARDS_STARTED",
      "DASHBOARDS_SUCCESS",
      "DASHBOARDS_FINISHED",
      "DASHBOARDS_FAILURE",
      "OPEN_PAGE_ACTIONS",
      "SERVICES_STATUS"
    ].forEach(property => {
      expect(actions).to.have.property(property);
      delete actions[property];
    });

    expect(actions).to.be.empty;
  });
});
