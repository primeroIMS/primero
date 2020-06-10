import * as constants from "./constants";

describe("<FormBuilder />/components/<FieldListItem /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["NAME", "SUBFORM_GROUP_BY", "SUBFORM_SORT_BY"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
