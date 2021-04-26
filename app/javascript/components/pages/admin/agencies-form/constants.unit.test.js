import * as constants from "./constants";

describe("<AgenciesForm /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    expect(clonedActions).to.be.an("object");
    ["NAME", "FORM_ID", "TERMS_OF_USE", "TERMS_OF_USE_ENABLED"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
