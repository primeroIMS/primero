// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as componentConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...componentConstants };

    ["NAME"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
