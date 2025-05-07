// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import actions from "./actions";

describe("<Dashboard /> - Actions", () => {
  const clone = { ...actions };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "CASES_BY_CASE_WORKER",
      "CASES_BY_STATUS",
      "CASES_REGISTRATION",
      "CASES_OVERVIEW",
      "DASHBOARDS",
      "DASHBOARDS_STARTED",
      "DASHBOARDS_SUCCESS",
      "DASHBOARDS_FINISHED",
      "DASHBOARDS_FAILURE",
      "DASHBOARD_FLAGS",
      "DASHBOARD_FLAGS_STARTED",
      "DASHBOARD_FLAGS_SUCCESS",
      "DASHBOARD_FLAGS_FINISHED",
      "DASHBOARD_FLAGS_FAILURE",
      "OPEN_PAGE_ACTIONS",
      "SERVICES_STATUS"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
