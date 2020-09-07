import * as index from "./index";

describe("<ExistingFieldDialog />/components - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["FieldsTable"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
