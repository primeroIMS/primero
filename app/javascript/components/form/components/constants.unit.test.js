import * as constants from "./constants";

describe("<Form />/components - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["FORM_SECTION_NAME"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
