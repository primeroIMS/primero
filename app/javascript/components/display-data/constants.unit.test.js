// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as displayDataConstants from "./constants";

describe("<DisplayData /> - Constants", () => {
  it("should have known constant", () => {
    const constants = { ...displayDataConstants };

    ["NAME"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
