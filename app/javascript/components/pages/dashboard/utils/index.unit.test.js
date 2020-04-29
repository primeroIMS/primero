import clone from "lodash/clone";

import * as index from "./index";

describe("index - pages/dashboard/utils/", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "dashboardType",
      "permittedSharedWithMe",
      "taskOverdueHasData",
      "teamSharingTable",
      "toApprovalsManager",
      "toData1D",
      "toListTable",
      "toProtectionConcernTable",
      "toReportingLocationTable",
      "toTasksOverdueTable"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
