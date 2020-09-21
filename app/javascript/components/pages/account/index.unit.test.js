import * as moduleToTest from "./index";

describe("pages/account/index.js", () => {
  it("exports an object", () => {
    expect(moduleToTest).to.be.an("object");
  });

  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...moduleToTest };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["default", "reducer"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(moduleToTest).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
