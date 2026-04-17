import * as constants from "./constants";

describe("pages/password-reset - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["NAME", "RESET_PASSWORD_FORM"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
