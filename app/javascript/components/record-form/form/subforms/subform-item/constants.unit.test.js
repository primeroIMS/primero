// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as subformItemConstants from "./constants";

describe("Verifying subformItem constant", () => {
  it("should have known constant", () => {
    const constants = { ...subformItemConstants };

    [
      "NAME",
      "ORDER_OF_FORMS",
      "VIOLATION_TALLY",
      "VIOLATION_TALLY_ESTIMATED",
      "VIOLATIONS_FIELDS",
      "DENIAL_HUMANITARIAN_ACCESS"
    ].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
