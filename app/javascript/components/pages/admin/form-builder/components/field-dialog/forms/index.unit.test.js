import * as index from "./index";

describe("pages/admin/<FormBuilder />/components/<FieldDialog />/forms - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["selectFieldForm", "textFieldForm", "tickboxFieldForm"].forEach(
      property => {
        expect(indexValues).to.have.property(property);
        delete indexValues[property];
      }
    );
    expect(indexValues).to.be.empty;
  });
});
