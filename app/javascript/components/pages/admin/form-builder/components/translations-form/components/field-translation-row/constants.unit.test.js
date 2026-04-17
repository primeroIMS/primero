import * as constants from "./constants";

describe("<FormBuilder>/components/<TranslationsForm>/components/<FieldTranslationRow/>  - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["NAME"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
