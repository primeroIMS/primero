import * as constants from "./constants";

describe("<AgenciesForm /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    expect(typeof clonedActions).toEqual("object");
    ["NAME", "FORM_ID", "TERMS_OF_USE", "TERMS_OF_USE_ENABLED"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
