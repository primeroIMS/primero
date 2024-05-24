// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("pages/admin - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default", "NAME"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
