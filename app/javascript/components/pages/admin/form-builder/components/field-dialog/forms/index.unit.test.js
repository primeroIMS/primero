// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "dateFieldForm",
      "selectFieldForm",
      "separatorFieldForm",
      "subformField",
      "tallyFieldForm",
      "textFieldForm",
      "tickboxFieldForm"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
