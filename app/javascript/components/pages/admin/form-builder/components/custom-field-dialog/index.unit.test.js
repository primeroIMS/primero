import * as index from "./index";

describe("pages/admin/form-builder/components/<CustomFieldDialog/> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["default"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
