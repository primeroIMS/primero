import * as constants from "./constants";

describe("<ExistingFieldDialog />/components/<FieldsTable/> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["COLUMN_HEADERS", "NAME"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
