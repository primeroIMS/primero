// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as drawerConstants from "./constants";

describe("Verifying violationActions constant", () => {
  it("should have known constant", () => {
    const constants = { ...drawerConstants };

    ["NAME"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
