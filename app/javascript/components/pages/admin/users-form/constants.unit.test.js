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
      "FORM_ID"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
