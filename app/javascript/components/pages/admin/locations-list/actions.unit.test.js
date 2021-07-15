import actions from "./actions";

describe("<LocationsList /> - Actions", () => {
  describe("actions", () => {
    let clone = { ...actions };

    before(() => {
      clone = { ...actions };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "DISABLE_LOCATIONS",
      "DISABLE_LOCATIONS_STARTED",
      "DISABLE_LOCATIONS_SUCCESS",
      "DISABLE_LOCATIONS_FAILURE",
      "DISABLE_LOCATIONS_FINISHED",
      "LOCATIONS",
      "LOCATIONS_STARTED",
      "LOCATIONS_SUCCESS",
      "LOCATIONS_FAILURE",
      "LOCATIONS_FINISHED",
      "SET_LOCATIONS_FILTER"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(clone).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
