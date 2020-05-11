import * as index from "./index";

describe("pages/admin/<FormBuilder>/components/<TabPanel/> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    ["FieldsList", "FormBuilderActionButtons", "TabPanel"].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
