import * as constants from "./constants";

describe("<ActionButton />  - constants", () => {
  it("exports an object", () => {
    expect(constants).to.be.an("object");
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...constants };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["NAME", "ACTION_BUTTON_TYPES"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
