import * as constants from "./constants";

describe("<CustomFieldSelectorDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["CUSTOM_FIELD_SELECTOR_DIALOG", "NAME"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
