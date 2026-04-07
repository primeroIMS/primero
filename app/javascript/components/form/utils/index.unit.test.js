import * as index from "./index";

describe("<Form /> - Utils", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "buildLinkedIncidentOptions",
      "buildRoleOptions",
      "formatAgeRange",
      "get",
      "notPropagatedOnSubmit",
      "notVisible",
      "optionText",
      "submitHandler",
      "touchedFormData",
      "valueParser",
      "whichFormMode"
    ].forEach(property => {
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
