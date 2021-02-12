import * as constants from "./constants";

describe("<FormBuilder />/components/<FormTranslationsDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["NAME", "FORM_ID", "LOCALE_ID"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
