import actions from "./actions";

describe("<ImportDialog /> - Actions", () => {
  describe("actions", () => {
    let clone = { ...actions };

    before(() => {
      clone = { ...actions };
    });

    after(() => {
      expect(clone).to.be.empty;
    });

    [
      "CLEAR_IMPORT_ERRORS",
      "IMPORT_LOCATIONS",
      "IMPORT_LOCATIONS_STARTED",
      "IMPORT_LOCATIONS_SUCCESS",
      "IMPORT_LOCATIONS_FINISHED",
      "IMPORT_LOCATIONS_FAILURE"
    ].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(clone).to.have.property(property);
        delete clone[property];
      });
    });
  });
});
