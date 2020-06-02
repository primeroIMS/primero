import * as index from "./index";

describe("pages/admin/<FormList> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default", "reducer"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
