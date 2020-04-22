import * as index from "./index";

describe("<Form /> - Utils", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "submitHandler",
      "touchedFormData",
      "whichFormMode",
      "optionText",
      "whichOptions"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
