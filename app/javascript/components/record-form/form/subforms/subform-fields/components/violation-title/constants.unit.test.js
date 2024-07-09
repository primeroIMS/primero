// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as violationTitleConstants from "./constants";

describe("Verifying violationTitle constant", () => {
  it("should have known constant", () => {
    const constants = { ...violationTitleConstants };

    ["NAME", "VIOLATION_STATUS"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
