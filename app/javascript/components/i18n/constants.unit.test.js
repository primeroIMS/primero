import * as constants from "./constants";

describe("I8n - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["ORIENTATION"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
