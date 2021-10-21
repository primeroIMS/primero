import * as index from "./index";

describe("<ActionButton />  - components/icon-button/index", () => {
  it("exports an object", () => {
    expect(index).to.be.an("object");
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...index };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["default"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(index).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
