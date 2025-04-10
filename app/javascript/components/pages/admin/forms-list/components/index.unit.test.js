// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("pages/admin/<FormList>/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "DragIndicator",
      "FilterInput",
      "FiltersExpansionPanel",
      "FormFilters",
      "FormGroup",
      "FormGroupList",
      "FormSection",
      "FormSectionList",
      "ReorderActions",
      "TableRow"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
