// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("pages/admin/<FormBuilder />/components/<ClearButtons /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["GROUP_BY", "NAME", "SORT_BY"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
