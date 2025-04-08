// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<RecordOwner /> - constants", () => {
  it("should have known constant", () => {
    const constantsValues = { ...constants };

    ["FIELDS", "NAME"].forEach(property => {
      expect(constantsValues).toHaveProperty(property);

      delete constantsValues[property];
    });

    expect(Object.keys(constantsValues)).toHaveLength(0);
  });
});
