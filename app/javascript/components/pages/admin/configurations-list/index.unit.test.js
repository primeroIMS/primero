import * as index from "./index";

describe("configurations-list/index.js", () => {
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

    ["default", "reducer"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(index).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
