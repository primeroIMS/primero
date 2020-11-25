import * as constants from "./constants";

describe("demo-indicator/constants", () => {
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

    ["NAME"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
