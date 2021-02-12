import * as constants from "./constants";

describe("Unflag - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["NAME", "UNFLAG_DIALOG", "FORM_ID"].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
