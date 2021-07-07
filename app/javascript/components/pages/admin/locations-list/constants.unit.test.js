import * as constants from "./constants";

describe("<LocationsList /> - Constants", () => {
  describe("constants", () => {
    let clone;

    before(() => {
      clone = { ...constants };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "ACTION_NAME",
      "NAME",
      "DISABLED",
      "DEFAULT_LOCATION_METADATA",
      "NAME_DELIMITER",
      "COLUMNS",
      "LOCATION_TYPE_LOOKUP",
      "LOCATIONS_DIALOG"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
