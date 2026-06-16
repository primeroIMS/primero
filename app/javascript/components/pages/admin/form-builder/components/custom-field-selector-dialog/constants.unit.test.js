import * as constants from "./constants";

describe("<CustomFieldSelectorDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["DATE_TIME_FIELD", "CUSTOM_FIELD_SELECTOR_DIALOG", "MULTI_SELECT_FIELD", "NAME", "PHONE_NUMBER_FIELD"].forEach(
      property => {
        expect(clonedActions).toHaveProperty(property);
        delete clonedActions[property];
      }
    );

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
