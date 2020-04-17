import * as constants from "./constants";

describe("<RecordOwner /> - constants", () => {
  it("should have known constant", () => {
    const constantsValues = { ...constants };

    ["FIELDS", "NAME"].forEach(property => {
      expect(constantsValues).to.have.property(property);

      delete constantsValues[property];
    });

    expect(constantsValues).to.be.empty;
  });
});
