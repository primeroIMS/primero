import * as constants from "./constants";

describe("layouts/components/<LoginLayout> - constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    ["NAME"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
