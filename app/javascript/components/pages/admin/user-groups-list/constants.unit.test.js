// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<UserGroupsList /> - Constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    expect(typeof clonedConstants).toEqual("object");

    ["AGENCY_UNIQUE_IDS", "DISABLED", "NAME", "MANAGED"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
