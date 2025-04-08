// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<AdminFilters /> - pages/admin/components/filters/constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["FILTERS_DRAWER", "NAME"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
