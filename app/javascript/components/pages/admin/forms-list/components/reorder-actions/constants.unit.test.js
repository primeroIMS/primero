import * as constants from "./constants";

describe("pages/admin/<FormList>/components/<ReorderActions> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["NAME"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
