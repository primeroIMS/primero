// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<BadgedIndicator /> - Index", () => {
  it("should have known constant", () => {
    const indexValues = { ...index };

    expect(indexValues).to.be.an("object");
    ["default"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
