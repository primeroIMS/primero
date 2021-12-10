import * as subformItemConstants from "./constants";

describe("Verifying subformItem constant", () => {
  it("should have known constant", () => {
    const constants = { ...subformItemConstants };

    ["NAME", "ORDER_OF_FORMS", "VIOLATION_TALLY", "VIOLATIONS_FIELDS"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
