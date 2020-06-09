import * as constants from "./constants";

describe("pages/admin/<FormBuilder />/components/<ClearButtons /> - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["GROUP_BY", "NAME", "SORT_BY"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
