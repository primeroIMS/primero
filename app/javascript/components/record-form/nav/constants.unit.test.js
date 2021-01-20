import * as navConstants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const constants = { ...navConstants };

    ["NAME", "CUSTOM_FORM_IDS_NAV"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.deep.equal({});
  });
});
