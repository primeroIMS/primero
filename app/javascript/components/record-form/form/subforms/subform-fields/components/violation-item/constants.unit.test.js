import * as violationItemConstants from "./constants";

describe("Verifying violationItem constant", () => {
  it("should have known constant", () => {
    const constants = { ...violationItemConstants };

    ["NAME", "VIOLATION_TALLY_FIELD"].forEach(property => {
      expect(constants).toHaveProperty(property);
      delete constants[property];
    });

    expect(Object.keys(constants)).toHaveLength(0);
  });
});
