import * as index from "./index";

describe("pages/admin/<FormBuilder />/components/<FieldDialog /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
