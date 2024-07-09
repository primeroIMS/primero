// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as index from "./index";

describe("<Dashboard /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "default",
      "namespace",
      "reducer",
      "selectFlags",
      "selectCasesByStatus",
      "selectCasesByCaseWorker",
      "selectCasesRegistration",
      "selectCasesOverview",
      "selectServicesStatus",
      "selectIsOpenPageActions",
      "fetchDashboards",
      "DASHBOARD_NAMES"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
