// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["NAME", "FORM_ID", "LEGITIMATE_BASIS"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
