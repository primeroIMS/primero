import * as constants from "./constants";

describe("<FormBuilder />/components/<FieldListItem /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["NAME", "SUBFORM_GROUP_BY", "SUBFORM_SECTION_CONFIGURATION", "SUBFORM_SORT_BY"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
