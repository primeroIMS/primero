import * as constants from "./constants";

describe("pages/password-reset - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["NAME", "RESET_PASSWORD_FORM"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
