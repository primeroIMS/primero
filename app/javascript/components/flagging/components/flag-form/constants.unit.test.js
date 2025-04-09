// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("FlagForm - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["NAME", "MAX_LENGTH_FLAG_REASON"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(Object.keys(clonedConstants)).toHaveLength(0);
  });
});
