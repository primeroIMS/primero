import * as index from "./index";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/basic - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "generalFields",
      "generalForm",
      "optionsForm",
      "subform",
      "validationSchema",
      "visibilityFields",
      "visibilityForm"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
