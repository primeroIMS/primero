import * as index from "./index";

describe("Approvals - Summary - index", () => {
  const indexValues = { ...index };

  it("should have known exported properties", () => {
    ["default"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });

    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
