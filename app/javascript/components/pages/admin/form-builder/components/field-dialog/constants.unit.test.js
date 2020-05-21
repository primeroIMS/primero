import * as constants from "./constants";

describe("pages/admin/<FormBuilder />/components/<FieldDialog /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["ADMIN_FIELDS_DIALOG", "NAME"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
