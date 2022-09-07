import * as index from "./index";

describe("pages/admin/<FormBuilder>/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "ConditionDialog",
      "ConditionItem",
      "ConditionList",
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
      "SettingsForm",
      "SettingsTab",
      "SkipLogic",
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
