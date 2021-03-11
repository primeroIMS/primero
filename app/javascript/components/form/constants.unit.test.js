import * as constants from "./constants";

describe("<Form /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    expect(clonedConstants).to.be.an("object");
    [
      "DIALOG_TRIGGER",
      "CHECK_BOX_FIELD",
      "CUSTOM_LOOKUPS",
      "DATE_FIELD",
      "ERROR_FIELD",
      "FORM_MODE_DIALOG",
      "FORM_MODE_EDIT",
      "FORM_MODE_NEW",
      "FORM_MODE_SHOW",
      "LABEL_FIELD",
      "LINK_FIELD",
      "NUMERIC_FIELD",
      "OPTION_TYPES",
      "ORDERABLE_OPTIONS_FIELD",
      "PARENT_FORM",
      "PHOTO_FIELD",
      "RADIO_FIELD",
      "SELECT_FIELD",
      "SEPARATOR",
      "SUBFORM_SECTION",
      "TEXT_AREA",
      "TEXT_FIELD",
      "TICK_FIELD",
      "TOGGLE_FIELD",
      "DOCUMENT_FIELD",
      "AUDIO_FIELD",
      "HIDDEN_FIELD",
      "SELECT_CHANGE_REASON"
    ].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });

  it("should have known properties for OPTION_TYPES", () => {
    const clonedOptionTypes = { ...constants.OPTION_TYPES };

    expect(clonedOptionTypes).to.be.an("object");

    [
      "AGENCY",
      "AGENCY_CURRENT_USER",
      "LOCATION",
      "MODULE",
      "FORM_GROUP",
      "LOOKUPS",
      "USER",
      "REPORTING_LOCATIONS",
      "ROLE",
      "USER_GROUP",
      "ROLE_EXTERNAL_REFERRAL",
      "REFER_TO_USERS",
      "SERVICE_TYPE",
      "FORM_GROUP_LOOKUP",
      "RECORD_FORMS"
    ].forEach(property => {
      expect(clonedOptionTypes).to.have.property(property);
      delete clonedOptionTypes[property];
    });

    expect(clonedOptionTypes).to.be.empty;
  });
});
