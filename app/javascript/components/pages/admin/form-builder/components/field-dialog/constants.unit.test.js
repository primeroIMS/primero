import * as constants from "./constants";

describe("pages/admin/<FormBuilder />/components/<FieldDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    [
      "ADMIN_FIELDS_DIALOG",
      "DATE_FIELD_CUSTOM_VALUES",
      "NAME",
      "FIELD_FORM",
      "FIELD_TRANSLATABLE_OPTIONS",
      "SUBFORM_TRANSLATABLE_OPTIONS",
      "RESET_OPTIONS"
    ].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
