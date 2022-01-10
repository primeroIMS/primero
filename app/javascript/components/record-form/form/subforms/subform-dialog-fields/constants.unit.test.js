import * as constants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    ["NAME", "VIOLATION_IDS_NAME"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
