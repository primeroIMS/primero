import * as index from "./index";

describe("ChangeLogs - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default", "reducer"].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
