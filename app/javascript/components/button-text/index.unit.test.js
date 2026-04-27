import * as index from "./index";

describe("<ButtonText/> - index", () => {
  const clone = { ...index };

  it("should have known exported properties", () => {
    ["default"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
