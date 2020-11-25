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

    ["LOCATIONS", "LOCATIONS_STARTED", "LOCATIONS_SUCCESS", "LOCATIONS_FAILURE", "LOCATIONS_FINISHED"].forEach(
      property => {
        it(`exports '${property}'`, () => {
          expect(clone).to.have.property(property);
          delete clone[property];
        });
      }
    );
  });
});
