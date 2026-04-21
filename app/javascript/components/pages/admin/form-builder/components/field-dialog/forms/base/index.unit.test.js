import * as index from "./index";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms/basic - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "generalFields",
      "generalForm",
      "optionsForm",
      "subform",
      "subformFields",
      "validationSchema",
      "visibilityFields",
      "visibilityForm"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
