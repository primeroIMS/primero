// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<RecordList /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");

    [
      "buildTableColumns",
      "default",
      "getAppliedFilters",
      "getMetadata",
      "SET_PAGINATION",
      "RECORDS",
      "RECORDS_FAILURE",
      "RECORDS_FINISHED",
      "RECORDS_STARTED",
      "RECORDS_SUCCESS"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
