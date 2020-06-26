import * as constants from "./constants";

describe("Verifying config constant", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    ["NAME", "SEVERITY"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });

  it("should have known the SEVERITY properties ", () => {
    const clonedProps = { ...constants.SEVERITY };

    ["error", "info", "success", "warning"].forEach(property => {
      expect(clonedProps).to.have.property(property);
      delete clonedProps[property];
    });

    expect(clonedProps).to.be.empty;
  });
});
