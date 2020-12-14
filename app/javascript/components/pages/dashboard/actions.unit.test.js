import actions from "./actions";

describe("<Dashboard /> - Actions", () => {
  const clone = { ...actions };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
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
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
