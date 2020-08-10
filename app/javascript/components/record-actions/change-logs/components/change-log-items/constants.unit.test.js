import * as constants from "./constants";

describe("ChangeLogItems - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["NAME", "CREATE_ACTION", "EMPTY_VALUE"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
