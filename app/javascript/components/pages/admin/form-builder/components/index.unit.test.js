import * as index from "./index";

describe("pages/admin/<FormBuilder>/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "CustomFieldDialog",
      "FieldDialog",
      "FieldTranslationsDialog",
      "FieldsList",
      "FormBuilderActionButtons",
      "FormTranslationsDialog",
      "TabPanel",
      "TranslationsForm"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
