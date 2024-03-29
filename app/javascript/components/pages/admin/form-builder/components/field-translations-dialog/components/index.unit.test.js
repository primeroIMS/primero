// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<FieldTranslationsDialog>/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["TranslatableOptions"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
