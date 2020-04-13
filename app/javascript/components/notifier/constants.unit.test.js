import * as constants from "./constants";

describe("<Notifier/> - constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["SNACKBAR_VARIANTS"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });

  it("should have known SNACKBAR_VARIANTS properties", () => {
    const clonedConstants = { ...constants.SNACKBAR_VARIANTS };

    ["error", "info", "success"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
