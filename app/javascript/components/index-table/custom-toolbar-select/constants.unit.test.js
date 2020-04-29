import * as constants from "./constants";

describe("<CustomToolbarSelect /> - constants", () => {
  it("should have known constant", () => {
    const clone = { ...constants };

    ["NAME"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
