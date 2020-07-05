import * as index from "./index";

describe("<ButtonText/> - index", () => {
  const clone = { ...index };

  it("should have known exported properties", () => {
    ["default"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
