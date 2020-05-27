import * as constants from "./constants";

describe("<LookupForms /> - constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    ["NAME", "LOOKUP_NAME", "LOOKUP_VALUES"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
