import * as constants from "./constants";

describe("I8n - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["ORIENTATION"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
