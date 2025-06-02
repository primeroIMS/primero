// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import * as index from "./index";

describe("index - pages/dashboard/utils/", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
    [
      "dashboardType",
      "filterIndicatorsByKey",
      "permittedSharedWithMe",
      "teamSharingTable",
      "toApprovalsManager",
      "toCasesBySocialWorkerTable",
      "toCasesToAssignTable",
      "toData1D",
      "toListTable",
      "toProtectionConcernTable",
      "toReportingLocationTable",
      "toTasksOverdueTable"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });

    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
