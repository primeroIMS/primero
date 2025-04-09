// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as index from "./index";

describe("<Dashboard /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
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
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
