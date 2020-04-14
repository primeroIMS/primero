import * as permissionsConstants from "./constants";

describe("Verifying user constant", () => {
  it("should have known constant", () => {
    const constants = { ...permissionsConstants };

    ["PERMISSIONS", "LIST_HEADERS"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
