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
      "tickboxFieldForm",
      "signatureFieldForm"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });

    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
