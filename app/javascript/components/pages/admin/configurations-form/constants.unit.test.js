import * as constants from "./constants";

describe("configurations-form/constants.js", () => {
  it("exports an object", () => {
    expect(constants).to.be.an("object");
  });

  describe("constants", () => {
    let clone;

    before(() => {
      clone = { ...constants };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["APPLY_CONFIGURATION_MODAL", "DELETE_CONFIGURATION_MODAL", "NAME", "SEND_CONFIGURATION_MODAL", "FORM_ID"].forEach(
      property => {
        it(`exports '${property}'`, () => {
          expect(constants).to.have.property(property);
          delete clone[property];
        });
      }
    );
  });
});
