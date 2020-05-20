import * as index from "./index";

describe("pages/admin/<FormList>/components/<ReorderActions> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
