// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("<Form /> - Utils", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "buildLinkedIncidentOptions",
      "buildRoleOptions",
      "get",
      "notPropagatedOnSubmit",
      "notVisible",
      "optionText",
      "submitHandler",
      "touchedFormData",
      "valueParser",
      "whichFormMode"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
