import * as constants from "./constants";

describe("<FieldTranslationsDialog>- Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["NAME", "FIELD_TRANSLATIONS_FORM"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
