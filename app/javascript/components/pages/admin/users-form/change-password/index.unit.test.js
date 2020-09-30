import * as index from "./index";

describe("pages/users-form/change-password/index.js", () => {
  describe("index", () => {
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
