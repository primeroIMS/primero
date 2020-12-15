import * as utils from "./utils";

describe("<Records /> - utils", () => {
  describe("properties", () => {
    let clone;

    before(() => {
      clone = { ...utils };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    ["cleanUpFilters", "useMetadata", "getShortIdFromUniqueId"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(utils).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
