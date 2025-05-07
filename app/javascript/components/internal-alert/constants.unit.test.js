// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    ["NAME", "SEVERITY"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });

  it("should have known the SEVERITY properties ", () => {
    const clonedProps = { ...constants.SEVERITY };

    ["error", "info", "success", "warning"].forEach(property => {
      expect(clonedProps).toHaveProperty(property);
      delete clonedProps[property];
    });

    expect(Object.keys(clonedProps)).toHaveLength(0);
  });
});
