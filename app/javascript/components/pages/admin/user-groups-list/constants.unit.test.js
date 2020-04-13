import * as constants from "./constants";

describe("<UserGroupsList /> - Constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    expect(clonedConstants).to.be.an("object");

    ["NAME"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
