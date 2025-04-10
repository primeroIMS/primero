// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<LookupsList /> pages/admin/lookups-list", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    expect(typeof clone).toEqual("object");

    ["NAME", "TABLE_OPTIONS"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
