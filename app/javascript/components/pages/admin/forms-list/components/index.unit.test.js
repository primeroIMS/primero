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
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
