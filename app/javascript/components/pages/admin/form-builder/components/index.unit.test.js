import * as index from "./index";

describe("pages/admin/<FormBuilder>/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "CustomFieldDialog",
      "FieldDialog",
      "FieldDialogLabel",
      "FieldTranslationsDialog",
      "Fields",
      "FieldsForm",
      "FieldsList",
      "FieldsTab",
      "FormBuilderActionButtons",
      "FormTranslationsDialog",
      "SettingsTab",
      "SubformFieldsList",
      "TabPanel",
      "TranslationsForm",
      "TranslationsNote",
      "TranslationsTab"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
