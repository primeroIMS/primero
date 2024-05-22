// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as violationItemConstants from "./constants";

describe("Verifying violationItem constant", () => {
  it("should have known constant", () => {
    const constants = { ...violationItemConstants };

    ["NAME", "VIOLATION_TALLY_FIELD"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
