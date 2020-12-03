import * as userConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...userConstants };

    [
      "IDENTITY_PROVIDER_ID",
      "PASSWORD_MODAL",
      "ROLE_OPTIONS",
      "USERGROUP_PRIMERO_GBV",
      "USER_CONFIRMATION_DIALOG",
      "USER_GROUP_UNIQUE_IDS"
    ].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
