// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<BadgedIndicator /> - Index", () => {
  it("should have known constant", () => {
    const indexValues = { ...index };

    expect(typeof indexValues).toEqual("object");
    ["default"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });

    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
