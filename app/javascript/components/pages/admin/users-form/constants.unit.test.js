import * as userConstants from "./constants";

describe("Verifying user constant", () => {
  it("should have known constant", () => {
    const constants = { ...userConstants };

    [
      "IDENTITY_PROVIDER_ID",
      "PASSWORD_MODAL",
      "PASSWORD_SELF_OPTION",
      "PASSWORD_USER_OPTION",
      "ROLE_OPTIONS",
      "USERGROUP_PRIMERO_GBV",
      "USER_CONFIRMATION_DIALOG",
      "USER_GROUP_UNIQUE_IDS",
      "FIELD_NAMES",
      "FORM_ID"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});

describe("values", () => {
  it("should have valid values for constants", () => {
    const constants = { ...userConstants };

    expect(constants.FIELD_NAMES).to.have.all.keys(
      "FULL_NAME",
      "USER_NAME",
      "CODE",
      "PASSWORD_SETTING",
      "PASSWORD",
      "PASSWORD_CONFIRMATION",
      "CHANGE_PASSWORD",
      "LOCALE",
      "ROLE_UNIQUE_ID",
      "USER_GROUP_UNIQUE_IDS",
      "SERVICES",
      "PHONE",
      "EMAIL",
      "AGENCY_ID",
      "AGENCY_OFFICE",
      "POSITION",
      "LOCATION",
      "DISABLED",
      "SEND_MAIL"
    );
  });
});
