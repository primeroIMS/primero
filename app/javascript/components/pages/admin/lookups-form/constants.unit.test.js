// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<LookupForms /> - constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    ["NAME", "LOOKUP_NAME", "LOOKUP_VALUES"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
